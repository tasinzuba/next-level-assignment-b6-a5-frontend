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
      await api.put(`/admin/users/${userId}/role`, { role });
      setUsers(users.map((u) => u.id === userId ? { ...u, role } : u));
      toast.success('Role updated!');
    } catch {
      toast.error('Failed to update role');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">Manage Users</h1>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-zinc-900 h-14 rounded" />)}
        </div>
      ) : (
        <div className="bg-zinc-950 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-900">
              <tr>
                <th className="text-left px-4 py-3 text-gray-300 text-sm">User</th>
                <th className="text-left px-4 py-3 text-gray-300 text-sm hidden md:table-cell">Joined</th>
                <th className="text-left px-4 py-3 text-gray-300 text-sm">Role</th>
                <th className="text-right px-4 py-3 text-gray-300 text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-zinc-800 hover:bg-zinc-900/50 transition">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">{u.name}</div>
                    <div className="text-gray-400 text-xs">{u.email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm hidden md:table-cell">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded font-bold ${u.role === 'ADMIN' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-gray-300'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.id !== user?.id && (
                      <button
                        onClick={() => handleRoleChange(u.id, u.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                        className="text-sm text-blue-400 hover:text-blue-300 transition"
                      >
                        {u.role === 'ADMIN' ? 'Make User' : 'Make Admin'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
