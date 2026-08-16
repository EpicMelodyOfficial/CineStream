import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/tmdb';
import { ArrowLeft, ExternalLink, Star, User } from 'lucide-react';
import PlayTrailerButton from './PlayTrailerButton';
import MovieCard from './MovieCard';

export default function MediaDetail({ media, type }: { media: any, type: 'movie' | 'tv' }) {
  const title = type === 'movie' ? media.title : media.name;
  const releaseDateStr = type === 'movie' ? media.release_date : media.first_air_date;
  const year = releaseDateStr ? new Date(releaseDateStr).getFullYear() : '';

  // Runtime
  const runtime = type === 'movie' ? media.runtime : (media.episode_run_time?.[0] || 0);
  const runtimeHours = runtime ? Math.floor(runtime / 60) : 0;
  const runtimeMins = runtime ? runtime % 60 : 0;
  const runtimeStr = runtime > 0 ? `${runtimeHours > 0 ? `${runtimeHours}h ` : ''}${runtimeMins}m` : '';

  // User Score (e.g., 8.5)
  const score = media.vote_average ? media.vote_average.toFixed(1) : 'NR';

  // Crew (Directors or Creators)
  let keyPeople: { name: string; jobs: string[] }[] = [];
  if (type === 'movie' && media.credits?.crew) {
    const rawCrew = media.credits.crew.filter((c: any) => c.job === 'Director' || c.job === 'Writer').slice(0, 4);
    const unique = new Map();
    for (const person of rawCrew) {
      if (!unique.has(person.id)) {
        unique.set(person.id, { name: person.name, jobs: [person.job] });
      } else {
        const existing = unique.get(person.id);
        if (!existing.jobs.includes(person.job)) existing.jobs.push(person.job);
      }
    }
    keyPeople = Array.from(unique.values());
  } else if (type === 'tv' && media.created_by) {
    keyPeople = media.created_by.map((c: any) => ({ name: c.name, jobs: ['Creator'] }));
  }

  const cast = media.credits?.cast?.slice(0, 10) || [];
  const recommendations = media.recommendations?.results || [];
  
  // Format Money
  const formatMoney = (amount: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const providersData = media['watch/providers']?.results || {};
  const providers = providersData['US'] || Object.values(providersData)[0];

  return (
    <main className="relative min-h-screen bg-[#050505] text-white selection:bg-white/30 pb-32 overflow-hidden">
      
      {/* Ambient Blur Background */}
      {media.backdrop_path && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Image
            src={getImageUrl(media.backdrop_path, 'original')}
            alt="ambient"
            fill
            className="object-cover opacity-[0.15] blur-[100px] scale-110 saturate-[1.2]"
            priority
          />
        </div>
      )}

      {/* Header Fade Overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 pt-8 md:pt-16 max-w-[1400px]">
        
        {/* Navigation */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 md:mb-16 font-medium text-[13px] uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* LEFT COLUMN - Sticky Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3 order-2 lg:order-1">
            <div className="lg:sticky lg:top-12 space-y-8">
              
              {/* Poster Frame */}
              <div className="relative aspect-[2/3] w-[60%] md:w-[45%] lg:w-full mx-auto overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-2xl bg-white/5">
                <Image
                  src={getImageUrl(media.poster_path, 'w500')}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />
              </div>

              {/* Action Button */}
              {media.videos?.results && (
                <PlayTrailerButton videos={media.videos.results} />
              )}

              {/* Watch Providers (Stream) */}
              {providers?.flatrate && (
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl p-6">
                  <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-4">Stream Now On</p>
                  <div className="flex flex-wrap gap-3">
                    {providers.flatrate.map((p: any) => (
                      <div key={p.provider_id} className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-white/10" title={p.provider_name}>
                        <Image src={getImageUrl(p.logo_path, 'w500')} alt={p.provider_name} width={48} height={48} className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Facts Bento Box */}
              <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl p-6 space-y-6">
                 <div>
                   <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1.5">Status</p>
                   <p className="font-medium text-white/90 text-[15px]">{media.status || '-'}</p>
                 </div>
                 
                 <div>
                   <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1.5">Original Language</p>
                   <p className="font-medium text-white/90 text-[15px] uppercase">{media.original_language || '-'}</p>
                 </div>

                 {type === 'movie' && (
                   <>
                     <div>
                       <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1.5">Budget</p>
                       <p className="font-medium text-white/90 text-[15px]">{formatMoney(media.budget)}</p>
                     </div>
                     <div>
                       <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1.5">Revenue</p>
                       <p className="font-medium text-white/90 text-[15px]">{formatMoney(media.revenue)}</p>
                     </div>
                   </>
                 )}

                 {type === 'tv' && media.networks?.length > 0 && (
                   <div>
                     <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-3">Network</p>
                     <div className="bg-white p-2 rounded-lg inline-block">
                       <Image src={getImageUrl(media.networks[0].logo_path, 'w500')} alt={media.networks[0].name} width={80} height={30} className="object-contain h-6 w-auto" />
                     </div>
                   </div>
                 )}

                 {media.homepage && (
                   <div className="pt-2">
                     <a href={media.homepage} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-white/90 hover:text-white transition-colors font-semibold text-[14px]">
                       <ExternalLink className="w-4 h-4" />
                       Visit Homepage
                     </a>
                   </div>
                 )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Main Info */}
          <div className="lg:col-span-8 xl:col-span-9 order-1 lg:order-2">
             
             {/* Title */}
             <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold tracking-tighter text-white mb-4 leading-[1.1] drop-shadow-2xl">
               {title}
             </h1>

             {/* Tagline */}
             {media.tagline && (
               <p className="text-xl md:text-3xl font-light text-white/50 mb-8 italic drop-shadow-md">
                 "{media.tagline}"
               </p>
             )}

             {/* Badges / Metadata */}
             <div className="flex flex-wrap items-center gap-3 mb-10">
               <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/5 px-4 py-1.5 rounded-full text-[15px] font-semibold text-white">
                 <Star className="w-4 h-4 fill-current text-yellow-500" />
                 <span>{score}</span>
               </div>
               
               {year && (
                 <div className="bg-white/5 backdrop-blur-md border border-white/5 px-4 py-1.5 rounded-full text-[15px] font-medium text-white/80">
                   {year}
                 </div>
               )}
               
               {runtimeStr && (
                 <div className="bg-white/5 backdrop-blur-md border border-white/5 px-4 py-1.5 rounded-full text-[15px] font-medium text-white/80">
                   {runtimeStr}
                 </div>
               )}
               
               {type === 'tv' && media.number_of_seasons && (
                 <div className="bg-white/5 backdrop-blur-md border border-white/5 px-4 py-1.5 rounded-full text-[15px] font-medium text-white/80">
                   {media.number_of_seasons} Season{media.number_of_seasons !== 1 && 's'}
                 </div>
               )}
             </div>

             {/* Genres */}
             {media.genres?.length > 0 && (
               <div className="flex flex-wrap gap-2 mb-12">
                 {media.genres.map((g: any) => (
                   <span key={g.id} className="px-5 py-2 rounded-full border border-white/20 text-[14px] font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-default">
                     {g.name}
                   </span>
                 ))}
               </div>
             )}

             {/* Overview */}
             <div className="mb-16">
               <h3 className="text-[11px] font-bold tracking-widest uppercase text-white/40 mb-5">Synopsis</h3>
               <p className="text-lg md:text-2xl text-white/80 leading-relaxed font-light max-w-4xl">
                 {media.overview || 'No overview available.'}
               </p>
             </div>

             {/* Directed / Created By */}
             {keyPeople.length > 0 && (
               <div className="mb-20">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                   {keyPeople.map((person, idx) => (
                     <div key={idx}>
                       <p className="font-semibold text-white text-[17px] mb-1">{person.name}</p>
                       <p className="text-[13px] text-white/40 uppercase tracking-wide font-medium">{person.jobs.join(', ')}</p>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             {/* Top Cast */}
             {cast.length > 0 && (
               <div className="mb-20">
                 <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">Top Cast</h3>
                 <div className="flex gap-6 overflow-x-auto pb-8 snap-x -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar mask-fade-edges">
                   {cast.map((actor: any) => (
                     <div key={actor.id} className="w-[110px] shrink-0 snap-start group">
                       <div className="w-[110px] h-[110px] rounded-full overflow-hidden bg-white/5 border border-white/10 mb-4 group-hover:border-white/30 transition-colors">
                         {actor.profile_path ? (
                           <Image src={getImageUrl(actor.profile_path, 'w500')} alt={actor.name} width={110} height={110} className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-white/20">
                             <User className="w-8 h-8" />
                           </div>
                         )}
                       </div>
                       <div className="text-center">
                         <p className="font-semibold text-[14px] text-white leading-tight line-clamp-1 mb-1">{actor.name}</p>
                         <p className="text-[12px] text-white/50 line-clamp-2 leading-snug">{actor.character}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             {/* Recommendations */}
             {recommendations.length > 0 && (
               <div>
                 <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">More Like This</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                   {recommendations.slice(0, 8).map((item: any) => (
                     <div key={item.id}>
                       <MovieCard movie={item} />
                     </div>
                   ))}
                 </div>
               </div>
             )}

          </div>
        </div>
      </div>
    </main>
  );
}
