import React, { useState } from 'react';
import { 
  Train, ArrowRight, Repeat, Clock, MapPin, 
  ChevronDown, ChevronUp, Copy, Check, Share2, 
  RotateCw, Navigation, ShieldCheck, Footprints 
} from 'lucide-react';
import { 
  INTERCHANGE_STATIONS, 
  LINE_CONFIG, 
  STATIONS_DATA, 
  getStationDetails 
} from '../services/metroData';

const RouteTimeline = ({ 
  route = [], 
  interchangeStations = [], 
  linesTraversed = [],
  onReverseRoute 
}) => {
  const [expandedLegs, setExpandedLegs] = useState({});
  const [copied, setCopied] = useState(false);

  if (!route || route.length === 0) return null;

  // Station lookup
  const getStation = (name) => STATIONS_DATA.find((s) => s.station_name === name);

  // Group stations into distinct transit legs based on line transfers
  const legs = [];
  let currentLeg = {
    line: getStation(route[0])?.line || 'Red',
    from: route[0],
    to: route[0],
    stations: [route[0]],
  };

  for (let i = 1; i < route.length; i++) {
    const station = route[i];
    const prevStation = route[i - 1];
    const stationObj = getStation(station);
    const line = stationObj?.line || currentLeg.line;

    // Detect transfer at interchange stations
    if (line !== currentLeg.line && INTERCHANGE_STATIONS.includes(prevStation)) {
      currentLeg.to = prevStation;
      legs.push(currentLeg);

      currentLeg = {
        line: line,
        from: prevStation,
        to: station,
        stations: [prevStation, station],
        transferStation: prevStation,
      };
    } else {
      currentLeg.to = station;
      currentLeg.stations.push(station);
    }
  }
  legs.push(currentLeg);

  const toggleExpand = (legIndex) => {
    setExpandedLegs((prev) => ({
      ...prev,
      [legIndex]: !prev[legIndex],
    }));
  };

  const handleCopySummary = () => {
    const summary = [
      `🚇 Hyderabad Metro Route: ${route[0]} ➔ ${route[route.length - 1]}`,
      `📍 Total Stations: ${route.length}`,
      `🔄 Interchanges: ${interchangeStations.length > 0 ? interchangeStations.join(', ') : 'None (Direct)'}`,
      `🛤️ Corridors: ${linesTraversed.join(', ')}`,
      `\nStep-by-step route:`,
      ...route.map((s, idx) => `${idx + 1}. ${s}${interchangeStations.includes(s) ? ' [Interchange]' : ''}`),
      `\nPlanned via Hyderabad Metro Route Planner`,
    ].join('\n');

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 md:p-7 shadow-2xl">
      {/* Title & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Train className="w-5 h-5 text-red-500" />
            Step-by-Step Itinerary
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Clear boarding, transfer instructions, and platform guidance
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onReverseRoute && (
            <button
              onClick={onReverseRoute}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
              title="Reverse origin and destination"
            >
              <RotateCw className="w-3.5 h-3.5 text-blue-400" />
              Reverse
            </button>
          )}

          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
            title="Copy route text summary"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Share Summary</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Leg-by-Leg Structured Journey */}
      <div className="space-y-6">
        {legs.map((leg, legIdx) => {
          const config = LINE_CONFIG[leg.line] || {
            name: `${leg.line} Line`,
            color: '#EF4444',
          };
          const isExpanded = !!expandedLegs[legIdx];
          const intermediateStations = leg.stations.slice(1, -1);

          return (
            <div
              key={legIdx}
              className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 md:p-5 relative overflow-hidden"
            >
              {/* Color Stripe on left edge */}
              <div
                className="absolute top-0 bottom-0 left-0 w-1.5"
                style={{ backgroundColor: config.color }}
              />

              {/* Leg Header */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border"
                    style={{
                      backgroundColor: `${config.color}20`,
                      borderColor: `${config.color}40`,
                      color: config.color,
                    }}
                  >
                    <Train className="w-3.5 h-3.5" />
                    Leg {legIdx + 1}: {config.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    {leg.stations.length - 1} stops • ~{(leg.stations.length - 1) * 2} mins
                  </span>
                </div>
              </div>

              {/* Boarding Station */}
              <div className="flex items-start gap-3 pl-1">
                <div className="flex flex-col items-center">
                  <div
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center mt-1"
                    style={{
                      borderColor: config.color,
                      backgroundColor: legIdx === 0 ? config.color : '#FFFFFF',
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                  </div>
                  <div
                    className="w-0.5 h-8 my-1"
                    style={{ backgroundColor: `${config.color}50` }}
                  />
                </div>

                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">
                      {leg.from}
                    </span>
                    {legIdx === 0 && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                        Boarding Station
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Board {config.name} train towards{' '}
                    <span className="text-slate-300 font-medium">{leg.to}</span> • Trains arrive every 4-6 mins
                  </p>
                </div>
              </div>

              {/* Intermediate Stations Toggle */}
              {intermediateStations.length > 0 && (
                <div className="pl-1 mb-2">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-0.5 h-full"
                        style={{ backgroundColor: `${config.color}50` }}
                      />
                    </div>

                    <div className="flex-1 py-1">
                      <button
                        onClick={() => toggleExpand(legIdx)}
                        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition py-1 px-2.5 rounded-lg bg-slate-900 border border-slate-800"
                      >
                        <span>
                          {intermediateStations.length} Intermediate Stop
                          {intermediateStations.length > 1 ? 's' : ''}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>

                      {/* Expanded Intermediate Stop List */}
                      {isExpanded && (
                        <div className="mt-3 space-y-2 pl-3 border-l-2 border-slate-800 ml-2 animate-slide-in">
                          {intermediateStations.map((stName, idx) => {
                            const details = getStation(stName);
                            return (
                              <div
                                key={stName}
                                className="flex items-center justify-between text-xs text-slate-300 py-0.5"
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: config.color }}
                                  />
                                  <span>{stName}</span>
                                </div>
                                <span className="text-[11px] text-slate-500">
                                  Zone {details?.fare_zone || 1}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Alighting Station */}
              <div className="flex items-start gap-3 pl-1">
                <div className="flex flex-col items-center">
                  <div
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center mt-1"
                    style={{
                      borderColor: config.color,
                      backgroundColor: legIdx === legs.length - 1 ? '#3B82F6' : '#F59E0B',
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">
                      {leg.to}
                    </span>
                    {legIdx === legs.length - 1 ? (
                      <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-semibold">
                        Final Destination
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                        <Repeat className="w-3 h-3" />
                        Transfer Hub
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {legIdx === legs.length - 1
                      ? 'Arrive at destination. Exit station through automated gates.'
                      : `De-board train here to transfer to ${legs[legIdx + 1]?.line} Line.`}
                  </p>
                </div>
              </div>

              {/* Interchange Transfer Notice between legs */}
              {legIdx < legs.length - 1 && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-200">
                  <Footprints className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-amber-300">
                      Transfer Alert at {leg.to}:
                    </span>{' '}
                    Switch from {config.name} to {legs[legIdx + 1]?.line} Line. Follow interchange signage to upper/lower level (~3-4 min walking time).
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RouteTimeline;
