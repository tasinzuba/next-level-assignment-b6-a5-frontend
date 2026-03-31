'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { User } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();
  const [profile, setProfile] = useState<User | null>(null);
  const [nameForm, setNameForm] = useState('');
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      setProfile(res.data.data);
      setNameForm(res.data.data.name);
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', { name: nameForm });
      setUser(res.data.data);
      setProfile(res.data.data);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPw(true);
    try {
      await api.put('/auth/change-password', pwForm);
      toast.success('Password changed! Please login again.');
      logout();
      router.push('/login');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPw(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="bg-zinc-900 h-12 rounded" />
          <div className="bg-zinc-900 h-48 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-white">My Profile</h1>

      {/* Stats Card */}
      {profile && (
        <div className="bg-zinc-950 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-3xl font-bold text-black">
            {profile.name[0].toUpperCase()}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-white">{profile.name}</h2>
            <p className="text-gray-400">{profile.email}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${profile.role === 'ADMIN' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-gray-300'}`}>
              {profile.role}
            </span>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-red-400">{profile._count?.reviews || 0}</p>
              <p className="text-gray-400 text-sm">Reviews</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">{profile._count?.watchlist || 0}</p>
              <p className="text-gray-400 text-sm">Watchlist</p>
            </div>
          </div>
        </div>
      )}

      {/* Update Name */}
      <div className="bg-zinc-950 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-5">Update Profile</h2>
        <form onSubmit={handleUpdateName} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Name</label>
            <input
              type="text"
              required
              value={nameForm}
              onChange={(e) => setNameForm(e.target.value)}
              className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600"
            />
          </div>
          <button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-lg transition disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-zinc-950 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-5">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={pwForm.newPassword}
              onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
              className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600"
            />
          </div>
          <button type="submit" disabled={changingPw} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-lg transition disabled:opacity-50">
            {changingPw ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
