'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Film, UserCircle } from 'lucide-react';
import HeaderSearch from '@/components/HeaderSearch';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Set background state
          setIsScrolled(currentScrollY > 10);

          // Hide on scroll down, show on scroll up
          if (currentScrollY > lastScrollY && currentScrollY > 80) {
            setIsHidden(true);
          } else if (currentScrollY < lastScrollY) {
            setIsHidden(false);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 z-50 w-full transition-transform duration-300 ease-in-out ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div 
        className={`w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-black/80 backdrop-blur-2xl border-b border-white/10 supports-[backdrop-filter]:bg-black/60 shadow-lg' 
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4 md:px-8 max-w-[1400px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Film className="h-5 w-5 text-white" />
          <span className="text-lg font-display font-semibold tracking-tight text-white hidden sm:inline-block">CineStream</span>
        </Link>

        {/* Centered Navigation */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="text-[13px] font-medium text-white transition-colors hover:text-white/80">Home</Link>
          <Link href="/" className="text-[13px] font-medium text-gray-400 transition-colors hover:text-white">Movies</Link>
          <Link href="/" className="text-[13px] font-medium text-gray-400 transition-colors hover:text-white">TV Shows</Link>
          <Link href="/" className="text-[13px] font-medium text-gray-400 transition-colors hover:text-white">My List</Link>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-3 md:gap-6">
          <Suspense fallback={<div className="w-32 sm:w-40 md:w-48 lg:w-64 h-8 bg-white/10 rounded-full animate-pulse" />}>
            <HeaderSearch />
          </Suspense>
          <button className="text-gray-400 hover:text-white transition-colors shrink-0">
            <UserCircle className="h-[22px] w-[22px]" />
          </button>
        </div>
      </div>
      </div>
    </header>
  );
}
