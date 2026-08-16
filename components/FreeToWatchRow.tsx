'use client';

import { useState } from 'react';
import MovieCard from '@/components/MovieCard';

export default function FreeToWatchRow({ 
  movies, 
  tv 
}: { 
  movies: any[], 
  tv: any[] 
}) {
  type TabType = 'movies' | 'tv';
  const [activeTab, setActiveTab] = useState<TabType>('movies');

  const items = activeTab === 'movies' ? movies : tv;

  if (!items || (movies.length === 0 && tv.length === 0)) return null;

  const tabs = [
    { id: 'movies', label: 'Movies' },
    { id: 'tv', label: 'TV' }
  ];

  return (
    <div className="mb-24">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6 px-1">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
          Free To Watch
        </h2>
        
        {/* Toggle Switch */}
        <div className="inline-flex items-center rounded-full border border-white/20 p-0.5 bg-black/40 backdrop-blur-md self-start sm:self-auto overflow-x-auto hide-scrollbar max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-1.5 text-[13px] sm:text-[14px] font-semibold rounded-full transition-all duration-300 whitespace-nowrap ${
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
      
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 -mx-4 px-4 md:-mx-8 md:px-8 hide-scrollbar">
        {items.map((item: any) => (
          <div key={item.id} className="snap-start shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]">
            <MovieCard movie={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
