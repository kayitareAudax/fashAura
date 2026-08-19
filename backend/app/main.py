from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import close_mongo_connection, connect_to_mongo, init_indexes
from app.routers import auth, clothes, outfits, products, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    await init_indexes()
    yield
    await close_mongo_connection()


app = FastAPI(title="FashAura API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(clothes.router)
app.include_router(outfits.router)
app.include_router(products.router)


@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok"}
