"""
Hyderabad Metro Seed Data
===========================
Complete station data for Red, Blue, and Green Lines.
Based on official Wikipedia data with accurate station names and connections.
"""
from datetime import datetime

# Complete Red Line: Miyapur to LB Nagar (27 stations)
RED_LINE_STATIONS = [
    {"station_name": "Miyapur", "line": "Red", "fare_zone": 1, "connections": ["JNTU College"]},
    {"station_name": "JNTU College", "line": "Red", "fare_zone": 1, "connections": ["Miyapur", "KPHB Colony"]},
    {"station_name": "KPHB Colony", "line": "Red", "fare_zone": 1, "connections": ["JNTU College", "Kukatpally"]},
    {"station_name": "Kukatpally", "line": "Red", "fare_zone": 1, "connections": ["KPHB Colony", "Balanagar"]},
    {"station_name": "Balanagar", "line": "Red", "fare_zone": 2, "connections": ["Kukatpally", "Moosapet"]},
    {"station_name": "Moosapet", "line": "Red", "fare_zone": 2, "connections": ["Balanagar", "Bharat Nagar"]},
    {"station_name": "Bharat Nagar", "line": "Red", "fare_zone": 2, "connections": ["Moosapet", "Erragadda"]},
    {"station_name": "Erragadda", "line": "Red", "fare_zone": 2, "connections": ["Bharat Nagar", "ESI Hospital"]},
    {"station_name": "ESI Hospital", "line": "Red", "fare_zone": 2, "connections": ["Erragadda", "SR Nagar"]},
    {"station_name": "SR Nagar", "line": "Red", "fare_zone": 2, "connections": ["ESI Hospital", "Ameerpet"]},
    {"station_name": "Ameerpet", "line": "Red", "fare_zone": 2, "connections": ["SR Nagar", "Punjagutta", "Madhura Nagar", "Begumpet"]},
    {"station_name": "Punjagutta", "line": "Red", "fare_zone": 3, "connections": ["Ameerpet", "Irrum Manzil"]},
    {"station_name": "Irrum Manzil", "line": "Red", "fare_zone": 3, "connections": ["Punjagutta", "Khairatabad"]},
    {"station_name": "Khairatabad", "line": "Red", "fare_zone": 3, "connections": ["Irrum Manzil", "Lakdi-ka-pul"]},
    {"station_name": "Lakdi-ka-pul", "line": "Red", "fare_zone": 3, "connections": ["Khairatabad", "Assembly"]},
    {"station_name": "Assembly", "line": "Red", "fare_zone": 3, "connections": ["Lakdi-ka-pul", "Nampally"]},
    {"station_name": "Nampally", "line": "Red", "fare_zone": 3, "connections": ["Assembly", "Gandhi Bhavan"]},
    {"station_name": "Gandhi Bhavan", "line": "Red", "fare_zone": 3, "connections": ["Nampally", "Osmania Medical College"]},
    {"station_name": "Osmania Medical College", "line": "Red", "fare_zone": 3, "connections": ["Gandhi Bhavan", "MG Bus Station"]},
    {"station_name": "MG Bus Station", "line": "Red", "fare_zone": 3, "connections": ["Osmania Medical College", "Malakpet", "Sultan Bazaar"]},
    {"station_name": "Malakpet", "line": "Red", "fare_zone": 4, "connections": ["MG Bus Station", "New Market"]},
    {"station_name": "New Market", "line": "Red", "fare_zone": 4, "connections": ["Malakpet", "Musarambagh"]},
    {"station_name": "Musarambagh", "line": "Red", "fare_zone": 4, "connections": ["New Market", "Dilsukhnagar"]},
    {"station_name": "Dilsukhnagar", "line": "Red", "fare_zone": 4, "connections": ["Musarambagh", "Chaitanyapuri"]},
    {"station_name": "Chaitanyapuri", "line": "Red", "fare_zone": 4, "connections": ["Dilsukhnagar", "Victoria Memorial"]},
    {"station_name": "Victoria Memorial", "line": "Red", "fare_zone": 4, "connections": ["Chaitanyapuri", "LB Nagar"]},
    {"station_name": "LB Nagar", "line": "Red", "fare_zone": 5, "connections": ["Victoria Memorial"]},
]

# Complete Blue Line: Nagole to Raidurg (23 stations)
BLUE_LINE_STATIONS = [
    {"station_name": "Nagole", "line": "Blue", "fare_zone": 5, "connections": ["Uppal"]},
    {"station_name": "Uppal", "line": "Blue", "fare_zone": 5, "connections": ["Nagole", "Stadium"]},
    {"station_name": "Stadium", "line": "Blue", "fare_zone": 5, "connections": ["Uppal", "NGRI"]},
    {"station_name": "NGRI", "line": "Blue", "fare_zone": 5, "connections": ["Stadium", "Habsiguda"]},
    {"station_name": "Habsiguda", "line": "Blue", "fare_zone": 5, "connections": ["NGRI", "Tarnaka"]},
    {"station_name": "Tarnaka", "line": "Blue", "fare_zone": 4, "connections": ["Habsiguda", "Mettuguda"]},
    {"station_name": "Mettuguda", "line": "Blue", "fare_zone": 4, "connections": ["Tarnaka", "Secunderabad East"]},
    {"station_name": "Secunderabad East", "line": "Blue", "fare_zone": 4, "connections": ["Mettuguda", "Parade Ground"]},
    {"station_name": "Parade Ground", "line": "Blue", "fare_zone": 3, "connections": ["Secunderabad East", "Paradise", "JBS Parade Ground", "Secunderabad West"]},
    {"station_name": "Paradise", "line": "Blue", "fare_zone": 3, "connections": ["Parade Ground", "Rasoolpura"]},
    {"station_name": "Rasoolpura", "line": "Blue", "fare_zone": 3, "connections": ["Paradise", "Prakash Nagar"]},
    {"station_name": "Prakash Nagar", "line": "Blue", "fare_zone": 3, "connections": ["Rasoolpura", "Begumpet"]},
    {"station_name": "Begumpet", "line": "Blue", "fare_zone": 3, "connections": ["Prakash Nagar", "Ameerpet"]},
    {"station_name": "Ameerpet", "line": "Blue", "fare_zone": 2, "connections": ["Begumpet", "Madhura Nagar", "SR Nagar", "Punjagutta"]},
    {"station_name": "Madhura Nagar", "line": "Blue", "fare_zone": 2, "connections": ["Ameerpet", "Yousufguda"]},
    {"station_name": "Yousufguda", "line": "Blue", "fare_zone": 2, "connections": ["Madhura Nagar", "Jubilee Hills Check Post"]},
    {"station_name": "Jubilee Hills Check Post", "line": "Blue", "fare_zone": 2, "connections": ["Yousufguda", "Jubilee Hills Road No. 5"]},
    {"station_name": "Jubilee Hills Road No. 5", "line": "Blue", "fare_zone": 2, "connections": ["Jubilee Hills Check Post", "Peddamma Gudi"]},
    {"station_name": "Peddamma Gudi", "line": "Blue", "fare_zone": 2, "connections": ["Jubilee Hills Road No. 5", "Madhapur"]},
    {"station_name": "Madhapur", "line": "Blue", "fare_zone": 2, "connections": ["Peddamma Gudi", "Durgam Cheruvu"]},
    {"station_name": "Durgam Cheruvu", "line": "Blue", "fare_zone": 1, "connections": ["Madhapur", "HITEC City"]},
    {"station_name": "HITEC City", "line": "Blue", "fare_zone": 1, "connections": ["Durgam Cheruvu", "Raidurg"]},
    {"station_name": "Raidurg", "line": "Blue", "fare_zone": 1, "connections": ["HITEC City"]},
]

# Complete Green Line: JBS Parade Ground to MG Bus Station (10 stations)
GREEN_LINE_STATIONS = [
    {"station_name": "JBS Parade Ground", "line": "Green", "fare_zone": 4, "connections": ["Parade Ground", "Secunderabad West"]},
    {"station_name": "Parade Ground", "line": "Green", "fare_zone": 3, "connections": ["JBS Parade Ground", "Secunderabad West", "Secunderabad East", "Paradise"]},
    {"station_name": "Secunderabad West", "line": "Green", "fare_zone": 3, "connections": ["Parade Ground", "Gandhi Hospital"]},
    {"station_name": "Gandhi Hospital", "line": "Green", "fare_zone": 3, "connections": ["Secunderabad West", "Musheerabad"]},
    {"station_name": "Musheerabad", "line": "Green", "fare_zone": 3, "connections": ["Gandhi Hospital", "RTC Cross Roads"]},
    {"station_name": "RTC Cross Roads", "line": "Green", "fare_zone": 3, "connections": ["Musheerabad", "Chikkadpally"]},
    {"station_name": "Chikkadpally", "line": "Green", "fare_zone": 3, "connections": ["RTC Cross Roads", "Narayanguda"]},
    {"station_name": "Narayanguda", "line": "Green", "fare_zone": 3, "connections": ["Chikkadpally", "Sultan Bazaar"]},
    {"station_name": "Sultan Bazaar", "line": "Green", "fare_zone": 3, "connections": ["Narayanguda", "MG Bus Station"]},
    {"station_name": "MG Bus Station", "line": "Green", "fare_zone": 3, "connections": ["Sultan Bazaar", "Osmania Medical College"]},
]

# Combine all stations
ALL_STATIONS = RED_LINE_STATIONS + BLUE_LINE_STATIONS + GREEN_LINE_STATIONS

async def seed_stations(db):
    """
    Seed the database with all Hyderabad Metro stations.
    Clears existing stations and inserts fresh data.
    """
    # Clear existing stations
    await db.stations.delete_many({})

    # Insert all stations
    for station in ALL_STATIONS:
        station["created_at"] = datetime.utcnow()
        station["updated_at"] = None

    result = await db.stations.insert_many(ALL_STATIONS)
    print(f"✅ Seeded {len(result.inserted_ids)} stations")

    return result.inserted_ids

async def seed_admin_user(db):
    """Create default admin user"""
    from app.middleware.auth_middleware import hash_password

    # Check if admin exists
    existing = await db.users.find_one({"email": "admin@hyderabadmetro.com"})
    if existing:
        print("✅ Admin user already exists")
        return

    admin_doc = {
        "name": "Admin",
        "email": "admin@hyderabadmetro.com",
        "password_hash": hash_password("admin123"),
        "role": "admin",
        "favorites": [],
        "created_at": datetime.utcnow()
    }

    result = await db.users.insert_one(admin_doc)
    print(f"✅ Admin user created: {result.inserted_id}")
    print("   Email: admin@hyderabadmetro.com")
    print("   Password: admin123")

if __name__ == "__main__":
    import asyncio
    from motor.motor_asyncio import AsyncIOMotorClient

    async def main():
        client = AsyncIOMotorClient("mongodb://localhost:27017")
        db = client.hyderabad_metro

        await seed_stations(db)
        await seed_admin_user(db)

        client.close()

    asyncio.run(main())
