'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Movie } from '@/types';

export default function MovieCarousel({ movies }: { movies: Movie[] }) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(5);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const maxIndex = Math.max(0, movies.length - visible);

  const startAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3500);
  };

  useEffect(() => {
    startAuto();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxIndex, visible]);

  const go = (dir: number) => {
    setCurrent((prev) => Math.max(0, Math.min(maxIndex, prev + dir)));
    startAuto();
  };

  const cardWidth = 100 / visible;

  return (
    <div className="relative group">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * cardWidth}%)` }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 px-1.5"
              style={{ width: `${cardWidth}%` }}
            >
              <Link href={`/movies/${movie.id}`} className="group/card block relative overflow-hidden rounded-lg" style={{ aspectRatio: '2/3' }}>
                <div className="w-full h-full bg-zinc-900 relative overflow-hidden rounded-lg">
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl">🎬</div>
                  )}
                  {/* gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                  {/* top badges */}
                  <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
                    <span className={`text-white text-xs font-bold px-1.5 py-0.5 rounded ${movie.priceType === 'PREMIUM' ? 'bg-red-700' : 'bg-zinc-700'}`}>
                      {movie.priceType === 'PREMIUM' ? 'PREMIUM' : 'FREE'}
                    </span>
                    {movie.averageRating > 0 && (
                      <span className="flex items-center gap-0.5 bg-black/60 text-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded">
                        ★ {movie.averageRating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  {/* bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 px-2 pb-2">
                    <h3 className="text-white text-xs font-semibold line-clamp-2 group-hover/card:text-red-400 transition leading-tight">
                      {movie.title}
                    </h3>
                    <p className="text-gray-400 text-xs mt-0.5">{movie.releaseYear}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Prev */}
      {current > 0 && (
        <button
          onClick={() => go(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-8 h-8 bg-black/90 border border-zinc-600 hover:border-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition text-lg"
        >◀</button>
      )}

      {/* Next */}
      {current < maxIndex && (
        <button
          onClick={() => go(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-8 h-8 bg-black/90 border border-zinc-600 hover:border-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition text-lg"
        >▶</button>
      )}
    </div>
  );
}
