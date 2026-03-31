import Link from 'next/link';
import CosmicButton from '@/components/CosmicButton';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4 bg-black">
      <div>
        <div className="flex justify-center mb-6">
          <svg className="w-20 h-20 text-zinc-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
        </div>
        <h1 className="text-8xl font-extrabold text-red-400">404</h1>
        <h2 className="text-2xl font-bold text-white mt-4">Page Not Found</h2>
        <p className="text-gray-500 mt-3 mb-8 max-w-sm mx-auto">The page you are looking for doesn&apos;t exist or has been moved.</p>
        <div className="flex gap-4 justify-center">
          <CosmicButton href="/" variant="primary">
            Go Home
          </CosmicButton>
          <CosmicButton href="/movies" variant="outline">
            Browse Movies
          </CosmicButton>
        </div>
      </div>
    </div>
  );
}
