from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel, Field
from typing import Optional, List

class RouteHistory(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    user_id: str = Field(...)
    source: str = Field(..., min_length=2)
    destination: str = Field(..., min_length=2)
    route: List[str] = Field(default_factory=list)
    stations_count: int = Field(default=0)
    interchanges: int = Field(default=0)
    fare: float = Field(default=0.0)
    travel_time: int = Field(default=0)
    searched_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
