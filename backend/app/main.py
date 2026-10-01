"""
Hyderabad Metro Route Planner - FastAPI Application
====================================================
Production-ready FastAPI backend with MongoDB async driver,
JWT authentication, and graph-based route finding algorithms.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import os

from app.database.db import (
    connect_to_mongo,
    close_mongo_connection,
    get_database,
)
from app.algorithms.bfs import metro_graph
from app.routes import (
    auth_routes,
    station_routes,
    route_routes,
    favorite_routes,
    history_routes,
)

# Load environment variables
load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown"""

    # Connect to MongoDB
    await connect_to_mongo()

    # Get database
    db = get_database()

    # Load stations from MongoDB
    print("Before Mongo query")

    stations = await db.stations.find().to_list(length=100)

    print("After Mongo query")
    print("MongoDB station count:", len(stations))

    # Clear graph before rebuilding
    metro_graph.adjacency_list.clear()
    metro_graph.station_lines.clear()
    metro_graph.station_zones.clear()
    metro_graph.all_stations.clear()

    # Build graph
    metro_graph.build_from_stations(stations)

    print(f"Graph station count: {len(metro_graph.all_stations)}")
    print(f"Contains Miyapur? {'Miyapur' in metro_graph.all_stations}")

    yield

    # Shutdown
    await close_mongo_connection()


app = FastAPI(
    title="Hyderabad Metro Route Planner API",
    description="Smart metro route planning with graph-based algorithms",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    os.getenv("FRONTEND_URL", "https://your-frontend.vercel.app"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(station_routes.router, prefix="/api/stations", tags=["Stations"])
app.include_router(route_routes.router, prefix="/api/routes", tags=["Route Planner"])
app.include_router(favorite_routes.router, prefix="/api/favorites", tags=["Favorites"])
app.include_router(history_routes.router, prefix="/api/history", tags=["Search History"])


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to Hyderabad Metro Route Planner API",
        "docs": "/api/docs",
        "version": "1.0.0",
    }


@app.get("/api/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "Hyderabad Metro Route Planner API",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
