'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Movie } from '@/types';

const emptyForm = {
  title: '', description: '', genre: '', releaseYear: new Date().getFullYear(),
  director: '', cast: '', posterUrl: '', trailerUrl: '', priceType: 'FREE', featured: false,
};

export default function AdminMoviesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') { router.push('/'); return; }
    fetchMovies();
  }, [user]);

  const fetchMovies = async () => {
    try {
      const res = await api.get('/movies?limit=100');
      setMovies(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        genre: form.genre.split(',').map((g) => g.trim()).filter(Boolean),
        cast: form.cast.split(',').map((c) => c.trim()).filter(Boolean),
      };
      if (editId) {
        await api.put(`/movies/${editId}`, payload);
        toast.success('Movie updated!');
      } else {
        await api.post('/movies', payload);
        toast.success('Movie added!');
      }
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm);
      fetchMovies();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to save movie');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditId(movie.id);
    setForm({
      title: movie.title, description: movie.description,
      genre: movie.genre?.join(', ') || '', releaseYear: movie.releaseYear,
      director: movie.director, cast: movie.cast?.join(', ') || '',
      posterUrl: movie.posterUrl || '', trailerUrl: movie.trailerUrl || '',
      priceType: movie.priceType, featured: movie.featured,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this movie?')) return;
    try {
      await api.delete(`/movies/${id}`);
      toast.success('Movie deleted');
      setMovies(movies.filter((m) => m.id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Manage Movies</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}
          className="bg-red-600 hover:bg-red-700 text-black font-bold px-5 py-2 rounded-lg transition"
        >
          {showForm ? 'Cancel' : '+ Add Movie'}
        </button>
      </div>

      {showForm && (
        <div className="bg-zinc-950 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-5">{editId ? 'Edit Movie' : 'Add New Movie'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'title', label: 'Title', type: 'text' },
              { key: 'director', label: 'Director', type: 'text' },
              { key: 'releaseYear', label: 'Release Year', type: 'number' },
              { key: 'posterUrl', label: 'Poster URL', type: 'url' },
              { key: 'trailerUrl', label: 'Trailer URL', type: 'url' },
              { key: 'genre', label: 'Genres (comma separated)', type: 'text' },
              { key: 'cast', label: 'Cast (comma separated)', type: 'text' },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-sm text-gray-300 mb-1">{label}</label>
                <input
                  type={type}
                  value={String(form[key as keyof typeof form])}
                  onChange={(e) => setForm({ ...form, [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
                  required={['title', 'director', 'releaseYear'].includes(key)}
                  className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-600"
                />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-300 mb-1">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-600 resize-none"
              />
            </div>
            <div className="flex gap-6 items-center">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Price Type</label>
                <select
                  value={form.priceType}
                  onChange={(e) => setForm({ ...form, priceType: e.target.value })}
                  className="bg-zinc-900 text-white border border-zinc-800 rounded-lg px-4 py-2.5"
                >
                  <option value="FREE">Free</option>
                  <option value="PREMIUM">Premium</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-gray-300 text-sm mt-5 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4" />
                Featured
              </label>
            </div>
            <div className="md:col-span-2">
              <button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-700 text-black font-bold px-6 py-2.5 rounded-lg transition disabled:opacity-50">
                {saving ? 'Saving...' : editId ? 'Update Movie' : 'Add Movie'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="bg-zinc-900 h-16 rounded" />)}
        </div>
      ) : (
        <div className="bg-zinc-950 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-900">
              <tr>
                <th className="text-left px-4 py-3 text-gray-300 text-sm">Title</th>
                <th className="text-left px-4 py-3 text-gray-300 text-sm hidden md:table-cell">Year</th>
                <th className="text-left px-4 py-3 text-gray-300 text-sm hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-gray-300 text-sm hidden md:table-cell">Rating</th>
                <th className="text-right px-4 py-3 text-gray-300 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id} className="border-t border-zinc-800 hover:bg-zinc-900/50 transition">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">{movie.title}</div>
                    <div className="text-gray-400 text-xs">{movie.genre?.join(', ')}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{movie.releaseYear}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs px-2 py-1 rounded font-bold ${movie.priceType === 'PREMIUM' ? 'bg-red-600 text-black' : 'bg-green-700 text-white'}`}>
                      {movie.priceType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-red-400 hidden md:table-cell">⭐ {movie.averageRating?.toFixed(1) || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleEdit(movie)} className="text-blue-400 hover:text-blue-300 text-sm mr-3">Edit</button>
                    <button onClick={() => handleDelete(movie.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
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
