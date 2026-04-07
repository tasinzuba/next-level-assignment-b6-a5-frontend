import Link from 'next/link';
import { Movie } from '@/types';
import MovingBorderCard from '@/components/MovingBorderCard';

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <MovingBorderCard
      as="div"
      containerClassName="group block"
      className="overflow-hidden flex flex-col h-full"
      borderRadius="0.5rem"
      duration={3000}
    >
      <Link href={`/movies/${movie.id}`} className="block">
        <div className="aspect-[2/3] bg-gray-100 dark:bg-zinc-900 relative overflow-hidden">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-300 dark:text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-black/80 text-yellow-400 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            {movie.averageRating?.toFixed(1) || 'N/A'}
          </div>
          {movie.priceType === 'PREMIUM' && (
            <div className="absolute top-2 left-2 bg-red-700 text-white text-xs font-bold px-2 py-1 rounded">
              PREMIUM
            </div>
          )}
        </div>
      </Link>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-red-400 text-xs font-semibold">{movie.releaseYear}</span>
          {movie.director && (
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              {movie.director}
            </span>
          )}
          {(movie as Movie & { mediaType?: string }).mediaType === 'SERIES' && (
            <span className="text-xs bg-gray-200 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">Series</span>
          )}
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 truncate">{movie.genre?.join(', ')}</p>
        {movie.description && (
          <p className="text-gray-600 dark:text-gray-400 text-xs mt-2 line-clamp-2 leading-relaxed">
            {movie.description}
          </p>
        )}
        <div className="mt-auto pt-3">
          <Link
            href={`/movies/${movie.id}`}
            className="block w-full text-center text-xs font-semibold px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </MovingBorderCard>
  );
}
