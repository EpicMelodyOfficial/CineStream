import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'CineStream - Movie Reviews & Ratings',
  description: 'Movie ratings, reviews, and streaming provider information powered by TMDB.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans min-h-screen bg-black text-white selection:bg-white/20 selection:text-white antialiased flex flex-col" suppressHydrationWarning>
        <Navbar />
        
        <div className="flex-1">
          {children}
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-black py-8 md:py-12 mt-auto">
          <div className="container mx-auto px-4 md:px-8 max-w-[1400px] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
            <p>Copyright © 2026 CineStream. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-white transition-colors">Legal</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
