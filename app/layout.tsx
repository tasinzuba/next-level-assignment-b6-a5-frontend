import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/ThemeProvider';
import AIChatbot from '@/components/AIChatbot';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Recape Movie - Rate, Review & Discover Movies',
  description: 'Your ultimate destination for movie and series reviews, ratings, and streaming.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth dark" suppressHydrationWarning>
      <body className={`${geist.className} bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen flex flex-col transition-colors duration-300`}>
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <AIChatbot />
          <Toaster position="top-right" toastOptions={{ style: { background: 'var(--toast-bg)', color: 'var(--toast-text)', border: '1px solid var(--toast-border)' } }} />
        </ThemeProvider>
      </body>
    </html>
  );
}
