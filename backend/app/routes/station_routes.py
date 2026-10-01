"""
Station Routes
==============
CRUD operations for metro stations.
Includes admin-only operations for managing stations.
"""
from fastapi import APIRouter, HTTPException, status, Depends
from bson import ObjectId
from datetime import datetime

from app.database.db import get_database
from app.schemas.station_schema import StationCreate, StationResponse, StationUpdate
from app.middleware.auth_middleware import get_current_user, get_current_admin
from app.algorithms.bfs import metro_graph

router = APIRouter()

@router.get("/", response_model=list)
async def get_all_stations():
    """Get all metro stations"""
    db = get_database()
    stations = await db.stations.find().to_list(length=100)

    return [
        {
            "id": str(station["_id"]),
            "station_name": station["station_name"],
            "line": station["line"],
            "fare_zone": station["fare_zone"],
            "connections": station.get("connections", []),
            "created_at": station["created_at"],
            "updated_at": station.get("updated_at")
        }
        for station in stations
    ]

@router.get("/{station_id}")
async def get_station(station_id: str):
    """Get a specific station by ID"""
    db = get_database()

    try:
        station = await db.stations.find_one({"_id": ObjectId(station_id)})
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid station ID")

    if not station:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Station not found")

    return {
        "id": str(station["_id"]),
        "station_name": station["station_name"],
        "line": station["line"],
        "fare_zone": station["fare_zone"],
        "connections": station.get("connections", []),
        "created_at": station["created_at"],
        "updated_at": station.get("updated_at")
    }

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_station(station: StationCreate, current_user=Depends(get_current_admin)):
    """
    Create a new station (Admin only).
    Also rebuilds the metro graph after creation.
    """
    db = get_database()

    # Check if station already exists
    existing = await db.stations.find_one({"station_name": station.station_name})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Station with this name already exists"
        )

    station_doc = {
        "station_name": station.station_name,
        "line": station.line,
        "fare_zone": station.fare_zone,
        "connections": station.connections,
        "created_at": datetime.utcnow(),
        "updated_at": None
    }

    result = await db.stations.insert_one(station_doc)

    # Rebuild metro graph
    all_stations = await db.stations.find().to_list(length=200)
    metro_graph.build_from_stations(all_stations)

    return {
        "id": str(result.inserted_id),
        "message": "Station created successfully"
    }

@router.put("/{station_id}")
async def update_station(station_id: str, station: StationUpdate, current_user=Depends(get_current_admin)):
    """Update a station (Admin only)"""
    db = get_database()

    try:
        existing = await db.stations.find_one({"_id": ObjectId(station_id)})
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid station ID")

    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Station not found")

    update_data = {k: v for k, v in station.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()

    await db.stations.update_one(
        {"_id": ObjectId(station_id)},
        {"$set": update_data}
    )

    # Rebuild metro graph
    all_stations = await db.stations.find().to_list(length=200)
    metro_graph.build_from_stations(all_stations)

    return {"message": "Station updated successfully"}

@router.delete("/{station_id}")
async def delete_station(station_id: str, current_user=Depends(get_current_admin)):
    """Delete a station (Admin only)"""
    db = get_database()

    try:
        result = await db.stations.delete_one({"_id": ObjectId(station_id)})
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid station ID")

    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Station not found")

    # Rebuild metro graph
    all_stations = await db.stations.find().to_list(length=200)
    metro_graph.build_from_stations(all_stations)

    return {"message": "Station deleted successfully"}

@router.get("/stats/overview")
async def get_station_stats(current_user=Depends(get_current_admin)):
    """Get station statistics (Admin only)"""
    db = get_database()

    total_stations = await db.stations.count_documents({})
    red_line = await db.stations.count_documents({"line": "Red"})
    blue_line = await db.stations.count_documents({"line": "Blue"})
    green_line = await db.stations.count_documents({"line": "Green"})

    return {
        "total_stations": total_stations,
        "red_line_stations": red_line,
        "blue_line_stations": blue_line,
        "green_line_stations": green_line
    }
