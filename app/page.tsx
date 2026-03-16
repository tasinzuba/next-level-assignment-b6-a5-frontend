import Link from 'next/link';
import api from '@/lib/api';
import { Movie } from '@/types';
import HeroSlider from '@/components/HeroSlider';
import MovieCarousel from '@/components/MovieCarousel';
import HomeSidebar from '@/components/HomeSidebar';

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

      {/* ── SECTION 1: Hero + Sidebar ── */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Hero Slider */}
            <HeroSlider movies={heroMovies} />

            {/* Latest Movies */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-1 h-6 bg-red-600 rounded-sm block" />
                  <h2 className="text-lg font-bold text-white">Latest Movies</h2>
                </div>
                <Link href="/movies" className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded transition">
                  SEE ALL
                </Link>
              </div>
              {latestMovies.length > 0 ? (
                <MovieCarousel movies={latestMovies} />
              ) : (
                <p className="text-gray-600 text-center py-8">No movies yet.</p>
              )}
            </section>

            {/* Featured */}
            {featuredMovies.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-1 h-6 bg-red-600 rounded-sm block" />
                    <h2 className="text-lg font-bold text-white">Featured</h2>
                  </div>
                  <Link href="/movies" className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded transition">
                    SEE ALL
                  </Link>
                </div>
                <MovieCarousel movies={featuredMovies} />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <HomeSidebar latestUpdates={latestMovies} />
          </div>
        </div>
      </div>

      {/* ── SECTION 2: Features ── */}
      <section className="border-t border-zinc-900 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Why <span className="text-red-500">Recape</span> Movie?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Everything you need to explore, rate, and track movies — all in one place.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🎬', title: 'Huge Library', desc: 'Thousands of movies and series across all genres, from classics to latest releases.' },
              { icon: '⭐', title: 'Honest Reviews', desc: 'Real reviews from real movie lovers. Rate on a 1–10 scale with spoiler warnings.' },
              { icon: '📋', title: 'Personal Watchlist', desc: 'Save movies you want to watch and never lose track of your next favorite film.' },
              { icon: '💎', title: 'Premium Access', desc: 'Unlock exclusive premium content with 1080p & 4K quality at affordable prices.' },
            ].map((f) => (
              <div key={f.title} className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-center hover:border-red-600/60 transition group">
                <div className="w-14 h-14 bg-red-600/10 border border-red-600/20 rounded-xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:bg-red-600/20 transition">
                  {f.icon}
                </div>
                <h3 className="text-white font-bold mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Pricing ── */}
      <section className="bg-zinc-950 border-t border-zinc-900 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">💎 Choose Your Plan</h2>
            <p className="text-gray-500">Unlock premium content with our affordable plans</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      <span className="text-red-500 font-bold">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`block text-center py-2.5 rounded-lg font-bold transition ${plan.btn}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Testimonials ── */}
      <section className="border-t border-zinc-900 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">What Our Members Say</h2>
            <p className="text-gray-500">Thousands of movie lovers trust Recape Movie</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Arifur Rahman',
                avatar: 'A',
                rating: 5,
                text: '"Recape Movie helped me discover so many hidden gems. The review system is spot on and the watchlist feature keeps me organized!"',
              },
              {
                name: 'Nusrat Jahan',
                avatar: 'N',
                rating: 5,
                text: '"I love how clean and fast the site is. Premium subscription is totally worth it — the 4K quality is stunning!"',
              },
              {
                name: 'Tanvir Hossain',
                avatar: 'T',
                rating: 4,
                text: '"The community reviews are honest and helpful. I always check Recape before watching anything new. Best movie platform!"',
              },
            ].map((t) => (
              <div key={t.name} className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 hover:border-red-900/60 transition">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-5 italic">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-red-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <span className="text-white text-sm font-semibold">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: Call to Action ── */}
      <section className="border-t border-zinc-900 py-20 px-4 bg-gradient-to-b from-black via-red-950/20 to-black">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">Ready to dive in?</h2>
          <p className="text-gray-400 text-lg mb-8">Create your free account and start discovering amazing movies today.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/register"
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-3 rounded-lg text-lg transition shadow-lg shadow-red-900/30"
            >
              Get Started Free
            </Link>
            <Link
              href="/movies"
              className="border border-zinc-700 hover:border-zinc-500 text-gray-300 hover:text-white font-bold px-8 py-3 rounded-lg text-lg transition"
            >
              Browse Movies
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
