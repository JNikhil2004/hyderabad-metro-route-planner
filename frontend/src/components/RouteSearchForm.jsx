import React, { useState } from 'react';
import { 
  Search, ArrowRightLeft, Sparkles, Clock, 
  MapPin, AlertCircle, RotateCcw, Zap, Compass 
} from 'lucide-react';
import StationSelector from './StationSelector';
import { POPULAR_STATIONS } from '../services/metroData';

const RouteSearchForm = ({ 
  source, 
  destination, 
  onSourceChange, 
  onDestinationChange, 
  onSearch, 
  loading,
  algorithm,
  onAlgorithmChange,
  onReset
}) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);

  const handleSwap = () => {
    if (!source && !destination) return;
    setIsSwapping(true);
    const tempSource = source;
    onSourceChange(destination);
    onDestinationChange(tempSource);
    setTimeout(() => setIsSwapping(false), 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!source || !destination) {
      setErrorMsg('Please select both Origin and Destination stations.');
      return;
    }

    if (source === destination) {
      setErrorMsg('Origin and Destination stations cannot be the same.');
      return;
    }

    onSearch(source, destination, algorithm);
  };

  const handleQuickStationClick = (stName) => {
    if (!source) {
      onSourceChange(stName);
    } else if (!destination && source !== stName) {
      onDestinationChange(stName);
    } else if (source && destination) {
      onDestinationChange(stName);
    }
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 md:p-7 shadow-2xl">
      {/* Header & Algorithm Strategy Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-red-500" />
            Plan Your Journey
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time graph-based navigation across all 60 Hyderabad metro stations
          </p>
        </div>

        {/* Algorithm Strategy Tabs */}
        <div className="inline-flex p-1 bg-slate-950/80 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onAlgorithmChange('bfs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              algorithm === 'bfs'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Breadth-First Search: Finds route with minimum number of stations"
          >
            <Zap className="w-3.5 h-3.5" />
            Shortest Stops (BFS)
          </button>

          <button
            type="button"
            onClick={() => onAlgorithmChange('dijkstra')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              algorithm === 'dijkstra'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Dijkstra's Algorithm: Minimizes total travel time including transfer penalties"
          >
            <Clock className="w-3.5 h-3.5" />
            Fastest Time (Dijkstra)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Origin / Destination Dual Row with Swap */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 items-end">
          <StationSelector
            id="origin-station-selector"
            label="From Station (Origin)"
            value={source}
            onChange={(val) => {
              onSourceChange(val);
              setErrorMsg('');
            }}
            placeholder="Select origin station or click on map..."
            iconType="origin"
            otherSelected={destination}
          />

          {/* Swap Button */}
          <div className="flex justify-center md:pb-1">
            <button
              type="button"
              onClick={handleSwap}
              disabled={!source && !destination}
              className={`p-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 hover:text-white border border-slate-700 transition shadow-md disabled:opacity-40 disabled:cursor-not-allowed ${
                isSwapping ? 'rotate-180 duration-300' : 'transition-transform duration-300'
              }`}
              title="Swap Origin and Destination"
            >
              <ArrowRightLeft className="w-4 h-4 text-red-400" />
            </button>
          </div>

          <StationSelector
            id="destination-station-selector"
            label="To Station (Destination)"
            value={destination}
            onChange={(val) => {
              onDestinationChange(val);
              setErrorMsg('');
            }}
            placeholder="Select destination station..."
            iconType="destination"
            otherSelected={source}
          />
        </div>

        {/* Popular Station Quick Chips */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-slate-400">
              ⚡ Quick Hubs:
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_STATIONS.map((st) => {
              const isSelected = source === st.name || destination === st.name;
              return (
                <button
                  key={st.name}
                  type="button"
                  onClick={() => handleQuickStationClick(st.name)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-red-500/20 text-red-300 border-red-500/40 font-semibold'
                      : 'bg-slate-800/70 text-slate-300 border-slate-700/60 hover:bg-slate-700/70 hover:text-white'
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor:
                        st.line === 'Red'
                          ? '#EF4444'
                          : st.line === 'Blue'
                          ? '#3B82F6'
                          : '#10B981',
                    }}
                  />
                  <span>{st.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Validation Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-red-400 animate-slide-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || !source || !destination}
            className="flex-1 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition shadow-lg shadow-red-900/30 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Calculating Shortest Route...</span>
              </div>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span className="text-sm">Find Shortest Route</span>
              </>
            )}
          </button>

          {(source || destination) && (
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Reset fields"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RouteSearchForm;
