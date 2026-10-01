"""
Favorite Routes
===============
CRUD operations for user's favorite routes.
"""
from fastapi import APIRouter, HTTPException, status, Depends
from bson import ObjectId
from datetime import datetime

from app.database.db import get_database
from app.schemas.favorite_schema import FavoriteCreate, FavoriteResponse
from app.middleware.auth_middleware import get_current_user

router = APIRouter()

@router.get("/", response_model=list)
async def get_favorites(current_user=Depends(get_current_user)):
    """Get all favorite routes for the current user"""
    db = get_database()
    favorites = await db.favorite_routes.find(
        {"user_id": current_user.user_id}
    ).sort("created_at", -1).to_list(length=100)

    return [
        {
            "id": str(fav["_id"]),
            "user_id": fav["user_id"],
            "source": fav["source"],
            "destination": fav["destination"],
            "created_at": fav["created_at"]
        }
        for fav in favorites
    ]

@router.post("/", status_code=status.HTTP_201_CREATED)
async def add_favorite(favorite: FavoriteCreate, current_user=Depends(get_current_user)):
    """Add a new favorite route"""
    db = get_database()

    # Check if already exists
    existing = await db.favorite_routes.find_one({
        "user_id": current_user.user_id,
        "source": favorite.source,
        "destination": favorite.destination
    })

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Route already in favorites"
        )

    fav_doc = {
        "user_id": current_user.user_id,
        "source": favorite.source,
        "destination": favorite.destination,
        "created_at": datetime.utcnow()
    }

    result = await db.favorite_routes.insert_one(fav_doc)

    return {
        "id": str(result.inserted_id),
        "user_id": current_user.user_id,
        "source": favorite.source,
        "destination": favorite.destination,
        "created_at": fav_doc["created_at"]
    }

@router.delete("/{favorite_id}")
async def delete_favorite(favorite_id: str, current_user=Depends(get_current_user)):
    """Delete a favorite route"""
    db = get_database()

    try:
        result = await db.favorite_routes.delete_one({
            "_id": ObjectId(favorite_id),
            "user_id": current_user.user_id
        })
    except:
        raise HTTPException(status_code=400, detail="Invalid favorite ID")

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Favorite not found")

    return {"message": "Favorite removed successfully"}
