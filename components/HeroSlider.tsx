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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movies.length]);

  if (!movies.length) return null;

  const go = (idx: number) => { setCurrent(idx); startAuto(); };
  const prev = () => go((current - 1 + movies.length) % movies.length);
  const next = () => go((current + 1) % movies.length);

  // Show 2 slides side by side like reference
  const pairs: Movie[][] = [];
  for (let i = 0; i < movies.length; i += 2) {
    if (movies[i + 1]) pairs.push([movies[i], movies[i + 1]]);
    else pairs.push([movies[i]]);
  }
  const pair = pairs[current % pairs.length] || [movies[0]];

  return (
    <div className="relative w-full bg-black overflow-hidden">
      {/* 2-column slide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {pair.map((m) => (
          <Link key={m.id} href={`/movies/${m.id}`} className="group relative block overflow-hidden" style={{ height: '360px' }}>
            {m.posterUrl ? (
              <img
                src={m.posterUrl}
                alt={m.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            ) : (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                <svg className="w-16 h-16 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
            )}
            {/* overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            {/* badge */}
            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">
              {m.priceType}
            </div>
            {/* bottom info */}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
              <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 group-hover:text-red-400 transition">
                {m.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-300">
                <span>{m.releaseYear}</span>
                {m.averageRating > 0 && (
                  <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                    ★ {m.averageRating.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Arrows */}
      {pairs.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/70 hover:bg-black border border-zinc-700 rounded-full flex items-center justify-center text-white text-lg transition"
          >‹</button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/70 hover:bg-black border border-zinc-700 rounded-full flex items-center justify-center text-white text-lg transition"
          >›</button>
        </>
      )}

      {/* Dots */}
      {pairs.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {pairs.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`h-1.5 rounded-full transition-all ${i === (current % pairs.length) ? 'w-5 bg-red-500' : 'w-1.5 bg-zinc-500'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
