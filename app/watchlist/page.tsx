'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Watchlist } from '@/types';

export default function WatchlistPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [watchlist, setWatchlist] = useState<Watchlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    fetchWatchlist();
  }, [user]);

  const fetchWatchlist = async () => {
    try {
      const res = await api.get('/watchlist');
      setWatchlist(res.data.data || []);
    } catch {
      toast.error('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (movieId: string) => {
    try {
      await api.post('/watchlist/toggle', { movieId });
      setWatchlist(watchlist.filter((w) => w.movie.id !== movieId));
      toast.success('Removed from watchlist');
    } catch {
      toast.error('Failed to remove');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-zinc-900 rounded-lg aspect-[2/3] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">My Watchlist</h1>

      {watchlist.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl mb-4">Your watchlist is empty.</p>
          <Link href="/movies" className="bg-red-600 hover:bg-red-700 text-black font-bold px-6 py-3 rounded-lg transition">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {watchlist.map((item) => (
            <div key={item.id} className="group relative">
              <Link href={`/movies/${item.movie.id}`}>
                <div className="bg-zinc-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-red-500 transition">
                  <div className="aspect-[2/3] bg-zinc-800 relative">
                    {item.movie.posterUrl ? (
                      <img src={item.movie.posterUrl} alt={item.movie.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">🎬</div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/70 text-red-400 text-xs font-bold px-2 py-1 rounded">
                      ⭐ {item.movie.averageRating?.toFixed(1) || 'N/A'}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-white text-sm truncate">{item.movie.title}</h3>
                    <p className="text-gray-400 text-xs mt-1">{item.movie.releaseYear}</p>
                  </div>
                </div>
              </Link>
              <button
                onClick={() => handleRemove(item.movie.id)}
                className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
