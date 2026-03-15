'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Review } from '@/types';

export default function AdminReviewsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') { router.push('/'); return; }
    fetchReviews();
  }, [user, filter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/reviews?status=${filter}`);
      setReviews(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await api.put(`/reviews/${id}/approve`, { status });
      toast.success(`Review ${status.toLowerCase()}!`);
      setReviews(reviews.filter((r) => r.id !== id));
    } catch {
      toast.error('Failed to update review');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">Review Moderation</h1>

      <div className="flex gap-3 mb-6">
        {['PENDING', 'APPROVED', 'REJECTED'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter === s ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-gray-800 h-28 rounded-xl animate-pulse" />)}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No {filter.toLowerCase()} reviews.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-900 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white">{review.title}</h3>
                  <p className="text-gray-400 text-sm mt-0.5">
                    by <span className="text-gray-300">{review.user?.name}</span> •{' '}
                    <span className="text-yellow-400">{review.movie?.title}</span> •{' '}
                    {'⭐'.repeat(review.rating)}
                  </p>
                </div>
                {review.spoiler && <span className="text-red-400 text-xs bg-red-900/30 px-2 py-1 rounded flex-shrink-0">Spoiler</span>}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">{review.body}</p>
              {filter === 'PENDING' && (
                <div className="flex gap-3 mt-4">
                  <button onClick={() => handleApprove(review.id, 'APPROVED')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-semibold transition">
                    Approve
                  </button>
                  <button onClick={() => handleApprove(review.id, 'REJECTED')} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-semibold transition">
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
