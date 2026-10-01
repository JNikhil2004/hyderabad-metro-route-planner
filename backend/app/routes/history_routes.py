"""
Search History Routes
=====================
View and manage user's route search history.
"""
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime

from app.database.db import get_database
from app.middleware.auth_middleware import get_current_user

router = APIRouter()

@router.get("/")
async def get_search_history(current_user=Depends(get_current_user)):
    """Get search history for the current user"""
    db = get_database()

    history = await db.route_history.find(
        {"user_id": current_user.user_id}
    ).sort("searched_at", -1).to_list(length=100)

    return [
        {
            "id": str(h["_id"]),
            "user_id": h["user_id"],
            "source": h["source"],
            "destination": h["destination"],
            "route": h.get("route", []),
            "stations_count": h.get("stations_count", 0),
            "interchanges": h.get("interchanges", 0),
            "fare": h.get("fare", 0),
            "travel_time": h.get("travel_time", 0),
            "searched_at": h["searched_at"]
        }
        for h in history
    ]

@router.get("/stats")
async def get_history_stats(current_user=Depends(get_current_user)):
    """Get search history statistics"""
    db = get_database()

    total_searches = await db.route_history.count_documents({"user_id": current_user.user_id})

    # Most searched routes
    pipeline = [
        {"$match": {"user_id": current_user.user_id}},
        {"$group": {
            "_id": {"source": "$source", "destination": "$destination"},
            "count": {"$sum": 1}
        }},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]

    popular_routes = await db.route_history.aggregate(pipeline).to_list(length=5)

    return {
        "total_searches": total_searches,
        "most_searched_routes": [
            {
                "source": r["_id"]["source"],
                "destination": r["_id"]["destination"],
                "count": r["count"]
            }
            for r in popular_routes
        ]
    }

@router.delete("/")
async def clear_history(current_user=Depends(get_current_user)):
    """Clear all search history for the current user"""
    db = get_database()

    result = await db.route_history.delete_many({"user_id": current_user.user_id})

    return {
        "message": "Search history cleared",
        "deleted_count": result.deleted_count
    }
