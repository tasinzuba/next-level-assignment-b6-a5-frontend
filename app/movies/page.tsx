'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Movie } from '@/types';
import MovieCard from '@/components/MovieCard';

const GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Thriller', 'Sci-Fi', 'Romance', 'Animation', 'Crime', 'Documentary'];

function MoviesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [genre, setGenre] = useState(searchParams.get('genre') || '');
  const [priceType, setPriceType] = useState(searchParams.get('priceType') || '');
  const [mediaType, setMediaType] = useState(searchParams.get('mediaType') || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState(searchParams.get('sort') || 'createdAt');
  const [order, setOrder] = useState(searchParams.get('order') || 'desc');

  useEffect(() => {
    fetchMovies();
  }, [search, genre, priceType, mediaType, page, sort, order]);

  // Sync URL params on mount
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setGenre(searchParams.get('genre') || '');
    setPriceType(searchParams.get('priceType') || '');
    setMediaType(searchParams.get('mediaType') || '');
    setSort(searchParams.get('sort') || 'createdAt');
    setOrder(searchParams.get('order') || 'desc');
    setPage(1);
  }, [searchParams]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 12, sort, order };
      if (search) params.search = search;
      if (genre) params.genre = genre;
      if (priceType) params.priceType = priceType;
      if (mediaType) params.mediaType = mediaType;

      const res = await api.get('/movies', { params });
      setMovies(res.data.data || []);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch {
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const pageTitle = mediaType === 'SERIES' ? 'All Series' : mediaType === 'MOVIE' ? 'All Movies' : 'Movies & Series';

  const selectClass = "bg-zinc-900 text-white border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-600 cursor-pointer";

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-3xl font-bold text-white">{pageTitle}</h1>
        {/* Media type tabs */}
        <div className="flex bg-zinc-900 p-1 rounded-xl gap-1">
          {[
            { val: '', label: 'All' },
            { val: 'MOVIE', label: 'Movies' },
            { val: 'SERIES', label: 'Series' },
          ].map((t) => (
            <button
              key={t.val}
              onClick={() => { setMediaType(t.val); setPage(1); }}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${mediaType === t.val ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8 bg-zinc-950 border border-zinc-800 rounded-xl p-4">
        <input
          type="text"
          placeholder="Search title, director, cast..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="bg-zinc-900 text-white border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-red-600 flex-1 min-w-[200px]"
        />
        <select value={genre} onChange={(e) => { setGenre(e.target.value); setPage(1); }} className={selectClass}>
          <option value="">All Genres</option>
          {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={priceType} onChange={(e) => { setPriceType(e.target.value); setPage(1); }} className={selectClass}>
          <option value="">Free & Premium</option>
          <option value="FREE">Free Only</option>
          <option value="PREMIUM">Premium Only</option>
        </select>
        <select
          value={`${sort}-${order}`}
          onChange={(e) => { const [s, o] = e.target.value.split('-'); setSort(s); setOrder(o); setPage(1); }}
          className={selectClass}
        >
          <option value="createdAt-desc">Latest Added</option>
          <option value="releaseYear-desc">Newest Release</option>
          <option value="releaseYear-asc">Oldest Release</option>
          <option value="title-asc">A → Z</option>
          <option value="title-desc">Z → A</option>
        </select>
        {(search || genre || priceType || mediaType) && (
          <button
            onClick={() => { setSearch(''); setGenre(''); setPriceType(''); setMediaType(''); setPage(1); router.push('/movies'); }}
            className="px-3 py-2 text-sm text-gray-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-lg transition"
          >
            Clear ✕
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-zinc-900 rounded-xl aspect-[2/3] animate-pulse" />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <>
          <p className="text-gray-500 text-sm mb-4">{totalPages > 1 ? `Page ${page} of ${totalPages}` : `${movies.length} result${movies.length !== 1 ? 's' : ''}`}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-zinc-900 rounded-lg text-sm text-gray-300 disabled:opacity-40 hover:bg-zinc-800 transition">← Prev</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = page <= 3 ? i + 1 : page - 2 + i;
                if (p < 1 || p > totalPages) return null;
                return (
                  <button key={p} onClick={() => setPage(p)} className={`px-4 py-2 rounded-lg text-sm transition ${p === page ? 'bg-red-600 text-white' : 'bg-zinc-900 text-gray-300 hover:bg-zinc-800'}`}>{p}</button>
                );
              })}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 bg-zinc-900 rounded-lg text-sm text-gray-300 disabled:opacity-40 hover:bg-zinc-800 transition">Next →</button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <svg className="w-16 h-16 text-zinc-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          <p className="text-gray-400 text-lg">No results found.</p>
          <p className="text-gray-600 text-sm mt-2">Try different filters or search terms.</p>
        </div>
      )}
    </div>
  );
}

export default function MoviesPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-10"><div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">{Array.from({length:12}).map((_,i)=><div key={i} className="bg-zinc-900 rounded-xl aspect-[2/3] animate-pulse"/>)}</div></div>}>
      <MoviesContent />
    </Suspense>
  );
}
