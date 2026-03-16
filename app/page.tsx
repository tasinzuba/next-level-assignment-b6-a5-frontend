import Link from 'next/link';
import api from '@/lib/api';
import { Movie } from '@/types';
import HeroSlider from '@/components/HeroSlider';
import MovieCarousel from '@/components/MovieCarousel';

async function getMovies(params: string): Promise<Movie[]> {
  try {
    const res = await api.get(`/movies?${params}`);
    return res.data.data || [];
  } catch {
    return [];
  }
}

async function getFeatured(): Promise<Movie[]> {
  try {
    const res = await api.get('/movies/featured');
    return res.data.data || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [heroMovies, latestMovies, featuredMovies] = await Promise.all([
    getFeatured(),
    getMovies('limit=10&sort=createdAt&order=desc'),
    getFeatured(),
  ]);

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Slider - 2 column style */}
      <HeroSlider movies={heroMovies} />

      {/* Latest Movies */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="w-1 h-6 bg-red-600 rounded-sm block" />
            <h2 className="text-xl font-bold text-white">Latest Movies</h2>
          </div>
          <Link href="/movies" className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded transition">
            SEE ALL
          </Link>
        </div>
        {latestMovies.length > 0 ? (
          <MovieCarousel movies={latestMovies} />
        ) : (
          <p className="text-gray-600 text-center py-12">No movies yet.</p>
        )}
      </section>

      {/* Featured Movies */}
      {featuredMovies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-6 pb-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="w-1 h-6 bg-red-600 rounded-sm block" />
              <h2 className="text-xl font-bold text-white">Featured</h2>
            </div>
            <Link href="/movies" className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded transition">
              SEE ALL
            </Link>
          </div>
          <MovieCarousel movies={featuredMovies} />
        </section>
      )}
    </div>
  );
}
