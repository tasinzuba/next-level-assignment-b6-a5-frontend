'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Movie } from '@/types';

const emptyForm = {
  title: '', synopsis: '', genre: '', releaseYear: new Date().getFullYear(),
  director: '', cast: '', thumbnail: '', streamingUrl: '', priceType: 'FREE', mediaType: 'MOVIE', platform: '',
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
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') { router.push('/'); return; }
    fetchMovies();
  }, [user]);

  const fetchMovies = async () => {
    try {
      const res = await api.get('/movies?limit=200');
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
        platform: form.platform.split(',').map((p) => p.trim()).filter(Boolean),
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

  const handleEdit = (movie: Movie & { synopsis?: string; streamingUrl?: string; platform?: string[] }) => {
    setEditId(movie.id);
    setForm({
      title: movie.title,
      synopsis: movie.synopsis || '',
      genre: movie.genre?.join(', ') || '',
      releaseYear: movie.releaseYear,
      director: movie.director,
      cast: movie.cast?.join(', ') || '',
      thumbnail: movie.posterUrl || '',
      streamingUrl: movie.streamingUrl || '',
      priceType: movie.priceType,
      mediaType: (movie as Movie & { mediaType?: string }).mediaType || 'MOVIE',
      platform: movie.platform?.join(', ') || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this movie? This cannot be undone.')) return;
    try {
      await api.delete(`/movies/${id}`);
      toast.success('Movie deleted');
      setMovies(movies.filter((m) => m.id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filtered = movies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.director?.toLowerCase().includes(search.toLowerCase())
  );

  const inputClass = "w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition text-sm placeholder:text-zinc-500";

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Movies</h1>
          <p className="text-gray-400 text-sm mt-1">{movies.length} total movies</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}
          className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition ${showForm ? 'bg-zinc-700 text-white hover:bg-zinc-600' : 'bg-red-600 hover:bg-red-500 text-white'}`}
        >
          {showForm ? '✕ Cancel' : '+ Add Movie'}
        </button>
      </div>

      {showForm && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">{editId ? 'Edit Movie' : 'Add New Movie'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wide">Title *</label>
                <input type="text" placeholder="e.g. The Dark Knight" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wide">Director *</label>
                <input type="text" placeholder="e.g. Christopher Nolan" value={form.director} onChange={(e) => setForm({ ...form, director: e.target.value })} required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wide">Release Year *</label>
                <input type="number" min="1900" max="2100" value={form.releaseYear} onChange={(e) => setForm({ ...form, releaseYear: Number(e.target.value) })} required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wide">Price Type</label>
                <select value={form.priceType} onChange={(e) => setForm({ ...form, priceType: e.target.value })} className={inputClass}>
                  <option value="FREE">Free</option>
                  <option value="PREMIUM">Premium</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wide">Media Type</label>
                <select value={form.mediaType} onChange={(e) => setForm({ ...form, mediaType: e.target.value })} className={inputClass}>
                  <option value="MOVIE">🎥 Movie</option>
                  <option value="SERIES">📺 Series</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wide">Genres (comma-separated)</label>
                <input type="text" placeholder="e.g. Action, Crime, Drama" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wide">Cast (comma-separated)</label>
                <input type="text" placeholder="e.g. Christian Bale, Heath Ledger" value={form.cast} onChange={(e) => setForm({ ...form, cast: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wide">Platforms (comma-separated)</label>
                <input type="text" placeholder="e.g. Netflix, HBO Max" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wide">Streaming URL</label>
                <input type="url" placeholder="https://youtube.com/watch?v=..." value={form.streamingUrl} onChange={(e) => setForm({ ...form, streamingUrl: e.target.value })} className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wide">Poster Image URL</label>
                <input type="url" placeholder="https://image.tmdb.org/t/p/w500/..." value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} className={inputClass} />
                {form.thumbnail && (
                  <div className="mt-2 flex items-center gap-3">
                    <img src={form.thumbnail} alt="Preview" className="w-10 h-14 object-cover rounded border border-zinc-700" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    <span className="text-xs text-gray-500">Poster preview</span>
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wide">Synopsis *</label>
                <textarea rows={3} placeholder="Brief description of the movie..." value={form.synopsis} onChange={(e) => setForm({ ...form, synopsis: e.target.value })} required className={`${inputClass} resize-none`} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-lg transition disabled:opacity-50 text-sm">
                {saving ? 'Saving...' : editId ? 'Update Movie' : 'Add Movie'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }} className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2.5 rounded-lg transition text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search movies by title or director..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputClass}
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="bg-zinc-900 h-16 rounded-lg animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">🎬</p>
          <p>{search ? 'No movies match your search.' : 'No movies yet. Add your first movie!'}</p>
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-900/80 border-b border-zinc-800">
                  <th className="text-left px-5 py-3.5 text-gray-400 text-xs font-semibold uppercase tracking-wide">Movie</th>
                  <th className="text-left px-5 py-3.5 text-gray-400 text-xs font-semibold uppercase tracking-wide hidden md:table-cell">Year</th>
                  <th className="text-left px-5 py-3.5 text-gray-400 text-xs font-semibold uppercase tracking-wide hidden md:table-cell">Type</th>
                  <th className="text-left px-5 py-3.5 text-gray-400 text-xs font-semibold uppercase tracking-wide hidden lg:table-cell">Rating</th>
                  <th className="text-right px-5 py-3.5 text-gray-400 text-xs font-semibold uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filtered.map((movie) => (
                  <tr key={movie.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {movie.posterUrl ? (
                          <img src={movie.posterUrl} alt={movie.title} className="w-9 h-12 object-cover rounded border border-zinc-700 flex-shrink-0" />
                        ) : (
                          <div className="w-9 h-12 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center text-sm flex-shrink-0">🎬</div>
                        )}
                        <div>
                          <p className="font-semibold text-white text-sm">{movie.title}</p>
                          <p className="text-gray-500 text-xs">{movie.genre?.join(', ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-sm hidden md:table-cell">{movie.releaseYear}</td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${movie.priceType === 'PREMIUM' ? 'bg-red-600/20 text-red-400 border border-red-600/30' : 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'}`}>
                        {movie.priceType}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm hidden lg:table-cell">
                      <span className="text-yellow-400">★</span>
                      <span className="text-gray-300 ml-1">{movie.averageRating?.toFixed(1) || '—'}</span>
                      <span className="text-gray-500 text-xs ml-1">({movie.totalReviews || 0})</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => handleEdit(movie as Movie & { synopsis?: string; streamingUrl?: string; platform?: string[] })} className="text-blue-400 hover:text-blue-300 text-sm font-medium mr-4 transition">Edit</button>
                      <button onClick={() => handleDelete(movie.id)} className="text-red-400 hover:text-red-300 text-sm font-medium transition">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-zinc-800 text-gray-500 text-xs">
            Showing {filtered.length} of {movies.length} movies
          </div>
        </div>
      )}
    </div>
  );
}
