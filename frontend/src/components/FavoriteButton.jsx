import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const LOCAL_FAVS_KEY = 'hm_saved_favorites';

const FavoriteButton = ({ source, destination }) => {
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    checkIfFavorited();
  }, [source, destination, user]);

  const checkIfFavorited = async () => {
    if (!source || !destination) return;

    if (user) {
      try {
        const res = await api.get('/favorites/');
        const exists = res.data.some(
          (f) => f.source === source && f.destination === destination
        );
        setFavorited(exists);
        return;
      } catch {
        // Fallback to local
      }
    }

    try {
      const raw = localStorage.getItem(LOCAL_FAVS_KEY);
      const list = raw ? JSON.parse(raw) : [];
      const exists = list.some(
        (f) => f.source === source && f.destination === destination
      );
      setFavorited(exists);
    } catch {
      setFavorited(false);
    }
  };

  const handleToggle = async () => {
    if (!source || !destination) return;
    setLoading(true);

    try {
      if (user) {
        try {
          if (favorited) {
            const res = await api.get('/favorites/');
            const match = res.data.find(
              (f) => f.source === source && f.destination === destination
            );
            if (match) {
              await api.delete(`/favorites/${match.id}`);
            }
          } else {
            await api.post('/favorites/', { source, destination });
          }
        } catch {
          // If backend fails, fallback to local storage
        }
      }

      // Sync with localStorage
      const raw = localStorage.getItem(LOCAL_FAVS_KEY);
      let list = raw ? JSON.parse(raw) : [];

      if (favorited) {
        list = list.filter(
          (f) => !(f.source === source && f.destination === destination)
        );
        setFavorited(false);
      } else {
        list.push({
          id: 'fav_' + Date.now(),
          source,
          destination,
          created_at: new Date().toISOString(),
        });
        setFavorited(true);
      }
      localStorage.setItem(LOCAL_FAVS_KEY, JSON.stringify(list));
    } catch (err) {
      console.error('Favorite toggle failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading || !source || !destination}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition shadow-sm ${
        favorited
          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-rose-500/30'
          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
      }`}
      title={favorited ? 'Remove from favorites' : 'Save to favorites'}
    >
      <Heart
        className={`w-3.5 h-3.5 transition-transform ${
          favorited ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-400'
        }`}
      />
      <span>{favorited ? 'Favorited' : 'Bookmark'}</span>
    </button>
  );
};

export default FavoriteButton;
