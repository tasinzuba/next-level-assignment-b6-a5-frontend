import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-white mb-6">About MoviePortal</h1>
      <p className="text-gray-300 leading-relaxed mb-4">
        MoviePortal is your ultimate destination for discovering, rating, and reviewing movies and TV series.
        Our platform connects passionate movie lovers who want to share their opinions and discover new content.
      </p>
      <p className="text-gray-300 leading-relaxed mb-8">
        Whether you are looking for hidden gems or the latest blockbusters, our community-driven reviews
        and curated watchlists will help you find your next favorite film.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { title: 'Community Reviews', desc: 'Read honest reviews from real movie fans', icon: '⭐' },
          { title: 'Personal Watchlist', desc: 'Save movies you want to watch later', icon: '📋' },
          { title: 'Premium Content', desc: 'Access exclusive premium movies with subscription', icon: '💎' },
        ].map((f) => (
          <div key={f.title} className="bg-gray-900 rounded-xl p-5 text-center">
            <p className="text-3xl mb-3">{f.icon}</p>
            <h3 className="font-bold text-white mb-1">{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <Link href="/register" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-lg transition">
          Join the Community
        </Link>
      </div>
    </div>
  );
}
