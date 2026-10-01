from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel, Field
from typing import Optional

class FavoriteRoute(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    user_id: str = Field(...)
    source: str = Field(..., min_length=2)
    destination: str = Field(..., min_length=2)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
