import Link from 'next/link';
import CosmicButton from '@/components/CosmicButton';
import MovingBorderCard from '@/components/MovingBorderCard';

export default function AboutPage() {
  return (
    <div className="bg-black min-h-screen">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-red-950/30 to-black">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            About <span className="text-red-400">Recape</span> Movie
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            Your ultimate destination for discovering, rating, and reviewing movies and TV series.
            We connect passionate movie lovers who want to share their opinions and discover new content.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-1 h-8 bg-red-600 rounded-sm block" />
                <h2 className="text-2xl font-bold text-white">Our Mission</h2>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4">
                Whether you are looking for hidden gems or the latest blockbusters, our community-driven reviews
                and curated watchlists will help you find your next favorite film.
              </p>
              <p className="text-gray-400 leading-relaxed">
                We believe every movie deserves an honest review, and every viewer deserves a platform
                to share their perspective.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '500+', label: 'Movies & Series' },
                { value: '2K+', label: 'Reviews' },
                { value: '1K+', label: 'Members' },
                { value: '10+', label: 'Genres' },
              ].map((stat) => (
                <MovingBorderCard key={stat.label} className="bg-zinc-950 p-5 text-center" duration={3500}>
                  <p className="text-2xl font-extrabold text-red-400">{stat.value}</p>
                  <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                </MovingBorderCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Community Reviews', desc: 'Read honest reviews from real movie fans. Rate on a 1-10 scale with spoiler warnings.', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
              { title: 'Personal Watchlist', desc: 'Save movies you want to watch later and never lose track of your next favorite film.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
              { title: 'Premium Content', desc: 'Access exclusive premium movies with 1080p & 4K streaming at affordable prices.', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
            ].map((f) => (
              <MovingBorderCard key={f.title} className="bg-zinc-950 p-6 text-center" duration={3000}>
                <div className="w-12 h-12 bg-red-600/10 border border-red-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600/20 transition">
                  <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </MovingBorderCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-zinc-900 bg-gradient-to-b from-black via-red-950/20 to-black">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Join Our Community</h2>
          <p className="text-gray-400 mb-8">Create a free account and start discovering amazing movies today.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <CosmicButton href="/register" variant="primary">
              Get Started Free
            </CosmicButton>
            <CosmicButton href="/movies" variant="outline">
              Browse Movies
            </CosmicButton>
          </div>
        </div>
      </section>
    </div>
  );
}
