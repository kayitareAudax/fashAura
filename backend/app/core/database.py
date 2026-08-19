from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import settings

client: AsyncIOMotorClient | None = None
database: AsyncIOMotorDatabase | None = None


async def connect_to_mongo() -> None:
    global client, database
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    database = client[settings.MONGODB_DB_NAME]
    # Fail fast on a bad connection string instead of on the first request.
    await client.admin.command("ping")


async def close_mongo_connection() -> None:
    global client
    if client is not None:
        client.close()


def get_database() -> AsyncIOMotorDatabase:
    assert database is not None, "Database not initialized. Was connect_to_mongo() called?"
    return database


async def init_indexes() -> None:
    db = get_database()
    await db.users.create_index("email", unique=True)
    await db.clothes.create_index("user_id")
    await db.clothes.create_index([("user_id", 1), ("category", 1)])
    await db.outfits.create_index([("user_id", 1), ("date", -1)])
    await db.saved_products.create_index([("user_id", 1), ("product_id", 1)], unique=True)
