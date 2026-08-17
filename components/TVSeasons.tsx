'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/tmdb';
import { fetchSeasonData } from '@/app/actions';
import { ChevronDown, Calendar, Clock, Star } from 'lucide-react';

export default function TVSeasons({ seasons, tvId }: { seasons: any[], tvId: number }) {
  const [activeSeason, setActiveSeason] = useState<number | null>(null);
  const [seasonDetails, setSeasonDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const filteredSeasons = seasons.filter((s: any) => s.season_number > 0);

  const handleSeasonClick = async (seasonNumber: number) => {
    if (activeSeason === seasonNumber) {
      setActiveSeason(null);
      setSeasonDetails(null);
      return;
    }
    
    setActiveSeason(seasonNumber);
    setLoading(true);
    try {
      const data = await fetchSeasonData(tvId, seasonNumber);
      setSeasonDetails(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr?: string, full?: boolean) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return full 
      ? d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatYear = (dateStr?: string) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d.getFullYear();
  };

  if (filteredSeasons.length === 0) return null;

  return (
    <div className="mb-20">
      <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">Seasons</h3>
      <div className="flex gap-4 overflow-x-auto pb-8 snap-x -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar mask-fade-edges">
        {filteredSeasons.map((season: any) => (
          <div 
            key={season.id || season.season_number} 
            className={`w-[140px] md:w-[160px] shrink-0 snap-start group bg-white/5 border rounded-xl overflow-hidden hover:bg-white/10 transition-colors cursor-pointer ${activeSeason === season.season_number ? 'border-white/50 ring-2 ring-white/20' : 'border-white/10'}`}
            onClick={() => handleSeasonClick(season.season_number)}
          >
            <div className="aspect-[2/3] w-full relative bg-black/50">
              {season.poster_path ? (
                <Image src={getImageUrl(season.poster_path, 'w500')} alt={season.name || 'Season'} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20">
                  <span className="text-[10px] uppercase tracking-widest">No Poster</span>
                </div>
              )}
              {activeSeason === season.season_number && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <ChevronDown className="w-10 h-10 text-white animate-bounce" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h4 className="font-bold text-[15px] text-white line-clamp-1 mb-1">{season.name}</h4>
              <div className="text-[12px] text-white/60 space-y-0.5">
                <p>{season.episode_count || 0} Episode{season.episode_count !== 1 && 's'}</p>
                {formatYear(season.air_date) && <p>Released {formatYear(season.air_date)}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeSeason && (
        <div className="mt-4 p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-500">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : seasonDetails ? (
            <div>
              <div className="flex flex-col md:flex-row gap-8 mb-10">
                {seasonDetails.poster_path && (
                  <div className="w-32 md:w-48 shrink-0 rounded-xl overflow-hidden ring-1 ring-white/10 hidden md:block">
                    <Image src={getImageUrl(seasonDetails.poster_path, 'w500')} alt={seasonDetails.name || 'Season Poster'} width={200} height={300} className="w-full h-auto object-cover" />
                  </div>
                )}
                <div>
                  <h4 className="text-3xl font-bold text-white mb-2">{seasonDetails.name}</h4>
                  <div className="flex items-center gap-4 text-[14px] font-medium text-white/60 mb-6">
                    {formatDate(seasonDetails.air_date, true) && (
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate(seasonDetails.air_date, true)}</span>
                    )}
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {seasonDetails.episodes?.length || 0} Episodes</span>
                  </div>
                  <p className="text-white/80 leading-relaxed text-lg max-w-3xl">
                    {seasonDetails.overview || 'No overview available for this season.'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-lg font-bold text-white/90 mb-6 uppercase tracking-widest text-[13px]">Episodes</h5>
                {seasonDetails.episodes?.map((episode: any) => (
                  <div key={episode.id || episode.episode_number} className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 rounded-xl bg-black/40 hover:bg-white/5 border border-white/5 transition-colors group">
                    <div className="w-full sm:w-48 aspect-video shrink-0 rounded-lg overflow-hidden relative bg-white/5">
                      {episode.still_path ? (
                        <Image src={getImageUrl(episode.still_path, 'w500')} alt={episode.name || 'Episode'} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 text-xs uppercase tracking-wider">No Image</div>
                      )}
                      <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[11px] font-bold text-white">
                        E{episode.episode_number}
                      </div>
                    </div>
                    <div className="flex-1 py-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <h6 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">{episode.name}</h6>
                        <div className="flex items-center gap-3 text-[13px] font-medium text-white/50 shrink-0">
                          {formatDate(episode.air_date) && <span>{formatDate(episode.air_date)}</span>}
                          {typeof episode.vote_average === 'number' && episode.vote_average > 0 && (
                            <span className="flex items-center gap-1 text-white/80 bg-white/10 px-1.5 py-0.5 rounded">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              {episode.vote_average.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-[14px] text-white/60 line-clamp-3 leading-relaxed">
                        {episode.overview || 'No overview available.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-white/50 text-center py-10">Failed to load season details.</p>
          )}
        </div>
      )}
    </div>
  );
}
