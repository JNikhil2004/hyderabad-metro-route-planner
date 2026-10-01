"""
MongoDB Async Database Connection using Motor
"""
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection settings
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "hyderabad_metro")

# Global client instance
client: AsyncIOMotorClient = None

def get_database():
    """Get the database instance"""
    return client[DATABASE_NAME]

async def connect_to_mongo():
    """Establish connection to MongoDB"""
    global client
    client = AsyncIOMotorClient(MONGODB_URL)
    print(f"✅ Connected to MongoDB: {DATABASE_NAME}")

async def close_mongo_connection():
    """Close MongoDB connection"""
    global client
    if client:
        client.close()
        print("✅ MongoDB connection closed")
