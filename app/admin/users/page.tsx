'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { User } from '@/types';

export default function AdminUsersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') { router.push('/'); return; }
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, role: 'USER' | 'ADMIN') => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role });
      setUsers(users.map((u) => u.id === userId ? { ...u, role } : u));
      toast.success('Role updated!');
    } catch {
      toast.error('Failed to update role');
    }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const inputClass = "w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 transition text-sm placeholder:text-zinc-500";

  const avatarBg = (name: string) => {
    const colors = ['bg-red-600', 'bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-orange-600'];
    const i = name.charCodeAt(0) % colors.length;
    return colors[i];
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Users</h1>
        <p className="text-gray-400 text-sm mt-1">{users.length} registered users</p>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputClass}
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-zinc-900 h-16 rounded-lg animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">👥</p>
          <p>{search ? 'No users match your search.' : 'No users found.'}</p>
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-900/80 border-b border-zinc-800">
                  <th className="text-left px-5 py-3.5 text-gray-400 text-xs font-semibold uppercase tracking-wide">User</th>
                  <th className="text-left px-5 py-3.5 text-gray-400 text-xs font-semibold uppercase tracking-wide hidden md:table-cell">Joined</th>
                  <th className="text-left px-5 py-3.5 text-gray-400 text-xs font-semibold uppercase tracking-wide hidden lg:table-cell">Reviews</th>
                  <th className="text-left px-5 py-3.5 text-gray-400 text-xs font-semibold uppercase tracking-wide">Role</th>
                  <th className="text-right px-5 py-3.5 text-gray-400 text-xs font-semibold uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 ${avatarBg(u.name)} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm flex items-center gap-2">
                            {u.name}
                            {u.id === user?.id && <span className="text-xs text-gray-500">(you)</span>}
                          </p>
                          <p className="text-gray-500 text-xs">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-sm hidden md:table-cell">
                      {new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-sm hidden lg:table-cell">
                      {u._count?.reviews ?? 0}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${u.role === 'ADMIN' ? 'bg-red-600/20 text-red-400 border-red-600/30' : 'bg-zinc-700/50 text-gray-300 border-zinc-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {u.id !== user?.id && (
                        <button
                          onClick={() => handleRoleChange(u.id, u.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                          className={`text-sm font-medium transition px-3 py-1 rounded-lg border ${u.role === 'ADMIN' ? 'border-zinc-700 text-gray-400 hover:border-zinc-500 hover:text-white' : 'border-red-600/40 text-red-400 hover:border-red-500 hover:bg-red-600/10'}`}
                        >
                          {u.role === 'ADMIN' ? 'Remove Admin' : 'Make Admin'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-zinc-800 text-gray-500 text-xs">
            Showing {filtered.length} of {users.length} users
          </div>
        </div>
      )}
    </div>
  );
}
