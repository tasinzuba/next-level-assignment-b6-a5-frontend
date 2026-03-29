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
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
          <span className="w-1 h-5 bg-red-600 rounded-sm block" />
          <h3 className="text-white font-bold text-sm">Latest Updates</h3>
        </div>
        <ul className="divide-y divide-zinc-800/60">
          {latestUpdates.slice(0, 8).map((m) => (
            <li key={m.id}>
              <Link href={`/movies/${m.id}`} className="flex gap-3 px-3 py-2.5 hover:bg-zinc-900 transition group">
                <div className="flex-shrink-0 w-12 h-16 rounded overflow-hidden bg-zinc-900">
                  {m.posterUrl ? (
                    <img src={m.posterUrl} alt={m.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">🎬</div>
                  )}
                </div>
                <div className="flex-1 min-w-0 py-0.5">
                  <p className="text-white text-xs font-semibold line-clamp-2 group-hover:text-red-400 transition leading-snug">
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
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
          <span className="w-1 h-5 bg-red-600 rounded-sm block" />
          <h3 className="text-white font-bold text-sm">Categories</h3>
        </div>
        <ul className="py-1">
          {GENRES.map((genre) => (
            <li key={genre}>
              <Link
                href={`/movies?genre=${encodeURIComponent(genre)}`}
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-zinc-900 transition text-sm group"
              >
                <span className="text-red-500 text-xs">›</span>
                {genre}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
