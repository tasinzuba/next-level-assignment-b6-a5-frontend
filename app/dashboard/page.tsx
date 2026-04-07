'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function UserDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ watchlist: 0, reviews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [wRes, rRes] = await Promise.all([
          api.get('/watchlist'),
          api.get('/reviews/my'),
        ]);
        setStats({
          watchlist: wRes.data.data?.length || 0,
          reviews: rRes.data.data?.length || 0,
        });
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Watchlist', value: stats.watchlist, icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z', href: '/dashboard/watchlist', color: 'from-blue-600/20 to-blue-600/5', border: 'border-blue-600/30', text: 'text-blue-400' },
    { label: 'My Reviews', value: stats.reviews, icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', href: '/dashboard/reviews', color: 'from-yellow-600/20 to-yellow-600/5', border: 'border-yellow-600/30', text: 'text-yellow-400' },
    { label: 'Subscription', value: user?.subscription?.status === 'ACTIVE' ? 'Active' : 'Free', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', href: '/dashboard/subscription', color: 'from-emerald-600/20 to-emerald-600/5', border: 'border-emerald-600/30', text: 'text-emerald-400' },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-gray-100 dark:bg-zinc-900 h-28 rounded-xl animate-pulse" />)
          : cards.map((c) => (
              <Link key={c.label} href={c.href} className={`bg-gradient-to-b ${c.color} border ${c.border} rounded-xl p-5`}>
                <svg className={`w-6 h-6 mb-2 ${c.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={c.icon} />
                </svg>
                <p className={`text-3xl font-bold ${c.text}`}>{typeof c.value === 'number' ? c.value.toLocaleString() : c.value}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{c.label}</p>
              </Link>
            ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/movies" className="group bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 hover:border-red-600 rounded-xl p-6 transition-all">
          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-red-400 transition mb-2">Browse Movies</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Discover new movies and series to watch.</p>
        </Link>
        <Link href="/dashboard/profile" className="group bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 hover:border-red-600 rounded-xl p-6 transition-all">
          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-red-400 transition mb-2">Edit Profile</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Update your name and password.</p>
        </Link>
      </div>
    </div>
  );
}
