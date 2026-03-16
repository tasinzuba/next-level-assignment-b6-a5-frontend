'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Movie } from '@/types';

export default function MovieCarousel({ movies }: { movies: Movie[] }) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(4);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setVisible(1);
      else if (window.innerWidth < 768) setVisible(2);
      else if (window.innerWidth < 1024) setVisible(3);
      else setVisible(4);
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
  }, [maxIndex, visible]);

  const go = (dir: number) => {
    setCurrent((prev) => Math.max(0, Math.min(maxIndex, prev + dir)));
    startAuto();
  };

  const cardWidth = 100 / visible;

  return (
    <div className="relative group">
      {/* Slides */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * cardWidth}%)` }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 px-2"
              style={{ width: `${cardWidth}%` }}
            >
              <Link href={`/movies/${movie.id}`} className="group/card block">
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden hover:border-red-600 transition">
                  <div className="aspect-[2/3] bg-zinc-900 relative overflow-hidden">
                    {movie.posterUrl ? (
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover/card:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl">
                        🎬
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/80 text-red-400 text-xs font-bold px-2 py-1 rounded">
                      ⭐ {movie.averageRating?.toFixed(1) || 'N/A'}
                    </div>
                    {movie.priceType === 'PREMIUM' && (
                      <div className="absolute top-2 left-2 bg-red-700 text-white text-xs font-bold px-2 py-1 rounded">
                        PREMIUM
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-white text-sm truncate group-hover/card:text-red-400 transition">
                      {movie.title}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1">{movie.releaseYear}</p>
                    <p className="text-gray-500 text-xs mt-1 truncate">{movie.genre?.join(', ')}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Prev button */}
      {current > 0 && (
        <button
          onClick={() => go(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 bg-black/80 border border-zinc-700 hover:border-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
        >
          ‹
        </button>
      )}

      {/* Next button */}
      {current < maxIndex && (
        <button
          onClick={() => go(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 bg-black/80 border border-zinc-700 hover:border-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
        >
          ›
        </button>
      )}

      {/* Dots */}
      {maxIndex > 0 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); startAuto(); }}
              className={`w-1.5 h-1.5 rounded-full transition ${i === current ? 'bg-red-500 w-4' : 'bg-zinc-600 hover:bg-zinc-400'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
