/**
 * Route Service with Automatic Offline Fallback
 * ==============================================
 * Seamlessly talks to FastAPI backend if available, and gracefully
 * falls back to high-performance client-side BFS/Dijkstra graph engine.
 * Ensures the app works 100% reliably in all environments (GitHub Pages,
 * local without MongoDB, or full stack).
 */
import api from './api';
import {
  ALL_STATION_NAMES,
  INTERCHANGE_STATIONS,
  STATIONS_BY_LINE,
  bfsShortestPath,
  dijkstraShortestTime,
} from './metroData';

const LOCAL_HISTORY_KEY = 'hm_search_history';

export const routeService = {
  /**
   * Fetch all stations from backend or fallback to local registry
   */
  async getStations() {
    try {
      const response = await api.get('/routes/stations/list');
      if (response.data && response.data.stations?.length > 0) {
        return {
          stations: response.data.stations,
          interchange_stations: response.data.interchange_stations || INTERCHANGE_STATIONS,
          lines: response.data.lines || STATIONS_BY_LINE,
          isOffline: false,
        };
      }
    } catch {
      // Backend unavailable - use local data
    }

    return {
      stations: ALL_STATION_NAMES,
      interchange_stations: INTERCHANGE_STATIONS,
      lines: STATIONS_BY_LINE,
      isOffline: true,
    };
  },

  /**
   * Find route between source and destination using specified algorithm
   * @param {string} source - Origin station
   * @param {string} destination - Target station
   * @param {'bfs' | 'dijkstra'} algorithm - Route optimization strategy
   */
  async findRoute(source, destination, algorithm = 'bfs') {
    const endpoint = algorithm === 'dijkstra' ? '/routes/find-time' : '/routes/find';

    try {
      const response = await api.post(endpoint, { source, destination });
      if (response.data && response.data.route) {
        this.saveLocalHistory(response.data);
        return { ...response.data, isClientCalculated: false };
      }
    } catch {
      // Backend unavailable or error -> calculate locally with exact same algorithm
    }

    const calculated =
      algorithm === 'dijkstra'
        ? dijkstraShortestTime(source, destination)
        : bfsShortestPath(source, destination);

    if (!calculated) {
      throw new Error(`No route found between "${source}" and "${destination}"`);
    }

    this.saveLocalHistory(calculated);
    return { ...calculated, isClientCalculated: true };
  },

  /**
   * Save route into local storage history for persistent guest/demo access
   */
  saveLocalHistory(routeData) {
    try {
      const raw = localStorage.getItem(LOCAL_HISTORY_KEY);
      const list = raw ? JSON.parse(raw) : [];
      const newEntry = {
        id: 'hist_' + Date.now(),
        source: routeData.source,
        destination: routeData.destination,
        route: routeData.route,
        stations_count: routeData.stations_count,
        interchanges: routeData.interchanges,
        fare: routeData.fare,
        travel_time: routeData.travel_time,
        searched_at: new Date().toISOString(),
      };
      // Keep only last 20
      const filtered = [newEntry, ...list.filter(
        (item) => !(item.source === newEntry.source && item.destination === newEntry.destination)
      )].slice(0, 20);
      localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  },

  getLocalHistory() {
    try {
      const raw = localStorage.getItem(LOCAL_HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  clearLocalHistory() {
    try {
      localStorage.removeItem(LOCAL_HISTORY_KEY);
    } catch (e) {
      console.warn(e);
    }
  },
};

export default routeService;
