import Link from 'next/link';

const GENRES = ['Action', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Sci-Fi', 'Animation', 'Crime'];

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 text-gray-400 mt-16">
      {/* Top accent */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent" />

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4 hover:opacity-80 transition">
              <img src="/logo.svg" alt="Recape Movie" className="h-12" />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Your ultimate destination for discovering, rating, and reviewing movies and TV series.
            </p>
            <div className="flex gap-3">
              {/* Social icons */}
              {[
                { label: 'Facebook', path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                { label: 'Twitter', path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                { label: 'Instagram', path: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 19.5h11a3 3 0 003-3v-11a3 3 0 00-3-3h-11a3 3 0 00-3 3v11a3 3 0 003 3z' },
              ].map((s) => (
                <button key={s.label} aria-label={s.label} className="w-8 h-8 bg-zinc-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition">
                  <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.path} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/movies', label: 'Browse Movies' },
                { href: '/subscription', label: 'Subscription Plans' },
                { href: '/watchlist', label: 'My Watchlist' },
                { href: '/my-reviews', label: 'My Reviews' },
                { href: '/about', label: 'About Us' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-500 hover:text-red-400 transition text-sm flex items-center gap-1.5">
                    <span className="text-red-600 text-xs">›</span> {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Genres</h4>
            <ul className="space-y-2.5">
              {GENRES.map((g) => (
                <li key={g}>
                  <Link href={`/movies?genre=${encodeURIComponent(g)}`} className="text-gray-500 hover:text-red-400 transition text-sm flex items-center gap-1.5">
                    <span className="text-red-600 text-xs">›</span> {g}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Join */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Join the Community</h4>
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">
              Create a free account to rate movies, write reviews, and build your personal watchlist.
            </p>
            <Link
              href="/register"
              className="inline-block bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition shadow-md shadow-red-900/30"
            >
              Sign Up Free
            </Link>
            <div className="mt-6 space-y-1.5">
              {[
                { icon: '🎬', text: '500+ Movies & Series' },
                { icon: '⭐', text: '2K+ Community Reviews' },
                { icon: '👥', text: '1K+ Active Members' },
              ].map((s) => (
                <p key={s.text} className="text-gray-600 text-xs flex items-center gap-2">
                  <span>{s.icon}</span> {s.text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} <span className="text-red-500 font-semibold">Recape</span> Movie. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-gray-400 transition">About</Link>
            <span>·</span>
            <Link href="/subscription" className="hover:text-gray-400 transition">Plans</Link>
            <span>·</span>
            <Link href="/register" className="hover:text-gray-400 transition">Sign Up</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
