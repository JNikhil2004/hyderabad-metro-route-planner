from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class StationBase(BaseModel):
    station_name: str = Field(..., min_length=2, max_length=100)
    line: str = Field(..., pattern="^(Red|Blue|Green)$")
    fare_zone: int = Field(..., ge=1, le=5)
    connections: List[str] = Field(default_factory=list)

class StationCreate(StationBase):
    pass

class StationUpdate(BaseModel):
    station_name: Optional[str] = Field(None, min_length=2, max_length=100)
    line: Optional[str] = Field(None, pattern="^(Red|Blue|Green)$")
    fare_zone: Optional[int] = Field(None, ge=1, le=5)
    connections: Optional[List[str]] = Field(None)

class StationResponse(StationBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
