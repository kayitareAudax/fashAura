from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.models.common import PyObjectId


class ProductBase(BaseModel):
    brand: str
    name: str
    price: float = Field(ge=0)
    currency: str = "AED"
    original_price: Optional[float] = Field(default=None, ge=0)
    tag: Optional[str] = None
    tag_color: Optional[str] = None
    category: Optional[str] = None
    weather_suitability: Optional[str] = None
    # Manually set for now (no ML yet) - a placeholder for a future
    # recommendation-driven score.
    match_score: Optional[int] = Field(default=None, ge=0, le=100)
    is_trending: bool = False
    is_new: bool = False


class ProductCreate(ProductBase):
    image_url: str


class ProductUpdate(BaseModel):
    brand: Optional[str] = None
    name: Optional[str] = None
    price: Optional[float] = Field(default=None, ge=0)
    currency: Optional[str] = None
    original_price: Optional[float] = Field(default=None, ge=0)
    tag: Optional[str] = None
    tag_color: Optional[str] = None
    category: Optional[str] = None
    weather_suitability: Optional[str] = None
    match_score: Optional[int] = Field(default=None, ge=0, le=100)
    is_trending: Optional[bool] = None
    is_new: Optional[bool] = None
    image_url: Optional[str] = None


class ProductOut(ProductBase):
    id: PyObjectId = Field(alias="_id")
    image_url: str
    created_at: datetime
    saved: bool = False  # relative to the requesting user

    model_config = {"populate_by_name": True}
