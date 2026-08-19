from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import hmac
import hashlib
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime, timezone

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
    return {"status": "success", "enrollment": public_enrollment(doc)}


@api_router.get("/orders/{order_ref}")
async def get_order(order_ref: str):
    doc = await db.enrollments.find_one({"order_ref": order_ref}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"enrollment": public_enrollment(doc), "payment_mode": "live" if RAZORPAY_CONFIGURED else "demo"}


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
