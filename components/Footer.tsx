import Link from 'next/link';

const GENRES = ['Action', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Sci-Fi', 'Animation', 'Crime'];

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-gray-400 mt-16">
      {/* Top accent */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent" />

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 hover:opacity-80 transition">
              <img src="/logo.svg" alt="Recape Movie" className="h-12" />
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Rec<span className="text-red-500">ape</span></span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Your ultimate destination for discovering, rating, and reviewing movies and TV series.
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/jubayerahamed82" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-8 h-8 bg-gray-200 dark:bg-zinc-800 hover:bg-red-600 dark:hover:bg-red-600 rounded-lg flex items-center justify-center transition">
                <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a href="https://github.com/tasinzuba" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="w-8 h-8 bg-gray-200 dark:bg-zinc-800 hover:bg-red-600 dark:hover:bg-red-600 rounded-lg flex items-center justify-center transition">
                <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/movies', label: 'Browse Movies' },
                { href: '/subscription', label: 'Subscription Plans' },
                { href: '/watchlist', label: 'My Watchlist' },
                { href: '/my-reviews', label: 'My Reviews' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-500 hover:text-red-400 transition text-sm flex items-center gap-1.5">
                    <span className="text-red-500 text-xs">›</span> {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-bold text-sm uppercase tracking-wider mb-4">Genres</h4>
            <ul className="space-y-2.5">
              {GENRES.map((g) => (
                <li key={g}>
                  <Link href={`/movies?genre=${encodeURIComponent(g)}`} className="text-gray-500 hover:text-red-400 transition text-sm flex items-center gap-1.5">
                    <span className="text-red-500 text-xs">›</span> {g}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Join */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-bold text-sm uppercase tracking-wider mb-4">Join the Community</h4>
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
                '500+ Movies & Series',
                '2K+ Community Reviews',
                '1K+ Active Members',
              ].map((text) => (
                <p key={text} className="text-gray-600 text-xs flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-600 rounded-full" /> {text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 dark:border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-600">
          <p>© {new Date().getFullYear()} <span className="text-red-400 font-semibold">Recape</span> Movie. All rights reserved.</p>
          <p>Made by <span className="text-red-400 font-semibold">Jubayer</span></p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-gray-400 transition">About</Link>
            <span>·</span>
            <Link href="/subscription" className="hover:text-gray-400 transition">Plans</Link>
            <span>·</span>
            <Link href="/register" className="hover:text-gray-400 transition">Sign Up</Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-gray-400 transition">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
