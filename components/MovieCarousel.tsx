'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Movie } from '@/types';

export default function MovieCarousel({ movies }: { movies: Movie[] }) {
  const [visible, setVisible] = useState(5);
  const [index, setIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 480) setVisible(2);
      else if (window.innerWidth < 640) setVisible(2);
      else if (window.innerWidth < 768) setVisible(3);
      else if (window.innerWidth < 1024) setVisible(4);
      else setVisible(5);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Triple the items for seamless infinite loop: [clone-end | original | clone-start]
  const cloned = movies.length > 0 ? [...movies, ...movies, ...movies] : [];
  const offset = movies.length; // start at original set

  // Reset to correct position without transition when we hit clone zones
  useEffect(() => {
    if (!transitioning) {
      // snap back without animation
      setTransitioning(true);
    }
  }, [transitioning]);

  const cardWidth = 100 / visible;

  const goTo = useCallback((newIndex: number, animate: boolean) => {
    setTransitioning(animate);
    setIndex(newIndex);
  }, []);

  const next = useCallback(() => {
    const newIndex = index + 1;
    goTo(newIndex, true);
    // If we've gone past the original into the end-clone, jump back
    if (newIndex >= offset + movies.length) {
      setTimeout(() => goTo(offset, false), 500);
    }
  }, [index, offset, movies.length, goTo]);

  const prev = useCallback(() => {
    const newIndex = index - 1;
    goTo(newIndex, true);
    // If we've gone before the original into the start-clone, jump forward
    if (newIndex < offset) {
      setTimeout(() => goTo(offset + movies.length - 1, false), 500);
    }
  }, [index, offset, movies.length, goTo]);

  const startAuto = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, 3500);
  }, [next]);

  useEffect(() => {
    if (movies.length === 0) return;
    setIndex(offset);
    startAuto();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movies.length, visible]);

  useEffect(() => {
    startAuto();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startAuto]);

  if (movies.length === 0) return null;

  return (
    <div className="relative group">
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className={transitioning ? 'flex transition-transform duration-500 ease-in-out' : 'flex'}
          style={{ transform: `translateX(-${index * cardWidth}%)` }}
        >
          {cloned.map((movie, i) => (
            <div
              key={`${movie.id}-${i}`}
              className="flex-shrink-0 px-1.5"
              style={{ width: `${cardWidth}%` }}
            >
              <Link href={`/movies/${movie.id}`} className="group/card block relative overflow-hidden rounded-lg" style={{ aspectRatio: '2/3' }}>
                <div className="w-full h-full bg-gray-100 dark:bg-zinc-900 relative overflow-hidden rounded-lg">
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-300 dark:text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                  <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
                    <span className={`text-white text-xs font-bold px-1.5 py-0.5 rounded ${movie.priceType === 'PREMIUM' ? 'bg-red-700' : 'bg-gray-500 dark:bg-zinc-700'}`}>
                      {movie.priceType === 'PREMIUM' ? 'PREMIUM' : 'FREE'}
                    </span>
                    {movie.averageRating > 0 && (
                      <span className="flex items-center gap-0.5 bg-black/60 text-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded">
                        ★ {movie.averageRating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 px-2 pb-2">
                    <h3 className="text-gray-900 dark:text-white text-xs font-semibold line-clamp-2 group-hover/card:text-red-400 transition leading-tight">
                      {movie.title}
                    </h3>
                    <p className="text-red-400 text-xs mt-0.5 font-semibold">{movie.releaseYear}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => { prev(); startAuto(); }}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-8 h-8 bg-white/90 dark:bg-black/90 border border-gray-300 dark:border-zinc-700 hover:border-red-500 rounded-full flex items-center justify-center text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition text-lg"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>

      <button
        onClick={() => { next(); startAuto(); }}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-8 h-8 bg-white/90 dark:bg-black/90 border border-gray-300 dark:border-zinc-700 hover:border-red-500 rounded-full flex items-center justify-center text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}
