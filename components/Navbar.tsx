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
  const [scrolled, setScrolled] = useState(false);
  const adminRef = useRef<HTMLDivElement>(null);

  useEffect(() => { initAuth(); }, [initAuth]);
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) {
        setAdminOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

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
          {[
            { href: '/movies', label: 'Movies' },
            ...(user ? [
              { href: '/watchlist', label: 'Watchlist' },
              { href: '/my-reviews', label: 'My Reviews' },
              { href: '/subscription', label: 'Plans' },
            ] : []),
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
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

        {/* Right: search + auth */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          {/* Search icon */}
          <Link href="/movies" className="p-2 text-gray-400 hover:text-white transition rounded-lg hover:bg-zinc-800">
            <svg className="w-4.5 h-4.5 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>

          {user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-zinc-800/80 transition group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md shadow-red-900/30 ring-2 ring-red-600/30">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-300 group-hover:text-white transition max-w-[100px] truncate">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-zinc-800 border border-zinc-700/60 transition"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-1.5 text-sm text-gray-300 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-lg transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition shadow-md shadow-red-900/30"
              >
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
          <Link href="/movies" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${isActive('/movies') ? 'text-white bg-zinc-800' : 'text-gray-400 hover:text-white hover:bg-zinc-800/60'}`}>
            🎬 Movies
          </Link>
          {user && (
            <>
              <Link href="/watchlist" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${isActive('/watchlist') ? 'text-white bg-zinc-800' : 'text-gray-400 hover:text-white hover:bg-zinc-800/60'}`}>
                📋 Watchlist
              </Link>
              <Link href="/my-reviews" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${isActive('/my-reviews') ? 'text-white bg-zinc-800' : 'text-gray-400 hover:text-white hover:bg-zinc-800/60'}`}>
                ⭐ My Reviews
              </Link>
              <Link href="/subscription" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${isActive('/subscription') ? 'text-white bg-zinc-800' : 'text-gray-400 hover:text-white hover:bg-zinc-800/60'}`}>
                💎 Plans
              </Link>
            </>
          )}
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
                <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-zinc-800/60 transition text-sm">
                  <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {user.name}
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-400 hover:bg-zinc-800/60 transition text-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-zinc-800/60 transition text-sm">Login</Link>
                <Link href="/register" className="block px-3 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition text-sm text-center mt-1">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
