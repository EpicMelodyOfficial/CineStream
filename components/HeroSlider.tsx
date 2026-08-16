'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Info } from 'lucide-react';
import { getImageUrl } from '@/lib/tmdb';

export default function HeroSlider({ items }: { items: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!items || items.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % Math.min(5, items.length));
    }, 6000); // 6 seconds per slide

    return () => clearInterval(interval);
  }, [items]);

  if (!items || items.length === 0) return null;

  const displayItems = items.slice(0, 5); // Max 5 items in slider

  return (
    <div className="relative w-full overflow-hidden bg-black h-[85vh] min-h-[600px] md:h-[95vh] xl:h-[100vh] group shadow-2xl">
      {displayItems.map((item, index) => {
        const isActive = index === currentIndex;
        const title = item.title || item.name;
        const type = item.media_type || (item.name ? 'tv' : 'movie');
        const overview = item.overview;
        const year = (item.release_date || item.first_air_date) ? new Date(item.release_date || item.first_air_date).getFullYear() : '';
        
        return (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive && isMounted ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            aria-hidden={!isActive}
          >
            {/* Background Image */}
            <Image
              src={getImageUrl(item.backdrop_path, 'original')}
              alt={title}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
              priority={index === 0} // Only prioritize the first image to prevent slow LCP
            />

            {/* Top gradient to ensure fixed navbar text is always legible */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

            {/* Bottom gradient to seamlessly merge with the black page background */}
            <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />

            {/* Left gradient for text readability */}
            <div className="absolute inset-0 w-full md:w-2/3 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:px-8 md:px-12 lg:px-[max(5%,calc((100vw-1400px)/2+32px))] pb-16 md:pb-24 w-full md:w-3/4 lg:w-2/3 pointer-events-none">
              <div
                className={`transition-all duration-1000 transform pointer-events-auto ${
                  isActive && isMounted ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-8 opacity-0'
                }`}
              >
                {/* Meta details */}
                <div className="flex items-center gap-3 mb-3 text-sm font-semibold tracking-wide text-white/70 uppercase">
                  <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-sm text-white">
                    {type === 'tv' ? 'TV Series' : 'Movie'}
                  </span>
                  {year && <span>{year}</span>}
                </div>

                {/* Title or Logo */}
                {item.logo_path ? (
                  <div className="relative w-64 md:w-80 h-20 md:h-28 mb-6 drop-shadow-lg">
                    <Image
                      src={getImageUrl(item.logo_path, 'original')}
                      alt={title}
                      fill
                      className="object-contain object-left-bottom"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 line-clamp-2 drop-shadow-lg">
                    {title}
                  </h2>
                )}

                {/* Overview */}
                <p className="text-white/80 text-base md:text-lg line-clamp-2 md:line-clamp-3 mb-8 max-w-xl text-shadow-sm font-medium">
                  {overview}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <Link
                    href={`/${type}/${item.id}`}
                    className="flex items-center gap-2 bg-white text-black px-6 py-3 md:px-8 md:py-3.5 rounded-full font-semibold text-[15px] hover:scale-105 transition-transform duration-300"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Watch Now
                  </Link>
                  <Link
                    href={`/${type}/${item.id}`}
                    className="flex items-center gap-2 bg-white/20 text-white backdrop-blur-xl px-6 py-3 md:px-8 md:py-3.5 rounded-full font-semibold text-[15px] hover:bg-white/30 transition-colors duration-300"
                  >
                    <Info className="w-5 h-5" />
                    Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Pagination Indicators */}
      <div className="absolute bottom-6 md:bottom-8 left-0 right-0 z-20 flex justify-center gap-2 pointer-events-none">
        {displayItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-500 rounded-full h-1.5 md:h-2 pointer-events-auto ${
              index === currentIndex ? 'w-6 md:w-8 bg-white' : 'w-1.5 md:w-2 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
