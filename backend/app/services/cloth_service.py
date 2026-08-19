from datetime import datetime, timezone

from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.cloth import ClothUpdate
from app.models.common import to_object_id
from app.services.cloudinary_service import delete_image, upload_image


async def create_cloth(
    db: AsyncIOMotorDatabase, user_id: str, data: dict, file_bytes: bytes
) -> dict:
    upload = await upload_image(file_bytes, folder=f"fashaura/{user_id}/clothes")
    now = datetime.now(timezone.utc)
    doc = {
        **data,
        "user_id": to_object_id(user_id),
        "image_url": upload["url"],
        "image_public_id": upload["public_id"],
        "times_worn": 0,
        "favorite": False,
        "created_at": now,
        "updated_at": now,
    }
    result = await db.clothes.insert_one(doc)
    doc["_id"] = result.inserted_id
    return doc


async def list_clothes(
    db: AsyncIOMotorDatabase,
    user_id: str,
    category: str | None = None,
    weather: str | None = None,
) -> list[dict]:
    query: dict = {"user_id": to_object_id(user_id)}
    if category and category != "All":
        query["category"] = category
    if weather:
        query["weather_suitability"] = weather
    cursor = db.clothes.find(query).sort("created_at", -1)
    return [doc async for doc in cursor]


async def get_cloth(db: AsyncIOMotorDatabase, user_id: str, cloth_id: str) -> dict:
    doc = await db.clothes.find_one(
        {"_id": to_object_id(cloth_id), "user_id": to_object_id(user_id)}
    )
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cloth not found")
    return doc


async def update_cloth(
    db: AsyncIOMotorDatabase,
    user_id: str,
    cloth_id: str,
    data: ClothUpdate,
    file_bytes: bytes | None = None,
) -> dict:
    existing = await get_cloth(db, user_id, cloth_id)
    update_data = {k: v for k, v in data.model_dump(exclude_unset=True).items() if v is not None}

    if file_bytes:
        upload = await upload_image(file_bytes, folder=f"fashaura/{user_id}/clothes")
        await delete_image(existing.get("image_public_id"))
        update_data["image_url"] = upload["url"]
        update_data["image_public_id"] = upload["public_id"]

    if update_data:
        update_data["updated_at"] = datetime.now(timezone.utc)
        await db.clothes.update_one({"_id": to_object_id(cloth_id)}, {"$set": update_data})

    return await get_cloth(db, user_id, cloth_id)


async def delete_cloth(db: AsyncIOMotorDatabase, user_id: str, cloth_id: str) -> None:
    doc = await get_cloth(db, user_id, cloth_id)
    await delete_image(doc.get("image_public_id"))
    await db.clothes.delete_one({"_id": to_object_id(cloth_id)})


async def increment_wear(db: AsyncIOMotorDatabase, user_id: str, cloth_id: str) -> dict:
    await get_cloth(db, user_id, cloth_id)
    await db.clothes.update_one({"_id": to_object_id(cloth_id)}, {"$inc": {"times_worn": 1}})
    return await get_cloth(db, user_id, cloth_id)


async def get_stats(db: AsyncIOMotorDatabase, user_id: str) -> dict:
    uid = to_object_id(user_id)
    total = await db.clothes.count_documents({"user_id": uid})
    hot = await db.clothes.count_documents({"user_id": uid, "weather_suitability": "hot"})
    mild = await db.clothes.count_documents({"user_id": uid, "weather_suitability": "mild"})
    cold = await db.clothes.count_documents({"user_id": uid, "weather_suitability": "cold"})

    pipeline = [
        {"$match": {"user_id": uid}},
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
    ]
    by_category = {doc["_id"]: doc["count"] async for doc in db.clothes.aggregate(pipeline)}

    return {
        "total": total,
        "hot_weather": hot,
        "mild_weather": mild,
        "cold_weather": cold,
        "by_category": by_category,
    }
