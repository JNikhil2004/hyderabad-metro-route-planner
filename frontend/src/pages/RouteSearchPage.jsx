import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Sparkles, Train, MapPin, Share2, Heart, 
  RotateCw, AlertTriangle, ShieldCheck, Zap 
} from 'lucide-react';
import RouteSearchForm from '../components/RouteSearchForm';
import RouteTimeline from '../components/RouteTimeline';
import RouteStats from '../components/RouteStats';
import MetroMap from '../components/MetroMap';
import FavoriteButton from '../components/FavoriteButton';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import routeService from '../services/routeService';

const RouteSearchPage = () => {
  const location = useLocation();

  const [source, setSource] = useState(location.state?.source || '');
  const [destination, setDestination] = useState(location.state?.destination || '');
  const [algorithm, setAlgorithm] = useState('bfs');
  const [routeResult, setRouteResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [viewMode, setViewMode] = useState('both'); // 'both' | 'map' | 'details'

  // Pre-trigger search if navigated from favorites or history with state
  useEffect(() => {
    if (location.state?.source && location.state?.destination) {
      setSource(location.state.source);
      setDestination(location.state.destination);
      handleSearch(location.state.source, location.state.destination, 'bfs');
    }
  }, [location.state]);

  const handleSearch = async (src, dst, algo = algorithm) => {
    if (!src || !dst) return;
    setLoading(true);

    try {
      const data = await routeService.findRoute(src, dst, algo);
      setRouteResult(data);
      if (data.isClientCalculated) {
        setToast({
          message: 'Route calculated using high-speed graph engine.',
          type: 'info',
        });
      }
    } catch (err) {
      console.error(err);
      setToast({
        message: err.message || 'Could not find a valid metro route between selected stations.',
        type: 'error',
      });
      setRouteResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReverseRoute = () => {
    if (!source || !destination) return;
    const newSource = destination;
    const newDest = source;
    setSource(newSource);
    setDestination(newDest);
    handleSearch(newSource, newDest, algorithm);
  };

  const handleReset = () => {
    setSource('');
    setDestination('');
    setRouteResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-500/20 text-red-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-3">
            <Train className="w-3.5 h-3.5" />
            Hyderabad Metro Route Navigator
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Plan the <span className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">Optimal Route</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            Calculate shortest paths, interchange transfers, travel duration, and fares across Red, Blue, and Green lines.
          </p>
        </div>

        {/* View Mode Toggle for Mobile / Tablet */}
        <div className="flex justify-center lg:hidden">
          <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setViewMode('both')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                viewMode === 'both' ? 'bg-red-600 text-white shadow' : 'text-slate-400'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                viewMode === 'map' ? 'bg-red-600 text-white shadow' : 'text-slate-400'
              }`}
            >
              Interactive Map
            </button>
            <button
              onClick={() => setViewMode('details')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                viewMode === 'details' ? 'bg-red-600 text-white shadow' : 'text-slate-400'
              }`}
            >
              Search & Itinerary
            </button>
          </div>
        </div>

        {/* Main Grid: Responsive 2-column layout on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Search Form + Stats + Timeline */}
          <div
            className={`space-y-6 ${
              viewMode === 'map' ? 'hidden lg:block lg:col-span-5' : 'lg:col-span-5'
            }`}
          >
            {/* Route Search Form */}
            <RouteSearchForm
              source={source}
              destination={destination}
              onSourceChange={setSource}
              onDestinationChange={setDestination}
              onSearch={handleSearch}
              loading={loading}
              algorithm={algorithm}
              onAlgorithmChange={(newAlgo) => {
                setAlgorithm(newAlgo);
                if (source && destination) {
                  handleSearch(source, destination, newAlgo);
                }
              }}
              onReset={handleReset}
            />

            {/* Loading Indicator */}
            {loading && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8">
                <LoadingSpinner text="Analyzing metro network graph..." />
              </div>
            )}

            {/* Route Result Summary & Details */}
            {routeResult && !loading && (
              <div className="space-y-6 animate-slide-in">
                {/* Result Title Bar */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Calculated Journey
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 truncate mt-0.5">
                      <span>{routeResult.source}</span>
                      <span className="text-red-500 font-normal">➔</span>
                      <span>{routeResult.destination}</span>
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <FavoriteButton
                      source={routeResult.source}
                      destination={routeResult.destination}
                    />
                  </div>
                </div>

                {/* Key Metrics Stats */}
                <RouteStats
                  stationsCount={routeResult.stations_count}
                  interchanges={routeResult.interchanges}
                  fare={routeResult.fare}
                  travelTime={routeResult.travel_time}
                  linesTraversed={routeResult.lines_traversed}
                  interchangeStations={routeResult.interchange_stations}
                />

                {/* Step-by-Step Itinerary Timeline */}
                <RouteTimeline
                  route={routeResult.route}
                  interchangeStations={routeResult.interchange_stations}
                  linesTraversed={routeResult.lines_traversed}
                  onReverseRoute={handleReverseRoute}
                />
              </div>
            )}
          </div>

          {/* Right Column: Interactive Metro Map */}
          <div
            className={`space-y-4 ${
              viewMode === 'details' ? 'hidden lg:block lg:col-span-7' : 'lg:col-span-7'
            } lg:sticky lg:top-24`}
          >
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-1.5 shadow-2xl backdrop-blur-xl">
              <MetroMap
                selectedSource={source}
                selectedDestination={destination}
                routeResult={routeResult}
                onSelectSource={(name) => {
                  setSource(name);
                  if (destination && destination !== name) {
                    handleSearch(name, destination, algorithm);
                  }
                }}
                onSelectDestination={(name) => {
                  setDestination(name);
                  if (source && source !== name) {
                    handleSearch(source, name, algorithm);
                  }
                }}
              />
            </div>

            {/* Quick Map Tips Badge */}
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>
                  <strong>Interactive Vector Map:</strong> Click any station circle to set Origin/Destination.
                </span>
              </div>
              <span className="text-slate-400 hidden sm:inline">60 Stations • 3 Lines</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteSearchPage;
