from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
import uuid
import hmac
import hashlib
import re
import ipaddress
import httpx
import jwt
import json
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import Literal, Optional
from datetime import datetime, timezone, timedelta
from fastapi import FastAPI, APIRouter, HTTPException, Request, UploadFile, File
from fastapi.responses import StreamingResponse, Response
from fastapi.staticfiles import StaticFiles

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from database import store

RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', '').strip()
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', '').strip()
RAZORPAY_CONFIGURED = bool(RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET)

rzp_client = None
if RAZORPAY_CONFIGURED:
    import razorpay
    rzp_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY", "")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "")
SITE_URL = os.environ.get("SITE_URL", "").rstrip("/")

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []
    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []
    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)
    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan(); scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{EMAIL_BASE_URL}/api/v1/email/send",
            headers={"X-Email-Key": EMAIL_KEY},
            json=payload,
        )
    resp.raise_for_status()
    return resp.json().get("id")


def enrollment_email_html(doc):
    course = COURSES[doc["course_id"]]
    first_name = escape(doc["name"].split()[0])
    if doc["course_id"] == "online":
        next_steps = ("Your batch schedule and student portal access details will reach this "
                      "inbox before your first live session.")
    else:
        next_steps = ("Your classroom batch details, venue, and start date will reach this "
                      "inbox before your first session.")
    link_html = ""
    if SITE_URL:
        link_html = (f'<p style="margin:24px 0"><a href="{SITE_URL}/payment/result?status=success&amp;ref={doc["order_ref"]}" '
                     f'style="background:#0B1021;color:#ffffff;padding:12px 24px;text-decoration:none;'
                     f'font-family:monospace;font-size:12px;letter-spacing:2px;text-transform:uppercase">'
                     f'View your enrollment</a></p>')
    return (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        'style="background:#f4f4f3;padding:32px 0"><tr><td align="center">'
        '<table role="presentation" width="560" cellpadding="0" cellspacing="0" '
        'style="background:#ffffff;border:1px solid #e5e5e5;padding:40px;font-family:Arial,sans-serif">'
        f'<tr><td><p style="font-family:monospace;font-size:11px;letter-spacing:3px;text-transform:uppercase;'
        f'color:#64748b;margin:0 0 8px">Payment verified · Enrollment confirmed</p>'
        f'<h1 style="font-family:Georgia,serif;font-size:32px;font-weight:500;color:#0B1021;margin:0 0 16px">'
        f'Welcome aboard, {first_name}.</h1>'
        f'<p style="color:#333a52;font-size:15px;line-height:1.6;margin:0 0 24px">'
        f'Your seat in the <strong>{escape(course["name"])}</strong> at One Stock Academy is confirmed. '
        f'{next_steps}</p>'
        f'<table role="presentation" width="100%" cellpadding="8" cellspacing="0" '
        f'style="background:#f4f4f3;font-family:monospace;font-size:13px;color:#0B1021;margin:0 0 8px">'
        f'<tr><td style="color:#64748b">Reference</td><td align="right">{escape(doc["order_ref"])}</td></tr>'
        f'<tr><td style="color:#64748b">Course</td><td align="right">{escape(course["name"])}</td></tr>'
        f'<tr><td style="color:#64748b">Amount paid</td><td align="right">₹{doc["amount_inr"]:,}</td></tr>'
        f'</table>'
        f'{link_html}'
        f'<p style="font-size:11px;color:#94a3b8;line-height:1.6;margin:24px 0 0">'
        f'Trading involves substantial risk of loss. One Stock Academy provides education only — '
        f'nothing in our classes is investment advice or a promise of returns. '
        f'Sent by {escape(EMAIL_FROM_NAME)}. We never ask for your password or card details by email.</p>'
        '</td></tr></table></td></tr></table>'
    )


app = FastAPI()
api_router = APIRouter(prefix="/api")

COURSES = {
    "online": {
        "id": "online",
        "name": "Online — Live Virtual Classes",
        "format": "Live virtual classes",
        "price_inr": 49990,
    },
    "offline": {
        "id": "offline",
        "name": "Offline — In-Person Classroom",
        "format": "In-person classroom",
        "price_inr": 199990,
    },
}


class OrderCreate(BaseModel):
    course_id: str
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=8, max_length=15)


class PaymentVerify(BaseModel):
    order_ref: str
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    razorpay_signature: Optional[str] = None
    demo_outcome: Optional[str] = None  # "success" | "failure" in demo mode only


def public_enrollment(doc):
    return {
        "order_ref": doc["order_ref"],
        "course_id": doc["course_id"],
        "course_name": COURSES[doc["course_id"]]["name"],
        "amount_inr": doc["amount_inr"],
        "status": doc["status"],
        "name": doc["name"],
        "email": doc["email"],
        "created_at": doc["created_at"],
        "paid_at": doc.get("paid_at"),
    }


@api_router.get("/")
async def root():
    return {"message": "One Stock Academy API"}


@api_router.get("/courses")
async def get_courses():
    return {"courses": list(COURSES.values()), "payment_mode": "live" if RAZORPAY_CONFIGURED else "demo"}


@api_router.post("/orders")
async def create_order(payload: OrderCreate):
    if payload.course_id not in COURSES:
        raise HTTPException(status_code=400, detail="Unknown course")
    course = COURSES[payload.course_id]
    order_ref = "OSA-" + uuid.uuid4().hex[:10].upper()
    doc = {
        "order_ref": order_ref,
        "course_id": course["id"],
        "amount_inr": course["price_inr"],
        "name": payload.name.strip(),
        "email": payload.email.lower(),
        "phone": payload.phone.strip(),
        "status": "created",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    if RAZORPAY_CONFIGURED:
        rzp_order = rzp_client.order.create({
            "amount": course["price_inr"] * 100,
            "currency": "INR",
            "receipt": order_ref[:40],
            "payment_capture": 1,
        })
        doc["razorpay_order_id"] = rzp_order["id"]
        await store.insert_enrollment(doc)
        return {
            "demo": False,
            "order_ref": order_ref,
            "razorpay_order_id": rzp_order["id"],
            "razorpay_key_id": RAZORPAY_KEY_ID,
            "amount_paise": course["price_inr"] * 100,
            "currency": "INR",
            "course": course,
        }

    await store.insert_enrollment(doc)
    return {
        "demo": True,
        "order_ref": order_ref,
        "amount_paise": course["price_inr"] * 100,
        "currency": "INR",
        "course": course,
    }


@api_router.post("/payments/verify")
async def verify_payment(payload: PaymentVerify):
    doc = await store.get_enrollment(payload.order_ref)
    if not doc:
        raise HTTPException(status_code=404, detail="Order not found")
    if doc["status"] == "paid":
        return {"status": "success", "enrollment": public_enrollment(doc)}

    if RAZORPAY_CONFIGURED:
        if not (payload.razorpay_order_id and payload.razorpay_payment_id and payload.razorpay_signature):
            raise HTTPException(status_code=400, detail="Missing payment verification fields")
        if payload.razorpay_order_id != doc.get("razorpay_order_id"):
            raise HTTPException(status_code=400, detail="Order mismatch")
        expected = hmac.new(
            RAZORPAY_KEY_SECRET.encode(),
            f"{payload.razorpay_order_id}|{payload.razorpay_payment_id}".encode(),
            hashlib.sha256,
        ).hexdigest()
        if not hmac.compare_digest(expected, payload.razorpay_signature):
            await store.update_enrollment(payload.order_ref, {"status": "failed"})
            raise HTTPException(status_code=400, detail="Invalid payment signature")
    else:
        if payload.demo_outcome != "success":
            await store.update_enrollment(payload.order_ref, {"status": "failed"})
            return {"status": "failed"}

    paid_at = datetime.now(timezone.utc).isoformat()
    update = {"status": "paid", "paid_at": paid_at}
    if payload.razorpay_payment_id:
        update["razorpay_payment_id"] = payload.razorpay_payment_id
    await store.update_enrollment(payload.order_ref, update)
    doc = await store.get_enrollment(payload.order_ref)

    email_status = "skipped"
    if EMAIL_KEY and EMAIL_FROM_NAME:
        try:
            subject = f"Enrollment confirmed — {COURSES[doc['course_id']]['name']}"
            email_id = await send_email(to=doc["email"], subject=subject, html=enrollment_email_html(doc))
            await store.update_enrollment(payload.order_ref, {"confirmation_email_id": email_id})
            email_status = "sent"
        except Exception as e:
            logger.error(f"Confirmation email failed for {payload.order_ref}: {e}")
            email_status = "failed"

    return {"status": "success", "enrollment": public_enrollment(doc), "email": email_status}


@api_router.get("/orders/{order_ref}")
async def get_order(order_ref: str):
    doc = await store.get_enrollment(order_ref)
    if not doc:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"enrollment": public_enrollment(doc), "payment_mode": "live" if RAZORPAY_CONFIGURED else "demo"}


JWT_SECRET = os.environ.get("JWT_SECRET", "")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")


def client_ip(request: Request) -> str:
    fwd = request.headers.get("X-Forwarded-For", "")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def rate_limited(bucket: dict, key: str, limit: int, window_sec: int) -> bool:
    now = datetime.now(timezone.utc).timestamp()
    hits = [t for t in bucket.get(key, []) if now - t < window_sec]
    bucket[key] = hits + [now]
    if len(bucket) > 5000:  # prune stale keys so the dict can't grow unbounded
        for k in [k for k, v in bucket.items() if not v or now - v[-1] >= window_sec]:
            bucket.pop(k, None)
    return len(hits) >= limit


class AdminLogin(BaseModel):
    password: str


def require_admin(request: Request):
    auth = request.headers.get("Authorization", "")
    token = auth[7:] if auth.startswith("Bearer ") else ""
    if not token or not JWT_SECRET:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


_admin_attempts = {}


@api_router.post("/admin/login")
async def admin_login(payload: AdminLogin, request: Request):
    ip = client_ip(request)
    if rate_limited(_admin_attempts, ip, limit=5, window_sec=600):
        raise HTTPException(status_code=429, detail="Too many attempts — try again in a few minutes")
    if not ADMIN_PASSWORD or payload.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    _admin_attempts.pop(ip, None)
    token = jwt.encode(
        {"sub": "admin", "exp": datetime.now(timezone.utc) + timedelta(hours=12)},
        JWT_SECRET,
        algorithm="HS256",
    )
    return {"token": token}


@api_router.get("/admin/enrollments")
async def admin_enrollments(request: Request):
    require_admin(request)
    docs = await store.list_enrollments()
    return {"enrollments": [{**public_enrollment(d), "phone": d.get("phone", "")} for d in docs]}


class LeadCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    whatsapp: str = Field(min_length=8, max_length=15)
    age: int = Field(default=18, ge=13, le=100)
    trading_experience: str = Field(default="beginner", min_length=2, max_length=40)
    city: str = Field(min_length=2, max_length=80)
    interest: str = "online"


@api_router.post("/leads")
async def create_lead(payload: LeadCreate):
    interest = payload.interest if payload.interest in COURSES else "online"
    doc = {
        "lead_id": "LEAD-" + uuid.uuid4().hex[:8].upper(),
        "name": payload.name.strip(),
        "email": payload.email.lower(),
        "whatsapp": payload.whatsapp.strip(),
        "age": payload.age,
        "trading_experience": payload.trading_experience.strip(),
        "city": payload.city.strip(),
        "interest": interest,
        "status": "new",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await store.insert_lead(doc)
    return {"status": "ok", "lead_id": doc["lead_id"]}


@api_router.get("/admin/leads")
async def admin_leads(request: Request):
    require_admin(request)
    docs = await store.list_leads()
    return {"leads": docs}


def slugify(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:60].strip("-")
    return s or "post"
 
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
SITE_BASE = SITE_URL or "https://onestockacademy.com"
 
 
# ---------- helpers ----------
 
def slugify(text: str, max_len: int = 90) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", (text or "").lower()).strip("-")[:max_len].strip("-")
    return s or "post"
 
 
def _clean_slug(raw: str) -> str:
    """Accepts 'my-post', '/blog/my-post' or a full URL and returns a clean slug ('' if empty)."""
    raw = (raw or "").strip().lower()
    raw = re.sub(r"^https?://[^/]+", "", raw)
    raw = raw.replace("/blog/", "").strip("/")
    return slugify(raw) if raw else ""
 
 
async def _unique_slug(base: str) -> str:
    slug, n = base, 2
    while await store.get_blog_by_slug(slug):
        slug = f"{base}-{n}"
        n += 1
    return slug
 
 
def _clean_url(url: str, field: str = "URL", allow_relative: bool = True) -> str:
    url = (url or "").strip()
    ok = url.startswith(("https://", "http://")) or (allow_relative and url.startswith("/"))
    if url and not ok:
        raise HTTPException(status_code=400, detail=f"{field} must be an http(s) URL")
    return url
 
 
def _csv(text: str) -> str:
    return ", ".join(t.strip() for t in (text or "").split(",") if t.strip())
 
 
class BlogIn(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    h1: str = Field(default="", max_length=250)
    slug: str = Field(default="", max_length=200)
    excerpt: str = Field(default="", max_length=400)
    content: str = Field(default="", max_length=3_000_000)  # TipTap HTML
    cover_image: str = Field(default="", max_length=2000)
    cover_alt: str = Field(default="", max_length=300)
    category: str = Field(default="", max_length=100)
    tags: str = Field(default="", max_length=500)             # comma separated
    author: str = Field(default="", max_length=120)
    published_at: str = Field(default="", max_length=40)      # YYYY-MM-DD or ISO datetime
    meta_title: str = Field(default="", max_length=250)
    meta_description: str = Field(default="", max_length=500)
    focus_keyword: str = Field(default="", max_length=200)
    secondary_keywords: str = Field(default="", max_length=500)
    canonical_url: str = Field(default="", max_length=500)
    index_status: Literal["index", "noindex"] = "index"
    schema_type: Literal["BlogPosting", "Article"] = "BlogPosting"
    og_title: str = Field(default="", max_length=250)
    og_description: str = Field(default="", max_length=500)
    og_image: str = Field(default="", max_length=2000)
    status: Literal["draft", "published"] = "draft"
 
 
def _blog_fields(p: BlogIn) -> dict:
    published_at = p.published_at.strip()
    if published_at:
        try:
            datetime.fromisoformat(published_at.replace("Z", "+00:00"))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid publish date")
    elif p.status == "published":
        published_at = datetime.now(timezone.utc).date().isoformat()
    return {
        "title": p.title.strip(),
        "h1": p.h1.strip(),
        "excerpt": p.excerpt.strip(),
        "content": p.content,
        "cover_image": _clean_url(p.cover_image, "Featured image"),
        "cover_alt": p.cover_alt.strip(),
        "category": p.category.strip(),
        "tags": _csv(p.tags),
        "author": p.author.strip(),
        "published_at": published_at,
        "meta_title": p.meta_title.strip(),
        "meta_description": p.meta_description.strip(),
        "focus_keyword": p.focus_keyword.strip(),
        "secondary_keywords": _csv(p.secondary_keywords),
        "canonical_url": _clean_url(p.canonical_url, "Canonical URL", allow_relative=False),
        "index_status": p.index_status,
        "schema_type": p.schema_type,
        "og_title": p.og_title.strip(),
        "og_description": p.og_description.strip(),
        "og_image": _clean_url(p.og_image, "OG image"),
        "status": p.status,
    }
 
 
# ---------- Public ----------
 
@api_router.get("/blogs")
async def list_public_blogs():
    """Cards for the /blog page (no body content), in the admin-chosen order."""
    return {"blogs": await store.list_blogs(published_only=True)}
 
 
@api_router.get("/blogs/{slug}")
async def get_public_blog(slug: str):
    doc = await store.get_blog_by_slug(slug)
    if not doc or doc["status"] != "published":
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"blog": doc}
 
 
@api_router.get("/sitemap.xml")
async def sitemap_xml():
    """Dynamic sitemap: static pages + every published, indexable blog post."""
    static_paths = ["/", "/about", "/media-coverage", "/global-market", "/buniyaad", "/blog", "/privacy-policy"]
    entries = [f"<url><loc>{escape(SITE_BASE + p)}</loc></url>" for p in static_paths]
    for b in await store.list_blogs(published_only=True):
        if (b.get("index_status") or "index") == "noindex":
            continue
        own_url = f"{SITE_BASE}/blog/{b['slug']}"
        canon = (b.get("canonical_url") or "").strip()
        if canon and canon.rstrip("/") != own_url:
            continue  # canonicalised elsewhere: only the canonical URL belongs in a sitemap
        lastmod = str(b.get("updated_at") or b.get("created_at") or "")[:10]
        entries.append(
            f"<url><loc>{escape(own_url)}</loc>"
            + (f"<lastmod>{escape(lastmod)}</lastmod>" if lastmod else "")
            + "</url>"
        )
    xml = ('<?xml version="1.0" encoding="UTF-8"?>'
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + "".join(entries) + "</urlset>")
    return Response(content=xml, media_type="application/xml")
 
 
# ---------- Admin ----------
 
@api_router.get("/admin/blogs")
async def admin_list_blogs(request: Request):
    require_admin(request)
    return {"blogs": await store.list_blogs(published_only=False)}
 
 
@api_router.get("/admin/blogs/{blog_id}")
async def admin_get_blog(blog_id: str, request: Request):
    require_admin(request)
    doc = await store.get_blog_by_id(blog_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"blog": doc}
 
 
@api_router.post("/admin/blogs")
async def admin_create_blog(payload: BlogIn, request: Request):
    require_admin(request)
    now = datetime.now(timezone.utc).isoformat()
    base = _clean_slug(payload.slug) or slugify(payload.title)
    doc = {
        "blog_id": "BLOG-" + uuid.uuid4().hex[:10].upper(),
        "slug": await _unique_slug(base),
        **_blog_fields(payload),
        "sort_order": (await store.min_sort_order()) - 1,
        "created_at": now,
        "updated_at": now,
    }
    await store.insert_blog(doc)
    return {"blog": doc}
 
 
@api_router.put("/admin/blogs/{blog_id}")
async def admin_update_blog(blog_id: str, payload: BlogIn, request: Request):
    require_admin(request)
    current = await store.get_blog_by_id(blog_id)
    if not current:
        raise HTTPException(status_code=404, detail="Blog not found")
    fields = _blog_fields(payload)
    if not payload.published_at.strip() and current.get("published_at"):
        fields["published_at"] = current["published_at"]  # keep the original publish date
    new_slug = _clean_slug(payload.slug)
    if new_slug and new_slug != current["slug"]:
        clash = await store.get_blog_by_slug(new_slug)
        if clash and clash["blog_id"] != blog_id:
            raise HTTPException(status_code=409, detail="That URL slug is already used by another post")
        fields["slug"] = new_slug
    fields["updated_at"] = datetime.now(timezone.utc).isoformat()
    await store.update_blog(blog_id, fields)
    return {"blog": await store.get_blog_by_id(blog_id)}
 
 
@api_router.delete("/admin/blogs/{blog_id}")
async def admin_delete_blog(blog_id: str, request: Request):
    require_admin(request)
    await store.delete_blog(blog_id)
    return {"status": "deleted"}
 
 
class BlogOrderIn(BaseModel):
    ids: list[str] = Field(min_length=1, max_length=500)  # blog_ids; first = shown first
 
 
@api_router.put("/admin/blogs-order")
async def admin_reorder_blogs(payload: BlogOrderIn, request: Request):
    require_admin(request)
    for position, blog_id in enumerate(payload.ids):
        await store.update_blog(blog_id, {"sort_order": position})
    return {"status": "ok"}
 
 
# ---------- Image upload (featured / OG images) ----------
 
_IMG_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif"}
 
 
def _looks_like_image(data: bytes) -> bool:
    return (data[:3] == b"\xff\xd8\xff" or data[:8] == b"\x89PNG\r\n\x1a\n"
            or data[:4] == b"GIF8" or (data[:4] == b"RIFF" and data[8:12] == b"WEBP"))
 
 
@api_router.post("/admin/upload")
async def admin_upload(request: Request, file: UploadFile = File(...)):
    require_admin(request)
    ext = _IMG_TYPES.get(file.content_type or "")
    data = await file.read()
    if not ext or not _looks_like_image(data):
        raise HTTPException(status_code=400, detail="Upload a JPG, PNG, WebP or GIF image")
    if len(data) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image must be under 5 MB")
    name = uuid.uuid4().hex + ext
    (UPLOAD_DIR / name).write_bytes(data)
    base = os.environ.get("PUBLIC_API_URL", "").rstrip("/") or str(request.base_url).rstrip("/")
    return {"url": f"{base}/uploads/{name}"}
 

app.include_router(api_router)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
