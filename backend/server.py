from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import hmac
import hashlib
import re
import ipaddress
import httpx
import jwt
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

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
        "price_inr": 49000,
    },
    "offline": {
        "id": "offline",
        "name": "Offline — In-Person Classroom",
        "format": "In-person classroom",
        "price_inr": 99000,
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
        await db.enrollments.insert_one(doc)
        return {
            "demo": False,
            "order_ref": order_ref,
            "razorpay_order_id": rzp_order["id"],
            "razorpay_key_id": RAZORPAY_KEY_ID,
            "amount_paise": course["price_inr"] * 100,
            "currency": "INR",
            "course": course,
        }

    await db.enrollments.insert_one(doc)
    return {
        "demo": True,
        "order_ref": order_ref,
        "amount_paise": course["price_inr"] * 100,
        "currency": "INR",
        "course": course,
    }


@api_router.post("/payments/verify")
async def verify_payment(payload: PaymentVerify):
    doc = await db.enrollments.find_one({"order_ref": payload.order_ref}, {"_id": 0})
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
            await db.enrollments.update_one({"order_ref": payload.order_ref}, {"$set": {"status": "failed"}})
            raise HTTPException(status_code=400, detail="Invalid payment signature")
    else:
        if payload.demo_outcome != "success":
            await db.enrollments.update_one({"order_ref": payload.order_ref}, {"$set": {"status": "failed"}})
            return {"status": "failed"}

    paid_at = datetime.now(timezone.utc).isoformat()
    update = {"status": "paid", "paid_at": paid_at}
    if payload.razorpay_payment_id:
        update["razorpay_payment_id"] = payload.razorpay_payment_id
    await db.enrollments.update_one({"order_ref": payload.order_ref}, {"$set": update})
    doc = await db.enrollments.find_one({"order_ref": payload.order_ref}, {"_id": 0})

    email_status = "skipped"
    if EMAIL_KEY and EMAIL_FROM_NAME:
        try:
            subject = f"Enrollment confirmed — {COURSES[doc['course_id']]['name']}"
            email_id = await send_email(to=doc["email"], subject=subject, html=enrollment_email_html(doc))
            await db.enrollments.update_one(
                {"order_ref": payload.order_ref}, {"$set": {"confirmation_email_id": email_id}}
            )
            email_status = "sent"
        except Exception as e:
            logger.error(f"Confirmation email failed for {payload.order_ref}: {e}")
            email_status = "failed"

    return {"status": "success", "enrollment": public_enrollment(doc), "email": email_status}


@api_router.get("/orders/{order_ref}")
async def get_order(order_ref: str):
    doc = await db.enrollments.find_one({"order_ref": order_ref}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"enrollment": public_enrollment(doc), "payment_mode": "live" if RAZORPAY_CONFIGURED else "demo"}


JWT_SECRET = os.environ.get("JWT_SECRET", "")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")


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


@api_router.post("/admin/login")
async def admin_login(payload: AdminLogin):
    if not ADMIN_PASSWORD or payload.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    token = jwt.encode(
        {"sub": "admin", "exp": datetime.now(timezone.utc) + timedelta(hours=12)},
        JWT_SECRET,
        algorithm="HS256",
    )
    return {"token": token}


@api_router.get("/admin/enrollments")
async def admin_enrollments(request: Request):
    require_admin(request)
    docs = await db.enrollments.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return {"enrollments": [{**public_enrollment(d), "phone": d.get("phone", "")} for d in docs]}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
