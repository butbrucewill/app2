"""Dual-database layer: uses MySQL when MYSQL_* env vars are set, otherwise MongoDB.

Exposes one async interface used by server.py:
    insert_enrollment / get_enrollment / update_enrollment / list_enrollments
    insert_lead / list_leads
    append_chat_messages
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

USE_MYSQL = bool(MYSQL_HOST and MYSQL_USER and MYSQL_DATABASE)


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
                city VARCHAR(80) NOT NULL,
                interest VARCHAR(20) NOT NULL,
                status VARCHAR(20) NOT NULL,
                created_at VARCHAR(40) NOT NULL
            )""",
            """CREATE TABLE IF NOT EXISTS chat_messages (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                session_id VARCHAR(64) NOT NULL,
                role VARCHAR(12) NOT NULL,
                text TEXT NOT NULL,
                at VARCHAR(40) NOT NULL,
                INDEX idx_session (session_id)
            )""",
        ]
        async with self._pool.acquire() as conn:
            async with conn.cursor() as cur:
                for s in stmts:
                    await cur.execute(s)

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
        cols = ["lead_id", "name", "email", "whatsapp", "city", "interest", "status", "created_at"]
        await self._execute(
            f"INSERT INTO leads ({','.join(cols)}) VALUES ({','.join(['%s'] * len(cols))})",
            [doc.get(c) for c in cols],
        )

    async def list_leads(self):
        return await self._fetchall("SELECT * FROM leads ORDER BY created_at DESC LIMIT 500")

    async def append_chat_messages(self, session_id, messages):
        pool = await self._get_pool()
        async with pool.acquire() as conn:
            async with conn.cursor() as cur:
                await cur.executemany(
                    "INSERT INTO chat_messages (session_id, role, text, at) VALUES (%s, %s, %s, %s)",
                    [(session_id, m["role"], m["text"], m["at"]) for m in messages],
                )


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

    async def append_chat_messages(self, session_id, messages):
        from datetime import datetime, timezone
        await self.db.chat_sessions.update_one(
            {"session_id": session_id},
            {
                "$push": {"messages": {"$each": messages}},
                "$set": {"updated_at": datetime.now(timezone.utc).isoformat()},
            },
            upsert=True,
        )


store = MySQLStore() if USE_MYSQL else MongoStore()
logger.info("Database backend: %s", "MySQL" if USE_MYSQL else "MongoDB")
