'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Movie } from '@/types';
import MovieCard from '@/components/MovieCard';

const GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Thriller', 'Sci-Fi', 'Romance', 'Animation'];

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [priceType, setPriceType] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMovies();
  }, [search, genre, priceType, page]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 12 };
      if (search) params.search = search;
      if (genre) params.genre = genre;
      if (priceType) params.priceType = priceType;

      const res = await api.get('/movies', { params });
      setMovies(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch {
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-white mb-8">All Movies</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="bg-zinc-900 text-white border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600 flex-1 min-w-[200px]"
        />
        <select
          value={genre}
          onChange={(e) => { setGenre(e.target.value); setPage(1); }}
          className="bg-zinc-900 text-white border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600"
        >
          <option value="">All Genres</option>
          {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select
          value={priceType}
          onChange={(e) => { setPriceType(e.target.value); setPage(1); }}
          className="bg-zinc-900 text-white border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600"
        >
          <option value="">All Types</option>
          <option value="FREE">Free</option>
          <option value="PREMIUM">Premium</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-zinc-900 rounded-lg aspect-[2/3] animate-pulse" />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
          {/* Pagination */}
          <div className="flex justify-center gap-3 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-zinc-900 rounded disabled:opacity-40 hover:bg-zinc-800 transition"
            >
              ← Prev
            </button>
            <span className="px-4 py-2 text-gray-400">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-zinc-900 rounded disabled:opacity-40 hover:bg-zinc-800 transition"
            >
              Next →
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-400 text-center py-20">No movies found.</p>
      )}
    </div>
  );
}
