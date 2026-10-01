"""
Route Planner Routes
====================
Handles route finding using BFS/Dijkstra algorithms.
Saves search history for authenticated users.
"""
from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime

from app.database.db import get_database
from app.schemas.route_schema import RouteRequest, RouteResponse
from app.middleware.auth_middleware import get_current_user
from app.algorithms.bfs import metro_graph

router = APIRouter()

@router.post("/find", response_model=RouteResponse)
async def find_route(route_req: RouteRequest, current_user=Depends(get_current_user)):
    """
    Find shortest route between two stations.
    Uses BFS algorithm for shortest path.
    Saves route to search history for authenticated users.
    """
    source = route_req.source.strip()
    destination = route_req.destination.strip()

    # Validate stations exist
    if source not in metro_graph.all_stations:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Source station '{source}' not found"
        )

    if destination not in metro_graph.all_stations:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Destination station '{destination}' not found"
        )

    # Find shortest path using BFS
    result = metro_graph.bfs_shortest_path(source, destination)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No route found between the specified stations"
        )

    # Save to search history
    db = get_database()
    await db.route_history.insert_one({
        "user_id": current_user.user_id,
        "source": source,
        "destination": destination,
        "route": result.route,
        "stations_count": result.stations_count,
        "interchanges": result.interchanges,
        "fare": result.fare,
        "travel_time": result.travel_time,
        "searched_at": datetime.utcnow()
    })

    return {
        "source": result.source,
        "destination": result.destination,
        "route": result.route,
        "stations_count": result.stations_count,
        "interchanges": result.interchanges,
        "interchange_stations": result.interchange_stations,
        "fare": result.fare,
        "travel_time": result.travel_time,
        "lines_traversed": result.lines_traversed
    }

@router.post("/find-time")
async def find_route_by_time(route_req: RouteRequest, current_user=Depends(get_current_user)):
    """
    Find shortest route by travel time using Dijkstra's algorithm.
    """
    source = route_req.source.strip()
    destination = route_req.destination.strip()
    print("=" * 60)
    print("SOURCE:", repr(source))
    print("DESTINATION:", repr(destination))
    print("GRAPH ID:", id(metro_graph))
    print("TOTAL STATIONS:", len(metro_graph.all_stations))
    print("HAS MIYAPUR:", "Miyapur" in metro_graph.all_stations)
    print("SOURCE EXISTS:", source in metro_graph.all_stations)
    print("=" * 60)


    if source not in metro_graph.all_stations:
        raise HTTPException(status_code=404, detail=f"Source station '{source}' not found")

    if destination not in metro_graph.all_stations:
        raise HTTPException(status_code=404, detail=f"Destination station '{destination}' not found")

    result = metro_graph.dijkstra_shortest_time(source, destination)

    if not result:
        raise HTTPException(status_code=404, detail="No route found")

    # Save to history
    db = get_database()
    await db.route_history.insert_one({
        "user_id": current_user.user_id,
        "source": source,
        "destination": destination,
        "route": result.route,
        "stations_count": result.stations_count,
        "interchanges": result.interchanges,
        "fare": result.fare,
        "travel_time": result.travel_time,
        "searched_at": datetime.utcnow()
    })

    return {
        "source": result.source,
        "destination": result.destination,
        "route": result.route,
        "stations_count": result.stations_count,
        "interchanges": result.interchanges,
        "interchange_stations": result.interchange_stations,
        "fare": result.fare,
        "travel_time": result.travel_time,
        "lines_traversed": result.lines_traversed
    }

@router.get("/stations/list")
async def get_stations_list():
    """Get sorted list of all stations"""
    return {
        "stations": metro_graph.get_all_stations(),
        "interchange_stations": metro_graph.get_interchange_stations(),
        "lines": {
            "Red": metro_graph.get_stations_by_line("Red"),
            "Blue": metro_graph.get_stations_by_line("Blue"),
            "Green": metro_graph.get_stations_by_line("Green")
        }
    }
