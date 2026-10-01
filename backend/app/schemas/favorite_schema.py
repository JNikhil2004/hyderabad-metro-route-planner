from pydantic import BaseModel, Field
from datetime import datetime

class FavoriteCreate(BaseModel):
    source: str = Field(..., min_length=2)
    destination: str = Field(..., min_length=2)

class FavoriteResponse(FavoriteCreate):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True
