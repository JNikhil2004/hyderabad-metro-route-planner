from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List

class User(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr = Field(..., unique=True)
    password_hash: str = Field(...)
    role: str = Field(default="user", pattern="^(user|admin)$")
    favorites: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "john@example.com",
                "role": "user",
                "favorites": []
            }
        }
