"""
BFS Route Finding Algorithm
============================
Graph-based shortest path finding for Hyderabad Metro Network.
Uses Breadth First Search (BFS) for shortest station path.
Optional Dijkstra for shortest travel time.
"""
from collections import deque, defaultdict
from typing import List, Dict, Tuple, Optional, Set
from dataclasses import dataclass

@dataclass
class RouteResult:
    """Data class to hold route calculation results"""
    source: str
    destination: str
    route: List[str]
    stations_count: int
    interchanges: int
    interchange_stations: List[str]
    fare: float
    travel_time: int
    lines_traversed: List[str]

class MetroGraph:
    """
    Graph representation of Hyderabad Metro Network.
    Each station is a node, connections are edges.
    """

    # Line colors for visualization
    LINE_COLORS = {
        "Red": "#EF4444",
        "Blue": "#803BF6", 
        "Green": "#10B981"
    }

    # Interchange stations
    INTERCHANGE_STATIONS = {"Ameerpet", "Parade Ground", "MG Bus Station"}

    def __init__(self):
        self.adjacency_list: Dict[str, List[str]] = defaultdict(list)
        self.station_lines: Dict[str, str] = {}
        self.station_zones: Dict[str, int] = {}
        self.all_stations: Set[str] = set()

    def add_station(self, name: str, line: str, zone: int, connections: List[str]):
        """Add a station to the graph"""
        self.station_lines[name] = line
        self.station_zones[name] = zone
        self.all_stations.add(name)

        # Add bidirectional connections
        for conn in connections:
            if conn not in self.adjacency_list[name]:
                self.adjacency_list[name].append(conn)

    def build_from_stations(self, stations_data: List[dict]):
        """Build graph from station database records"""
        for station in stations_data:
            self.add_station(
                name=station["station_name"],
                line=station["line"],
                zone=station["fare_zone"],
                connections=station.get("connections", [])
            )

        # Ensure bidirectional edges
        for station, connections in list(self.adjacency_list.items()):
            for conn in connections:
                if station not in self.adjacency_list[conn]:
                    self.adjacency_list[conn].append(station)

    def bfs_shortest_path(self, source: str, destination: str) -> Optional[RouteResult]:
        """
        Find shortest path using Breadth First Search (BFS).
        BFS guarantees shortest path in unweighted graphs.

        Time Complexity: O(V + E)
        Space Complexity: O(V)
        """
        if source not in self.all_stations or destination not in self.all_stations:
            return None

        if source == destination:
            return RouteResult(
                source=source,
                destination=destination,
                route=[source],
                stations_count=1,
                interchanges=0,
                interchange_stations=[],
                fare=0.0,
                travel_time=2,
                lines_traversed=[self.station_lines.get(source, "Unknown")]
            )

        # BFS initialization
        queue = deque([(source, [source])])
        visited = {source}

        while queue:
            current, path = queue.popleft()

            for neighbor in self.adjacency_list.get(current, []):
                if neighbor not in visited:
                    new_path = path + [neighbor]

                    if neighbor == destination:
                        return self._build_route_result(source, destination, new_path)

                    visited.add(neighbor)
                    queue.append((neighbor, new_path))

        return None  # No path found

    def dijkstra_shortest_time(self, source: str, destination: str) -> Optional[RouteResult]:
        """
        Find shortest path by travel time using Dijkstra's Algorithm.
        Edge weights: travel time between stations.

        Time Complexity: O((V + E) log V)
        Space Complexity: O(V)
        """
        if source not in self.all_stations or destination not in self.all_stations:
            return None

        if source == destination:
            return RouteResult(
                source=source,
                destination=destination,
                route=[source],
                stations_count=1,
                interchanges=0,
                interchange_stations=[],
                fare=0.0,
                travel_time=2,
                lines_traversed=[self.station_lines.get(source, "Unknown")]
            )

        import heapq

        # Priority queue: (travel_time, station, path)
        pq = [(0, source, [source])]
        visited = set()

        while pq:
            time, current, path = heapq.heappop(pq)

            if current in visited:
                continue

            visited.add(current)

            if current == destination:
                return self._build_route_result(source, destination, path, time)

            for neighbor in self.adjacency_list.get(current, []):
                if neighbor not in visited:
                    # Calculate edge weight (travel time)
                    edge_time = self._calculate_edge_time(current, neighbor)
                    new_time = time + edge_time
                    new_path = path + [neighbor]
                    heapq.heappush(pq, (new_time, neighbor, new_path))

        return None

    def _calculate_edge_time(self, station1: str, station2: str) -> int:
        """
        Calculate travel time between two adjacent stations.
        Base time: 2 minutes per station
        Interchange penalty: +3 minutes
        """
        base_time = 2

        # Check if crossing lines (interchange)
        line1 = self.station_lines.get(station1)
        line2 = self.station_lines.get(station2)

        if line1 and line2 and line1 != line2:
            return base_time + 3  # Interchange penalty

        return base_time

    def _build_route_result(self, source: str, destination: str, 
                           path: List[str], total_time: int = None) -> RouteResult:
        """Build a RouteResult object from a path"""

        stations_count = len(path)

        # Calculate interchanges
        interchanges = 0
        interchange_stations = []
        lines_traversed = []
        current_line = None

        for i, station in enumerate(path):
            line = self.station_lines.get(station, "Unknown")

            if i == 0:
                current_line = line
                lines_traversed.append(line)
            elif line != current_line:
                interchanges += 1
                interchange_stations.append(station)
                current_line = line
                if line not in lines_traversed:
                    lines_traversed.append(line)

        # Calculate fare based on zones crossed
        fare = self._calculate_fare(path)

        # Calculate travel time
        if total_time is None:
            travel_time = self._calculate_travel_time(path)
        else:
            travel_time = total_time

        return RouteResult(
            source=source,
            destination=destination,
            route=path,
            stations_count=stations_count,
            interchanges=interchanges,
            interchange_stations=interchange_stations,
            fare=fare,
            travel_time=travel_time,
            lines_traversed=lines_traversed
        )

    def _calculate_fare(self, path: List[str]) -> float:
        """
        Calculate fare based on number of stations travelled.
        """

        stations = len(path) - 1  # Number of stations travelled

        if stations <= 2:
            return 10.0
        elif stations <= 4:
            return 15.0
        elif stations <= 6:
            return 20.0
        elif stations <= 9:
            return 25.0
        elif stations <= 12:
            return 30.0
        elif stations <= 15:
            return 35.0
        elif stations <= 18:
            return 40.0
        elif stations <= 21:
            return 45.0
        else:
            return 50.0

    def _calculate_travel_time(self, path: List[str]) -> int:
        """Calculate total travel time for a path"""
        if len(path) <= 1:
            return 2

        total_time = 0
        for i in range(len(path) - 1):
            total_time += self._calculate_edge_time(path[i], path[i + 1])

        return total_time

    def get_all_stations(self) -> List[str]:
        """Get list of all stations sorted alphabetically"""
        return sorted(list(self.all_stations))

    def get_stations_by_line(self, line: str) -> List[str]:
        """Get all stations on a specific line"""
        return sorted([s for s, l in self.station_lines.items() if l == line])

    def get_interchange_stations(self) -> List[str]:
        """Get all interchange stations"""
        return sorted(list(self.INTERCHANGE_STATIONS & self.all_stations))


# Singleton instance
metro_graph = MetroGraph()
