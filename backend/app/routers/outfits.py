from typing import Optional

from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_database
from app.dependencies import get_current_user
from app.models.outfit import DateRange, OutfitCreate, OutfitOut, OutfitStats, OutfitUpdate
from app.services import outfit_service

router = APIRouter(prefix="/outfits", tags=["outfits"])


@router.post("", response_model=OutfitOut, status_code=201, response_model_by_alias=False)
async def add_outfit(
    data: OutfitCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Log an outfit (defaults to today if `date` is omitted) from existing
    wardrobe items."""
    return await outfit_service.create_outfit(db, str(current_user["_id"]), data)


@router.get("", response_model=list[OutfitOut], response_model_by_alias=False)
async def list_my_outfits(
    range: DateRange = Query("all"),
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    return await outfit_service.list_outfits(db, str(current_user["_id"]), range)


@router.get("/today", response_model=Optional[OutfitOut], response_model_by_alias=False)
async def get_today_outfit(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    return await outfit_service.get_today(db, str(current_user["_id"]))


@router.get("/stats", response_model=OutfitStats)
async def my_outfit_stats(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    return await outfit_service.get_stats(db, str(current_user["_id"]))


@router.get("/{outfit_id}", response_model=OutfitOut, response_model_by_alias=False)
async def get_one_outfit(
    outfit_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    return await outfit_service.get_outfit(db, str(current_user["_id"]), outfit_id)


@router.patch("/{outfit_id}", response_model=OutfitOut, response_model_by_alias=False)
async def update_one_outfit(
    outfit_id: str,
    data: OutfitUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Rate it, add a note, change its pieces/occasion, or toggle liked/saved
    (used by the Home screen's Love it / Save look buttons on today's outfit)."""
    return await outfit_service.update_outfit(db, str(current_user["_id"]), outfit_id, data)


@router.delete("/{outfit_id}", status_code=204)
async def delete_one_outfit(
    outfit_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    await outfit_service.delete_outfit(db, str(current_user["_id"]), outfit_id)


@router.post(
    "/{outfit_id}/rewear", response_model=OutfitOut, status_code=201, response_model_by_alias=False
)
async def rewear(
    outfit_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """"Wear again": logs a new outfit for today reusing this outfit's pieces."""
    return await outfit_service.rewear_outfit(db, str(current_user["_id"]), outfit_id)
