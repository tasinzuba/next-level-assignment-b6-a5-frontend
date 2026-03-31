'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4 bg-black">
      <div>
        <div className="flex justify-center mb-6">
          <svg className="w-16 h-16 text-red-600/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">An unexpected error occurred. Please try again.</p>
        <button
          onClick={reset}
          className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-lg transition shadow-lg shadow-red-900/30"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
