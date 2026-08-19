from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field

from app.models.common import PyObjectId

Category = Literal["Tops", "Bottoms", "Shoes", "Outerwear", "Accessories"]
WeatherSuitability = Literal["hot", "mild", "cold", "any"]


class ClothBase(BaseModel):
    name: str
    category: Category
    weather_suitability: WeatherSuitability = "any"
    color: Optional[str] = None
    brand: Optional[str] = None
    size: Optional[str] = None
    notes: Optional[str] = None


class ClothUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[Category] = None
    weather_suitability: Optional[WeatherSuitability] = None
    color: Optional[str] = None
    brand: Optional[str] = None
    size: Optional[str] = None
    notes: Optional[str] = None
    favorite: Optional[bool] = None


class ClothOut(ClothBase):
    id: PyObjectId = Field(alias="_id")
    user_id: PyObjectId
    image_url: str
    image_public_id: str
    times_worn: int = 0
    favorite: bool = False
    created_at: datetime
    updated_at: datetime

    model_config = {"populate_by_name": True}


class ClothStats(BaseModel):
    total: int
    hot_weather: int
    mild_weather: int
    cold_weather: int
    by_category: dict[str, int]
