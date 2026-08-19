from typing import Optional

from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_database
from app.dependencies import get_current_user
from app.models.product import ProductCreate, ProductOut, ProductUpdate
from app.services import product_service

router = APIRouter(prefix="/products", tags=["products"])


@router.post("", response_model=ProductOut, status_code=201, response_model_by_alias=False)
async def add_product(
    data: ProductCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Add a catalog item (store product). `image_url` is expected to already
    point at a hosted image (e.g. uploaded to Cloudinary beforehand)."""
    return await product_service.create_product(db, data.model_dump())


@router.get("", response_model=list[ProductOut], response_model_by_alias=False)
async def list_all_products(
    trending: Optional[bool] = None,
    is_new: Optional[bool] = None,
    saved_only: bool = False,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Backs the Store screen's tabs: `trending=true` for Trending,
    `is_new=true` for New In, `saved_only=true` for Saved. Omit both flags
    for a general listing (e.g. a future "For You" feed)."""
    return await product_service.list_products(
        db, str(current_user["_id"]), trending, is_new, saved_only
    )


@router.get("/{product_id}", response_model=ProductOut, response_model_by_alias=False)
async def get_one_product(
    product_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    return await product_service.get_product(db, product_id, str(current_user["_id"]))


@router.patch("/{product_id}", response_model=ProductOut, response_model_by_alias=False)
async def update_one_product(
    product_id: str,
    data: ProductUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    return await product_service.update_product(db, product_id, data.model_dump(exclude_unset=True))


@router.delete("/{product_id}", status_code=204)
async def delete_one_product(
    product_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    await product_service.delete_product(db, product_id)


@router.post("/{product_id}/save", status_code=204)
async def save_one_product(
    product_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    await product_service.save_product(db, str(current_user["_id"]), product_id)


@router.delete("/{product_id}/save", status_code=204)
async def unsave_one_product(
    product_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    await product_service.unsave_product(db, str(current_user["_id"]), product_id)
