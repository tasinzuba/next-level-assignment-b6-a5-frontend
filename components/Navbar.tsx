'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api';

const GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Thriller', 'Sci-Fi', 'Romance', 'Animation', 'Crime', 'Documentary'];

interface SearchResult {
  id: string;
  title: string;
  thumbnail?: string;
  releaseYear: number;
  mediaType?: string;
}

export default function Navbar() {
  const { user, logout, initAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { initAuth(); }, [initAuth]);
  useEffect(() => { setMenuOpen(false); setUserOpen(false); setAdminOpen(false); setSearchOpen(false); }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setUserOpen(false);
        setAdminOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Live search debounce
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }
    searchTimer.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await api.get('/movies', { params: { search: searchQuery.trim(), limit: 6 } });
        setSearchResults(res.data.data || []);
        setSearchOpen(true);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  }, [searchQuery]);

  const handleLogout = () => { logout(); router.push('/'); };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleResultClick = (id: string) => {
    setSearchQuery('');
    setSearchOpen(false);
    router.push(`/movies/${id}`);
  };

  const chevron = (isOpen: boolean) => (
    <svg className={`w-3 h-3 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  // Hover dropdown component
  const HoverDropdown = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="relative group">
      <button className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition text-gray-300 hover:text-white hover:bg-zinc-800/40 group-hover:text-white group-hover:bg-zinc-800/40`}>
        {label}
        <svg className="w-3 h-3 ml-1 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
        {children}
      </div>
    </div>
  );

  return (
    <nav ref={navRef} className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-zinc-950/97 backdrop-blur-md shadow-lg shadow-black/50' : 'bg-zinc-950'} border-b border-zinc-800/80`}>
      {/* Red accent line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">

        {/* Logo — left */}
        <Link href="/" className="flex-shrink-0 hover:opacity-85 transition">
          <img src="/logo.svg" alt="Recape" className="h-9" />
        </Link>

        {/* ── Desktop Nav — CENTER ── */}
        <div className="hidden md:flex items-center justify-center gap-1 flex-1">

          {/* Movies hover dropdown */}
          <HoverDropdown label="Movies">
            <div className="w-44 bg-zinc-900 border border-zinc-700/70 rounded-xl shadow-2xl shadow-black/60 py-1.5">
              <Link href="/movies" className="px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-zinc-800/70 transition block">
                All Movies
              </Link>
              <Link href="/movies?mediaType=MOVIE" className="px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-zinc-800/70 transition block">
                Movies Only
              </Link>
              <Link href="/movies?mediaType=SERIES" className="px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-zinc-800/70 transition block">
                Series
              </Link>
              <div className="border-t border-zinc-800 my-1" />
              <Link href="/movies?priceType=FREE" className="px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-zinc-800/70 transition block">
                Free
              </Link>
              <Link href="/movies?priceType=PREMIUM" className="px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-zinc-800/70 transition block">
                Premium
              </Link>
            </div>
          </HoverDropdown>

          {/* Genres hover dropdown */}
          <HoverDropdown label="Genres">
            <div className="w-48 bg-zinc-900 border border-zinc-700/70 rounded-xl shadow-2xl shadow-black/60 py-1.5">
              {GENRES.map((g) => (
                <Link key={g} href={`/movies?genre=${encodeURIComponent(g)}`} className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-zinc-800/70 transition block">
                  {g}
                </Link>
              ))}
            </div>
          </HoverDropdown>

          {/* Special Categories hover dropdown */}
          <HoverDropdown label="Special Categories">
            <div className="w-52 bg-zinc-900 border border-zinc-700/70 rounded-xl shadow-2xl shadow-black/60 py-1.5">
              <Link href="/movies?sort=releaseYear&order=desc" className="px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-zinc-800/70 transition block">
                Newest Releases
              </Link>
              <Link href="/movies?sort=createdAt&order=desc" className="px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-zinc-800/70 transition block">
                Recently Added
              </Link>
              <Link href="/movies?priceType=FREE&sort=createdAt&order=desc" className="px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-zinc-800/70 transition block">
                Free to Watch
              </Link>
              <div className="border-t border-zinc-800 my-1" />
              <Link href="/subscription" className="px-4 py-2.5 text-sm text-yellow-400 hover:text-yellow-300 hover:bg-zinc-800/70 transition block">
                Premium Content
              </Link>
            </div>
          </HoverDropdown>

          <Link href="/about" className={`px-3 py-2 text-sm font-medium rounded-md transition ${pathname === '/about' ? 'text-white bg-zinc-800/60' : 'text-gray-300 hover:text-white hover:bg-zinc-800/40'}`}>
            About
          </Link>

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

          {/* Admin hover dropdown */}
          {user?.role === 'ADMIN' && (
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition text-gray-300 hover:text-white hover:bg-zinc-800/40 group-hover:text-white group-hover:bg-zinc-800/40">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                Admin
                <svg className="w-3 h-3 ml-0.5 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                <div className="w-48 bg-zinc-900 border border-zinc-700/70 rounded-xl shadow-2xl shadow-black/60 py-1.5">
                  {[
                    { href: '/admin', label: 'Dashboard' },
                    { href: '/admin/movies', label: 'Movies' },
                    { href: '/admin/reviews', label: 'Reviews' },
                    { href: '/admin/users', label: 'Users' },
                  ].map((item) => (
                    <Link key={item.href} href={item.href} className={`block px-4 py-2.5 text-sm transition hover:bg-zinc-800/70 ${pathname === item.href ? 'text-red-400' : 'text-gray-300 hover:text-white'}`}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Search + Auth ── */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          {/* Live search */}
          <div ref={searchRef} className="relative">
            <form onSubmit={handleSearch} className="flex items-center bg-zinc-800/60 border border-zinc-700/60 rounded-lg overflow-hidden hover:border-zinc-600 focus-within:border-red-500 transition">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
                placeholder="Search..."
                className="bg-transparent text-white text-sm px-3 py-1.5 w-36 focus:outline-none placeholder:text-gray-500 focus:w-52 transition-all duration-300"
              />
              <button type="submit" className="px-2.5 py-1.5 text-gray-400 hover:text-white transition">
                {searchLoading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
            </form>

            {/* Live results dropdown */}
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute right-0 top-full mt-1.5 w-72 bg-zinc-900 border border-zinc-700/70 rounded-xl shadow-2xl shadow-black/60 py-1.5 z-50">
                {searchResults.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleResultClick(r.id)}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-zinc-800/70 transition"
                  >
                    {r.thumbnail ? (
                      <img src={r.thumbnail} alt={r.title} className="w-8 h-11 object-cover rounded border border-zinc-700 flex-shrink-0" />
                    ) : (
                      <div className="w-8 h-11 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center text-sm flex-shrink-0">🎬</div>
                    )}
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{r.title}</p>
                      <p className="text-gray-500 text-xs">{r.releaseYear} · {r.mediaType === 'SERIES' ? 'Series' : 'Movie'}</p>
                    </div>
                  </button>
                ))}
                <div className="border-t border-zinc-800 mt-1 pt-1 px-3 py-1.5">
                  <button onClick={handleSearch} className="text-xs text-red-400 hover:text-red-300 transition">
                    See all results for &quot;{searchQuery}&quot; →
                  </button>
                </div>
              </div>
            )}
          </div>

          {user ? (
            <div className="relative">
              <button onClick={() => setUserOpen(!userOpen)} className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-zinc-800/60 transition">
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-white font-bold text-sm ring-2 ring-red-600/30">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-300 max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                {chevron(userOpen)}
              </button>
              {userOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-56 bg-zinc-900 border border-zinc-700/70 rounded-xl shadow-2xl shadow-black/60 py-1.5 z-50">
                  <div className="px-4 py-3 border-b border-zinc-800">
                    <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{user.role}</p>
                  </div>
                  {[
                    { href: '/profile', label: 'My Profile' },
                    { href: '/watchlist', label: 'My Watchlist' },
                    { href: '/my-reviews', label: 'My Reviews' },
                    { href: '/subscription', label: 'Subscription' },
                  ].map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setUserOpen(false)} className={`block px-4 py-2.5 text-sm transition hover:bg-zinc-800/70 ${pathname === item.href ? 'text-red-400' : 'text-gray-300 hover:text-white'}`}>
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-zinc-800 mt-1 pt-1">
                    <button onClick={() => { setUserOpen(false); handleLogout(); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-800/70 transition">
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
        <button className="md:hidden flex items-center justify-center w-9 h-9 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition ml-auto" onClick={() => setMenuOpen(!menuOpen)}>
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
