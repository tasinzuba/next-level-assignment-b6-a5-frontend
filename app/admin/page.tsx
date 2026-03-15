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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-gray-800 h-28 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Movies', value: stats?.totalMovies || 0, color: 'text-blue-400', icon: '🎬' },
    { label: 'Total Users', value: stats?.totalUsers || 0, color: 'text-green-400', icon: '👥' },
    { label: 'Total Reviews', value: stats?.totalReviews || 0, color: 'text-purple-400', icon: '⭐' },
    { label: 'Pending Reviews', value: stats?.pendingReviews || 0, color: 'text-yellow-400', icon: '⏳' },
    { label: 'Subscriptions', value: stats?.activeSubscriptions || 0, color: 'text-pink-400', icon: '💎' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {statCards.map((s) => (
          <div key={s.label} className="bg-gray-900 rounded-xl p-5 text-center">
            <p className="text-3xl mb-1">{s.icon}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-gray-400 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { href: '/admin/movies', label: 'Manage Movies', desc: 'Add, edit and delete movies', icon: '🎬', color: 'border-blue-500' },
          { href: '/admin/reviews', label: 'Approve Reviews', desc: 'Manage pending reviews', icon: '✅', color: 'border-yellow-500' },
          { href: '/admin/users', label: 'Manage Users', desc: 'View and manage user roles', icon: '👥', color: 'border-green-500' },
        ].map((card) => (
          <Link key={card.href} href={card.href} className={`bg-gray-900 border-l-4 ${card.color} rounded-xl p-6 hover:bg-gray-800 transition`}>
            <p className="text-3xl mb-3">{card.icon}</p>
            <h3 className="text-xl font-bold text-white">{card.label}</h3>
            <p className="text-gray-400 text-sm mt-1">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
