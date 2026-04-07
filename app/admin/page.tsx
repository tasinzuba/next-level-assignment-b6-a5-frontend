'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { DashboardStats, ChartData } from '@/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from 'recharts';

const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#f97316', '#06b6d4', '#ec4899'];

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'ADMIN') { router.push('/'); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [statsRes, chartRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/chart-data'),
      ]);
      setStats(statsRes.data.data);
      setChartData(chartRes.data.data);
    } catch {
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Movies', value: stats?.totalMovies ?? 0, change: '+12%', up: true, icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z', href: '/admin/movies', gradient: 'from-blue-500 to-blue-600', lightBg: 'bg-blue-50', lightText: 'text-blue-600', darkBg: 'dark:bg-blue-500/10', darkText: 'dark:text-blue-400' },
    { label: 'Total Users', value: stats?.totalUsers ?? 0, change: '+8%', up: true, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', href: '/admin/users', gradient: 'from-emerald-500 to-emerald-600', lightBg: 'bg-emerald-50', lightText: 'text-emerald-600', darkBg: 'dark:bg-emerald-500/10', darkText: 'dark:text-emerald-400' },
    { label: 'Total Reviews', value: stats?.totalReviews ?? 0, change: '+24%', up: true, icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', href: '/admin/reviews', gradient: 'from-amber-500 to-amber-600', lightBg: 'bg-amber-50', lightText: 'text-amber-600', darkBg: 'dark:bg-amber-500/10', darkText: 'dark:text-amber-400' },
    { label: 'Pending', value: stats?.pendingReviews ?? 0, change: 'action', up: false, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', href: '/admin/reviews', gradient: 'from-red-500 to-red-600', lightBg: 'bg-red-50', lightText: 'text-red-600', darkBg: 'dark:bg-red-500/10', darkText: 'dark:text-red-400' },
    { label: 'Subscriptions', value: stats?.activeSubscriptions ?? 0, change: '+5%', up: true, icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', href: '/admin/users', gradient: 'from-violet-500 to-violet-600', lightBg: 'bg-violet-50', lightText: 'text-violet-600', darkBg: 'dark:bg-violet-500/10', darkText: 'dark:text-violet-400' },
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 shadow-xl">
        {label && <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>}
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-semibold text-gray-900 dark:text-white">
            <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: p.color }} />
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  };

  const chartCardClass = "bg-white dark:bg-zinc-900/80 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm";

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Welcome back, {user?.name}. Here&apos;s your overview.</p>
        </div>
        <Link href="/admin/analytics" className="text-sm text-red-500 hover:text-red-400 font-medium transition hidden sm:block">
          View Full Analytics →
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900/80 border border-gray-100 dark:border-zinc-800 h-[120px] rounded-2xl animate-pulse" />
            ))
          : statCards.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="group bg-white dark:bg-zinc-900/80 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 lg:p-5 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${s.lightBg} ${s.darkBg} rounded-xl flex items-center justify-center`}>
                    <svg className={`w-5 h-5 ${s.lightText} ${s.darkText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                    </svg>
                  </div>
                  {s.change !== 'action' ? (
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${s.up ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
                      {s.up ? '↑' : '↓'} {s.change}
                    </span>
                  ) : (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                    </span>
                  )}
                </div>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{s.value.toLocaleString()}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 font-medium">{s.label}</p>
              </Link>
            ))}
      </div>

      {/* Charts */}
      {!loading && chartData && (
        <>
          {/* Row 1: Genre Bar + User Growth */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-6">
            <div className={`${chartCardClass} lg:col-span-4`}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Content by Genre</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Distribution across categories</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData.genreDistribution} barSize={24} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-zinc-800" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'currentColor' }} className="text-gray-400 dark:text-gray-500" angle={-35} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11, fill: 'currentColor' }} className="text-gray-400 dark:text-gray-500" allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Movies" radius={[6, 6, 0, 0]}>
                    {chartData.genreDistribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className={`${chartCardClass} lg:col-span-3`}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">User Growth</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Last 6 months</p>
                </div>
                <span className="text-xs font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">Trending ↑</span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData.userGrowth}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-zinc-800" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'currentColor' }} className="text-gray-400 dark:text-gray-500" />
                  <YAxis tick={{ fontSize: 11, fill: 'currentColor' }} className="text-gray-400 dark:text-gray-500" allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="users" stroke="#22c55e" strokeWidth={2.5} fill="url(#userGrad)" dot={{ fill: '#22c55e', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 2: Reviews Area + Status Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-6">
            <div className={`${chartCardClass} lg:col-span-4`}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Review Activity</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Last 6 months</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData.reviewGrowth}>
                  <defs>
                    <linearGradient id="reviewGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-zinc-800" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'currentColor' }} className="text-gray-400 dark:text-gray-500" />
                  <YAxis tick={{ fontSize: 11, fill: 'currentColor' }} className="text-gray-400 dark:text-gray-500" allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="reviews" stroke="#3b82f6" strokeWidth={2.5} fill="url(#reviewGrad)" dot={{ fill: '#3b82f6', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className={`${chartCardClass} lg:col-span-3`}>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Review Status</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Current distribution</p>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={chartData.reviewStatus}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={85}
                    paddingAngle={4} dataKey="value"
                    strokeWidth={0}
                  >
                    {chartData.reviewStatus.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 -mt-2">
                {chartData.reviewStatus.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{s.name}</span>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Two small distribution charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <div className={chartCardClass}>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Content Type</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Movies vs Series</p>
              </div>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={160}>
                  <PieChart>
                    <Pie data={chartData.mediaTypeDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value" strokeWidth={0}>
                      {chartData.mediaTypeDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {chartData.mediaTypeDistribution.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{item.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={chartCardClass}>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Access Type</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Free vs Premium</p>
              </div>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={160}>
                  <PieChart>
                    <Pie data={chartData.priceDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value" strokeWidth={0}>
                      {chartData.priceDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {chartData.priceDistribution.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{item.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/admin/movies', label: 'Manage Movies', desc: `${stats?.totalMovies ?? 0} total`, icon: 'M12 4v16m8-8H4', gradient: 'from-blue-500 to-blue-600' },
            { href: '/admin/reviews', label: 'Moderate Reviews', desc: `${stats?.pendingReviews ?? 0} pending`, icon: 'M9 12l2 2 4-4', gradient: 'from-red-500 to-red-600' },
            { href: '/admin/users', label: 'Manage Users', desc: `${stats?.totalUsers ?? 0} registered`, icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', gradient: 'from-emerald-500 to-emerald-600' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="group flex items-center gap-3.5 bg-white dark:bg-zinc-900/80 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition">
              <div className={`w-10 h-10 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-red-500 transition">{item.label}</h3>
                <p className="text-gray-400 dark:text-gray-500 text-xs">{item.desc}</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Pending Alert */}
      {!loading && (stats?.pendingReviews ?? 0) > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/5 dark:to-orange-500/5 border border-amber-200/60 dark:border-amber-500/20 rounded-2xl p-4 flex flex-wrap items-center gap-4">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
          </div>
          <div className="flex-1">
            <p className="text-amber-900 dark:text-amber-300 font-semibold text-sm">
              {stats?.pendingReviews} review{(stats?.pendingReviews ?? 0) > 1 ? 's' : ''} awaiting moderation
            </p>
            <p className="text-amber-700/70 dark:text-amber-400/60 text-xs mt-0.5">Review submissions need your approval</p>
          </div>
          <Link href="/admin/reviews" className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-xl text-sm font-semibold transition shadow-sm">
            Review Now
          </Link>
        </div>
      )}
    </div>
  );
}
