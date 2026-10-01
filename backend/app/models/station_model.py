from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel, Field
from typing import Optional, List

class Station(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    station_name: str = Field(..., min_length=2, max_length=100)
    line: str = Field(..., pattern="^(Red|Blue|Green)$")
    fare_zone: int = Field(..., ge=1, le=5)
    connections: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "station_name": "Ameerpet",
                "line": "Red",
                "fare_zone": 2,
                "connections": ["Madhura Nagar", "Punjagutta", "Begumpet"]
            }
        }
