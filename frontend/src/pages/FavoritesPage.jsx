import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Trash2, MapPin, Compass, Train } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';

const LOCAL_FAVS_KEY = 'hm_saved_favorites';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    setLoading(true);
    let items = [];

    if (user) {
      try {
        const response = await api.get('/favorites/');
        items = response.data;
      } catch (err) {
        console.warn('Backend favorites fetch failed, falling back to local storage', err);
      }
    }

    if (items.length === 0) {
      try {
        const raw = localStorage.getItem(LOCAL_FAVS_KEY);
        items = raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.warn(e);
      }
    }

    setFavorites(items);
    setLoading(false);
  };

  const handleDelete = async (id, source, destination) => {
    try {
      if (user) {
        try {
          await api.delete(`/favorites/${id}`);
        } catch {
          // ignore
        }
      }

      // Also clean up local
      const raw = localStorage.getItem(LOCAL_FAVS_KEY);
      if (raw) {
        const list = JSON.parse(raw).filter(
          (f) => !(f.id === id || (f.source === source && f.destination === destination))
        );
        localStorage.setItem(LOCAL_FAVS_KEY, JSON.stringify(list));
      }

      setFavorites((prev) => prev.filter((f) => f.id !== id));
      setToast({ message: 'Removed from favorites', type: 'success' });
    } catch {
      setToast({ message: 'Failed to remove favorite', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <LoadingSpinner text="Loading saved routes..." />
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
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Bookmarked Routes</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Quick access to your regular commute pairs
              </p>
            </div>
          </div>

          <Link
            to="/search"
            className="bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow"
          >
            <Compass className="w-4 h-4" />
            Plan New Route
          </Link>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center">
            <EmptyState type="favorites" />
          </div>
        ) : (
          <div className="grid gap-3.5">
            {favorites.map((fav) => (
              <div
                key={fav.id}
                className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 transition shadow-lg group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-rose-400 flex-shrink-0">
                    <Train className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-base font-bold text-white truncate">
                      <span className="truncate">{fav.source}</span>
                      <ArrowRight className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="truncate">{fav.destination}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Bookmarked on{' '}
                      {fav.created_at ? new Date(fav.created_at).toLocaleDateString() : 'Recent'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <Link
                    to="/search"
                    state={{ source: fav.source, destination: fav.destination }}
                    className="bg-red-600 hover:bg-red-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-red-950/40"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Navigate</span>
                  </Link>

                  <button
                    onClick={() => handleDelete(fav.id, fav.source, fav.destination)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                    title="Remove from bookmarks"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
