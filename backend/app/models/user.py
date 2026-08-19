from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from app.models.common import PyObjectId


class NotificationPreferences(BaseModel):
    daily_outfit_message: bool = True
    weather_alerts: bool = True
    new_store_arrivals: bool = False


class NotificationPreferencesUpdate(BaseModel):
    daily_outfit_message: Optional[bool] = None
    weather_alerts: Optional[bool] = None
    new_store_arrivals: Optional[bool] = None


class UserPreferences(BaseModel):
    ai_style_learning: bool = True
    dark_mode: bool = True
    share_usage_data: bool = False
    temperature_unit: str = "C"
    lifestyle_mode: str = "Business Casual"
    notifications: NotificationPreferences = NotificationPreferences()
    whatsapp_number: Optional[str] = None
    whatsapp_send_time: str = "07:00"
    whatsapp_language: str = "English"
    whatsapp_include_emoji: bool = True
    whatsapp_include_store_link: bool = False


class UserPreferencesUpdate(BaseModel):
    ai_style_learning: Optional[bool] = None
    dark_mode: Optional[bool] = None
    share_usage_data: Optional[bool] = None
    temperature_unit: Optional[str] = None
    lifestyle_mode: Optional[str] = None
    notifications: Optional[NotificationPreferencesUpdate] = None
    whatsapp_number: Optional[str] = None
    whatsapp_send_time: Optional[str] = None
    whatsapp_language: Optional[str] = None
    whatsapp_include_emoji: Optional[bool] = None
    whatsapp_include_store_link: Optional[bool] = None


class UserBase(BaseModel):
    name: str
    email: EmailStr
    city: Optional[str] = None
    country: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(min_length=8)


class UserUpdate(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    avatar_url: Optional[str] = None


class UserOut(UserBase):
    id: PyObjectId = Field(alias="_id")
    avatar_url: Optional[str] = None
    premium: bool = False
    preferences: UserPreferences = UserPreferences()
    created_at: datetime

    model_config = {"populate_by_name": True}


class UserStats(BaseModel):
    items: int
    looks: int
    avg_rating: float
    streak_days: int
