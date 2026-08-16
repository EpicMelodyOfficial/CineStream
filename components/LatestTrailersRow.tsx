'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, X } from 'lucide-react';
import { getImageUrl } from '@/lib/tmdb';
import { fetchTrailerVideo } from '@/app/actions';

export default function LatestTrailersRow({ 
  popular, 
  streaming, 
  onTv, 
  forRent, 
  inTheaters 
}: { 
  popular: any[], 
  streaming: any[], 
  onTv: any[], 
  forRent: any[], 
  inTheaters: any[] 
}) {
  type TabType = 'popular' | 'streaming' | 'onTv' | 'forRent' | 'inTheaters';
  const [activeTab, setActiveTab] = useState<TabType>('popular');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // State for the video player modal
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isFetchingVideo, setIsFetchingVideo] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  const getActiveItems = () => {
    switch (activeTab) {
      case 'popular': return popular;
      case 'streaming': return streaming;
      case 'onTv': return onTv;
      case 'forRent': return forRent;
      case 'inTheaters': return inTheaters;
      default: return popular;
    }
  };

  const activeItems = getActiveItems();
  const trailerItems = activeItems?.filter(item => item.backdrop_path).slice(0, 15) || [];

  const handlePlayTrailer = async (item: any) => {
    try {
      setIsFetchingVideo(true);
      setVideoError(null);
      const type = item.media_type || (item.name ? 'tv' : 'movie');
      const data = await fetchTrailerVideo(item.id, type);
      
      const videos = data.results || [];
      // Prefer official trailers on YouTube
      const trailer = videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) 
                   || videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer')
                   || videos.find((v: any) => v.site === 'YouTube');
                   
      if (trailer) {
        setPlayingVideoId(trailer.key);
      } else {
        setVideoError('No trailer available for this title.');
        setTimeout(() => setVideoError(null), 3000);
      }
    } catch (err) {
      setVideoError('Failed to load trailer.');
      setTimeout(() => setVideoError(null), 3000);
    } finally {
      setIsFetchingVideo(false);
    }
  };

  if (trailerItems.length === 0) return null;

  return (
    <div className="relative mb-12 -mx-4 md:-mx-8 px-4 md:px-8 py-10 transition-colors duration-500 overflow-hidden">
      {/* Dynamic Background with transition */}
      <div className="absolute inset-0 z-0 bg-black">
        {trailerItems.map((item, index) => (
          <div 
            key={`${activeTab}-${item.id}`}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image 
              src={getImageUrl(item.backdrop_path, 'original')}
              alt={item.title || item.name || 'Trailer Background'}
              fill
              className="object-cover opacity-60 md:opacity-70 saturate-[1.1] transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            {/* Gradient overlay to blend with the page */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black via-black/20 to-transparent" />
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent" />
          </div>
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8 px-1">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-md">
            Latest Trailers
          </h2>
          
          {/* Toggle Switch */}
          <div className="inline-flex items-center rounded-full border border-white/20 p-0.5 bg-white/5 backdrop-blur-md self-start sm:self-auto overflow-x-auto hide-scrollbar max-w-full">
            {[
              { id: 'popular', label: 'Popular' },
              { id: 'streaming', label: 'Streaming' },
              { id: 'onTv', label: 'On TV' },
              { id: 'forRent', label: 'For Rent' },
              { id: 'inTheaters', label: 'In Theaters' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as TabType); setHoveredIndex(null); }}
                className={`px-4 sm:px-5 py-1.5 text-[13px] sm:text-[14px] font-semibold rounded-full transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-white text-black shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 hide-scrollbar">
          {trailerItems.map((item: any, index: number) => (
            <div 
              key={item.id} 
              className="snap-start shrink-0 w-[280px] sm:w-[320px] md:w-[360px] group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handlePlayTrailer(item)}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-3 shadow-[0_8px_20px_rgba(0,0,0,0.4)] group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={getImageUrl(item.backdrop_path, 'w500')}
                  alt={item.title || item.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                    {isFetchingVideo && hoveredIndex === index ? (
                      <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                    )}
                  </div>
                </div>
              </div>
              <div className="text-center px-2">
                <h3 className="text-white font-bold text-base md:text-lg line-clamp-1 drop-shadow-md">
                  {item.title || item.name}
                </h3>
                <p className="text-white/70 text-sm drop-shadow-sm">Official Trailer</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Error Message overlay */}
      {videoError && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-[100] backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4">
          {videoError}
        </div>
      )}

      {/* Video Player Modal */}
      {playingVideoId && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
          onClick={() => setPlayingVideoId(null)}
        >
          <div 
            className="w-full max-w-5xl aspect-video relative bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setPlayingVideoId(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${playingVideoId}?autoplay=1&rel=0&showinfo=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
