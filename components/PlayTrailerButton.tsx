'use client';

import { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';

export default function PlayTrailerButton({ videos }: { videos: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!videos || !Array.isArray(videos)) return null;

  // Find best trailer
  const trailer = videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer' && v.official && v.key) 
               || videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer' && v.key)
               || videos.find((v: any) => v.site === 'YouTube' && v.key);

  if (!trailer || !trailer.key) return null;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2.5 bg-white text-black hover:bg-gray-200 transition-colors py-4 px-6 rounded-xl font-bold text-[15px] shadow-lg hover:scale-[1.02] active:scale-[0.98]"
      >
        <Play className="w-5 h-5 fill-current" />
        Watch Trailer
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="w-full max-w-5xl aspect-video relative bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm"
              aria-label="Close trailer modal"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&showinfo=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </>
  );
}

