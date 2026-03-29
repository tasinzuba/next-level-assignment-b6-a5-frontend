export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  subscription?: Subscription | null;
  _count?: { reviews: number; watchlist: number };
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string[];
  releaseYear: number;
  director: string;
  cast: string[];
  posterUrl: string;
  trailerUrl?: string;
  priceType: 'FREE' | 'PREMIUM';
  featured: boolean;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
}

export interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  status: 'PENDING' | 'PUBLISHED' | 'UNPUBLISHED';
  spoiler: boolean;
  createdAt: string;
  user: { id: string; name: string };
  movie: { id: string; title: string; posterUrl: string };
  _count?: { comments: number; likes: number };
}

export interface Comment {
  id: string;
  body: string;
  createdAt: string;
  user: { id: string; name: string };
}

export interface Watchlist {
  id: string;
  movie: Movie;
  createdAt: string;
}

export interface Subscription {
  id: string;
  plan: 'BASIC' | 'STANDARD' | 'PREMIUM';
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  startDate: string;
  endDate: string;
}

export interface DashboardStats {
  totalMovies: number;
  totalUsers: number;
  totalReviews: number;
  pendingReviews: number;
  activeSubscriptions: number;
}
