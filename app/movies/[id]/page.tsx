'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Movie, Review, Comment } from '@/types';
import { useAuthStore } from '@/store/authStore';

export default function MovieDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [reviewForm, setReviewForm] = useState({ title: '', content: '', rating: 5, spoiler: false });
  const [submitting, setSubmitting] = useState(false);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchMovie();
    fetchReviews();
    if (user) checkWatchlist();
  }, [id, user]);

  const fetchMovie = async () => {
    try {
      const res = await api.get(`/movies/${id}`);
      setMovie(res.data.data);
    } catch {
      router.push('/movies');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews?movieId=${id}&status=PUBLISHED`);
      setReviews(res.data.data || []);
    } catch {
      setReviews([]);
    }
  };

  const checkWatchlist = async () => {
    try {
      const res = await api.get('/watchlist');
      const list = res.data.data || [];
      setInWatchlist(list.some((w: { movie: { id: string } }) => w.movie.id === id));
    } catch {}
  };

  const handleWatchlist = async () => {
    if (!user) { router.push('/login'); return; }
    try {
      await api.post('/watchlist/toggle', { movieId: id });
      setInWatchlist(!inWatchlist);
      toast.success(inWatchlist ? 'Removed from watchlist' : 'Added to watchlist');
    } catch {
      toast.error('Failed to update watchlist');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push('/login'); return; }
    setSubmitting(true);
    try {
      await api.post('/reviews', { ...reviewForm, movieId: id });
      toast.success('Review submitted! Pending approval.');
      setReviewForm({ title: '', content: '', rating: 5, spoiler: false });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const loadComments = async (reviewId: string) => {
    if (expandedReview === reviewId) {
      setExpandedReview(null);
      return;
    }
    setExpandedReview(reviewId);
    if (!comments[reviewId]) {
      const res = await api.get(`/comments?reviewId=${reviewId}`);
      setComments({ ...comments, [reviewId]: res.data.data || [] });
    }
  };

  const handleComment = async (reviewId: string) => {
    if (!user) { router.push('/login'); return; }
    const body = commentText[reviewId]?.trim();
    if (!body) return;
    try {
      await api.post('/comments', { reviewId, body });
      const res = await api.get(`/comments?reviewId=${reviewId}`);
      setComments({ ...comments, [reviewId]: res.data.data || [] });
      setCommentText({ ...commentText, [reviewId]: '' });
    } catch {
      toast.error('Failed to post comment');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="animate-pulse bg-zinc-900 rounded-xl h-96" />
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Movie Info */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="w-full md:w-64 flex-shrink-0">
          {movie.posterUrl ? (
            <img src={movie.posterUrl} alt={movie.title} className="w-full rounded-xl shadow-2xl" />
          ) : (
            <div className="w-full aspect-[2/3] bg-zinc-900 rounded-xl flex items-center justify-center text-6xl">🎬</div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-4xl font-bold text-white">{movie.title}</h1>
              <p className="text-gray-400 mt-1">{movie.releaseYear} • {movie.director}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${movie.priceType === 'PREMIUM' ? 'bg-red-600 text-black' : 'bg-green-600 text-white'}`}>
              {movie.priceType}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <span className="text-red-400 text-2xl font-bold">⭐ {movie.averageRating?.toFixed(1) || 'N/A'}</span>
            <span className="text-gray-400 text-sm">({movie.totalReviews} reviews)</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {movie.genre?.map((g) => (
              <span key={g} className="bg-zinc-800 text-gray-300 px-3 py-1 rounded-full text-sm">{g}</span>
            ))}
          </div>

          <p className="text-gray-300 mt-5 leading-relaxed">{movie.description}</p>

          {movie.cast?.length > 0 && (
            <p className="text-gray-400 text-sm mt-3"><span className="text-gray-300 font-semibold">Cast:</span> {movie.cast.join(', ')}</p>
          )}

          <div className="flex gap-3 mt-6 flex-wrap">
            <button
              onClick={handleWatchlist}
              className={`px-5 py-2 rounded-lg font-semibold transition ${inWatchlist ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-600 hover:bg-red-700 text-black'}`}
            >
              {inWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
            </button>
            {movie.trailerUrl && (
              <a href={movie.trailerUrl} target="_blank" rel="noreferrer" className="px-5 py-2 rounded-lg bg-zinc-800 hover:bg-gray-600 text-white transition">
                Watch Trailer
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Write Review */}
      <div className="bg-zinc-950 rounded-xl p-6 mb-10">
        <h2 className="text-2xl font-bold text-white mb-5">Write a Review</h2>
        {user ? (
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <input
              type="text"
              required
              placeholder="Review title"
              value={reviewForm.title}
              onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
              className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600"
            />
            <textarea
              required
              rows={4}
              placeholder="Share your thoughts..."
              value={reviewForm.content}
              onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
              className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 resize-none"
            />
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-gray-300 text-sm">Rating:</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                  className="bg-zinc-900 text-white border border-zinc-800 rounded px-3 py-2"
                >
                  {[1,2,3,4,5].map((r) => <option key={r} value={r}>{r} ⭐</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={reviewForm.spoiler}
                  onChange={(e) => setReviewForm({ ...reviewForm, spoiler: e.target.checked })}
                  className="w-4 h-4"
                />
                Contains spoilers
              </label>
            </div>
            <button type="submit" disabled={submitting} className="bg-red-600 hover:bg-red-700 text-black font-bold px-6 py-2 rounded-lg transition disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <p className="text-gray-400">
            <Link href="/login" className="text-red-400 hover:underline">Sign in</Link> to write a review.
          </p>
        )}
      </div>

      {/* Reviews */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-400">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-zinc-950 rounded-xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white text-lg">{review.title}</h3>
                    <p className="text-gray-400 text-sm">{review.user.name} • {new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-red-400 font-bold text-xl">{'⭐'.repeat(review.rating)}</span>
                </div>
                {review.spoiler && <p className="text-red-400 text-xs mb-2">⚠ Spoiler Warning</p>}
                <p className="text-gray-300 leading-relaxed">{review.content}</p>

                <button
                  onClick={() => loadComments(review.id)}
                  className="mt-4 text-sm text-red-400 hover:underline"
                >
                  {expandedReview === review.id ? 'Hide' : 'Show'} Comments ({review._count?.comments || 0})
                </button>

                {expandedReview === review.id && (
                  <div className="mt-4 space-y-3 border-t border-zinc-800 pt-4">
                    {(comments[review.id] || []).map((c) => (
                      <div key={c.id} className="flex gap-3">
                        <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-sm font-bold text-red-400 flex-shrink-0">
                          {c.user.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-300">{c.user.name}</p>
                          <p className="text-gray-400 text-sm">{c.body}</p>
                        </div>
                      </div>
                    ))}
                    {user && (
                      <div className="flex gap-2 mt-3">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={commentText[review.id] || ''}
                          onChange={(e) => setCommentText({ ...commentText, [review.id]: e.target.value })}
                          className="flex-1 bg-zinc-900 text-white border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-600"
                        />
                        <button
                          onClick={() => handleComment(review.id)}
                          className="bg-red-600 text-black px-4 py-2 rounded text-sm font-semibold hover:bg-red-700 transition"
                        >
                          Post
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
