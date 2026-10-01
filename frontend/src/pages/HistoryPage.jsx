import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, ArrowRight, MapPin, Trash2, Train, 
  Repeat, IndianRupee, Compass, Calendar 
} from 'lucide-react';
import api from '../services/api';
import routeService from '../services/routeService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    setLoading(true);
    let items = [];

    if (user) {
      try {
        const response = await api.get('/history/');
        items = response.data;
      } catch (err) {
        console.warn('Backend history fetch failed, using local history', err);
      }
    }

    if (items.length === 0) {
      items = routeService.getLocalHistory();
    }

    setHistory(items);
    setLoading(false);
  };

  const handleClear = async () => {
    try {
      if (user) {
        try {
          await api.delete('/history/');
        } catch {
          // ignore
        }
      }
      routeService.clearLocalHistory();
      setHistory([]);
      setToast({ message: 'Search history cleared', type: 'success' });
    } catch {
      setToast({ message: 'Failed to clear history', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <LoadingSpinner text="Retrieving journey log..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Search History</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Past planned journeys and calculated fares
              </p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center">
            <EmptyState type="history" />
          </div>
        ) : (
          <div className="grid gap-4">
            {history.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-2xl p-5 transition shadow-lg space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400">
                      <Train className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-2 font-bold text-white text-base">
                      <span>{item.source}</span>
                      <ArrowRight className="w-4 h-4 text-red-500" />
                      <span>{item.destination}</span>
                    </div>
                  </div>

                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.searched_at ? new Date(item.searched_at).toLocaleString() : 'Just now'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 text-slate-300 bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-700/60">
                      <Train className="w-3.5 h-3.5 text-blue-400" />
                      {item.stations_count} stops
                    </span>

                    <span className="flex items-center gap-1 text-slate-300 bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-700/60">
                      <Repeat className="w-3.5 h-3.5 text-amber-400" />
                      {item.interchanges} transfer{item.interchanges !== 1 ? 's' : ''}
                    </span>

                    <span className="flex items-center gap-1 text-slate-300 bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-700/60">
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                      ₹{item.fare}
                    </span>

                    <span className="flex items-center gap-1 text-slate-300 bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-700/60">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      {item.travel_time} min
                    </span>
                  </div>

                  <Link
                    to="/search"
                    state={{ source: item.source, destination: item.destination }}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 hover:underline"
                  >
                    <span>Re-calculate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
