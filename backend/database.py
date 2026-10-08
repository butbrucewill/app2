"""Dual-database layer: uses MySQL when MYSQL_* env vars are set, otherwise MongoDB.

Exposes one async interface used by server.py:
    insert_enrollment / get_enrollment / update_enrollment / list_enrollments
    insert_lead / list_leads
    insert_blog / get_blog_by_slug / get_blog_by_id / update_blog / delete_blog
    list_blogs / min_sort_order
"""
import os
import logging

import aiomysql

logger = logging.getLogger(__name__)

MYSQL_HOST = os.environ.get("MYSQL_HOST", "")
MYSQL_USER = os.environ.get("MYSQL_USER", "")
MYSQL_PASSWORD = os.environ.get("MYSQL_PASSWORD", "")
MYSQL_DATABASE = os.environ.get("MYSQL_DATABASE", "")
MYSQL_PORT = int(os.environ.get("MYSQL_PORT") or 3306)
DATABASE_BACKEND = os.environ.get("DATABASE_BACKEND", "").strip().lower()

USE_MYSQL = bool(MYSQL_HOST and MYSQL_USER and MYSQL_DATABASE)


class MemoryStore:
    def __init__(self):
        self.enrollments = {}
        self.leads = {}
        self.blogs = {}

    async def insert_enrollment(self, doc):
        self.enrollments[doc["order_ref"]] = dict(doc)

    async def get_enrollment(self, order_ref):
        doc = self.enrollments.get(order_ref)
        return dict(doc) if doc else None

    async def update_enrollment(self, order_ref, fields):
        if order_ref in self.enrollments:
            self.enrollments[order_ref].update(fields)

    async def list_enrollments(self):
        docs = (dict(doc) for doc in self.enrollments.values())
        return sorted(docs, key=lambda doc: doc.get("created_at", ""), reverse=True)[:500]

    async def insert_lead(self, doc):
        self.leads[doc["lead_id"]] = dict(doc)

    async def list_leads(self):
        docs = (dict(doc) for doc in self.leads.values())
        return sorted(docs, key=lambda doc: doc.get("created_at", ""), reverse=True)[:500]

    async def insert_blog(self, doc):
        self.blogs[doc["blog_id"]] = dict(doc)

    async def get_blog_by_slug(self, slug):
        doc = next((doc for doc in self.blogs.values() if doc["slug"] == slug), None)
        return dict(doc) if doc else None

    async def get_blog_by_id(self, blog_id):
        doc = self.blogs.get(blog_id)
        return dict(doc) if doc else None

    async def update_blog(self, blog_id, fields):
        if blog_id in self.blogs:
            self.blogs[blog_id].update(fields)

    async def delete_blog(self, blog_id):
        self.blogs.pop(blog_id, None)

    async def list_blogs(self, published_only=True):
        docs = [
            {key: value for key, value in doc.items() if key != "content"}
            for doc in self.blogs.values()
            if not published_only or doc["status"] == "published"
        ]
        docs.sort(key=lambda d: d.get("created_at", ""), reverse=True)  # newest first...
        docs.sort(key=lambda d: d.get("sort_order", 0))                 # ...then admin order (stable)
        return docs[:500]

    async def min_sort_order(self):
        return min([d.get("sort_order", 0) for d in self.blogs.values()], default=0)


# ---------------- MySQL backend ----------------

class MySQLStore:
    def __init__(self):
        self._pool = None

    async def _get_pool(self):
        if self._pool is None:
            self._pool = await aiomysql.create_pool(
                host=MYSQL_HOST, port=MYSQL_PORT, user=MYSQL_USER,
                password=MYSQL_PASSWORD, db=MYSQL_DATABASE,
                autocommit=True, maxsize=5,
            )
            await self._create_tables()
            logger.info("MySQL store connected (%s@%s/%s)", MYSQL_USER, MYSQL_HOST, MYSQL_DATABASE)
        return self._pool

    async def _create_tables(self):
        stmts = [
            """CREATE TABLE IF NOT EXISTS enrollments (
                order_ref VARCHAR(40) PRIMARY KEY,
                course_id VARCHAR(20) NOT NULL,
                amount_inr INT NOT NULL,
                name VARCHAR(120) NOT NULL,
                email VARCHAR(190) NOT NULL,
                phone VARCHAR(30) NOT NULL,
                status VARCHAR(20) NOT NULL,
                created_at VARCHAR(40) NOT NULL,
                paid_at VARCHAR(40) NULL,
                razorpay_order_id VARCHAR(60) NULL,
                razorpay_payment_id VARCHAR(60) NULL,
                confirmation_email_id VARCHAR(190) NULL
            )""",
            """CREATE TABLE IF NOT EXISTS leads (
                lead_id VARCHAR(20) PRIMARY KEY,
                name VARCHAR(120) NOT NULL,
                email VARCHAR(190) NOT NULL,
                whatsapp VARCHAR(30) NOT NULL,
                age INT NULL,
                trading_experience VARCHAR(40) NULL,
                city VARCHAR(80) NOT NULL,
                interest VARCHAR(20) NOT NULL,
                status VARCHAR(20) NOT NULL,
                created_at VARCHAR(40) NOT NULL
            )""",
            """CREATE TABLE IF NOT EXISTS blogs (
                blog_id VARCHAR(30) PRIMARY KEY,
                slug VARCHAR(100) NOT NULL UNIQUE,
                title VARCHAR(200) NOT NULL,
                excerpt VARCHAR(400) NOT NULL,
                cover_image VARCHAR(2000) NOT NULL,
                content LONGTEXT NOT NULL,
                status VARCHAR(20) NOT NULL,
                sort_order INT NOT NULL DEFAULT 0,
                created_at VARCHAR(40) NOT NULL,
                updated_at VARCHAR(40) NOT NULL
            )""",
        ]
        async with self._pool.acquire() as conn:
            async with conn.cursor() as cur:
                for s in stmts:
                    await cur.execute(s)
                # Migrations for tables that already existed before these columns were added.
                # "duplicate column" errors are expected and ignored.
                for s in (
                    "ALTER TABLE leads ADD COLUMN age INT NULL",
                    "ALTER TABLE leads ADD COLUMN trading_experience VARCHAR(40) NULL",
                    "ALTER TABLE blogs ADD COLUMN sort_order INT NOT NULL DEFAULT 0",
                ):
                    try:
                        await cur.execute(s)
                    except Exception as exc:
                        if "duplicate column" not in str(exc).lower():
                            raise

    async def _fetchone(self, query, args):
        pool = await self._get_pool()
        async with pool.acquire() as conn:
            async with conn.cursor(aiomysql.DictCursor) as cur:
                await cur.execute(query, args)
                return await cur.fetchone()

    async def _fetchall(self, query, args=()):
        pool = await self._get_pool()
        async with pool.acquire() as conn:
            async with conn.cursor(aiomysql.DictCursor) as cur:
                await cur.execute(query, args)
                return await cur.fetchall()

    async def _execute(self, query, args):
        pool = await self._get_pool()
        async with pool.acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query, args)

    async def insert_enrollment(self, doc):
        cols = ["order_ref", "course_id", "amount_inr", "name", "email", "phone", "status",
                "created_at", "paid_at", "razorpay_order_id", "razorpay_payment_id",
                "confirmation_email_id"]
        vals = [doc.get(c) for c in cols]
        await self._execute(
            f"INSERT INTO enrollments ({','.join(cols)}) VALUES ({','.join(['%s'] * len(cols))})",
            vals,
        )

    async def get_enrollment(self, order_ref):
        return await self._fetchone("SELECT * FROM enrollments WHERE order_ref = %s", (order_ref,))

    async def update_enrollment(self, order_ref, fields):
        sets = ",".join(f"{k} = %s" for k in fields)
        await self._execute(
            f"UPDATE enrollments SET {sets} WHERE order_ref = %s",
            [*fields.values(), order_ref],
        )

    async def list_enrollments(self):
        return await self._fetchall("SELECT * FROM enrollments ORDER BY created_at DESC LIMIT 500")

    async def insert_lead(self, doc):
        cols = ["lead_id", "name", "email", "whatsapp", "age", "trading_experience", "city", "interest", "status", "created_at"]
        await self._execute(
            f"INSERT INTO leads ({','.join(cols)}) VALUES ({','.join(['%s'] * len(cols))})",
            [doc.get(c) for c in cols],
        )

    async def list_leads(self):
        return await self._fetchall("SELECT * FROM leads ORDER BY created_at DESC LIMIT 500")

    # ---- blogs ----

    async def insert_blog(self, doc):
        cols = ["blog_id", "slug", "title", "excerpt", "cover_image", "content",
                "status", "sort_order", "created_at", "updated_at"]
        await self._execute(
            f"INSERT INTO blogs ({','.join(cols)}) VALUES ({','.join(['%s'] * len(cols))})",
            [doc.get(c) for c in cols],
        )

    async def get_blog_by_slug(self, slug):
        return await self._fetchone("SELECT * FROM blogs WHERE slug = %s", (slug,))

    async def get_blog_by_id(self, blog_id):
        return await self._fetchone("SELECT * FROM blogs WHERE blog_id = %s", (blog_id,))

    async def update_blog(self, blog_id, fields):
        sets = ",".join(f"{k} = %s" for k in fields)
        await self._execute(
            f"UPDATE blogs SET {sets} WHERE blog_id = %s",
            [*fields.values(), blog_id],
        )

    async def delete_blog(self, blog_id):
        await self._execute("DELETE FROM blogs WHERE blog_id = %s", (blog_id,))

    async def list_blogs(self, published_only=True):
        # content is deliberately NOT selected: cards don't need the (large) body
        q = ("SELECT blog_id, slug, title, excerpt, cover_image, status, sort_order, "
             "created_at, updated_at FROM blogs")
        if published_only:
            q += " WHERE status = 'published'"
        q += " ORDER BY sort_order ASC, created_at DESC LIMIT 500"
        return await self._fetchall(q)

    async def min_sort_order(self):
        row = await self._fetchone("SELECT MIN(sort_order) AS m FROM blogs", ())
        return int((row or {}).get("m") or 0)


# ---------------- MongoDB backend ----------------

class MongoStore:
    def __init__(self):
        from motor.motor_asyncio import AsyncIOMotorClient
        client = AsyncIOMotorClient(os.environ["MONGO_URL"])
        self.db = client[os.environ["DB_NAME"]]

    async def insert_enrollment(self, doc):
        await self.db.enrollments.insert_one(doc)

    async def get_enrollment(self, order_ref):
        return await self.db.enrollments.find_one({"order_ref": order_ref}, {"_id": 0})

    async def update_enrollment(self, order_ref, fields):
        await self.db.enrollments.update_one({"order_ref": order_ref}, {"$set": fields})

    async def list_enrollments(self):
        return await self.db.enrollments.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)

    async def insert_lead(self, doc):
        await self.db.leads.insert_one(doc)

    async def list_leads(self):
        return await self.db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)

    # ---- blogs ----

    async def insert_blog(self, doc):
        await self.db.blogs.insert_one(dict(doc))   # copy so _id isn't added to the caller's dict

    async def get_blog_by_slug(self, slug):
        return await self.db.blogs.find_one({"slug": slug}, {"_id": 0})

    async def get_blog_by_id(self, blog_id):
        return await self.db.blogs.find_one({"blog_id": blog_id}, {"_id": 0})

    async def update_blog(self, blog_id, fields):
        await self.db.blogs.update_one({"blog_id": blog_id}, {"$set": fields})

    async def delete_blog(self, blog_id):
        await self.db.blogs.delete_one({"blog_id": blog_id})

    async def list_blogs(self, published_only=True):
        flt = {"status": "published"} if published_only else {}
        docs = await self.db.blogs.find(flt, {"_id": 0, "content": 0}).sort("created_at", -1).to_list(500)
        docs.sort(key=lambda d: d.get("sort_order", 0))  # stable: ties keep newest-first
        return docs

    async def min_sort_order(self):
        docs = await self.db.blogs.find({}, {"_id": 0, "sort_order": 1}).to_list(1000)
        return min([d.get("sort_order", 0) for d in docs], default=0)


if DATABASE_BACKEND == "memory":
    store = MemoryStore()
    logger.warning("Using in-memory preview store; data will be lost when the backend stops")
elif USE_MYSQL:
    store = MySQLStore()
    logger.info("Database backend: MySQL")
else:
    store = MongoStore()
    logger.info("Database backend: MongoDB") 