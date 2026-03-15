import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MoviePortal - Rate, Review & Discover Movies',
  description: 'Your ultimate destination for movie and series reviews, ratings, and streaming.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gray-950 text-white min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" toastOptions={{ style: { background: '#1f2937', color: '#fff' } }} />
      </body>
    </html>
  );
}
