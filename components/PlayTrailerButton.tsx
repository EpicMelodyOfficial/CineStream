'use client';

import { useState } from 'react';
import { Play, X } from 'lucide-react';

export default function PlayTrailerButton({ videos }: { videos: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  // Find best trailer
  const trailer = videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) 
               || videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer')
               || videos.find((v: any) => v.site === 'YouTube');

  if (!trailer) return null;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors font-semibold group"
      >
        <div className="flex items-center justify-center w-12 h-12 bg-black/30 rounded-full border border-white/20 group-hover:bg-black/50 transition-colors">
          <Play className="w-5 h-5 ml-1 fill-current" />
        </div>
        Play Trailer
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
