from datetime import date as date_cls
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.common import to_object_id
from app.models.outfit import DateRange, OutfitCreate, OutfitUpdate


def _to_midnight_utc(day: date_cls) -> datetime:
    return datetime(day.year, day.month, day.day, tzinfo=timezone.utc)


async def _assert_clothes_belong_to_user(
    db: AsyncIOMotorDatabase, user_id: str, cloth_ids: list[str]
) -> list:
    ids = [to_object_id(cid) for cid in cloth_ids]
    count = await db.clothes.count_documents(
        {"_id": {"$in": ids}, "user_id": to_object_id(user_id)}
    )
    if count != len(ids):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more cloth_ids are invalid or don't belong to you",
        )
    return ids


async def create_outfit(db: AsyncIOMotorDatabase, user_id: str, data: OutfitCreate) -> dict:
    cloth_object_ids = await _assert_clothes_belong_to_user(db, user_id, data.cloth_ids)
    outfit_day = data.date or date_cls.today()
    doc = {
        "user_id": to_object_id(user_id),
        "date": _to_midnight_utc(outfit_day),
        "cloth_ids": cloth_object_ids,
        "occasion": data.occasion,
        "weather": data.weather.model_dump() if data.weather else None,
        "note": data.note,
        "rating": data.rating,
        "liked": False,
        "saved": False,
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.outfits.insert_one(doc)
    doc["_id"] = result.inserted_id
    return doc


def _range_cutoff(range_: DateRange) -> datetime | None:
    today_midnight = _to_midnight_utc(date_cls.today())
    if range_ == "day":
        return today_midnight
    if range_ == "week":
        return today_midnight - timedelta(days=7)
    if range_ == "month":
        return today_midnight - timedelta(days=30)
    return None


async def list_outfits(
    db: AsyncIOMotorDatabase, user_id: str, range_: DateRange = "all"
) -> list[dict]:
    query: dict = {"user_id": to_object_id(user_id)}
    cutoff = _range_cutoff(range_)
    if cutoff is not None:
        query["date"] = {"$gte": cutoff}
    cursor = db.outfits.find(query).sort("date", -1)
    return [doc async for doc in cursor]


async def get_today(db: AsyncIOMotorDatabase, user_id: str) -> dict | None:
    return await db.outfits.find_one(
        {"user_id": to_object_id(user_id), "date": _to_midnight_utc(date_cls.today())}
    )


async def get_outfit(db: AsyncIOMotorDatabase, user_id: str, outfit_id: str) -> dict:
    doc = await db.outfits.find_one(
        {"_id": to_object_id(outfit_id), "user_id": to_object_id(user_id)}
    )
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Outfit not found")
    return doc


async def update_outfit(
    db: AsyncIOMotorDatabase, user_id: str, outfit_id: str, data: OutfitUpdate
) -> dict:
    await get_outfit(db, user_id, outfit_id)
    payload = data.model_dump(exclude_unset=True)

    update_data: dict = {}
    if "cloth_ids" in payload and payload["cloth_ids"] is not None:
        update_data["cloth_ids"] = await _assert_clothes_belong_to_user(
            db, user_id, payload.pop("cloth_ids")
        )
    if "weather" in payload and payload["weather"] is not None:
        update_data["weather"] = payload.pop("weather")
    for key, value in payload.items():
        if key in ("cloth_ids", "weather"):
            continue
        if value is not None:
            update_data[key] = value

    if update_data:
        await db.outfits.update_one({"_id": to_object_id(outfit_id)}, {"$set": update_data})
    return await get_outfit(db, user_id, outfit_id)


async def delete_outfit(db: AsyncIOMotorDatabase, user_id: str, outfit_id: str) -> None:
    await get_outfit(db, user_id, outfit_id)
    await db.outfits.delete_one({"_id": to_object_id(outfit_id)})


async def rewear_outfit(db: AsyncIOMotorDatabase, user_id: str, outfit_id: str) -> dict:
    """Log a fresh outfit entry for today, reusing another day's pieces, and
    bump those pieces' wear counters."""
    original = await get_outfit(db, user_id, outfit_id)
    doc = {
        "user_id": to_object_id(user_id),
        "date": _to_midnight_utc(date_cls.today()),
        "cloth_ids": original["cloth_ids"],
        "occasion": original.get("occasion"),
        "weather": None,
        "note": None,
        "rating": None,
        "liked": False,
        "saved": False,
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.outfits.insert_one(doc)
    doc["_id"] = result.inserted_id
    await db.clothes.update_many(
        {"_id": {"$in": original["cloth_ids"]}}, {"$inc": {"times_worn": 1}}
    )
    return doc


async def get_stats(db: AsyncIOMotorDatabase, user_id: str) -> dict:
    uid = to_object_id(user_id)
    total_looks = await db.outfits.count_documents({"user_id": uid})

    avg_pipeline = [
        {"$match": {"user_id": uid, "rating": {"$ne": None}}},
        {"$group": {"_id": None, "avg": {"$avg": "$rating"}}},
    ]
    avg_agg = await db.outfits.aggregate(avg_pipeline).to_list(length=1)
    avg_rating = round(avg_agg[0]["avg"], 1) if avg_agg else 0.0

    top_pipeline = [
        {"$match": {"user_id": uid}},
        {"$unwind": "$cloth_ids"},
        {"$group": {"_id": "$cloth_ids", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 1},
    ]
    top_agg = await db.outfits.aggregate(top_pipeline).to_list(length=1)
    top_piece = None
    if top_agg:
        cloth = await db.clothes.find_one({"_id": top_agg[0]["_id"]})
        top_piece = cloth["name"] if cloth else None

    return {"total_looks": total_looks, "avg_rating": avg_rating, "top_piece": top_piece}
