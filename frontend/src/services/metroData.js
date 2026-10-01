/**
 * Hyderabad Metro Data & Offline-Capable Routing Engine
 * =====================================================
 * Complete topological station data for Red, Blue, and Green lines.
 * Coordinates configured for high-aesthetic SVG schematic metro map.
 * Includes BFS (shortest hops) and Dijkstra (shortest time) algorithms
 * matching backend logic with 100% parity.
 */

export const LINE_CONFIG = {
  Red: {
    name: 'Red Line',
    corridor: 'Corridor 1 (Miyapur ⇄ LB Nagar)',
    color: '#EF4444',
    bgClass: 'bg-red-500',
    borderClass: 'border-red-500',
    textClass: 'text-red-500',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
    gradient: 'from-red-500 to-rose-600',
    stationsCount: 27,
    route: 'Miyapur ⇄ LB Nagar',
  },
  Blue: {
    name: 'Blue Line',
    corridor: 'Corridor 3 (Raidurg ⇄ Nagole)',
    color: '#2563EB',
    bgClass: 'bg-blue-600',
    borderClass: 'border-blue-600',
    textClass: 'text-blue-600',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
    gradient: 'from-blue-600 to-indigo-600',
    stationsCount: 23,
    route: 'Raidurg ⇄ Nagole',
  },
  Green: {
    name: 'Green Line',
    corridor: 'Corridor 2 (JBS Parade Ground ⇄ MGBS)',
    color: '#059669',
    bgClass: 'bg-emerald-600',
    borderClass: 'border-emerald-600',
    textClass: 'text-emerald-600',
    badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    gradient: 'from-emerald-600 to-teal-600',
    stationsCount: 10,
    route: 'JBS Parade Ground ⇄ MG Bus Station',
  },
};

export const INTERCHANGE_STATIONS = [
  'Ameerpet',
  'Parade Ground',
  'MG Bus Station',
];

export const POPULAR_STATIONS = [
  { name: 'HITEC City', line: 'Blue', tag: 'Tech Hub' },
  { name: 'Raidurg', line: 'Blue', tag: 'Financial Dist' },
  { name: 'Ameerpet', line: 'Red', tag: 'Major Interchange' },
  { name: 'Secunderabad East', line: 'Blue', tag: 'Railway Hub' },
  { name: 'MG Bus Station', line: 'Red', tag: 'Interchange / CBS' },
  { name: 'Miyapur', line: 'Red', tag: 'North Terminal' },
  { name: 'LB Nagar', line: 'Red', tag: 'South Terminal' },
  { name: 'Nagole', line: 'Blue', tag: 'East Terminal' },
];

/**
 * 60 Hyderabad Metro Stations with schematic coordinates (1200 x 860 viewport)
 */
export const STATIONS_DATA = [
  // --- RED LINE (27 Stations: Miyapur -> LB Nagar) ---
  { station_name: 'Miyapur', line: 'Red', fare_zone: 1, x: 90, y: 70, connections: ['JNTU College'] },
  { station_name: 'JNTU College', line: 'Red', fare_zone: 1, x: 125, y: 105, connections: ['Miyapur', 'KPHB Colony'] },
  { station_name: 'KPHB Colony', line: 'Red', fare_zone: 1, x: 160, y: 140, connections: ['JNTU College', 'Kukatpally'] },
  { station_name: 'Kukatpally', line: 'Red', fare_zone: 1, x: 195, y: 175, connections: ['KPHB Colony', 'Balanagar'] },
  { station_name: 'Balanagar', line: 'Red', fare_zone: 2, x: 230, y: 210, connections: ['Kukatpally', 'Moosapet'] },
  { station_name: 'Moosapet', line: 'Red', fare_zone: 2, x: 265, y: 245, connections: ['Balanagar', 'Bharat Nagar'] },
  { station_name: 'Bharat Nagar', line: 'Red', fare_zone: 2, x: 300, y: 280, connections: ['Moosapet', 'Erragadda'] },
  { station_name: 'Erragadda', line: 'Red', fare_zone: 2, x: 335, y: 315, connections: ['Bharat Nagar', 'ESI Hospital'] },
  { station_name: 'ESI Hospital', line: 'Red', fare_zone: 2, x: 370, y: 350, connections: ['Erragadda', 'SR Nagar'] },
  { station_name: 'SR Nagar', line: 'Red', fare_zone: 2, x: 410, y: 390, connections: ['ESI Hospital', 'Ameerpet'] },
  // Ameerpet Interchange
  { station_name: 'Ameerpet', line: 'Red', fare_zone: 2, x: 470, y: 440, connections: ['SR Nagar', 'Punjagutta', 'Madhura Nagar', 'Begumpet'], isInterchange: true },
  { station_name: 'Punjagutta', line: 'Red', fare_zone: 3, x: 495, y: 485, connections: ['Ameerpet', 'Irrum Manzil'] },
  { station_name: 'Irrum Manzil', line: 'Red', fare_zone: 3, x: 520, y: 525, connections: ['Punjagutta', 'Khairatabad'] },
  { station_name: 'Khairatabad', line: 'Red', fare_zone: 3, x: 545, y: 565, connections: ['Irrum Manzil', 'Lakdi-ka-pul'] },
  { station_name: 'Lakdi-ka-pul', line: 'Red', fare_zone: 3, x: 570, y: 605, connections: ['Khairatabad', 'Assembly'] },
  { station_name: 'Assembly', line: 'Red', fare_zone: 3, x: 595, y: 640, connections: ['Lakdi-ka-pul', 'Nampally'] },
  { station_name: 'Nampally', line: 'Red', fare_zone: 3, x: 620, y: 675, connections: ['Assembly', 'Gandhi Bhavan'] },
  { station_name: 'Gandhi Bhavan', line: 'Red', fare_zone: 3, x: 645, y: 710, connections: ['Nampally', 'Osmania Medical College'] },
  { station_name: 'Osmania Medical College', line: 'Red', fare_zone: 3, x: 675, y: 735, connections: ['Gandhi Bhavan', 'MG Bus Station'] },
  // MG Bus Station Interchange
  { station_name: 'MG Bus Station', line: 'Red', fare_zone: 3, x: 715, y: 745, connections: ['Osmania Medical College', 'Malakpet', 'Sultan Bazaar'], isInterchange: true },
  { station_name: 'Malakpet', line: 'Red', fare_zone: 4, x: 770, y: 755, connections: ['MG Bus Station', 'New Market'] },
  { station_name: 'New Market', line: 'Red', fare_zone: 4, x: 820, y: 765, connections: ['Malakpet', 'Musarambagh'] },
  { station_name: 'Musarambagh', line: 'Red', fare_zone: 4, x: 870, y: 775, connections: ['New Market', 'Dilsukhnagar'] },
  { station_name: 'Dilsukhnagar', line: 'Red', fare_zone: 4, x: 920, y: 785, connections: ['Musarambagh', 'Chaitanyapuri'] },
  { station_name: 'Chaitanyapuri', line: 'Red', fare_zone: 4, x: 970, y: 795, connections: ['Dilsukhnagar', 'Victoria Memorial'] },
  { station_name: 'Victoria Memorial', line: 'Red', fare_zone: 4, x: 1020, y: 805, connections: ['Chaitanyapuri', 'LB Nagar'] },
  { station_name: 'LB Nagar', line: 'Red', fare_zone: 5, x: 1070, y: 815, connections: ['Victoria Memorial'] },

  // --- BLUE LINE (23 Stations: Raidurg -> Nagole) ---
  { station_name: 'Raidurg', line: 'Blue', fare_zone: 1, x: 70, y: 490, connections: ['HITEC City'] },
  { station_name: 'HITEC City', line: 'Blue', fare_zone: 1, x: 115, y: 480, connections: ['Raidurg', 'Durgam Cheruvu'] },
  { station_name: 'Durgam Cheruvu', line: 'Blue', fare_zone: 1, x: 160, y: 470, connections: ['HITEC City', 'Madhapur'] },
  { station_name: 'Madhapur', line: 'Blue', fare_zone: 2, x: 205, y: 465, connections: ['Durgam Cheruvu', 'Peddamma Gudi'] },
  { station_name: 'Peddamma Gudi', line: 'Blue', fare_zone: 2, x: 250, y: 460, connections: ['Madhapur', 'Jubilee Hills Road No. 5'] },
  { station_name: 'Jubilee Hills Road No. 5', line: 'Blue', fare_zone: 2, x: 295, y: 455, connections: ['Peddamma Gudi', 'Jubilee Hills Check Post'] },
  { station_name: 'Jubilee Hills Check Post', line: 'Blue', fare_zone: 2, x: 340, y: 450, connections: ['Jubilee Hills Road No. 5', 'Yousufguda'] },
  { station_name: 'Yousufguda', line: 'Blue', fare_zone: 2, x: 385, y: 445, connections: ['Jubilee Hills Check Post', 'Madhura Nagar'] },
  { station_name: 'Madhura Nagar', line: 'Blue', fare_zone: 2, x: 425, y: 442, connections: ['Yousufguda', 'Ameerpet'] },
  // Ameerpet is shared at (470, 440)
  { station_name: 'Begumpet', line: 'Blue', fare_zone: 3, x: 525, y: 410, connections: ['Ameerpet', 'Prakash Nagar'] },
  { station_name: 'Prakash Nagar', line: 'Blue', fare_zone: 3, x: 575, y: 380, connections: ['Begumpet', 'Rasoolpura'] },
  { station_name: 'Rasoolpura', line: 'Blue', fare_zone: 3, x: 625, y: 350, connections: ['Prakash Nagar', 'Paradise'] },
  { station_name: 'Paradise', line: 'Blue', fare_zone: 3, x: 675, y: 320, connections: ['Rasoolpura', 'Parade Ground'] },
  // Parade Ground Interchange
  { station_name: 'Parade Ground', line: 'Blue', fare_zone: 3, x: 740, y: 280, connections: ['Paradise', 'Secunderabad East', 'JBS Parade Ground', 'Secunderabad West'], isInterchange: true },
  { station_name: 'Secunderabad East', line: 'Blue', fare_zone: 4, x: 795, y: 290, connections: ['Parade Ground', 'Mettuguda'] },
  { station_name: 'Mettuguda', line: 'Blue', fare_zone: 4, x: 845, y: 310, connections: ['Secunderabad East', 'Tarnaka'] },
  { station_name: 'Tarnaka', line: 'Blue', fare_zone: 4, x: 895, y: 335, connections: ['Mettuguda', 'Habsiguda'] },
  { station_name: 'Habsiguda', line: 'Blue', fare_zone: 5, x: 945, y: 365, connections: ['Tarnaka', 'NGRI'] },
  { station_name: 'NGRI', line: 'Blue', fare_zone: 5, x: 990, y: 395, connections: ['Habsiguda', 'Stadium'] },
  { station_name: 'Stadium', line: 'Blue', fare_zone: 5, x: 1030, y: 425, connections: ['NGRI', 'Uppal'] },
  { station_name: 'Uppal', line: 'Blue', fare_zone: 5, x: 1070, y: 455, connections: ['Stadium', 'Nagole'] },
  { station_name: 'Nagole', line: 'Blue', fare_zone: 5, x: 1110, y: 485, connections: ['Uppal'] },

  // --- GREEN LINE (10 Stations: JBS Parade Ground -> MGBS) ---
  { station_name: 'JBS Parade Ground', line: 'Green', fare_zone: 4, x: 740, y: 215, connections: ['Parade Ground', 'Secunderabad West'] },
  // Parade Ground is shared at (740, 280)
  { station_name: 'Secunderabad West', line: 'Green', fare_zone: 3, x: 740, y: 345, connections: ['Parade Ground', 'Gandhi Hospital'] },
  { station_name: 'Gandhi Hospital', line: 'Green', fare_zone: 3, x: 740, y: 405, connections: ['Secunderabad West', 'Musheerabad'] },
  { station_name: 'Musheerabad', line: 'Green', fare_zone: 3, x: 740, y: 465, connections: ['Gandhi Hospital', 'RTC Cross Roads'] },
  { station_name: 'RTC Cross Roads', line: 'Green', fare_zone: 3, x: 740, y: 525, connections: ['Musheerabad', 'Chikkadpally'] },
  { station_name: 'Chikkadpally', line: 'Green', fare_zone: 3, x: 740, y: 585, connections: ['RTC Cross Roads', 'Narayanguda'] },
  { station_name: 'Narayanguda', line: 'Green', fare_zone: 3, x: 740, y: 645, connections: ['Chikkadpally', 'Sultan Bazaar'] },
  { station_name: 'Sultan Bazaar', line: 'Green', fare_zone: 3, x: 730, y: 695, connections: ['Narayanguda', 'MG Bus Station'] },
  // MG Bus Station is shared at (715, 745)
];

// Build adjacency graph and fast lookup maps
const stationMap = new Map();
const adjacencyList = new Map();
const stationLines = new Map();

STATIONS_DATA.forEach((s) => {
  stationMap.set(s.station_name, s);
  stationLines.set(s.station_name, s.line);
  if (!adjacencyList.has(s.station_name)) {
    adjacencyList.set(s.station_name, []);
  }
  s.connections.forEach((conn) => {
    if (!adjacencyList.has(conn)) adjacencyList.set(conn, []);
    if (!adjacencyList.get(s.station_name).includes(conn)) {
      adjacencyList.get(s.station_name).push(conn);
    }
    if (!adjacencyList.get(conn).includes(s.station_name)) {
      adjacencyList.get(conn).push(s.station_name);
    }
  });
});

export const ALL_STATION_NAMES = Array.from(stationMap.keys()).sort();

export const STATIONS_BY_LINE = {
  Red: STATIONS_DATA.filter((s) => s.line === 'Red').map((s) => s.station_name),
  Blue: STATIONS_DATA.filter((s) => s.line === 'Blue').map((s) => s.station_name),
  Green: STATIONS_DATA.filter((s) => s.line === 'Green').map((s) => s.station_name),
};

/**
 * Calculates fare according to Hyderabad Metro fare slab
 */
export function calculateFare(stationCount) {
  const travelled = Math.max(0, stationCount - 1);
  if (travelled === 0) return 0;
  if (travelled <= 2) return 10;
  if (travelled <= 4) return 15;
  if (travelled <= 6) return 20;
  if (travelled <= 9) return 25;
  if (travelled <= 12) return 30;
  if (travelled <= 15) return 35;
  if (travelled <= 18) return 40;
  if (travelled <= 21) return 45;
  return 50;
}

/**
 * Calculates edge travel time with interchange penalty
 */
export function calculateEdgeTime(st1, st2) {
  const line1 = stationLines.get(st1);
  const line2 = stationLines.get(st2);
  let baseTime = 2; // ~2 min per station hop
  if (line1 && line2 && line1 !== line2) {
    baseTime += 3; // +3 min transfer penalty
  }
  return baseTime;
}

/**
 * Builds standard route result object
 */
export function buildRouteResult(source, destination, path, totalTime = null) {
  const stationsCount = path.length;
  let interchanges = 0;
  const interchangeStations = [];
  const linesTraversed = [];
  let currentLine = null;

  path.forEach((station, i) => {
    const line = stationLines.get(station) || 'Unknown';
    if (i === 0) {
      currentLine = line;
      linesTraversed.push(line);
    } else if (line !== currentLine) {
      interchanges += 1;
      if (!interchangeStations.includes(station)) {
        interchangeStations.push(station);
      }
      currentLine = line;
      if (!linesTraversed.includes(line)) {
        linesTraversed.push(line);
      }
    }
  });

  const fare = calculateFare(stationsCount);

  let travelTime = totalTime;
  if (travelTime === null) {
    if (path.length <= 1) {
      travelTime = 2;
    } else {
      travelTime = 0;
      for (let i = 0; i < path.length - 1; i++) {
        travelTime += calculateEdgeTime(path[i], path[i + 1]);
      }
    }
  }

  // Generate detailed leg instructions
  const legs = [];
  let currentLeg = {
    line: linesTraversed[0] || 'Red',
    from: path[0],
    to: path[0],
    stops: [path[0]],
  };

  for (let i = 1; i < path.length; i++) {
    const station = path[i];
    const line = stationLines.get(station);
    if (line !== currentLeg.line && INTERCHANGE_STATIONS.includes(station)) {
      currentLeg.to = station;
      currentLeg.stops.push(station);
      legs.push(currentLeg);
      currentLeg = {
        line: line,
        from: station,
        to: station,
        stops: [station],
        transferAt: station,
      };
    } else {
      currentLeg.to = station;
      currentLeg.stops.push(station);
    }
  }
  if (!legs.includes(currentLeg)) {
    legs.push(currentLeg);
  }

  return {
    source,
    destination,
    route: path,
    stations_count: stationsCount,
    interchanges,
    interchange_stations: interchangeStations,
    fare,
    travel_time: travelTime,
    lines_traversed: linesTraversed,
    legs,
  };
}

/**
 * BFS Shortest Path (minimum stations)
 */
export function bfsShortestPath(source, destination) {
  if (!stationMap.has(source) || !stationMap.has(destination)) return null;

  if (source === destination) {
    return buildRouteResult(source, destination, [source], 0);
  }

  const queue = [[source, [source]]];
  const visited = new Set([source]);

  while (queue.length > 0) {
    const [current, path] = queue.shift();

    const neighbors = adjacencyList.get(current) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        const newPath = [...path, neighbor];
        if (neighbor === destination) {
          return buildRouteResult(source, destination, newPath);
        }
        visited.add(neighbor);
        queue.push([neighbor, newPath]);
      }
    }
  }

  return null;
}

/**
 * Dijkstra Shortest Path (minimum travel time)
 */
export function dijkstraShortestTime(source, destination) {
  if (!stationMap.has(source) || !stationMap.has(destination)) return null;

  if (source === destination) {
    return buildRouteResult(source, destination, [source], 0);
  }

  // Priority queue simulated with array
  const pq = [{ time: 0, station: source, path: [source] }];
  const visited = new Set();

  while (pq.length > 0) {
    pq.sort((a, b) => a.time - b.time);
    const { time, station: current, path } = pq.shift();

    if (visited.has(current)) continue;
    visited.add(current);

    if (current === destination) {
      return buildRouteResult(source, destination, path, time);
    }

    const neighbors = adjacencyList.get(current) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        const edgeTime = calculateEdgeTime(current, neighbor);
        pq.push({
          time: time + edgeTime,
          station: neighbor,
          path: [...path, neighbor],
        });
      }
    }
  }

  return null;
}

export function getStationDetails(name) {
  return stationMap.get(name) || null;
}
