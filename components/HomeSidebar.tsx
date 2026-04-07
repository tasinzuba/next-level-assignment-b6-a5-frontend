'use client';

import Link from 'next/link';
import { Movie } from '@/types';

const GENRES = [
  'Action', 'Drama', 'Comedy', 'Thriller', 'Horror',
  'Romance', 'Sci-Fi', 'Animation', 'Crime', 'Adventure',
  'Fantasy', 'Documentary', 'Mystery', 'Biography', 'History',
];

export default function HomeSidebar({ latestUpdates }: { latestUpdates: Movie[] }) {
  return (
    <aside className="space-y-6">
      {/* Latest Updates */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
          <span className="w-1 h-5 bg-red-600 rounded-sm block" />
          <h3 className="text-gray-900 dark:text-white font-bold text-sm">Latest Updates</h3>
        </div>
        <ul className="divide-y divide-gray-200/60 dark:divide-zinc-800/60">
          {latestUpdates.slice(0, 8).map((m) => (
            <li key={m.id}>
              <Link href={`/movies/${m.id}`} className="flex gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition">
                <div className="flex-shrink-0 w-12 h-16 rounded overflow-hidden bg-gray-100 dark:bg-zinc-900">
                  {m.posterUrl ? (
                    <img src={m.posterUrl} alt={m.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-300 dark:text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 py-0.5">
                  <p className="text-gray-900 dark:text-white text-xs font-semibold line-clamp-2 leading-snug">
                    {m.title}
                  </p>
                  <p className="text-red-400 text-xs mt-0.5 font-semibold">{m.releaseYear}</p>
                  <p className="text-yellow-400 text-xs mt-0.5 font-semibold">
                    ★ {m.averageRating > 0 ? m.averageRating.toFixed(1) : 'N/A'}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Categories */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
          <span className="w-1 h-5 bg-red-600 rounded-sm block" />
          <h3 className="text-gray-900 dark:text-white font-bold text-sm">Categories</h3>
        </div>
        <ul className="py-1">
          {GENRES.map((genre) => (
            <li key={genre}>
              <Link
                href={`/movies?genre=${encodeURIComponent(genre)}`}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-900 transition text-sm group"
              >
                <span className="text-red-400 text-xs">›</span>
                {genre}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
