'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { getImageUrl } from '@/lib/tmdb';

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

  if (trailerItems.length === 0) return null;

  return (
    <div className="relative mb-12 -mx-4 md:-mx-8 px-4 md:px-8 py-10 transition-colors duration-500 overflow-hidden">
      {/* Dynamic Background with transition */}
      <div className="absolute inset-0 z-0 bg-[#0d253f]">
        {trailerItems.map((item, index) => (
          <div 
            key={`${activeTab}-${item.id}`}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image 
              src={getImageUrl(item.backdrop_path, 'original')}
              alt={item.title || item.name || 'Trailer Background'}
              fill
              className="object-cover opacity-30"
              referrerPolicy="no-referrer"
            />
            {/* Gradient overlay to blend with the page */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#04152d] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d253f] via-transparent to-transparent opacity-80" />
          </div>
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8 px-1">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-md">
            Latest Trailers
          </h2>
          
          {/* Toggle Switch */}
          <div className="inline-flex items-center rounded-full border border-[#1ed5a9]/50 p-0.5 bg-[#0d253f]/80 backdrop-blur-md self-start sm:self-auto overflow-x-auto hide-scrollbar max-w-full">
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
                    ? 'bg-[#1ed5a9] text-[#0d253f] shadow-sm'
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
                    <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
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
    </div>
  );
}
