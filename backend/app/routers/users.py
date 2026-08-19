from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_database
from app.dependencies import get_current_user
from app.models.user import UserOut, UserPreferencesUpdate, UserStats, UserUpdate
from app.services import user_service

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserOut, response_model_by_alias=False)
async def read_me(current_user: dict = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserOut, response_model_by_alias=False)
async def update_me(
    data: UserUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    return await user_service.update_user(db, str(current_user["_id"]), data)


@router.patch("/me/preferences", response_model=UserOut, response_model_by_alias=False)
async def update_my_preferences(
    data: UserPreferencesUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    return await user_service.update_preferences(db, str(current_user["_id"]), data)


@router.get("/me/stats", response_model=UserStats)
async def read_my_stats(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    return await user_service.get_user_stats(db, str(current_user["_id"]))
