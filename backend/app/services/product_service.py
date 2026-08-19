from datetime import datetime, timezone

from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.common import to_object_id


async def create_product(db: AsyncIOMotorDatabase, data: dict) -> dict:
    doc = {**data, "created_at": datetime.now(timezone.utc)}
    result = await db.products.insert_one(doc)
    doc["_id"] = result.inserted_id
    doc["saved"] = False
    return doc


async def _saved_product_ids(db: AsyncIOMotorDatabase, user_id: str) -> set:
    cursor = db.saved_products.find({"user_id": to_object_id(user_id)})
    return {doc["product_id"] async for doc in cursor}


async def list_products(
    db: AsyncIOMotorDatabase,
    user_id: str,
    trending: bool | None = None,
    is_new: bool | None = None,
    saved_only: bool = False,
) -> list[dict]:
    query: dict = {}
    if trending is not None:
        query["is_trending"] = trending
    if is_new is not None:
        query["is_new"] = is_new

    saved_ids = await _saved_product_ids(db, user_id)
    if saved_only:
        if not saved_ids:
            return []
        query["_id"] = {"$in": list(saved_ids)}

    products = [doc async for doc in db.products.find(query).sort("created_at", -1)]
    for p in products:
        p["saved"] = p["_id"] in saved_ids
    return products


async def get_product(db: AsyncIOMotorDatabase, product_id: str, user_id: str) -> dict:
    doc = await db.products.find_one({"_id": to_object_id(product_id)})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    saved = await db.saved_products.find_one(
        {"user_id": to_object_id(user_id), "product_id": to_object_id(product_id)}
    )
    doc["saved"] = saved is not None
    return doc


async def update_product(db: AsyncIOMotorDatabase, product_id: str, data: dict) -> dict:
    update_data = {k: v for k, v in data.items() if v is not None}
    if update_data:
        result = await db.products.update_one(
            {"_id": to_object_id(product_id)}, {"$set": update_data}
        )
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
            )
    doc = await db.products.find_one({"_id": to_object_id(product_id)})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    doc["saved"] = False
    return doc


async def delete_product(db: AsyncIOMotorDatabase, product_id: str) -> None:
    pid = to_object_id(product_id)
    await db.products.delete_one({"_id": pid})
    await db.saved_products.delete_many({"product_id": pid})


async def save_product(db: AsyncIOMotorDatabase, user_id: str, product_id: str) -> None:
    pid = to_object_id(product_id)
    product = await db.products.find_one({"_id": pid})
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    await db.saved_products.update_one(
        {"user_id": to_object_id(user_id), "product_id": pid},
        {"$setOnInsert": {"created_at": datetime.now(timezone.utc)}},
        upsert=True,
    )


async def unsave_product(db: AsyncIOMotorDatabase, user_id: str, product_id: str) -> None:
    await db.saved_products.delete_one(
        {"user_id": to_object_id(user_id), "product_id": to_object_id(product_id)}
    )
