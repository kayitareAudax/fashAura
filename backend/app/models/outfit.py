from datetime import date as date_cls
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field

from app.models.common import PyObjectId

Occasion = Literal["Casual", "Smart Casual", "Smart", "Business", "Formal", "Sport"]
DateRange = Literal["day", "week", "month", "all"]


class WeatherSnapshot(BaseModel):
    temperature_c: Optional[float] = None
    condition: Optional[str] = None
    icon: Optional[str] = None


class OutfitCreate(BaseModel):
    cloth_ids: list[str] = Field(min_length=1)
    date: Optional[date_cls] = None
    occasion: Optional[Occasion] = None
    weather: Optional[WeatherSnapshot] = None
    note: Optional[str] = None
    rating: Optional[int] = Field(default=None, ge=1, le=5)


class OutfitUpdate(BaseModel):
    cloth_ids: Optional[list[str]] = None
    occasion: Optional[Occasion] = None
    weather: Optional[WeatherSnapshot] = None
    note: Optional[str] = None
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    liked: Optional[bool] = None
    saved: Optional[bool] = None


class OutfitOut(BaseModel):
    id: PyObjectId = Field(alias="_id")
    user_id: PyObjectId
    date: datetime
    cloth_ids: list[PyObjectId]
    occasion: Optional[str] = None
    weather: Optional[WeatherSnapshot] = None
    note: Optional[str] = None
    rating: Optional[int] = None
    liked: bool = False
    saved: bool = False
    created_at: datetime

    model_config = {"populate_by_name": True}


class OutfitStats(BaseModel):
    total_looks: int
    avg_rating: float
    top_piece: Optional[str] = None
