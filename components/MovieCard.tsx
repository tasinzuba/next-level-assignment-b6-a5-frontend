import Link from 'next/link';
import { Movie } from '@/types';

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movies/${movie.id}`} className="group block">
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden hover:border-red-600 transition">
        <div className="aspect-[2/3] bg-zinc-900 relative overflow-hidden">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
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
          <h3 className="font-semibold text-white text-sm truncate group-hover:text-red-400 transition">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-red-400 text-xs font-semibold">{movie.releaseYear}</span>
            {(movie as Movie & { mediaType?: string }).mediaType === 'SERIES' && (
              <span className="text-xs bg-zinc-800 text-gray-400 px-1.5 py-0.5 rounded">Series</span>
            )}
          </div>
          <p className="text-gray-500 text-xs mt-1 truncate">{movie.genre?.join(', ')}</p>
        </div>
      </div>
    </Link>
  );
}
