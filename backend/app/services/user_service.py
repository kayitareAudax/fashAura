from datetime import date as date_cls
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.security import hash_password, verify_password
from app.models.common import to_object_id
from app.models.user import UserCreate, UserPreferencesUpdate, UserUpdate


def _default_preferences() -> dict:
    return {
        "ai_style_learning": True,
        "dark_mode": True,
        "share_usage_data": False,
        "temperature_unit": "C",
        "lifestyle_mode": "Business Casual",
        "notifications": {
            "daily_outfit_message": True,
            "weather_alerts": True,
            "new_store_arrivals": False,
        },
        "whatsapp_number": None,
        "whatsapp_send_time": "07:00",
        "whatsapp_language": "English",
        "whatsapp_include_emoji": True,
        "whatsapp_include_store_link": False,
    }


async def create_user(db: AsyncIOMotorDatabase, data: UserCreate) -> dict:
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )
    doc = {
        "name": data.name,
        "email": data.email,
        "password_hash": hash_password(data.password),
        "city": data.city,
        "country": data.country,
        "avatar_url": None,
        "premium": False,
        "preferences": _default_preferences(),
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.users.insert_one(doc)
    doc["_id"] = result.inserted_id
    return doc


async def authenticate_user(db: AsyncIOMotorDatabase, email: str, password: str) -> dict:
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password"
        )
    return user


async def update_user(db: AsyncIOMotorDatabase, user_id: str, data: UserUpdate) -> dict:
    update_data = {k: v for k, v in data.model_dump(exclude_unset=True).items() if v is not None}
    if update_data:
        await db.users.update_one({"_id": to_object_id(user_id)}, {"$set": update_data})
    return await db.users.find_one({"_id": to_object_id(user_id)})


async def update_preferences(
    db: AsyncIOMotorDatabase, user_id: str, data: UserPreferencesUpdate
) -> dict:
    payload = data.model_dump(exclude_unset=True)
    update_data: dict = {}
    notifications = payload.pop("notifications", None)
    for key, value in payload.items():
        if value is not None:
            update_data[f"preferences.{key}"] = value
    if notifications:
        for key, value in notifications.items():
            if value is not None:
                update_data[f"preferences.notifications.{key}"] = value
    if update_data:
        await db.users.update_one({"_id": to_object_id(user_id)}, {"$set": update_data})
    return await db.users.find_one({"_id": to_object_id(user_id)})


async def get_user_stats(db: AsyncIOMotorDatabase, user_id: str) -> dict:
    uid = to_object_id(user_id)
    items = await db.clothes.count_documents({"user_id": uid})
    looks = await db.outfits.count_documents({"user_id": uid})

    pipeline = [
        {"$match": {"user_id": uid, "rating": {"$ne": None}}},
        {"$group": {"_id": None, "avg": {"$avg": "$rating"}}},
    ]
    agg = await db.outfits.aggregate(pipeline).to_list(length=1)
    avg_rating = round(agg[0]["avg"], 1) if agg else 0.0

    streak = await _compute_streak(db, uid)
    return {"items": items, "looks": looks, "avg_rating": avg_rating, "streak_days": streak}


async def _compute_streak(db: AsyncIOMotorDatabase, uid) -> int:
    """Consecutive days (ending today) that have a logged outfit."""
    cursor = db.outfits.find({"user_id": uid}, {"date": 1})
    logged_days = {doc["date"].date() async for doc in cursor}
    if not logged_days:
        return 0

    streak = 0
    cursor_day = date_cls.today()
    while cursor_day in logged_days:
        streak += 1
        cursor_day -= timedelta(days=1)
    return streak
