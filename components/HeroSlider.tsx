'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Movie } from '@/types';

export default function HeroSlider({ movies }: { movies: Movie[] }) {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length);
    }, 4000);
  };

  useEffect(() => {
    if (movies.length < 2) return;
    startAuto();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [movies.length]);

  if (!movies.length) return null;

  const go = (idx: number) => {
    setCurrent(idx);
    startAuto();
  };

  const prev = () => { go((current - 1 + movies.length) % movies.length); };
  const next = () => { go((current + 1) % movies.length); };

  const movie = movies[current];

  return (
    <div className="relative w-full overflow-hidden bg-black" style={{ height: '480px' }}>
      {/* Slides */}
      {movies.map((m, i) => (
        <div
          key={m.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          {m.posterUrl ? (
            <img
              src={m.posterUrl}
              alt={m.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-6xl">🎬</div>
          )}
          {/* dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
      ))}

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-6 pt-16">
        <Link href={`/movies/${movie.id}`} className="group inline-block">
          <h2 className="text-2xl md:text-3xl font-bold text-white group-hover:text-red-400 transition line-clamp-1">
            {movie.title}
          </h2>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
            <span>{movie.releaseYear}</span>
            {movie.genre?.length > 0 && (
              <>
                <span className="w-1 h-1 bg-gray-600 rounded-full" />
                <span>{movie.genre.slice(0, 2).join(', ')}</span>
              </>
            )}
            {movie.averageRating > 0 && (
              <>
                <span className="w-1 h-1 bg-gray-600 rounded-full" />
                <span className="text-red-400 font-semibold">⭐ {movie.averageRating.toFixed(1)}</span>
              </>
            )}
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${movie.priceType === 'PREMIUM' ? 'bg-red-700 text-white' : 'bg-zinc-700 text-gray-300'}`}>
              {movie.priceType}
            </span>
          </div>
        </Link>
      </div>

      {/* Prev / Next arrows */}
      {movies.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/60 hover:bg-black/90 border border-zinc-700 rounded-full flex items-center justify-center text-white text-xl transition"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/60 hover:bg-black/90 border border-zinc-700 rounded-full flex items-center justify-center text-white text-xl transition"
          >
            ›
          </button>
        </>
      )}

      {/* Dot indicators */}
      {movies.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {movies.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-red-500' : 'w-1.5 bg-zinc-500 hover:bg-zinc-300'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
