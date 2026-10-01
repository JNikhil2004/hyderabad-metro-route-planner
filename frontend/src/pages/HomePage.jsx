import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Train, Map, Search, ArrowRight, MapPin, 
  Clock, Route, Zap, Sparkles, Activity, 
  Repeat, ShieldCheck, ChevronRight, Github 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LINE_CONFIG, INTERCHANGE_STATIONS, POPULAR_STATIONS } from '../services/metroData';

const HomePage = () => {
  const { user } = useAuth();

  const quickRoutes = [
    { from: 'HITEC City', to: 'Ameerpet', line: 'Blue', desc: 'Tech corridor to central hub' },
    { from: 'Miyapur', to: 'LB Nagar', line: 'Red', desc: 'Full Red line cross-city transit' },
    { from: 'Raidurg', to: 'Secunderabad East', line: 'Blue', desc: 'Financial district to major railway hub' },
    { from: 'JBS Parade Ground', to: 'MG Bus Station', line: 'Green', desc: 'North to South inter-terminal corridor' },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Dual Graph Algorithms',
      desc: 'Shortest path calculation via Breadth-First Search (BFS) and travel time optimization via Dijkstra with transfer penalties.',
      badge: 'O(V + E) Complexity',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: Map,
      title: 'Interactive Vector Map',
      desc: 'Topological SVG network schematic with real-time route tracing, live train pulse animations, and pan/zoom controls.',
      badge: '60 Stations',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      icon: Clock,
      title: 'Instant Fare & Timing',
      desc: 'Accurate tiered fare slabs (₹10 to ₹50) and realistic transit time estimates with automatic platform transfer calculations.',
      badge: 'Real-time Parity',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: Route,
      title: 'Interchange Guidance',
      desc: 'Precise line-switch alerts at Ameerpet, Parade Ground, and MG Bus Station with step-by-step leg navigation.',
      badge: '3 Hubs',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Network Status Ticker */}
      <div className="bg-slate-900 border-b border-slate-800/80 py-2.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-200">System Status:</span>
            <span className="text-slate-400">All 3 Hyderabad Metro corridors operating on normal schedule</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 hidden sm:flex">
            <span>Operating Hours: 06:00 - 23:00 IST</span>
            <span>•</span>
            <span>Frequency: Peak 4m / Non-Peak 7m</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-red-600/20 via-blue-600/15 to-emerald-600/20 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tech Badges Row */}
            <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 mb-6 shadow-xl backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>React 18</span>
              <span className="text-slate-600">•</span>
              <span>FastAPI Backend</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400 font-semibold">Graph Theory Algorithms</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight">
              Navigate Hyderabad <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-400 bg-clip-text text-transparent">
                Smarter & Faster
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 mt-6 max-w-2xl mx-auto leading-relaxed">
              Intelligent public transit route planner powered by BFS and Dijkstra algorithms.
              Find the shortest path, interchange transfers, fare estimates, and travel times across 
              all 60 stations and 3 metro corridors.
            </p>

            {/* Hero CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-2.5 transition shadow-xl shadow-red-900/30 text-base"
              >
                <Search className="w-5 h-5" />
                Plan Your Route Now
              </Link>

              <Link
                to="/search"
                className="bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 border border-slate-700/80 transition backdrop-blur-md text-base"
              >
                <Map className="w-5 h-5 text-blue-400" />
                Explore Interactive Map
              </Link>
            </div>

            {/* Quick Stats Pill Bar */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              <div className="bg-slate-900/70 border border-slate-800/80 p-3 rounded-2xl text-center">
                <div className="text-2xl font-black text-white">3</div>
                <div className="text-[11px] text-slate-400 font-medium">Lines (Red, Blue, Green)</div>
              </div>
              <div className="bg-slate-900/70 border border-slate-800/80 p-3 rounded-2xl text-center">
                <div className="text-2xl font-black text-white">60</div>
                <div className="text-[11px] text-slate-400 font-medium">Metro Stations</div>
              </div>
              <div className="bg-slate-900/70 border border-slate-800/80 p-3 rounded-2xl text-center">
                <div className="text-2xl font-black text-white">3</div>
                <div className="text-[11px] text-slate-400 font-medium">Interchange Hubs</div>
              </div>
              <div className="bg-slate-900/70 border border-slate-800/80 p-3 rounded-2xl text-center">
                <div className="text-2xl font-black text-white">69 km</div>
                <div className="text-[11px] text-slate-400 font-medium">Network Length</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Popular Routes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-900">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Popular Daily Commute Routes
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any route to open instant navigation with full stats
            </p>
          </div>
          <Link
            to="/search"
            className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
          >
            All Stations <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickRoutes.map((qr) => (
            <Link
              key={`${qr.from}-${qr.to}`}
              to="/search"
              state={{ source: qr.from, destination: qr.to }}
              className="bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl transition group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-medium text-slate-300">{qr.desc}</span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor:
                        qr.line === 'Red'
                          ? '#EF4444'
                          : qr.line === 'Blue'
                          ? '#3B82F6'
                          : '#10B981',
                    }}
                  />
                </div>
                <div className="font-bold text-white text-base group-hover:text-red-400 transition flex items-center gap-2">
                  <span>{qr.from}</span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition" />
                  <span>{qr.to}</span>
                </div>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>View Route</span>
                <span className="text-red-400 font-semibold">Inspect →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Corridors Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-white">The Three Hyderabad Corridors</h2>
          <p className="text-slate-400 text-sm mt-2">
            Fully elevated metro rail system serving Hyderabad, Secunderabad, and Cyberabad
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(LINE_CONFIG).map(([key, line]) => (
            <div
              key={key}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition relative overflow-hidden flex flex-col justify-between"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: line.color }}
              />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="px-3 py-1 rounded-xl text-xs font-bold border"
                    style={{
                      backgroundColor: `${line.color}15`,
                      borderColor: `${line.color}40`,
                      color: line.color,
                    }}
                  >
                    {line.name}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    {line.stationsCount} Stations
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{line.route}</h3>
                <p className="text-xs text-slate-400 mb-4">{line.corridor}</p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Active Daily Fleet</span>
                <Link
                  to="/search"
                  className="font-semibold text-white hover:text-red-400 flex items-center gap-1"
                >
                  Explore Corridor <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engineering & Algorithmic Features */}
      <div className="bg-slate-900/50 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3.5 py-1 rounded-full text-xs font-semibold mb-3">
              <Zap className="w-3.5 h-3.5" />
              Technical Architecture
            </div>
            <h2 className="text-3xl font-black text-white">Built for Precision & Speed</h2>
            <p className="text-slate-400 text-sm mt-2">
              Combining Graph Theory algorithms, vector SVG cartography, and responsive UI design.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${feat.color}`}>
                  <feat.icon className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  {feat.badge}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interchange Stations Callout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold mb-3">
                <Repeat className="w-4 h-4" />
                Transfer Junctions
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
                Strategic Interchange Network
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Switch effortlessly across lines at Ameerpet (Red & Blue), Parade Ground (Blue & Green), 
                and MG Bus Station (Red & Green). Our router automatically computes transfer walking buffers.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {INTERCHANGE_STATIONS.map((station) => (
                  <Link
                    key={station}
                    to="/search"
                    state={{ source: station }}
                    className="bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    {station}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/search"
                className="bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition text-sm shadow-lg shadow-red-900/30"
              >
                Launch Route Finder
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
