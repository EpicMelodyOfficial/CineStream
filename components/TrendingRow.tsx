'use client';

import { useState } from 'react';
import MovieCard from '@/components/MovieCard';

export default function TrendingRow({ today, week }: { today: any[], week: any[] }) {
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('day');

  const items = timeWindow === 'day' ? today : week;

  if (!today || today.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
          Trending
        </h2>
        
        {/* Toggle Switch */}
        <div className="inline-flex items-center rounded-full border border-white/20 p-0.5 bg-black/40 backdrop-blur-md self-start sm:self-auto">
          <button
            onClick={() => setTimeWindow('day')}
            className={`px-5 py-1.5 text-[14px] font-semibold rounded-full transition-all duration-300 ${
              timeWindow === 'day' 
                ? 'bg-white text-black shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeWindow('week')}
            className={`px-5 py-1.5 text-[14px] font-semibold rounded-full transition-all duration-300 ${
              timeWindow === 'week'
                ? 'bg-white text-black shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            This Week
          </button>
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
