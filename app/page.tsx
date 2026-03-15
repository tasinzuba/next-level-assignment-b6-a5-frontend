import Link from 'next/link';
import api from '@/lib/api';
import { Movie } from '@/types';
import MovieCard from '@/components/MovieCard';

async function getFeaturedMovies(): Promise<Movie[]> {
  try {
    const res = await api.get('/movies/featured');
    return res.data.data || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featuredMovies = await getFeaturedMovies();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            Discover & Review <span className="text-yellow-400">Amazing Movies</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Rate movies, write reviews, build your watchlist and connect with fellow movie lovers.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/movies"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-lg text-lg transition"
            >
              Browse Movies
            </Link>
            <Link
              href="/register"
              className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold px-8 py-3 rounded-lg text-lg transition"
            >
              Join Free
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-900 py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Movies', value: '500+' },
            { label: 'Reviews', value: '2K+' },
            { label: 'Members', value: '1K+' },
            { label: 'Genres', value: '20+' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-yellow-400">{s.value}</p>
              <p className="text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Movies */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Featured Movies</h2>
          <Link href="/movies" className="text-yellow-400 hover:underline">View All →</Link>
        </div>
        {featuredMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {featuredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-12">No featured movies yet.</p>
        )}
      </section>

      {/* CTA */}
      <section className="bg-yellow-500 py-16 text-center px-4">
        <h2 className="text-3xl font-bold text-black mb-3">Ready to dive in?</h2>
        <p className="text-gray-900 mb-6">Create your free account and start reviewing today.</p>
        <Link
          href="/register"
          className="bg-black text-white font-bold px-8 py-3 rounded-lg text-lg hover:bg-gray-800 transition"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
}
