import React from 'react';
import { Train, Github, Linkedin, Heart, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Mission */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-950/40">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-200 text-sm">
              Hyderabad Metro Route Planner
            </div>
            <p className="text-[11px] text-slate-400">
              Graph-based transit optimization for Hyderabad, Telangana
            </p>
          </div>
        </div>

        {/* Algorithm & Stack Note */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            BFS Shortest Path O(V+E)
          </span>
          <span className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Dijkstra Time Optimization
          </span>
          <span className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Topological SVG Cartography
          </span>
        </div>

        {/* Navigation Quick Links */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/search" className="hover:text-white transition">Plan Route</Link>
          <Link to="/favorites" className="hover:text-white transition">Favorites</Link>
          <Link to="/history" className="hover:text-white transition">History</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
        <p>© {new Date().getFullYear()} Hyderabad Metro Route Planner. Built for portfolio & showcase.</p>
        <p className="flex items-center gap-1">
          Designed with <Heart className="w-3 h-3 text-red-500 fill-current inline" /> for Hyderabad commuters
        </p>
      </div>
    </footer>
  );
};

export default Footer;
