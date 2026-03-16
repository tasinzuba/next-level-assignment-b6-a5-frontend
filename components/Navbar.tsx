'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout, initAuth } = useAuthStore();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-black border-b border-red-900 text-white sticky top-0 z-50 shadow-lg shadow-red-950/30">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-red-500 hover:text-red-400">
          🎬 MoviePortal
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/movies" className="hover:text-red-400 transition">Movies</Link>
          {user && (
            <>
              <Link href="/watchlist" className="hover:text-red-400 transition">Watchlist</Link>
              <Link href="/my-reviews" className="hover:text-red-400 transition">My Reviews</Link>
              <Link href="/subscription" className="hover:text-red-400 transition">Plans</Link>
            </>
          )}
          {user?.role === 'ADMIN' && (
            <Link href="/admin" className="text-red-500 hover:text-red-400 transition font-semibold">Admin</Link>
          )}
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="hover:text-red-400 transition">
                {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-700 hover:bg-red-600 px-4 py-1.5 rounded text-sm transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link href="/login" className="hover:text-red-400 transition">Login</Link>
              <Link
                href="/register"
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded text-sm font-semibold transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-zinc-950 border-t border-red-900 px-4 py-3 flex flex-col gap-3">
          <Link href="/movies" className="hover:text-red-400" onClick={() => setMenuOpen(false)}>Movies</Link>
          {user && (
            <>
              <Link href="/watchlist" className="hover:text-red-400" onClick={() => setMenuOpen(false)}>Watchlist</Link>
              <Link href="/my-reviews" className="hover:text-red-400" onClick={() => setMenuOpen(false)}>My Reviews</Link>
              <Link href="/subscription" className="hover:text-red-400" onClick={() => setMenuOpen(false)}>Plans</Link>
            </>
          )}
          {user?.role === 'ADMIN' && (
            <Link href="/admin" className="text-red-500" onClick={() => setMenuOpen(false)}>Admin</Link>
          )}
          {user ? (
            <>
              <Link href="/profile" className="hover:text-red-400" onClick={() => setMenuOpen(false)}>{user.name}</Link>
              <button onClick={handleLogout} className="text-left text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-red-400" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/register" className="hover:text-red-400" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
