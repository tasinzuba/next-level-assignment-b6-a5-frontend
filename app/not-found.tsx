import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <h1 className="text-8xl font-extrabold text-yellow-400">404</h1>
        <h2 className="text-3xl font-bold text-white mt-4">Page Not Found</h2>
        <p className="text-gray-400 mt-3 mb-8">The page you are looking for does not exist.</p>
        <Link href="/" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-lg transition">
          Go Home
        </Link>
      </div>
    </div>
  );
}
