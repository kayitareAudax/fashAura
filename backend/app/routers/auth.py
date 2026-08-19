from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_database
from app.core.security import create_access_token
from app.models.auth import Token
from app.models.user import UserCreate, UserOut
from app.services import user_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=201, response_model_by_alias=False)
async def register(data: UserCreate, db: AsyncIOMotorDatabase = Depends(get_database)):
    return await user_service.create_user(db, data)


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """OAuth2 password flow: send `username` (the user's email) and `password`
    as form fields. Returns a bearer token to use as `Authorization: Bearer <token>`."""
    user = await user_service.authenticate_user(db, form_data.username, form_data.password)
    token = create_access_token({"sub": str(user["_id"])})
    return Token(access_token=token)
