'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';

const GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Thriller', 'Sci-Fi', 'Romance', 'Animation', 'Crime', 'Documentary'];

type DropdownKey = 'movies' | 'genres' | 'special' | 'user' | 'admin' | null;

export default function Navbar() {
  const { user, logout, initAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState<DropdownKey>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => { initAuth(); }, [initAuth]);
  useEffect(() => { setMenuOpen(false); setOpen(null); }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggle = (key: DropdownKey) => setOpen((prev) => (prev === key ? null : key));

  const handleLogout = () => { logout(); router.push('/'); };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const chevron = (key: DropdownKey) => (
    <svg className={`w-3 h-3 ml-1 transition-transform ${open === key ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <nav ref={navRef} className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-zinc-950/97 backdrop-blur-md shadow-lg shadow-black/50' : 'bg-zinc-950'} border-b border-zinc-800/80`}>
      {/* Red accent line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 hover:opacity-85 transition">
          <img src="/logo.svg" alt="Recape" className="h-9" />
        </Link>

        {/* ── Desktop Nav ── */}
        <div className="hidden md:flex items-center gap-1 flex-1">

          {/* Movies dropdown */}
          <div className="relative">
            <button onClick={() => toggle('movies')} className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition ${open === 'movies' || pathname.startsWith('/movies') ? 'text-white bg-zinc-800/60' : 'text-gray-300 hover:text-white hover:bg-zinc-800/40'}`}>
              Movies {chevron('movies')}
            </button>
            {open === 'movies' && (
              <div className="absolute left-0 top-full mt-1.5 w-44 bg-zinc-900 border border-zinc-700/70 rounded-xl shadow-2xl shadow-black/60 py-1.5 z-50">
                <Link href="/movies" onClick={() => setOpen(null)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-zinc-800/70 transition">
                  <span className="text-red-400">🎬</span> All Movies
                </Link>
                <Link href="/movies?mediaType=MOVIE" onClick={() => setOpen(null)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-zinc-800/70 transition">
                  <span>🎥</span> Movies Only
                </Link>
                <Link href="/movies?mediaType=SERIES" onClick={() => setOpen(null)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-zinc-800/70 transition">
                  <span>📺</span> Series
                </Link>
                <div className="border-t border-zinc-800 my-1" />
                <Link href="/movies?priceType=FREE" onClick={() => setOpen(null)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-zinc-800/70 transition">
                  <span className="text-green-400">✓</span> Free
                </Link>
                <Link href="/movies?priceType=PREMIUM" onClick={() => setOpen(null)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-zinc-800/70 transition">
                  <span className="text-yellow-400">💎</span> Premium
                </Link>
              </div>
            )}
          </div>

          {/* Genres dropdown */}
          <div className="relative">
            <button onClick={() => toggle('genres')} className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition ${open === 'genres' ? 'text-white bg-zinc-800/60' : 'text-gray-300 hover:text-white hover:bg-zinc-800/40'}`}>
              Genres {chevron('genres')}
            </button>
            {open === 'genres' && (
              <div className="absolute left-0 top-full mt-1.5 w-48 bg-zinc-900 border border-zinc-700/70 rounded-xl shadow-2xl shadow-black/60 py-1.5 z-50">
                {GENRES.map((g) => (
                  <Link key={g} href={`/movies?genre=${encodeURIComponent(g)}`} onClick={() => setOpen(null)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-zinc-800/70 transition">
                    <span className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0" /> {g}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Special Categories dropdown */}
          <div className="relative">
            <button onClick={() => toggle('special')} className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition ${open === 'special' ? 'text-white bg-zinc-800/60' : 'text-gray-300 hover:text-white hover:bg-zinc-800/40'}`}>
              Special Categories {chevron('special')}
            </button>
            {open === 'special' && (
              <div className="absolute left-0 top-full mt-1.5 w-52 bg-zinc-900 border border-zinc-700/70 rounded-xl shadow-2xl shadow-black/60 py-1.5 z-50">
                <Link href="/movies?sort=releaseYear&order=desc" onClick={() => setOpen(null)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-zinc-800/70 transition">
                  <span>🆕</span> Newest Releases
                </Link>
                <Link href="/movies?sort=createdAt&order=desc" onClick={() => setOpen(null)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-zinc-800/70 transition">
                  <span>⏰</span> Recently Added
                </Link>
                <Link href="/movies?priceType=FREE&sort=createdAt&order=desc" onClick={() => setOpen(null)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-zinc-800/70 transition">
                  <span>🆓</span> Free to Watch
                </Link>
                <div className="border-t border-zinc-800 my-1" />
                <Link href="/subscription" onClick={() => setOpen(null)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-yellow-400 hover:text-yellow-300 hover:bg-zinc-800/70 transition">
                  <span>👑</span> Premium Content
                </Link>
              </div>
            )}
          </div>

          {/* Simple links */}
          <Link href="/about" className={`px-3 py-2 text-sm font-medium rounded-md transition ${pathname === '/about' ? 'text-white bg-zinc-800/60' : 'text-gray-300 hover:text-white hover:bg-zinc-800/40'}`}>
            About
          </Link>

          {/* User-only links */}
          {user && (
            <>
              <Link href="/watchlist" className={`px-3 py-2 text-sm font-medium rounded-md transition ${pathname === '/watchlist' ? 'text-white bg-zinc-800/60' : 'text-gray-300 hover:text-white hover:bg-zinc-800/40'}`}>
                Watchlist
              </Link>
              <Link href="/subscription" className={`px-3 py-2 text-sm font-medium rounded-md transition ${pathname === '/subscription' ? 'text-white bg-zinc-800/60' : 'text-gray-300 hover:text-white hover:bg-zinc-800/40'}`}>
                Plans
              </Link>
            </>
          )}

          {/* Admin dropdown */}
          {user?.role === 'ADMIN' && (
            <div className="relative">
              <button onClick={() => toggle('admin')} className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition ${open === 'admin' || pathname.startsWith('/admin') ? 'text-white bg-zinc-800/60' : 'text-gray-300 hover:text-white hover:bg-zinc-800/40'}`}>
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                Admin {chevron('admin')}
              </button>
              {open === 'admin' && (
                <div className="absolute left-0 top-full mt-1.5 w-48 bg-zinc-900 border border-zinc-700/70 rounded-xl shadow-2xl shadow-black/60 py-1.5 z-50">
                  {[
                    { href: '/admin', label: 'Dashboard', icon: '📊' },
                    { href: '/admin/movies', label: 'Movies', icon: '🎬' },
                    { href: '/admin/reviews', label: 'Reviews', icon: '⭐' },
                    { href: '/admin/users', label: 'Users', icon: '👥' },
                  ].map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setOpen(null)} className={`flex items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-zinc-800/70 ${pathname === item.href ? 'text-red-400' : 'text-gray-300 hover:text-white'}`}>
                      <span>{item.icon}</span> {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right: Search + Auth ── */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          {/* Always-visible search */}
          <form onSubmit={handleSearch} className="flex items-center bg-zinc-800/60 border border-zinc-700/60 rounded-lg overflow-hidden hover:border-zinc-600 focus-within:border-red-500 transition">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="bg-transparent text-white text-sm px-3 py-1.5 w-36 focus:outline-none placeholder:text-gray-500 focus:w-48 transition-all duration-300"
            />
            <button type="submit" className="px-2.5 py-1.5 text-gray-400 hover:text-white transition">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {user ? (
            <div className="relative" >
              <button onClick={() => toggle('user')} className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-zinc-800/60 transition">
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-white font-bold text-sm ring-2 ring-red-600/30">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-300 max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                {chevron('user')}
              </button>
              {open === 'user' && (
                <div className="absolute right-0 top-full mt-1.5 w-56 bg-zinc-900 border border-zinc-700/70 rounded-xl shadow-2xl shadow-black/60 py-1.5 z-50">
                  <div className="px-4 py-3 border-b border-zinc-800">
                    <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{user.role}</p>
                  </div>
                  {[
                    { href: '/profile', label: 'My Profile', icon: '👤' },
                    { href: '/watchlist', label: 'My Watchlist', icon: '📋' },
                    { href: '/my-reviews', label: 'My Reviews', icon: '⭐' },
                    { href: '/subscription', label: 'Subscription', icon: '💎' },
                  ].map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setOpen(null)} className={`flex items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-zinc-800/70 ${pathname === item.href ? 'text-red-400' : 'text-gray-300 hover:text-white'}`}>
                      <span>{item.icon}</span> {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-zinc-800 mt-1 pt-1">
                    <button onClick={() => { setOpen(null); handleLogout(); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-800/70 transition">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="px-4 py-1.5 text-sm text-gray-300 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-lg transition">
                Login
              </Link>
              <Link href="/register" className="px-4 py-1.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition shadow-md shadow-red-900/30">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden flex items-center justify-center w-9 h-9 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-zinc-950 border-t border-zinc-800 px-4 py-3 space-y-0.5">
          <form onSubmit={handleSearch} className="flex gap-2 mb-3">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search movies..." className="flex-1 bg-zinc-900 text-white text-sm border border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500" />
            <button type="submit" className="bg-red-600 hover:bg-red-500 text-white px-4 rounded-lg text-sm font-semibold">Go</button>
          </form>

          {[
            { href: '/movies', label: '🎬 All Movies' },
            { href: '/movies?mediaType=MOVIE', label: '🎥 Movies' },
            { href: '/movies?mediaType=SERIES', label: '📺 Series' },
            { href: '/movies?priceType=FREE', label: '🆓 Free' },
            { href: '/movies?priceType=PREMIUM', label: '💎 Premium' },
            { href: '/about', label: 'ℹ️ About' },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="flex items-center px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-zinc-800/60 transition">{l.label}</Link>
          ))}

          {/* Genres mobile */}
          <div className="border-t border-zinc-800 pt-2 mt-2">
            <p className="px-3 py-1 text-xs text-gray-600 uppercase tracking-widest font-semibold">Genres</p>
            <div className="grid grid-cols-2 gap-0.5">
              {GENRES.slice(0, 8).map((g) => (
                <Link key={g} href={`/movies?genre=${encodeURIComponent(g)}`} className="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-zinc-800/60 rounded-lg transition">{g}</Link>
              ))}
            </div>
          </div>

          {user && (
            <div className="border-t border-zinc-800 pt-2 mt-2">
              {[
                { href: '/watchlist', label: '📋 Watchlist' },
                { href: '/my-reviews', label: '⭐ My Reviews' },
                { href: '/subscription', label: '💎 Plans' },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="flex items-center px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-zinc-800/60 transition">{l.label}</Link>
              ))}
            </div>
          )}

          {user?.role === 'ADMIN' && (
            <div className="border-t border-zinc-800 pt-2 mt-2">
              <p className="px-3 py-1 text-xs text-gray-600 uppercase tracking-widest font-semibold">Admin</p>
              {[
                { href: '/admin', label: '📊 Dashboard' },
                { href: '/admin/movies', label: '🎬 Movies' },
                { href: '/admin/reviews', label: '⭐ Reviews' },
                { href: '/admin/users', label: '👥 Users' },
              ].map((l) => (
                <Link key={l.href} href={l.href} className={`flex items-center px-3 py-2.5 rounded-lg text-sm transition ${pathname === l.href ? 'text-red-400 bg-zinc-800/60' : 'text-gray-400 hover:text-red-400 hover:bg-zinc-800/60'}`}>{l.label}</Link>
              ))}
            </div>
          )}

          <div className="border-t border-zinc-800 pt-2 mt-2">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-white font-bold text-sm">{user.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <p className="text-white text-sm font-semibold">{user.name}</p>
                    <p className="text-gray-500 text-xs">{user.role}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-400 hover:bg-zinc-800/60 transition text-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-zinc-800/60 transition text-sm">Login</Link>
                <Link href="/register" className="block px-3 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition text-sm text-center mt-1">Sign Up Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
