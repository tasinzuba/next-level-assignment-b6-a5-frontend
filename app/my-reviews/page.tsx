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
  const [editForm, setEditForm] = useState({ title: '', body: '', rating: 5 });
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
    setEditForm({ title: review.title, body: review.body, rating: review.rating });
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
    if (status === 'APPROVED') return 'bg-green-700 text-white';
    if (status === 'REJECTED') return 'bg-red-700 text-white';
    return 'bg-yellow-600 text-black';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-gray-800 h-28 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">My Reviews</h1>

      {reviews.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl mb-4">You haven&apos;t written any reviews yet.</p>
          <Link href="/movies" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-lg transition">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-900 rounded-xl p-6">
              {editId === review.id ? (
                /* Edit Form */
                <form onSubmit={handleUpdate} className="space-y-4">
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-yellow-400"
                    placeholder="Review title"
                  />
                  <textarea
                    required
                    rows={4}
                    value={editForm.body}
                    onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-yellow-400 resize-none"
                    placeholder="Your review..."
                  />
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-gray-300 text-sm">Rating:</label>
                      <select
                        value={editForm.rating}
                        onChange={(e) => setEditForm({ ...editForm, rating: Number(e.target.value) })}
                        className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-1.5"
                      >
                        {[1,2,3,4,5,6,7,8,9,10].map((r) => <option key={r} value={r}>{r} ⭐</option>)}
                      </select>
                    </div>
                    <button type="submit" disabled={saving} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-5 py-2 rounded-lg transition disabled:opacity-50">
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button type="button" onClick={() => setEditId(null)} className="text-gray-400 hover:text-white transition">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* Review View */
                <div>
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                    <div>
                      <h3 className="font-bold text-white text-lg">{review.title}</h3>
                      <Link href={`/movies/${review.movie?.id}`} className="text-yellow-400 text-sm hover:underline">
                        {review.movie?.title}
                      </Link>
                      <p className="text-gray-500 text-xs mt-0.5">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-yellow-400 font-bold">{'⭐'.repeat(Math.min(review.rating, 5))}</span>
                      <span className="text-gray-300 text-sm font-semibold">{review.rating}/10</span>
                      <span className={`text-xs px-2 py-1 rounded font-bold ${statusColor(review.status)}`}>
                        {review.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed mb-4">{review.body}</p>

                  {/* Actions — only for PENDING reviews */}
                  <div className="flex gap-3">
                    {review.status === 'PENDING' && (
                      <button
                        onClick={() => handleEdit(review)}
                        className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-4 py-1.5 rounded-lg transition"
                      >
                        ✏️ Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-sm bg-red-700 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>

                  {review.status === 'APPROVED' && (
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
