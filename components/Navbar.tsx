'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout, initAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const adminRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { initAuth(); }, [initAuth]);
  useEffect(() => { setMenuOpen(false); setAdminOpen(false); setUserOpen(false); }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) setAdminOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const NAV_LINKS = [
    { href: '/movies', label: 'Movies', icon: '🎬' },
    { href: '/about', label: 'About', icon: 'ℹ️' },
    ...(user ? [
      { href: '/watchlist', label: 'Watchlist', icon: '📋' },
      { href: '/my-reviews', label: 'My Reviews', icon: '⭐' },
      { href: '/subscription', label: 'Plans', icon: '💎' },
    ] : []),
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md shadow-lg shadow-black/50' : 'bg-black'} border-b border-zinc-800/80`}>
      {/* Top accent line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 hover:opacity-85 transition">
          <img src="/logo.svg" alt="Recape Movie" className="h-10" />
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                isActive(link.href) ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-red-500 rounded-full" />
              )}
            </Link>
          ))}

          {/* Admin Dropdown */}
          {user?.role === 'ADMIN' && (
            <div className="relative" ref={adminRef}>
              <button
                onClick={() => setAdminOpen(!adminOpen)}
                className={`relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${
                  pathname.startsWith('/admin') ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                Admin
                <svg className={`w-3.5 h-3.5 transition-transform ${adminOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                {pathname.startsWith('/admin') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-red-500 rounded-full" />
                )}
              </button>
              {adminOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-52 bg-zinc-900/95 backdrop-blur border border-zinc-700/80 rounded-xl shadow-2xl shadow-black/60 py-1.5 z-50">
                  <div className="px-3 pb-1.5 mb-1 border-b border-zinc-800">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Admin Panel</p>
                  </div>
                  {[
                    { href: '/admin', label: 'Dashboard', icon: '📊' },
                    { href: '/admin/movies', label: 'Movies', icon: '🎬' },
                    { href: '/admin/reviews', label: 'Reviews', icon: '⭐' },
                    { href: '/admin/users', label: 'Users', icon: '👥' },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setAdminOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-zinc-800/80 ${pathname === item.href ? 'text-red-400 bg-zinc-800/40' : 'text-gray-300'}`}
                    >
                      <span className="text-base">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right section */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">

          {/* Search */}
          <div className="relative" ref={searchRef}>
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="bg-zinc-900 text-white text-sm border border-zinc-700 rounded-lg px-3 py-1.5 w-44 focus:outline-none focus:border-red-500 transition-all"
                />
                <button type="submit" className="p-1.5 text-gray-400 hover:text-white">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} className="p-1.5 text-gray-500 hover:text-white">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-400 hover:text-white transition rounded-lg hover:bg-zinc-800"
                title="Search"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>

          {user ? (
            <>
              {/* Notification bell */}
              <Link href="/my-reviews" className="relative p-2 text-gray-400 hover:text-white transition rounded-lg hover:bg-zinc-800" title="My Reviews">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </Link>

              {/* User dropdown */}
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-zinc-800/80 transition"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md shadow-red-900/30 ring-2 ring-red-600/30">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-300 max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                  <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform ${userOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-900/95 backdrop-blur border border-zinc-700/80 rounded-xl shadow-2xl shadow-black/60 py-1.5 z-50">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-zinc-800">
                      <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                      <p className="text-gray-500 text-xs truncate mt-0.5">{user.email}</p>
                      <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-semibold ${user.role === 'ADMIN' ? 'bg-red-600/20 text-red-400 border border-red-600/30' : 'bg-zinc-700/50 text-gray-400 border border-zinc-600'}`}>
                        {user.role}
                      </span>
                    </div>

                    {[
                      { href: '/profile', label: 'My Profile', svg: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                      { href: '/watchlist', label: 'My Watchlist', svg: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' },
                      { href: '/my-reviews', label: 'My Reviews', svg: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
                      { href: '/subscription', label: 'Subscription', svg: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setUserOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-zinc-800/80 ${pathname === item.href ? 'text-red-400 bg-zinc-800/40' : 'text-gray-300 hover:text-white'}`}
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={item.svg} />
                        </svg>
                        {item.label}
                      </Link>
                    ))}

                    <div className="border-t border-zinc-800 mt-1 pt-1">
                      <button
                        onClick={() => { setUserOpen(false); handleLogout(); }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-800/80 transition"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
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
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
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
        <div className="md:hidden bg-zinc-950/98 backdrop-blur border-t border-zinc-800 px-4 py-3 space-y-0.5">
          {/* Mobile search */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="flex-1 bg-zinc-900 text-white text-sm border border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
            />
            <button type="submit" className="bg-red-600 hover:bg-red-500 text-white px-3 rounded-lg text-sm">
              Go
            </button>
          </form>

          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${isActive(link.href) ? 'text-white bg-zinc-800' : 'text-gray-400 hover:text-white hover:bg-zinc-800/60'}`}
            >
              {link.icon} {link.label}
            </Link>
          ))}

          {user?.role === 'ADMIN' && (
            <div className="border-t border-zinc-800 pt-2 mt-2">
              <p className="px-3 py-1 text-xs text-gray-600 uppercase tracking-widest font-semibold">Admin</p>
              {[
                { href: '/admin', label: 'Dashboard', icon: '📊' },
                { href: '/admin/movies', label: 'Movies', icon: '🎬' },
                { href: '/admin/reviews', label: 'Reviews', icon: '⭐' },
                { href: '/admin/users', label: 'Users', icon: '👥' },
              ].map((item) => (
                <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${pathname === item.href ? 'text-red-400 bg-zinc-800/60' : 'text-gray-400 hover:text-red-400 hover:bg-zinc-800/60'}`}>
                  <span>{item.icon}</span>{item.label}
                </Link>
              ))}
            </div>
          )}

          <div className="border-t border-zinc-800 pt-2 mt-2">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-white font-bold text-sm ring-2 ring-red-600/30">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{user.name}</p>
                    <p className="text-gray-500 text-xs">{user.role}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-400 hover:bg-zinc-800/60 transition text-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
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
