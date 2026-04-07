'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { ChartData } from '@/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
  AreaChart, Area,
} from 'recharts';

const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#f97316', '#06b6d4', '#ec4899'];

interface TopRatedMovie {
  id: string;
  title: string;
  avgRating: number;
  _count: { reviews: number };
  genre: string[];
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [topRated, setTopRated] = useState<TopRatedMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'ADMIN') { router.push('/'); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [chartRes, topRatedRes] = await Promise.all([
        api.get('/admin/chart-data'),
        api.get('/admin/movies/top-rated'),
      ]);
      setChartData(chartRes.data.data);
      setTopRated(topRatedRes.data.data);
    } catch {
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics & Insights</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Detailed breakdowns and trends across the platform.</p>
      </div>

      {/* Top Rated Movies Table */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Rated Movies</h2>
        <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          {loading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-zinc-900 text-left">
                  <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-semibold">Rank</th>
                  <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-semibold">Title</th>
                  <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-semibold">Average Rating</th>
                  <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-semibold">Total Reviews</th>
                </tr>
              </thead>
              <tbody>
                {topRated.map((movie, index) => (
                  <tr
                    key={movie.id}
                    className="border-t border-gray-200 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-900 transition"
                  >
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-bold">#{index + 1}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">{movie.title}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{movie.genre.join(', ')}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-yellow-500 font-semibold">{movie.avgRating.toFixed(1)}</span>
                      <span className="text-gray-500 dark:text-gray-400"> / 5</span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{movie._count.reviews}</td>
                  </tr>
                ))}
                {topRated.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No top rated movies found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Charts */}
      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : chartData && (
        <div className="space-y-8">
          {/* Genre Distribution Bar Chart (Large) */}
          <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Genre Distribution</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData.genreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} angle={-30} textAnchor="end" height={70} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="value" name="Movies" radius={[4, 4, 0, 0]}>
                  {chartData.genreDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* User Registration Trend Line Chart */}
          <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Registration Trend</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData.userGrowth}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="users" stroke="#22c55e" strokeWidth={2} fill="url(#userGradient)" />
                <Line type="monotone" dataKey="users" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Content Breakdown Cards */}
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Content Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Movies vs Series */}
            <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Movies vs Series</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData.mediaTypeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    label={(props) => `${props.name} ${((props.percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {chartData.mediaTypeDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                  />
                  <Legend
                    formatter={(value) => <span className="text-gray-600 dark:text-gray-400 text-sm">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Free vs Premium */}
            <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Free vs Premium</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData.priceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    label={(props) => `${props.name} ${((props.percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {chartData.priceDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                  />
                  <Legend
                    formatter={(value) => <span className="text-gray-600 dark:text-gray-400 text-sm">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
