'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Review } from '@/types';

export default function MyReviewsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', content: '', rating: 5 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    fetchMyReviews();
  }, [user]);

  const fetchMyReviews = async () => {
    try {
      const res = await api.get('/reviews/my-reviews');
      setReviews(res.data.data || []);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review: Review) => {
    setEditId(review.id);
    setEditForm({ title: review.title, content: review.content, rating: review.rating });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setSaving(true);
    try {
      const res = await api.put(`/reviews/${editId}`, editForm);
      setReviews(reviews.map((r) => r.id === editId ? { ...r, ...res.data.data } : r));
      setEditId(null);
      toast.success('Review updated!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to update review');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(reviews.filter((r) => r.id !== id));
      toast.success('Review deleted');
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const statusColor = (status: string) => {
    if (status === 'PUBLISHED') return 'bg-emerald-700 text-white';
    if (status === 'UNPUBLISHED') return 'bg-red-700 text-white';
    return 'bg-amber-600 text-black';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-zinc-900 h-28 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Reviews</h1>

      {reviews.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 text-xl mb-4">You haven&apos;t written any reviews yet.</p>
          <Link href="/movies" className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-lg transition">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 dark:bg-zinc-950 rounded-xl p-6">
              {editId === review.id ? (
                /* Edit Form */
                <form onSubmit={handleUpdate} className="space-y-4">
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-600"
                    placeholder="Review title"
                  />
                  <textarea
                    required
                    rows={4}
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    className="w-full bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-600 resize-none"
                    placeholder="Your review..."
                  />
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-gray-600 dark:text-gray-300 text-sm">Rating:</label>
                      <select
                        value={editForm.rating}
                        onChange={(e) => setEditForm({ ...editForm, rating: Number(e.target.value) })}
                        className="bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-800 rounded px-3 py-1.5"
                      >
                        {[1,2,3,4,5,6,7,8,9,10].map((r) => <option key={r} value={r}>{r} / 10</option>)}
                      </select>
                    </div>
                    <button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2 rounded-lg transition disabled:opacity-50">
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button type="button" onClick={() => setEditId(null)} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* Review View */
                <div>
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{review.title}</h3>
                      <Link href={`/movies/${review.movie?.id}`} className="text-red-400 text-sm hover:underline">
                        {review.movie?.title}
                      </Link>
                      <p className="text-gray-500 text-xs mt-0.5">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="flex items-center gap-0.5">
                        {Array.from({ length: Math.min(review.rating, 5) }).map((_, i) => (
                          <svg key={i} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                        ))}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300 text-sm font-semibold">{review.rating}/10</span>
                      <span className={`text-xs px-2 py-1 rounded font-bold ${statusColor(review.status)}`}>
                        {review.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">{review.content}</p>

                  {/* Actions — only for PENDING reviews */}
                  <div className="flex gap-3">
                    {review.status !== 'PUBLISHED' && (
                      <button
                        onClick={() => handleEdit(review)}
                        className="text-sm bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 text-gray-900 dark:text-white px-4 py-1.5 rounded-lg transition"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-sm bg-red-700 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </div>

                  {review.status === 'PUBLISHED' && (
                    <p className="text-xs text-gray-500 mt-3">✓ Published review cannot be edited</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
