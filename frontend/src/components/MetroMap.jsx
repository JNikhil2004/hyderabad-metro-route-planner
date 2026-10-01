import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  ZoomIn, ZoomOut, RotateCcw, Crosshair, MapPin, 
  Navigation, Info, Sparkles, Layers, CheckCircle2 
} from 'lucide-react';
import { 
  STATIONS_DATA, 
  LINE_CONFIG, 
  INTERCHANGE_STATIONS, 
  getStationDetails 
} from '../services/metroData';

const MetroMap = ({ 
  selectedSource, 
  selectedDestination, 
  routeResult, 
  onSelectSource, 
  onSelectDestination 
}) => {
  // SVG Canvas dimensions
  const WIDTH = 1200;
  const HEIGHT = 880;

  // Pan and Zoom state
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activePopup, setActivePopup] = useState(null);
  const [hoveredStation, setHoveredStation] = useState(null);
  const [showLegend, setShowLegend] = useState(true);

  const containerRef = useRef(null);

  // Map station name to data object for quick coordinate lookup
  const stationLookup = useMemo(() => {
    const map = new Map();
    STATIONS_DATA.forEach((s) => map.set(s.station_name, s));
    return map;
  }, []);

  // Separate stations by line for clean track path rendering
  const redStations = useMemo(() => STATIONS_DATA.filter((s) => s.line === 'Red'), []);
  const blueStations = useMemo(() => STATIONS_DATA.filter((s) => s.line === 'Blue'), []);
  const greenStations = useMemo(() => STATIONS_DATA.filter((s) => s.line === 'Green'), []);

  // Helper to build SVG path data string from station array
  const createLinePath = (stations) => {
    if (!stations.length) return '';
    return stations.reduce((acc, st, i) => {
      return i === 0 ? `M ${st.x} ${st.y}` : `${acc} L ${st.x} ${st.y}`;
    }, '');
  };

  const redPath = useMemo(() => createLinePath(redStations), [redStations]);
  const bluePath = useMemo(() => createLinePath(blueStations), [blueStations]);
  const greenPath = useMemo(() => createLinePath(greenStations), [greenStations]);

  // Set of stations on currently active route
  const routeSet = useMemo(() => {
    return new Set(routeResult?.route || []);
  }, [routeResult]);

  // Generate SVG path for the active calculated route
  const activeRoutePath = useMemo(() => {
    if (!routeResult || !routeResult.route || routeResult.route.length === 0) return '';
    return routeResult.route
      .map((stationName, i) => {
        const s = stationLookup.get(stationName);
        if (!s) return '';
        return i === 0 ? `M ${s.x} ${s.y}` : `L ${s.x} ${s.y}`;
      })
      .filter(Boolean)
      .join(' ');
  }, [routeResult, stationLookup]);

  // Auto-fit route when a new route is calculated
  useEffect(() => {
    if (routeResult && routeResult.route && routeResult.route.length > 0) {
      focusOnRoute();
    }
  }, [routeResult]);

  const focusOnRoute = () => {
    if (!routeResult || !routeResult.route || routeResult.route.length === 0) {
      resetView();
      return;
    }
    const coords = routeResult.route
      .map((name) => stationLookup.get(name))
      .filter(Boolean);

    if (coords.length === 0) return;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    coords.forEach(({ x, y }) => {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    });

    const padding = 120;
    const boxW = Math.max(maxX - minX + padding * 2, 300);
    const boxH = Math.max(maxY - minY + padding * 2, 240);

    const fitScale = Math.min(WIDTH / boxW, HEIGHT / boxH, 2.2);
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const targetPanX = WIDTH / 2 - centerX * fitScale;
    const targetPanY = HEIGHT / 2 - centerY * fitScale;

    setScale(Math.max(0.9, Math.min(fitScale, 1.8)));
    setPan({ x: targetPanX, y: targetPanY });
  };

  const handleZoom = (delta) => {
    setScale((prev) => Math.min(Math.max(prev + delta, 0.6), 2.8));
  };

  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    setActivePopup(null);
  };

  // Mouse pan handlers
  const handleMouseDown = (e) => {
    // Only drag on left click and outside interactive elements
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.1 : -0.1;
    setScale((prev) => Math.min(Math.max(prev + zoomFactor, 0.6), 2.8));
  };

  const handleStationClick = (station, e) => {
    e.stopPropagation();
    setActivePopup(station);
  };

  return (
    <div className="relative w-full h-[520px] md:h-[620px] lg:h-[700px] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 select-none">
      {/* Top Banner / Ticker */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/60 text-xs text-slate-200 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-slate-100">Live Network Schematic</span>
          <span className="text-slate-400">| 3 Lines • 60 Stations</span>
        </div>

        {routeResult && (
          <div className="flex items-center gap-2 bg-red-600/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs text-white font-medium shadow-lg animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Route Active: {routeResult.stations_count} stops ({routeResult.travel_time} mins)</span>
          </div>
        )}
      </div>

      {/* Floating Map Controls */}
      <div className="absolute bottom-5 right-5 z-20 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={() => handleZoom(0.2)}
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl border border-slate-700/80 shadow-lg transition backdrop-blur-md"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleZoom(-0.2)}
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl border border-slate-700/80 shadow-lg transition backdrop-blur-md"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        {routeResult && (
          <button
            onClick={focusOnRoute}
            className="p-2.5 bg-red-600/90 hover:bg-red-500 text-white rounded-xl border border-red-400/50 shadow-lg transition backdrop-blur-md"
            title="Focus On Active Route"
          >
            <Crosshair className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={resetView}
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl border border-slate-700/80 shadow-lg transition backdrop-blur-md"
          title="Reset Center"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Interactive Legend (Collapsible) */}
      <div className="absolute bottom-5 left-5 z-20 pointer-events-auto max-w-xs">
        {showLegend ? (
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 p-3.5 rounded-2xl shadow-xl text-xs text-slate-300">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
              <span className="font-semibold text-slate-100 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-red-400" />
                Network Corridors
              </span>
              <button 
                onClick={() => setShowLegend(false)}
                className="text-slate-400 hover:text-white text-[11px] underline"
              >
                hide
              </button>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#EF4444]" />
                <span className="font-medium text-slate-200">Red Line:</span>
                <span className="text-slate-400 text-[11px]">Miyapur ⇄ LB Nagar</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3B82F6]" />
                <span className="font-medium text-slate-200">Blue Line:</span>
                <span className="text-slate-400 text-[11px]">Raidurg ⇄ Nagole</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                <span className="font-medium text-slate-200">Green Line:</span>
                <span className="text-slate-400 text-[11px]">JBS ⇄ MGBS</span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-amber-400 bg-white" />
                <span className="text-slate-300 text-[11px]">Interchange Station (Double Ring)</span>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-slate-400 italic">
              💡 Drag to pan • Scroll to zoom • Click any station to select
            </p>
          </div>
        ) : (
          <button
            onClick={() => setShowLegend(true)}
            className="bg-slate-900/90 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-800 text-xs shadow-lg backdrop-blur-md flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            Show Legend
          </button>
        )}
      </div>

      {/* Main Interactive SVG Canvas */}
      <div
        ref={containerRef}
        className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={() => setActivePopup(null)}
      >
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Glow Filter for Active Route */}
            <filter id="routeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Pulsing Gradient for Path Animation */}
            <linearGradient id="activeRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>

            {/* Subtle Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect width={WIDTH} height={HEIGHT} fill="#090D16" />
          <rect width={WIDTH} height={HEIGHT} fill="url(#grid)" />

          {/* Transformable Canvas Group */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}>
            {/* --- BASE TRACKS --- */}
            {/* Dim inactive tracks when a specific route is displayed */}
            <g opacity={routeResult ? 0.35 : 0.95} transition="opacity 0.4s ease">
              {/* Red Line Track */}
              <path
                d={redPath}
                fill="none"
                stroke="#EF4444"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Blue Line Track */}
              <path
                d={bluePath}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Green Line Track */}
              <path
                d={greenPath}
                fill="none"
                stroke="#10B981"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* --- ACTIVE HIGHLIGHTED ROUTE --- */}
            {routeResult && activeRoutePath && (
              <g>
                {/* Glowing Outer Track */}
                <path
                  d={activeRoutePath}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.3"
                  filter="url(#routeGlow)"
                />
                {/* Solid Highlight Track */}
                <path
                  d={activeRoutePath}
                  fill="none"
                  stroke="url(#activeRouteGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Animated Moving Train Dash Pulse */}
                <path
                  d={activeRoutePath}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  strokeDasharray="14 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-[dash_1.5s_linear_infinite]"
                  opacity="0.9"
                />
              </g>
            )}

            {/* --- STATIONS NODES & LABELS --- */}
            {STATIONS_DATA.map((station) => {
              const isInterchange = INTERCHANGE_STATIONS.includes(station.station_name);
              const isSource = selectedSource === station.station_name;
              const isDest = selectedDestination === station.station_name;
              const isInRoute = routeSet.has(station.station_name);
              const isHovered = hoveredStation === station.station_name;

              // Node radius
              let r = isInterchange ? 6.5 : 4.5;
              if (isInRoute) r += 2;
              if (isSource || isDest) r += 3.5;

              // Station color
              const lineColor =
                station.line === 'Red'
                  ? '#EF4444'
                  : station.line === 'Blue'
                  ? '#3B82F6'
                  : '#10B981';

              // Dim non-route stations if route active
              const nodeOpacity = routeResult && !isInRoute ? 0.35 : 1;

              return (
                <g
                  key={station.station_name}
                  className="cursor-pointer transition-all duration-200"
                  opacity={nodeOpacity}
                  onClick={(e) => handleStationClick(station, e)}
                  onMouseEnter={() => setHoveredStation(station.station_name)}
                  onMouseLeave={() => setHoveredStation(null)}
                >
                  {/* Outer pulse ring for Source or Destination */}
                  {(isSource || isDest) && (
                    <circle
                      cx={station.x}
                      cy={station.y}
                      r={r + 8}
                      fill="none"
                      stroke={isSource ? '#10B981' : '#F59E0B'}
                      strokeWidth="2.5"
                      opacity="0.7"
                      className="animate-ping"
                    />
                  )}

                  {/* Interchange double ring */}
                  {isInterchange ? (
                    <g>
                      <circle
                        cx={station.x}
                        cy={station.y}
                        r={r + 4}
                        fill="#0F172A"
                        stroke="#F59E0B"
                        strokeWidth="3"
                      />
                      <circle
                        cx={station.x}
                        cy={station.y}
                        r={r}
                        fill="#FFFFFF"
                        stroke="#0F172A"
                        strokeWidth="2"
                      />
                    </g>
                  ) : (
                    <circle
                      cx={station.x}
                      cy={station.y}
                      r={r}
                      fill={isInRoute ? '#FFFFFF' : '#0F172A'}
                      stroke={isInRoute ? lineColor : lineColor}
                      strokeWidth={isInRoute ? '3.5' : '2.5'}
                    />
                  )}

                  {/* Station Label */}
                  <text
                    x={station.x}
                    y={
                      // Stagger labels nicely
                      station.line === 'Green'
                        ? station.y + 4
                        : station.y < 350
                        ? station.y - 12
                        : station.y + 17
                    }
                    dx={
                      station.line === 'Green'
                        ? 14
                        : station.line === 'Blue' && station.x > 800
                        ? 10
                        : 0
                    }
                    textAnchor={
                      station.line === 'Green'
                        ? 'start'
                        : station.line === 'Blue' && station.x > 800
                        ? 'start'
                        : 'middle'
                    }
                    fill={
                      isSource
                        ? '#34D399'
                        : isDest
                        ? '#FBBF24'
                        : isInRoute
                        ? '#FFFFFF'
                        : isHovered
                        ? '#E2E8F0'
                        : '#94A3B8'
                    }
                    fontSize={
                      isSource || isDest
                        ? '13'
                        : isInterchange
                        ? '11.5'
                        : isInRoute
                        ? '10.5'
                        : '9.5'
                    }
                    fontWeight={isInterchange || isSource || isDest || isInRoute ? '700' : '500'}
                    style={{
                      textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.8)',
                      letterSpacing: '-0.2px',
                    }}
                  >
                    {station.station_name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Interactive Station Popover (When a station is clicked) */}
      {activePopup && (
        <div className="absolute top-16 right-5 z-30 w-72 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-4 text-white animate-slide-in pointer-events-auto">
          <div className="flex items-start justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      activePopup.line === 'Red'
                        ? '#EF4444'
                        : activePopup.line === 'Blue'
                        ? '#3B82F6'
                        : '#10B981',
                  }}
                />
                <span>{activePopup.line} Line</span>
                <span>• Zone {activePopup.fare_zone}</span>
              </div>
              <h4 className="text-lg font-bold text-slate-100 mt-0.5">
                {activePopup.station_name}
              </h4>
            </div>
            <button
              onClick={() => setActivePopup(null)}
              className="text-slate-400 hover:text-white p-1 text-sm font-bold"
            >
              ✕
            </button>
          </div>

          {INTERCHANGE_STATIONS.includes(activePopup.station_name) && (
            <div className="mt-2.5 p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-center gap-2">
              <span className="font-semibold">★ Interchange Station:</span>
              <span>Transfer to other lines here</span>
            </div>
          )}

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => {
                onSelectSource(activePopup.station_name);
                setActivePopup(null);
              }}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
            >
              <MapPin className="w-3.5 h-3.5" />
              Set Origin
            </button>
            <button
              onClick={() => {
                onSelectDestination(activePopup.station_name);
                setActivePopup(null);
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
            >
              <Navigation className="w-3.5 h-3.5" />
              Set Destination
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetroMap;
