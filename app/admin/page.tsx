'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { DashboardStats } from '@/types';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'ADMIN') { router.push('/'); return; }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data.data);
    } catch {
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Movies', value: stats?.totalMovies ?? 0, icon: '🎬', href: '/admin/movies', color: 'from-blue-600/20 to-blue-600/5', border: 'border-blue-600/30', text: 'text-blue-400' },
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: '👥', href: '/admin/users', color: 'from-emerald-600/20 to-emerald-600/5', border: 'border-emerald-600/30', text: 'text-emerald-400' },
    { label: 'Total Reviews', value: stats?.totalReviews ?? 0, icon: '⭐', href: '/admin/reviews', color: 'from-yellow-600/20 to-yellow-600/5', border: 'border-yellow-600/30', text: 'text-yellow-400' },
    { label: 'Pending Reviews', value: stats?.pendingReviews ?? 0, icon: '⏳', href: '/admin/reviews', color: 'from-red-600/20 to-red-600/5', border: 'border-red-600/30', text: 'text-red-400' },
    { label: 'Subscriptions', value: stats?.activeSubscriptions ?? 0, icon: '💎', href: '/admin/users', color: 'from-purple-600/20 to-purple-600/5', border: 'border-purple-600/30', text: 'text-purple-400' },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back, {user?.name}. Here&apos;s what&apos;s happening.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="bg-zinc-900 h-28 rounded-xl animate-pulse" />)
          : statCards.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className={`bg-gradient-to-b ${s.color} border ${s.border} rounded-xl p-5 hover:scale-[1.02] transition-transform`}
              >
                <p className="text-2xl mb-2">{s.icon}</p>
                <p className={`text-3xl font-bold ${s.text}`}>{s.value.toLocaleString()}</p>
                <p className="text-gray-400 text-xs mt-1 leading-tight">{s.label}</p>
              </Link>
            ))}
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/movies" className="group bg-zinc-950 border border-zinc-800 hover:border-red-600 rounded-xl p-6 transition-all">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-blue-600/10 border border-blue-600/30 rounded-lg flex items-center justify-center text-2xl">🎬</div>
              <div>
                <h3 className="font-bold text-white group-hover:text-red-400 transition">Manage Movies</h3>
                <p className="text-gray-500 text-xs">Add, edit, delete movies</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">{loading ? '...' : `${stats?.totalMovies ?? 0} movies in database`}</p>
          </Link>
          <Link href="/admin/reviews" className="group bg-zinc-950 border border-zinc-800 hover:border-red-600 rounded-xl p-6 transition-all">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-red-600/10 border border-red-600/30 rounded-lg flex items-center justify-center text-2xl">✅</div>
              <div>
                <h3 className="font-bold text-white group-hover:text-red-400 transition">Moderate Reviews</h3>
                <p className="text-gray-500 text-xs">Approve or reject reviews</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              <span className="text-yellow-400 font-semibold">{loading ? '...' : `${stats?.pendingReviews ?? 0} pending`}</span> reviews awaiting action
            </p>
          </Link>
          <Link href="/admin/users" className="group bg-zinc-950 border border-zinc-800 hover:border-red-600 rounded-xl p-6 transition-all">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-emerald-600/10 border border-emerald-600/30 rounded-lg flex items-center justify-center text-2xl">👥</div>
              <div>
                <h3 className="font-bold text-white group-hover:text-red-400 transition">Manage Users</h3>
                <p className="text-gray-500 text-xs">View and manage user roles</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">{loading ? '...' : `${stats?.totalUsers ?? 0} registered users`}</p>
          </Link>
        </div>
      </div>

      {!loading && (stats?.pendingReviews ?? 0) > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex flex-wrap items-center gap-4">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p className="text-yellow-400 font-semibold">
              {stats?.pendingReviews} review{(stats?.pendingReviews ?? 0) > 1 ? 's' : ''} waiting for moderation
            </p>
            <p className="text-gray-400 text-sm">Review submissions need your approval before they go live.</p>
          </div>
          <Link href="/admin/reviews" className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap">
            Review Now →
          </Link>
        </div>
      )}
    </div>
  );
}
