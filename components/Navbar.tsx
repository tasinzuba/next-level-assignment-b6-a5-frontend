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
    <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-yellow-400 hover:text-yellow-300">
          🎬 MoviePortal
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/movies" className="hover:text-yellow-400 transition">Movies</Link>
          {user && (
            <>
              <Link href="/watchlist" className="hover:text-yellow-400 transition">Watchlist</Link>
              <Link href="/subscription" className="hover:text-yellow-400 transition">Plans</Link>
            </>
          )}
          {user?.role === 'ADMIN' && (
            <Link href="/admin" className="hover:text-yellow-400 transition text-red-400">Admin</Link>
          )}
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="hover:text-yellow-400 transition">
                {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded text-sm transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link href="/login" className="hover:text-yellow-400 transition">Login</Link>
              <Link
                href="/register"
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-1.5 rounded text-sm font-semibold transition"
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
        <div className="md:hidden bg-gray-800 px-4 py-3 flex flex-col gap-3">
          <Link href="/movies" className="hover:text-yellow-400" onClick={() => setMenuOpen(false)}>Movies</Link>
          {user && (
            <Link href="/watchlist" className="hover:text-yellow-400" onClick={() => setMenuOpen(false)}>Watchlist</Link>
          )}
          {user?.role === 'ADMIN' && (
            <Link href="/admin" className="text-red-400" onClick={() => setMenuOpen(false)}>Admin</Link>
          )}
          {user ? (
            <>
              <Link href="/profile" className="hover:text-yellow-400" onClick={() => setMenuOpen(false)}>{user.name}</Link>
              <button onClick={handleLogout} className="text-left text-red-400">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-yellow-400" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/register" className="hover:text-yellow-400" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
