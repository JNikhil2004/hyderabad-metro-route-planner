# 🚇 Hyderabad Metro Route Planner

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

An intelligent, full-stack transit navigation system for the **Hyderabad Metro Rail** network. Features an **interactive SVG schematic vector map**, dual graph-search algorithms (**BFS** for fewest stops and **Dijkstra** for fastest time with transfer penalties), responsive modern UI, and offline-capable client routing with FastAPI backend synchronization.

---

## 🌟 Key Highlights

- 🗺️ **Interactive Vector Metro Map**: Topological SVG network map covering all 60 stations across 3 lines. Features dynamic route highlighting, animated glowing train pulses, pan/zoom controls, and click-to-select origin/destination.
- ⚡ **Dual Graph Algorithms**:
  - **BFS (Breadth-First Search)**: Guarantees shortest path by minimum station count ($O(V + E)$).
  - **Dijkstra's Algorithm**: Optimizes total travel duration factoring in line transfer penalties ($O((V + E) \log V)$).
- 📍 **Step-by-Step Transit Itinerary**: Detailed journey legs grouped by corridor, expandable intermediate stops, boarding alerts, and walking transfer guidance at key interchanges.
- 💰 **Accurate Fare & Duration Estimation**: Real-time fare calculation based on official Hyderabad Metro slabs (₹10 to ₹50) and estimated travel duration.
- 🔄 **Strategic Interchange Detection**: Highlights key transfer hubs at **Ameerpet** (Red ⇄ Blue), **Parade Ground** (Blue ⇄ Green), and **MG Bus Station** (Red ⇄ Green).
- 💾 **Favorites & Journey History**: One-click route bookmarking and persistent journey logs with sync to FastAPI MongoDB backend or local storage fallback.
- 🌿 **Eco-Impact Score**: Estimates CO₂ emissions saved compared to road traffic.
- 📱 **Clean Responsive UI**: Designed with modern dark transit aesthetics, glassmorphic cards, accessible combobox search with line filters, and smooth animations.

---

## 🚇 Metro Corridors

| Line | Corridor | Termini | Stations | Key Interchanges |
| :--- | :--- | :--- | :---: | :--- |
| **Red Line** | Corridor 1 | Miyapur ⇄ LB Nagar | 27 | Ameerpet (Blue), MG Bus Station (Green) |
| **Blue Line** | Corridor 3 | Raidurg ⇄ Nagole | 23 | Ameerpet (Red), Parade Ground (Green) |
| **Green Line** | Corridor 2 | JBS Parade Ground ⇄ MGBS | 10 | Parade Ground (Blue), MG Bus Station (Red) |

---

## 🏗️ Technical Architecture & Algorithms

### Graph Representation
The metro network is modeled as an undirected, weighted graph:
- **Vertices ($V = 60$)**: Metro stations with metadata (line color, fare zone, GPS/SVG schematic coordinates).
- **Edges ($E$)**: Physical rail connections between adjacent stations.
- **Edge Weights**: Travel time (base 2 minutes per station hop + 3-minute walking transfer penalty when switching lines).

### Algorithm Comparison

| Strategy | Algorithm | Objective | Time Complexity | Space Complexity |
| :--- | :--- | :--- | :---: | :---: |
| **Fewest Stops** | Breadth-First Search (BFS) | Minimum number of station hops | $\mathcal{O}(V + E)$ | $\mathcal{O}(V)$ |
| **Fastest Travel** | Dijkstra's Algorithm | Minimum travel time (penalizes transfers) | $\mathcal{O}((V + E) \log V)$ | $\mathcal{O}(V)$ |

---

## 📁 Project Structure

```
hyderabad-metro-route-planner/
├── frontend/                     # React + Vite Client
│   ├── src/
│   │   ├── components/
│   │   │   ├── MetroMap.jsx      # Interactive SVG map with live route glow & pan/zoom
│   │   │   ├── StationSelector.jsx# Searchable station combobox with line filter tabs
│   │   │   ├── RouteSearchForm.jsx# Route input with quick hubs, swap & algorithm toggle
│   │   │   ├── RouteStats.jsx    # Glassmorphic metrics (stops, fare, time, CO2)
│   │   │   ├── RouteTimeline.jsx # Leg-by-leg itinerary with intermediate stops accordion
│   │   │   ├── Navbar.jsx        # Navigation with live status indicator
│   │   │   ├── Footer.jsx        # Project info & tech stack credits
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── metroData.js      # Network graph, coordinates & client algorithms
│   │   │   ├── routeService.js   # API client with auto offline fallback
│   │   │   └── api.js            # Axios client with JWT interceptors
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Modern landing page & corridor overviews
│   │   │   ├── RouteSearchPage.jsx# Split-view planner + interactive map
│   │   │   ├── FavoritesPage.jsx # Bookmarked commute pairs
│   │   │   ├── HistoryPage.jsx   # Search history & re-calculation
│   │   │   └── ...
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                      # FastAPI Backend
│   ├── app/
│   │   ├── algorithms/
│   │   │   └── bfs.py            # Graph algorithms (BFS & Dijkstra)
│   │   ├── routes/
│   │   │   ├── route_routes.py   # /api/routes/find & /api/routes/find-time
│   │   │   ├── station_routes.py # Station CRUD & statistics
│   │   │   ├── auth_routes.py    # JWT registration & login
│   │   │   ├── favorite_routes.py# Bookmark endpoints
│   │   │   └── history_routes.py # Search history endpoints
│   │   ├── database/db.py        # MongoDB connection
│   │   └── main.py               # FastAPI entry point
│   ├── seed_data.py              # 60 stations dataset
│   └── requirements.txt
│
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+
- **Python**: v3.10+
- **MongoDB**: (Optional — local instance or Atlas; the frontend includes a client-side graph engine that works out of the box if backend is offline)

---

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The application will be running at `http://localhost:5173`.

---

### 3. Backend Setup (Optional)
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --reload --port 8000
```
Interactive API documentation will be available at `http://localhost:8000/api/docs`.

---

## 📡 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/routes/find` | Find shortest route by station count (BFS) |
| `POST` | `/api/routes/find-time` | Find route by minimum travel time (Dijkstra) |
| `GET` | `/api/routes/stations/list` | List all stations grouped by line and interchanges |
| `POST` | `/api/auth/register` | Register new commuter account |
| `POST` | `/api/auth/login` | Commuter authentication & JWT issuance |
| `GET` | `/api/favorites/` | Retrieve user bookmarked routes |
| `POST` | `/api/favorites/` | Save route to favorites |
| `GET` | `/api/history/` | Retrieve past route search logs |

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
