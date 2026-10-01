import React from 'react';
import { MapPin, Search, Heart, Clock, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({ type = 'search' }) => {
  const configs = {
    search: {
      icon: Search,
      title: 'No routes found',
      description: 'Select two distinct stations on the network to generate the shortest journey.',
      action: { to: '/search', label: 'Start Route Planning' },
    },
    favorites: {
      icon: Heart,
      title: 'No bookmarks yet',
      description: 'Bookmark your frequent commute routes to quickly recalculate them with one tap.',
      action: { to: '/search', label: 'Find & Save Route' },
    },
    history: {
      icon: Clock,
      title: 'No search history yet',
      description: 'Your recent route searches and transit inquiries will appear here automatically.',
      action: { to: '/search', label: 'Explore Network' },
    },
    stations: {
      icon: MapPin,
      title: 'No stations found',
      description: 'The metro network graph is synchronizing.',
      action: { to: '/search', label: 'Reset Filters' },
    },
  };

  const config = configs[type] || configs.search;
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-slate-400 shadow-xl">
        <Icon className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1.5">{config.title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
        {config.description}
      </p>

      {config.action && (
        <Link
          to={config.action.to}
          className="bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow"
        >
          <Compass className="w-4 h-4" />
          <span>{config.action.label}</span>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
