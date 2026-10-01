"""
Authentication Routes
=====================
Handles user registration, login, and JWT token generation
"""
from fastapi import APIRouter, HTTPException, status
from datetime import timedelta
from bson import ObjectId

from app.database.db import get_database
from app.schemas.user_schema import UserCreate, UserLogin, UserResponse, Token
from app.middleware.auth_middleware import hash_password, verify_password, create_access_token

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    """
    Register a new user.
    Checks for existing email, hashes password, and stores user in MongoDB.
    """
    db = get_database()
    users_collection = db.users

    # Check if email already exists
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash password
    password_hash = hash_password(user.password)

    # Create user document
    user_doc = {
        "name": user.name,
        "email": user.email,
        "password_hash": password_hash,
        "role": "user",
        "favorites": [],
        "created_at": __import__("datetime").datetime.utcnow()
    }

    result = await users_collection.insert_one(user_doc)

    # Return user response (without password)
    return {
        "id": str(result.inserted_id),
        "name": user.name,
        "email": user.email,
        "role": "user",
        "created_at": user_doc["created_at"]
    }

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    try:
        db = get_database()
        users_collection = db.users

        print("Login request received")
        print("Email:", credentials.email)

        user = await users_collection.find_one({"email": credentials.email})
        print("User:", user)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        password_ok = verify_password(credentials.password, user["password_hash"])
        print("Password verification:", password_ok)

        if not password_ok:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        access_token = create_access_token(
            data={"sub": str(user["_id"]), "role": user.get("role", "user")},
            expires_delta=timedelta(days=7)
        )

        print("Token created successfully")

        return {
            "access_token": access_token,
            "token_type": "bearer"
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

    # Create JWT token
    access_token = create_access_token(
        data={"sub": str(user["_id"]), "role": user.get("role", "user")},
        expires_delta=timedelta(days=7)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/admin-login", response_model=Token)
async def admin_login(credentials: UserLogin):
    """
    Admin login endpoint.
    Validates admin credentials and returns JWT token.
    """
    db = get_database()
    users_collection = db.users

    user = await users_collection.find_one({"email": credentials.email})
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials"
        )

    if not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials"
        )

    access_token = create_access_token(
        data={"sub": str(user["_id"]), "role": "admin"},
        expires_delta=timedelta(days=7)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
