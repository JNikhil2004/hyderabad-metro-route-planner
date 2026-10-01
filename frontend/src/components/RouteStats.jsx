import React from 'react';
import { 
  Train, Repeat, Clock, IndianRupee, 
  Leaf, Compass, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { LINE_CONFIG } from '../services/metroData';

const RouteStats = ({ 
  stationsCount, 
  interchanges, 
  fare, 
  travelTime, 
  linesTraversed = [],
  interchangeStations = [] 
}) => {
  // Approximate CO2 emissions saved vs private vehicular travel (~90g CO2 per km)
  const estDistanceKm = Math.max(1, (stationsCount - 1) * 1.25);
  const carbonSavedKg = (estDistanceKm * 0.088).toFixed(2);

  const stats = [
    {
      label: 'Total Stations',
      value: `${stationsCount} Stops`,
      subtext: stationsCount > 1 ? `${stationsCount - 1} hops travelled` : 'Same station',
      icon: Train,
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      label: 'Interchanges',
      value: interchanges === 0 ? 'Direct Route' : `${interchanges} Transfer${interchanges > 1 ? 's' : ''}`,
      subtext: interchangeStations.length > 0 ? `at ${interchangeStations.join(', ')}` : 'No line change needed',
      icon: Repeat,
      iconColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
    {
      label: 'Ticket Fare',
      value: `₹${fare}`,
      subtext: 'QR Ticket / Smart Card',
      icon: IndianRupee,
      iconColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      label: 'Estimated Time',
      value: `${travelTime} Mins`,
      subtext: 'Includes transit buffer',
      icon: Clock,
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
  ];

  return (
    <div className="space-y-4">
      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bgColor} border ${stat.borderColor} rounded-2xl p-4 flex flex-col justify-between backdrop-blur-md transition-transform hover:-translate-y-0.5 duration-200 shadow-lg`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {stat.label}
              </span>
              <div className={`p-2 rounded-xl bg-slate-900/60 ${stat.iconColor}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl font-black text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                {stat.subtext}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Corridor Breakdown & Green Eco Badge Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl text-xs text-slate-300">
        {/* Lines Traversed Sequence */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-medium">Corridors:</span>
          {linesTraversed.map((line, idx) => {
            const config = LINE_CONFIG[line] || { color: '#94A3B8' };
            return (
              <React.Fragment key={line}>
                <span
                  className="px-2.5 py-1 rounded-lg font-semibold text-[11px] flex items-center gap-1.5 border"
                  style={{
                    backgroundColor: `${config.color}15`,
                    borderColor: `${config.color}40`,
                    color: config.color,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  {line} Line
                </span>
                {idx < linesTraversed.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Eco / Sustainability Metric */}
        <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 font-medium">
          <Leaf className="w-3.5 h-3.5" />
          <span>Saves approx. {carbonSavedKg} kg CO₂ vs car</span>
        </div>
      </div>
    </div>
  );
};

export default RouteStats;
