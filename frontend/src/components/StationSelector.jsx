import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MapPin, Navigation, Search, X, ChevronDown, Check, Star } from 'lucide-react';
import { STATIONS_DATA, INTERCHANGE_STATIONS, LINE_CONFIG } from '../services/metroData';

const StationSelector = ({
  label,
  value,
  onChange,
  placeholder = 'Select station...',
  iconType = 'origin',
  otherSelected = '',
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter stations based on search query and active line filter
  const filteredStations = useMemo(() => {
    return STATIONS_DATA.filter((st) => {
      const matchesSearch = st.station_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());

      if (!matchesSearch) return false;

      if (activeFilter === 'ALL') return true;
      if (activeFilter === 'INTERCHANGE') return INTERCHANGE_STATIONS.includes(st.station_name);
      return st.line === activeFilter;
    });
  }, [searchQuery, activeFilter]);

  const handleSelect = (stationName) => {
    onChange(stationName);
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearchQuery('');
    if (inputRef.current) inputRef.current.focus();
  };

  const selectedDetails = STATIONS_DATA.find((s) => s.station_name === value);
  const isOrigin = iconType === 'origin';

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          {isOrigin ? (
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Navigation className="w-3.5 h-3.5 text-blue-400" />
          )}
          {label}
        </span>
        {value && (
          <span className="text-[11px] font-normal text-slate-400">
            {selectedDetails ? `${selectedDetails.line} Line • Zone ${selectedDetails.fare_zone}` : ''}
          </span>
        )}
      </label>

      {/* Main Selector Input Trigger */}
      <div
        id={id}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 50);
          }
        }}
        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl border transition-all cursor-pointer shadow-sm ${
          isOpen
            ? isOrigin
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-slate-900'
              : 'border-blue-500 ring-2 ring-blue-500/20 bg-slate-900'
            : value
            ? 'border-slate-700 bg-slate-800/90 hover:border-slate-600'
            : 'border-slate-700/80 bg-slate-900/60 hover:border-slate-600'
        }`}
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isOrigin ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
            }`}
          >
            {isOrigin ? <MapPin className="w-4 h-4" /> : <Navigation className="w-4 h-4" />}
          </div>

          <div className="flex-1 truncate">
            {value ? (
              <div className="flex items-center gap-2 truncate">
                <span className="font-semibold text-slate-100 text-sm truncate">{value}</span>
                {selectedDetails && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                      selectedDetails.line === 'Red'
                        ? 'bg-red-500/10 text-red-400 border-red-500/30'
                        : selectedDetails.line === 'Blue'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {selectedDetails.line}
                  </span>
                )}
                {INTERCHANGE_STATIONS.includes(value) && (
                  <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-current" /> Transfer
                  </span>
                )}
              </div>
            ) : (
              <span className="text-slate-400 text-sm">{placeholder}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 text-slate-400">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:text-slate-200 rounded-lg hover:bg-slate-700/50 transition"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-slate-200' : ''}`}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-slide-in">
          {/* Search Box */}
          <div className="p-3 border-b border-slate-800 bg-slate-950/60">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type station name (e.g. Ameerpet, HITEC)..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-8 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 mt-2.5 overflow-x-auto pb-0.5 custom-scrollbar">
              {[
                { key: 'ALL', label: 'All (60)' },
                { key: 'Red', label: 'Red Line' },
                { key: 'Blue', label: 'Blue Line' },
                { key: 'Green', label: 'Green Line' },
                { key: 'INTERCHANGE', label: '★ Interchanges' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveFilter(tab.key)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                    activeFilter === tab.key
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Station List */}
          <div className="max-h-60 overflow-y-auto p-1.5 custom-scrollbar">
            {filteredStations.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No metro stations found matching "{searchQuery}"
              </div>
            ) : (
              filteredStations.map((st) => {
                const isSelected = value === st.station_name;
                const isOther = otherSelected === st.station_name;
                const isInterchange = INTERCHANGE_STATIONS.includes(st.station_name);

                return (
                  <button
                    key={st.station_name}
                    type="button"
                    onClick={() => handleSelect(st.station_name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition ${
                      isSelected
                        ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                        : isOther
                        ? 'opacity-40 hover:opacity-100 hover:bg-slate-800/70'
                        : 'hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            st.line === 'Red'
                              ? '#EF4444'
                              : st.line === 'Blue'
                              ? '#3B82F6'
                              : '#10B981',
                        }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm truncate">{st.station_name}</span>
                          {isInterchange && (
                            <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-1 py-0.2 rounded font-medium">
                              ★ Interchange
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {st.line} Line • Zone {st.fare_zone}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs">
                      {isOther && <span className="text-slate-400 text-[10px] mr-1">(Selected)</span>}
                      {isSelected && <Check className="w-4 h-4 text-red-400" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StationSelector;
