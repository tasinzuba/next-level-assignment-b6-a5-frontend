'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { User } from '@/types';

const ITEMS_PER_PAGE = 10;

export default function AdminSubscriptionsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'ADMIN') { router.push('/'); return; }
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users?limit=100');
      const allUsers: User[] = res.data.data || [];
      const subscribedUsers = allUsers.filter((u) => u.subscription);
      setUsers(subscribedUsers);
    } catch {
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const activeUsers = users.filter((u) => u.subscription?.status === 'ACTIVE');
  const monthlyCount = activeUsers.filter((u) => u.subscription?.plan === 'MONTHLY').length;
  const yearlyCount = activeUsers.filter((u) => u.subscription?.plan === 'YEARLY').length;

  const statusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-600/20 text-green-400 border border-green-600/30';
      case 'EXPIRED':
        return 'bg-red-600/20 text-red-400 border border-red-600/30';
      case 'CANCELLED':
        return 'bg-gray-600/20 text-gray-400 border border-gray-600/30';
      default:
        return 'bg-gray-600/20 text-gray-400 border border-gray-600/30';
    }
  };

  const statCards = [
    { label: 'Total Active', value: activeUsers.length, color: 'from-emerald-600/20 to-emerald-600/5', border: 'border-emerald-600/30', text: 'text-emerald-400' },
    { label: 'Monthly Plans', value: monthlyCount, color: 'from-blue-600/20 to-blue-600/5', border: 'border-blue-600/30', text: 'text-blue-400' },
    { label: 'Yearly Plans', value: yearlyCount, color: 'from-purple-600/20 to-purple-600/5', border: 'border-purple-600/30', text: 'text-purple-400' },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {users.length} users with subscriptions
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-100 dark:bg-zinc-900 h-24 rounded-xl animate-pulse" />
            ))
          : statCards.map((s) => (
              <div
                key={s.label}
                className={`bg-gradient-to-b ${s.color} border ${s.border} rounded-xl p-5`}
              >
                <p className={`text-3xl font-bold ${s.text}`}>{s.value}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{s.label}</p>
              </div>
            ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition text-sm placeholder:text-gray-400 dark:placeholder:text-zinc-500"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-zinc-900 h-14 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <svg className="w-12 h-12 text-gray-300 dark:text-zinc-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <p>{search ? 'No subscriptions match your search.' : 'No subscriptions found.'}</p>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
                  <th className="text-left px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">User Name</th>
                  <th className="text-left px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide hidden md:table-cell">Email</th>
                  <th className="text-left px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">Plan</th>
                  <th className="text-left px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide hidden lg:table-cell">Start Date</th>
                  <th className="text-left px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide hidden lg:table-cell">End Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                {paginated.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-100/50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{u.name}</p>
                      <p className="text-gray-500 text-xs md:hidden">{u.email}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-400 text-sm hidden md:table-cell">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        u.subscription?.plan === 'YEARLY'
                          ? 'bg-purple-600/20 text-purple-400 border border-purple-600/30'
                          : 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                      }`}>
                        {u.subscription?.plan === 'YEARLY' ? 'Yearly' : 'Monthly'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusBadge(u.subscription?.status || '')}`}>
                        {u.subscription?.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-400 text-sm hidden lg:table-cell">
                      {u.subscription?.startDate
                        ? new Date(u.subscription.startDate).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-400 text-sm hidden lg:table-cell">
                      {u.subscription?.endDate
                        ? new Date(u.subscription.endDate).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer with pagination */}
          <div className="px-5 py-3 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between">
            <p className="text-gray-500 text-xs">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs rounded-lg bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1.5 text-xs rounded-lg transition ${
                      currentPage === i + 1
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs rounded-lg bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
