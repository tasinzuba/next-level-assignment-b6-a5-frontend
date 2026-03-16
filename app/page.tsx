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

async function getNewlyAdded(): Promise<Movie[]> {
  try {
    const res = await api.get('/movies?limit=5&sort=newest');
    return res.data.data || [];
  } catch {
    return [];
  }
}

async function getTopRated(): Promise<Movie[]> {
  try {
    const res = await api.get('/movies?limit=5&sort=top');
    return res.data.data || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featuredMovies, newlyAdded, topRated] = await Promise.all([
    getFeaturedMovies(),
    getNewlyAdded(),
    getTopRated(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-black via-red-950/40 to-black py-24 px-4 text-center border-b border-red-900/30">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            Discover & Review <span className="text-red-500">Amazing Movies</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Rate movies, write reviews, build your watchlist and connect with fellow movie lovers.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/movies"
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-3 rounded-lg text-lg transition"
            >
              Browse Movies
            </Link>
            <Link
              href="/register"
              className="border border-red-600 text-red-400 hover:bg-red-600 hover:text-white font-bold px-8 py-3 rounded-lg text-lg transition"
            >
              Join Free
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-zinc-950 border-b border-red-900/20 py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Movies', value: '500+' },
            { label: 'Reviews', value: '2K+' },
            { label: 'Members', value: '1K+' },
            { label: 'Genres', value: '20+' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-red-500">{s.value}</p>
              <p className="text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Editor's Picks */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">⭐ Editor&apos;s Picks</h2>
          <Link href="/movies" className="text-red-400 hover:underline text-sm">View All →</Link>
        </div>
        {featuredMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {featuredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-12">No featured movies yet.</p>
        )}
      </section>

      {/* Top Rated */}
      <section className="bg-zinc-950 border-y border-red-900/20 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">🔥 Top Rated This Week</h2>
            <Link href="/movies" className="text-red-400 hover:underline text-sm">View All →</Link>
          </div>
          {topRated.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {topRated.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-12">No movies yet.</p>
          )}
        </div>
      </section>

      {/* Newly Added */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">🆕 Newly Added</h2>
          <Link href="/movies" className="text-red-400 hover:underline text-sm">View All →</Link>
        </div>
        {newlyAdded.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {newlyAdded.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-12">No movies yet.</p>
        )}
      </section>

      {/* Pricing */}
      <section className="bg-zinc-950 border-y border-red-900/20 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">💎 Choose Your Plan</h2>
          <p className="text-gray-500">Unlock premium content with our affordable plans</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Free',
              price: '$0',
              period: 'forever',
              features: ['Access free movies', 'Write reviews', 'Build watchlist', 'Basic search'],
              border: 'border-zinc-700',
              btn: 'bg-zinc-700 hover:bg-zinc-600 text-white',
              href: '/register',
            },
            {
              name: 'Monthly',
              price: '$9.99',
              period: 'per month',
              features: ['All free features', 'Access premium movies', '1080p streaming', 'Priority support'],
              border: 'border-red-600',
              btn: 'bg-red-600 hover:bg-red-500 text-white',
              href: '/subscription',
              popular: true,
            },
            {
              name: 'Yearly',
              price: '$79.99',
              period: 'per year',
              features: ['All monthly features', '4K Ultra HD', 'Download offline', 'Early access titles'],
              border: 'border-red-900',
              btn: 'bg-red-900 hover:bg-red-800 text-white',
              href: '/subscription',
            },
          ].map((plan) => (
            <div key={plan.name} className={`bg-black border-2 ${plan.border} rounded-xl p-7 flex flex-col relative`}>
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <div className="mt-3 mb-5">
                <span className="text-4xl font-extrabold text-red-500">{plan.price}</span>
                <span className="text-gray-500 text-sm ml-2">{plan.period}</span>
              </div>
              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-400 text-sm">
                    <span className="text-red-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className={`block text-center py-2.5 rounded-lg font-bold transition ${plan.btn}`}>
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Why <span className="text-red-500">Recape</span> Movie?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🎬', title: 'Huge Library', desc: 'Thousands of movies and series across all genres, from classics to latest releases.' },
            { icon: '⭐', title: 'Honest Reviews', desc: 'Real reviews from real movie lovers. Rate on a 1-10 scale with spoiler warnings.' },
            { icon: '📋', title: 'Personal Watchlist', desc: 'Save movies you want to watch and never lose track of your next favorite film.' },
          ].map((f) => (
            <div key={f.title} className="bg-zinc-950 border border-red-900/30 rounded-xl p-6 text-center hover:border-red-600 transition">
              <p className="text-4xl mb-4">{f.icon}</p>
              <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-red-700 py-16 text-center px-4">
        <h2 className="text-3xl font-bold text-white mb-3">Ready to dive in?</h2>
        <p className="text-red-200 mb-6">Create your free account and start reviewing today.</p>
        <Link
          href="/register"
          className="bg-black text-white font-bold px-8 py-3 rounded-lg text-lg hover:bg-zinc-900 transition"
        >
          Get Started Free
        </Link>
      </section>
    </div>
  );
}
