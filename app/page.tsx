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
    <div className="bg-white dark:bg-black min-h-screen">

      {/* ── SECTION 1: Hero + Sidebar ── */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <div className="flex-1 min-w-0 space-y-8">
            <HeroSlider movies={heroMovies} />

            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-1 h-6 bg-red-600 rounded-sm block" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Latest Movies</h2>
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

            {featuredMovies.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-1 h-6 bg-red-600 rounded-sm block" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Featured</h2>
                  </div>
                  <Link href="/movies" className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded transition">
                    SEE ALL
                  </Link>
                </div>
                <MovieCarousel movies={featuredMovies} />
              </section>
            )}
          </div>

          <div className="hidden lg:block w-72 flex-shrink-0">
            <HomeSidebar latestUpdates={latestMovies} />
          </div>
        </div>
      </div>

      {/* ── SECTION 2: Features ── */}
      <section className="bg-gray-50 dark:bg-zinc-950/50 border-t border-gray-100 dark:border-zinc-900 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-red-500 text-sm font-semibold tracking-wide uppercase mb-2">Why Choose Us</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Why <span className="text-red-500">Recape</span> Movie?</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">Everything you need to explore, rate, and track movies — all in one place.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z', title: 'Huge Library', desc: 'Thousands of movies and series across all genres, from classics to latest releases.' },
              { icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', title: 'Honest Reviews', desc: 'Real reviews from real movie lovers. Rate on a 1-10 scale with spoiler warnings.' },
              { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', title: 'Personal Watchlist', desc: 'Save movies you want to watch and never lose track of your next favorite film.' },
              { icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', title: 'Premium Access', desc: 'Unlock exclusive premium content with 1080p & 4K quality at affordable prices.' },
            ].map((f) => (
              <div key={f.title} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 text-center">
                <div className="w-14 h-14 bg-red-500/10 dark:bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                </div>
                <h3 className="text-gray-900 dark:text-white font-bold mb-2">{f.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Pricing ── */}
      <section className="bg-white dark:bg-black border-t border-gray-100 dark:border-zinc-900 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-red-500 text-sm font-semibold tracking-wide uppercase mb-2">Pricing</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Choose Your Plan</h2>
            <p className="text-gray-500 dark:text-gray-400">Unlock premium content with our affordable plans</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'forever',
                features: ['Access free movies', 'Write reviews', 'Build watchlist', 'Basic search'],
                btn: 'bg-gray-800 hover:bg-gray-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white',
                href: '/register',
              },
              {
                name: 'Monthly',
                price: '$9.99',
                period: 'per month',
                features: ['All free features', 'Access premium movies', '1080p streaming', 'Priority support'],
                btn: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/25',
                href: '/subscription',
                popular: true,
              },
              {
                name: 'Yearly',
                price: '$79.99',
                period: 'per year',
                features: ['All monthly features', '4K Ultra HD', 'Download offline', 'Early access titles'],
                btn: 'bg-gray-800 hover:bg-gray-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white',
                href: '/subscription',
              },
            ].map((plan) => (
              <div key={plan.name} className={`relative bg-white dark:bg-zinc-900 border ${plan.popular ? 'border-red-500/50' : 'border-gray-100 dark:border-zinc-800'} rounded-2xl p-7 flex flex-col`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-20 shadow-sm">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <div className="mt-3 mb-5">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-gray-500 text-sm ml-2">/{plan.period}</span>
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-gray-600 dark:text-gray-400 text-sm">
                      <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`w-full py-3 rounded-xl font-bold text-center transition block ${plan.btn}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Testimonials ── */}
      <section className="bg-gray-50 dark:bg-zinc-950/50 border-t border-gray-100 dark:border-zinc-900 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-red-500 text-sm font-semibold tracking-wide uppercase mb-2">Testimonials</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">What Our Members Say</h2>
            <p className="text-gray-500 dark:text-gray-400">Thousands of movie lovers trust Recape Movie</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: 'Arifur Rahman', avatar: 'A', rating: 5, text: '"Recape Movie helped me discover so many hidden gems. The review system is spot on and the watchlist feature keeps me organized!"' },
              { name: 'Nusrat Jahan', avatar: 'N', rating: 5, text: '"I love how clean and fast the site is. Premium subscription is totally worth it — the 4K quality is stunning!"' },
              { name: 'Tanvir Hossain', avatar: 'T', rating: 4, text: '"The community reviews are honest and helpful. I always check Recape before watching anything new. Best movie platform!"' },
            ].map((t) => (
              <div key={t.name} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < t.rating ? 'text-amber-400' : 'text-gray-200 dark:text-zinc-700'}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-5">{t.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
                  <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {t.avatar}
                  </div>
                  <span className="text-gray-900 dark:text-white text-sm font-semibold">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: Statistics ── */}
      <section className="bg-white dark:bg-black border-t border-gray-100 dark:border-zinc-900 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-red-500 text-sm font-semibold tracking-wide uppercase mb-2">Our Impact</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Recape in Numbers</h2>
            <p className="text-gray-500 dark:text-gray-400">Our growing community of movie enthusiasts</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z', number: '500+', label: 'Movies & Series' },
              { icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', number: '10K+', label: 'Reviews' },
              { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', number: '5K+', label: 'Active Members' },
              { icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', number: '50+', label: 'Genres' },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                  </svg>
                </div>
                <p className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">{stat.number}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: FAQ ── */}
      <section className="bg-gray-50 dark:bg-zinc-950/50 border-t border-gray-100 dark:border-zinc-900 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-red-500 text-sm font-semibold tracking-wide uppercase mb-2">FAQ</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-500 dark:text-gray-400">Got questions? We have answers.</p>
          </div>
          <div className="space-y-3">
            {[
              { q: 'How do I create an account?', a: 'Click the "Get Started Free" button and fill in your name, email, and password. You will receive a confirmation email to verify your account and start exploring movies right away.' },
              { q: 'Is Recape Movie free?', a: 'Yes! You can browse movies, write reviews, and build your watchlist completely free. We also offer premium plans for access to exclusive content and higher streaming quality.' },
              { q: 'How do I write a review?', a: 'Navigate to any movie page and scroll down to the review section. You can rate the movie on a 1-10 scale, write your thoughts, and mark your review as containing spoilers if needed.' },
              { q: 'What is Premium content?', a: 'Premium content includes exclusive movies and series available in 1080p and 4K Ultra HD quality. You can unlock premium content by subscribing to our Monthly or Yearly plan.' },
              { q: 'How do I cancel my subscription?', a: 'You can cancel your subscription at any time from your account settings under the "Subscription" tab. Your premium access will remain active until the end of your current billing period.' },
            ].map((item) => (
              <div key={item.q} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5">
                <h3 className="text-gray-900 dark:text-white font-semibold mb-2">{item.q}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: Newsletter ── */}
      <section className="bg-white dark:bg-black border-t border-gray-100 dark:border-zinc-900 py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-red-500 text-sm font-semibold tracking-wide uppercase mb-2">Stay Updated</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Get Movie Updates</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Get the latest movie reviews and recommendations in your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            />
            <button
              type="button"
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition text-sm whitespace-nowrap shadow-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* ── SECTION 8: CTA ── */}
      <section className="border-t border-gray-100 dark:border-zinc-900 py-24 px-4 bg-gradient-to-b from-gray-50 dark:from-zinc-950/50 via-red-50/50 dark:via-red-950/10 to-white dark:to-black">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Ready to dive in?</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">Create your free account and start discovering amazing movies today.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register" className="px-8 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition shadow-lg shadow-red-600/25 text-sm">
              Get Started Free
            </Link>
            <Link href="/movies" className="px-8 py-3.5 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-zinc-500 font-bold rounded-xl transition text-sm">
              Browse Movies
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
