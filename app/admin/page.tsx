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
    { label: 'Total Movies', value: stats?.totalMovies ?? 0, icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z', href: '/admin/movies', color: 'from-blue-600/20 to-blue-600/5', border: 'border-blue-600/30', text: 'text-blue-400', iconColor: 'text-blue-400' },
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', href: '/admin/users', color: 'from-emerald-600/20 to-emerald-600/5', border: 'border-emerald-600/30', text: 'text-emerald-400', iconColor: 'text-emerald-400' },
    { label: 'Total Reviews', value: stats?.totalReviews ?? 0, icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', href: '/admin/reviews', color: 'from-yellow-600/20 to-yellow-600/5', border: 'border-yellow-600/30', text: 'text-yellow-400', iconColor: 'text-yellow-400' },
    { label: 'Pending Reviews', value: stats?.pendingReviews ?? 0, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', href: '/admin/reviews', color: 'from-red-600/20 to-red-600/5', border: 'border-red-600/30', text: 'text-red-400', iconColor: 'text-red-400' },
    { label: 'Subscriptions', value: stats?.activeSubscriptions ?? 0, icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', href: '/admin/users', color: 'from-purple-600/20 to-purple-600/5', border: 'border-purple-600/30', text: 'text-purple-400', iconColor: 'text-purple-400' },
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
                <svg className={`w-6 h-6 mb-2 ${s.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
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
              <div className="w-12 h-12 bg-blue-600/10 border border-blue-600/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-white group-hover:text-red-400 transition">Manage Movies</h3>
                <p className="text-gray-500 text-xs">Add, edit, delete movies</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">{loading ? '...' : `${stats?.totalMovies ?? 0} movies in database`}</p>
          </Link>
          <Link href="/admin/reviews" className="group bg-zinc-950 border border-zinc-800 hover:border-red-600 rounded-xl p-6 transition-all">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-red-600/10 border border-red-600/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
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
              <div className="w-12 h-12 bg-emerald-600/10 border border-emerald-600/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
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
          <svg className="w-6 h-6 text-yellow-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
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
