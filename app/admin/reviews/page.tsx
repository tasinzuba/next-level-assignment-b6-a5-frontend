'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Review } from '@/types';

const FILTERS = ['PENDING', 'PUBLISHED', 'UNPUBLISHED'] as const;
type FilterType = typeof FILTERS[number];

const filterStyle: Record<FilterType, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  PUBLISHED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  UNPUBLISHED: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function AdminReviewsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('PENDING');

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') { router.push('/'); return; }
    fetchReviews();
  }, [user, filter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/reviews/pending`);
      const all = res.data.data || [];
      setReviews(filter === 'PENDING' ? all : all.filter((r: Review) => r.status === filter));
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (id: string, status: 'PUBLISHED' | 'UNPUBLISHED') => {
    try {
      await api.patch(`/reviews/${id}/status`, { status });
      toast.success(`Review ${status === 'PUBLISHED' ? 'approved' : 'rejected'}!`);
      setReviews(reviews.filter((r) => r.id !== id));
    } catch {
      toast.error('Failed to update review');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <span className="text-yellow-400 tracking-tight">
        {'★'.repeat(rating)}
        <span className="text-zinc-700">{'★'.repeat(10 - rating)}</span>
      </span>
    );
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Review Moderation</h1>
        <p className="text-gray-400 text-sm mt-1">Manage user-submitted reviews</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 bg-zinc-900 p-1 rounded-xl w-fit">
        {FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
              filter === s
                ? 'bg-red-600 text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-zinc-900 h-32 rounded-xl animate-pulse" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-gray-400">No {filter.toLowerCase()} reviews found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-white">{review.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${filterStyle[review.status as FilterType] || ''}`}>
                      {review.status}
                    </span>
                    {review.spoiler && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-medium">
                        Spoiler
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">
                    by <span className="text-gray-300 font-medium">{review.user?.name}</span>
                    {' · '}
                    <span className="text-red-400">{review.movie?.title}</span>
                  </p>
                  <div className="mt-1 text-sm">{renderStars(review.rating)} <span className="text-gray-500 ml-1">{review.rating}/10</span></div>
                </div>
                <p className="text-gray-500 text-xs whitespace-nowrap">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 bg-zinc-900 rounded-lg p-3 border border-zinc-800">
                {review.content}
              </p>

              {review.status === 'PENDING' && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleModerate(review.id, 'PUBLISHED')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleModerate(review.id, 'UNPUBLISHED')}
                    className="bg-zinc-700 hover:bg-zinc-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    ✕ Reject
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
