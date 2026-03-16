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
  const adminRef = useRef<HTMLDivElement>(null);

  useEffect(() => { initAuth(); }, [initAuth]);
  useEffect(() => { setMenuOpen(false); }, [pathname]);

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

  const linkClass = (href: string) =>
    `hover:text-red-400 transition text-sm ${pathname === href ? 'text-red-400 font-semibold' : 'text-gray-300'}`;

  return (
    <nav className="bg-black border-b border-zinc-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <img src="/logo.svg" alt="Recape Movie" className="h-10" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="/movies" className={`px-3 py-2 rounded-lg ${linkClass('/movies')}`}>Movies</Link>
          {user && (
            <>
              <Link href="/watchlist" className={`px-3 py-2 rounded-lg ${linkClass('/watchlist')}`}>Watchlist</Link>
              <Link href="/my-reviews" className={`px-3 py-2 rounded-lg ${linkClass('/my-reviews')}`}>My Reviews</Link>
              <Link href="/subscription" className={`px-3 py-2 rounded-lg ${linkClass('/subscription')}`}>Plans</Link>
            </>
          )}

          {/* Admin Dropdown */}
          {user?.role === 'ADMIN' && (
            <div className="relative" ref={adminRef}>
              <button
                onClick={() => setAdminOpen(!adminOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition ${pathname.startsWith('/admin') ? 'text-red-400 font-semibold' : 'text-gray-300 hover:text-red-400'}`}
              >
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                Admin
                <svg className={`w-3 h-3 transition-transform ${adminOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {adminOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl shadow-black/50 py-1 z-50">
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
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-zinc-800 ${pathname === item.href ? 'text-red-400' : 'text-gray-300'}`}
                    >
                      <span>{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/profile" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-24 truncate">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-4 py-1.5 rounded-lg text-sm text-gray-300 hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-300 hover:text-white transition px-3 py-1.5">Login</Link>
              <Link href="/register" className="bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-gray-400 hover:text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-zinc-950 border-t border-zinc-800 px-4 py-3 space-y-1">
          <Link href="/movies" className="block px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-zinc-800 transition text-sm">Movies</Link>
          {user && (
            <>
              <Link href="/watchlist" className="block px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-zinc-800 transition text-sm">Watchlist</Link>
              <Link href="/my-reviews" className="block px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-zinc-800 transition text-sm">My Reviews</Link>
              <Link href="/subscription" className="block px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-zinc-800 transition text-sm">Plans</Link>
            </>
          )}
          {user?.role === 'ADMIN' && (
            <div className="border-t border-zinc-800 pt-2 mt-2">
              <p className="px-3 py-1 text-xs text-gray-600 uppercase tracking-widest font-semibold">Admin</p>
              {[
                { href: '/admin', label: 'Dashboard' },
                { href: '/admin/movies', label: 'Movies' },
                { href: '/admin/reviews', label: 'Reviews' },
                { href: '/admin/users', label: 'Users' },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="block px-3 py-2.5 rounded-lg text-red-400 hover:bg-zinc-800 transition text-sm">
                  {item.label}
                </Link>
              ))}
            </div>
          )}
          <div className="border-t border-zinc-800 pt-2 mt-2">
            {user ? (
              <>
                <Link href="/profile" className="block px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-zinc-800 transition text-sm">{user.name}</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2.5 rounded-lg text-red-400 hover:bg-zinc-800 transition text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-zinc-800 transition text-sm">Login</Link>
                <Link href="/register" className="block px-3 py-2.5 rounded-lg text-red-400 font-semibold hover:bg-zinc-800 transition text-sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
