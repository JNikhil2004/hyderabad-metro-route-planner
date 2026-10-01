from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class RouteRequest(BaseModel):
    source: str = Field(..., min_length=2, description="Source station name")
    destination: str = Field(..., min_length=2, description="Destination station name")

class RouteResponse(BaseModel):
    source: str
    destination: str
    route: List[str]
    stations_count: int
    interchanges: int
    interchange_stations: List[str]
    fare: float
    travel_time: int
    lines_traversed: List[str]

class RouteHistoryResponse(BaseModel):
    id: str
    user_id: str
    source: str
    destination: str
    route: List[str]
    stations_count: int
    interchanges: int
    fare: float
    travel_time: int
    searched_at: datetime

    class Config:
        from_attributes = True
