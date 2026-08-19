from typing import Optional

from fastapi import APIRouter, Depends, File, Form, UploadFile
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_database
from app.dependencies import get_current_user
from app.models.cloth import Category, ClothOut, ClothStats, ClothUpdate, WeatherSuitability
from app.services import cloth_service

router = APIRouter(prefix="/clothes", tags=["clothes"])


@router.post("", response_model=ClothOut, status_code=201, response_model_by_alias=False)
async def add_cloth(
    name: str = Form(...),
    category: Category = Form(...),
    weather_suitability: WeatherSuitability = Form("any"),
    color: Optional[str] = Form(None),
    brand: Optional[str] = Form(None),
    size: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    image: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Add a new wardrobe item. Multipart form: metadata fields + an `image` file,
    which is uploaded to Cloudinary."""
    file_bytes = await image.read()
    data = {
        "name": name,
        "category": category,
        "weather_suitability": weather_suitability,
        "color": color,
        "brand": brand,
        "size": size,
        "notes": notes,
    }
    return await cloth_service.create_cloth(db, str(current_user["_id"]), data, file_bytes)


@router.get("", response_model=list[ClothOut], response_model_by_alias=False)
async def list_my_clothes(
    category: Optional[str] = None,
    weather: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    return await cloth_service.list_clothes(db, str(current_user["_id"]), category, weather)


@router.get("/stats", response_model=ClothStats)
async def my_clothes_stats(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    return await cloth_service.get_stats(db, str(current_user["_id"]))


@router.get("/{cloth_id}", response_model=ClothOut, response_model_by_alias=False)
async def get_one_cloth(
    cloth_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    return await cloth_service.get_cloth(db, str(current_user["_id"]), cloth_id)


@router.patch("/{cloth_id}", response_model=ClothOut, response_model_by_alias=False)
async def update_one_cloth(
    cloth_id: str,
    name: Optional[str] = Form(None),
    category: Optional[Category] = Form(None),
    weather_suitability: Optional[WeatherSuitability] = Form(None),
    color: Optional[str] = Form(None),
    brand: Optional[str] = Form(None),
    size: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    favorite: Optional[bool] = Form(None),
    image: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Update metadata and/or replace the photo (all fields optional)."""
    update = ClothUpdate(
        name=name,
        category=category,
        weather_suitability=weather_suitability,
        color=color,
        brand=brand,
        size=size,
        notes=notes,
        favorite=favorite,
    )
    file_bytes = await image.read() if image is not None else None
    return await cloth_service.update_cloth(
        db, str(current_user["_id"]), cloth_id, update, file_bytes
    )


@router.delete("/{cloth_id}", status_code=204)
async def delete_one_cloth(
    cloth_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    await cloth_service.delete_cloth(db, str(current_user["_id"]), cloth_id)


@router.post("/{cloth_id}/wear", response_model=ClothOut, response_model_by_alias=False)
async def mark_worn(
    cloth_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Bump the wear counter, e.g. after the item is included in a logged outfit."""
    return await cloth_service.increment_wear(db, str(current_user["_id"]), cloth_id)
