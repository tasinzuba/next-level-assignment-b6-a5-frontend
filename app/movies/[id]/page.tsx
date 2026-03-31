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
  const [reviewForm, setReviewForm] = useState({ title: '', content: '', rating: 5, spoiler: false, tags: [] as string[] });
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

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
      const data = res.data.data || [];
      setReviews(data);
      const counts: Record<string, number> = {};
      data.forEach((r: Review) => { counts[r.id] = r._count?.likes || 0; });
      setLikeCounts(counts);
    } catch {
      setReviews([]);
    }
  };

  const handleLike = async (reviewId: string) => {
    if (!user) { router.push('/login'); return; }
    try {
      await api.post(`/reviews/${reviewId}/like`);
      const liked = likedReviews.has(reviewId);
      const next = new Set(likedReviews);
      if (liked) { next.delete(reviewId); } else { next.add(reviewId); }
      setLikedReviews(next);
      setLikeCounts((prev) => ({ ...prev, [reviewId]: (prev[reviewId] || 0) + (liked ? -1 : 1) }));
    } catch {
      toast.error('Failed to like review');
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
      setReviewForm({ title: '', content: '', rating: 5, spoiler: false, tags: [] });
      setTagInput('');
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
            <div className="w-full aspect-[2/3] bg-zinc-900 rounded-xl flex items-center justify-center">
              <svg className="w-16 h-16 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-4xl font-bold text-white">{movie.title}</h1>
              <p className="text-gray-400 mt-1">{movie.releaseYear} • {movie.director}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${movie.priceType === 'PREMIUM' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
              {movie.priceType}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <span className="text-red-400 text-2xl font-bold flex items-center gap-1.5">
              <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
              {movie.averageRating?.toFixed(1) || 'N/A'}
            </span>
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
              className={`px-5 py-2 rounded-lg font-semibold transition ${inWatchlist ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}
            >
              {inWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
            </button>
            {movie.streamingUrl && (
              <a href={movie.streamingUrl} target="_blank" rel="noreferrer" className="px-5 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white font-semibold transition flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                Watch Now
              </a>
            )}
            {movie.trailerUrl && (
              <a href={movie.trailerUrl} target="_blank" rel="noreferrer" className="px-5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition">
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
                  {[1,2,3,4,5].map((r) => <option key={r} value={r}>{r} / 5</option>)}
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
            {/* Tags */}
            <div>
              <label className="text-gray-300 text-sm block mb-2">Tags <span className="text-gray-500">(e.g. classic, underrated — press Enter)</span></label>
              <div className="flex flex-wrap gap-2 mb-2">
                {reviewForm.tags.map((tag) => (
                  <span key={tag} className="bg-zinc-800 text-gray-300 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                    {tag}
                    <button type="button" onClick={() => setReviewForm({ ...reviewForm, tags: reviewForm.tags.filter((t) => t !== tag) })} className="text-gray-500 hover:text-red-400 ml-1">×</button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const t = tagInput.trim().toLowerCase();
                    if (t && !reviewForm.tags.includes(t) && reviewForm.tags.length < 5) {
                      setReviewForm({ ...reviewForm, tags: [...reviewForm.tags, t] });
                      setTagInput('');
                    }
                  }
                }}
                className="bg-zinc-900 text-white border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-red-600 w-full md:w-64"
              />
            </div>
            <button type="submit" disabled={submitting} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-lg transition disabled:opacity-50">
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
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                    ))}
                  </span>
                </div>
                {review.spoiler && <p className="text-red-400 text-xs mb-2 font-semibold">Spoiler Warning</p>}
                {review.tags && review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {review.tags.map((tag) => (
                      <span key={tag} className="bg-zinc-800 text-gray-400 text-xs px-2 py-0.5 rounded-full border border-zinc-700">#{tag}</span>
                    ))}
                  </div>
                )}
                <p className="text-gray-300 leading-relaxed">{review.content}</p>

                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={() => handleLike(review.id)}
                    className={`flex items-center gap-1.5 text-sm font-medium transition px-3 py-1.5 rounded-lg ${likedReviews.has(review.id) ? 'bg-red-600/20 text-red-400' : 'bg-zinc-800 text-gray-400 hover:text-red-400'}`}
                  >
                    <svg className={`w-4 h-4 ${likedReviews.has(review.id) ? 'text-red-400' : 'text-gray-500'}`} fill={likedReviews.has(review.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    <span>{likeCounts[review.id] ?? 0}</span>
                  </button>
                  <button
                    onClick={() => loadComments(review.id)}
                    className="text-sm text-gray-400 hover:text-red-400 transition"
                  >
                    {expandedReview === review.id ? 'Hide' : 'Show'} Comments ({review._count?.comments || 0})
                  </button>
                </div>

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
                          className="bg-red-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-red-700 transition"
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
