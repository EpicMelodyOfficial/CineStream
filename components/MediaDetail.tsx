import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/tmdb';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import PlayTrailerButton from './PlayTrailerButton';
import MovieCard from './MovieCard';

export default function MediaDetail({ media, type }: { media: any, type: 'movie' | 'tv' }) {
  const title = type === 'movie' ? media.title : media.name;
  const originalTitle = type === 'movie' ? media.original_title : media.original_name;
  const releaseDateStr = type === 'movie' ? media.release_date : media.first_air_date;
  const year = releaseDateStr ? new Date(releaseDateStr).getFullYear() : '';
  
  // Format Date: MM/DD/YYYY
  let formattedDate = '';
  if (releaseDateStr) {
    const parts = releaseDateStr.split('-');
    if (parts.length === 3) {
      const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      formattedDate = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    } else {
      formattedDate = releaseDateStr;
    }
  }

  // Runtime
  const runtime = type === 'movie' ? media.runtime : (media.episode_run_time?.[0] || 0);
  const runtimeHours = runtime ? Math.floor(runtime / 60) : 0;
  const runtimeMins = runtime ? runtime % 60 : 0;
  const runtimeStr = runtime > 0 ? `${runtimeHours > 0 ? `${runtimeHours}h ` : ''}${runtimeMins}m` : '';

  // User Score
  const score = media.vote_average ? Math.round(media.vote_average * 10) : 0;
  let scoreColor = 'border-green-500 text-green-500';
  if (score < 70 && score >= 40) scoreColor = 'border-yellow-500 text-yellow-500';
  if (score < 40) scoreColor = 'border-red-500 text-red-500';

  // Crew (Directors or Creators)
  let keyPeople = [];
  if (type === 'movie' && media.credits?.crew) {
    keyPeople = media.credits.crew.filter((c: any) => c.job === 'Director' || c.job === 'Writer').slice(0, 3);
    // deduplicate
    const unique = new Map();
    for (const person of keyPeople) {
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

  // Keywords
  const keywordsData = type === 'movie' ? media.keywords?.keywords : media.keywords?.results;
  const keywords = keywordsData || [];

  return (
    <main className="bg-white dark:bg-[#0d253f] min-h-screen text-black dark:text-white pb-20">
      {/* Back Button (Floating) */}
      <div className="absolute top-4 left-4 z-50 md:hidden">
        <Link href="/" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white backdrop-blur-md">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      {/* Hero / Banner Section */}
      <div className="relative w-full bg-black overflow-hidden flex items-center border-b border-gray-800 dark:border-white/10" style={{ minHeight: '600px' }}>
        {/* Backdrop Background */}
        {media.backdrop_path && (
          <div className="absolute inset-0 z-0">
            <Image
              src={getImageUrl(media.backdrop_path, 'original')}
              alt={title}
              fill
              className="object-cover opacity-30 md:opacity-50"
              priority
            />
            {/* TMDB Style Gradient Overlay (darker on the left) */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent hidden md:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent md:hidden" />
          </div>
        )}

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-4 py-8 md:py-16 max-w-7xl mt-12 md:mt-0">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
            
            {/* Poster */}
            <div className="w-64 md:w-[300px] shrink-0 rounded-xl overflow-hidden shadow-2xl relative z-10 border border-white/10">
              <Image
                src={getImageUrl(media.poster_path)}
                alt={title}
                width={300}
                height={450}
                className="w-full h-auto object-cover"
                priority
              />
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col justify-center text-center md:text-left mt-4 md:mt-10">
              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                {title} <span className="font-normal opacity-70">({year})</span>
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4 mt-2 text-sm md:text-base text-gray-300">
                {formattedDate && <span>{formattedDate} (US)</span>}
                {formattedDate && <span className="hidden md:inline">•</span>}
                {media.genres && media.genres.length > 0 && (
                  <span>{media.genres.map((g: any) => g.name).join(', ')}</span>
                )}
                {runtimeStr && <span className="hidden md:inline">•</span>}
                {runtimeStr && <span>{runtimeStr}</span>}
              </div>

              {/* Actions Row */}
              <div className="flex items-center justify-center md:justify-start gap-6 mt-8 mb-6">
                <div className="flex items-center gap-2">
                  <div className={`flex items-center justify-center w-16 h-16 rounded-full bg-black/50 border-4 ${scoreColor} backdrop-blur-md`}>
                    <span className="text-xl font-bold text-white">{score > 0 ? `${score}%` : 'NR'}</span>
                  </div>
                  <span className="font-bold text-white leading-tight w-12">User<br/>Score</span>
                </div>
                
                {media.videos?.results && (
                  <PlayTrailerButton videos={media.videos.results} />
                )}
              </div>

              {media.tagline && (
                <div className="text-lg italic text-gray-400 mt-2 mb-4 font-serif">
                  {media.tagline}
                </div>
              )}

              <div className="mt-2">
                <h3 className="text-xl font-semibold text-white mb-2">Overview</h3>
                <p className="text-gray-200 leading-relaxed max-w-3xl">
                  {media.overview || 'No overview available.'}
                </p>
              </div>

              {keyPeople.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                  {keyPeople.map((person: any, idx: number) => (
                    <div key={idx}>
                      <p className="font-bold text-white">{person.name}</p>
                      <p className="text-sm text-gray-400">{person.jobs.join(', ')}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Body Layout */}
      <div className="container mx-auto px-4 py-10 max-w-7xl flex flex-col md:flex-row gap-8">
        
        {/* Main Content (Left) */}
        <div className="flex-1 overflow-hidden">
          
          {/* Top Billed Cast */}
          <section className="mb-10">
            <h3 className="text-2xl font-bold mb-6 text-black dark:text-white">Top Billed Cast</h3>
            <div className="flex gap-4 overflow-x-auto pb-6 snap-x -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar">
              {cast.length > 0 ? cast.map((actor: any) => (
                <div key={actor.id} className="w-[140px] shrink-0 bg-white dark:bg-[#1c1c1e] rounded-lg shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden snap-start">
                  <div className="h-[200px] w-full bg-gray-200 dark:bg-gray-800 relative">
                    {actor.profile_path ? (
                      <Image
                        src={getImageUrl(actor.profile_path, 'w500')}
                        alt={actor.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-[15px] leading-tight text-black dark:text-white">{actor.name}</p>
                    <p className="text-[13px] text-gray-600 dark:text-gray-400 mt-1">{actor.character}</p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500">No cast information available.</p>
              )}
            </div>
            {/* Note: In a full app, we might link to "Full Cast & Crew" */}
          </section>

          <hr className="border-gray-200 dark:border-gray-800 my-8" />

          {/* Recommendations */}
          <section className="mb-10">
            <h3 className="text-2xl font-bold mb-6 text-black dark:text-white">Recommendations</h3>
            <div className="flex gap-4 overflow-x-auto pb-6 snap-x -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar">
              {recommendations.length > 0 ? recommendations.map((item: any) => (
                <div key={item.id} className="w-[180px] shrink-0 snap-start">
                  {/* TMDB recommendations usually use backdrop_path instead of poster, but we can reuse MovieCard which handles it well */}
                  <MovieCard movie={item} />
                </div>
              )) : (
                <p className="text-gray-500">No recommendations available.</p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar (Right) */}
        <div className="w-full md:w-[260px] shrink-0 mt-8 md:mt-0">
          <div className="space-y-6 text-[15px]">
            
            {media.homepage && (
              <a href={media.homepage} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-blue-600 dark:text-[#1ed5a9] hover:underline font-medium">
                <ExternalLink className="w-4 h-4" />
                Visit Homepage
              </a>
            )}

            <div>
              <p className="font-bold text-black dark:text-white">Status</p>
              <p className="text-gray-700 dark:text-gray-300">{media.status || '-'}</p>
            </div>
            
            <div>
              <p className="font-bold text-black dark:text-white">Original Language</p>
              <p className="text-gray-700 dark:text-gray-300 uppercase">{media.original_language || '-'}</p>
            </div>

            {type === 'movie' && (
              <>
                <div>
                  <p className="font-bold text-black dark:text-white">Budget</p>
                  <p className="text-gray-700 dark:text-gray-300">{formatMoney(media.budget)}</p>
                </div>
                <div>
                  <p className="font-bold text-black dark:text-white">Revenue</p>
                  <p className="text-gray-700 dark:text-gray-300">{formatMoney(media.revenue)}</p>
                </div>
              </>
            )}

            {type === 'tv' && media.networks?.length > 0 && (
              <div>
                <p className="font-bold text-black dark:text-white mb-2">Network</p>
                <div className="bg-white rounded-md inline-block p-2">
                  <Image 
                    src={getImageUrl(media.networks[0].logo_path, 'w500')} 
                    alt={media.networks[0].name}
                    width={100}
                    height={40}
                    className="object-contain h-8 w-auto"
                  />
                </div>
              </div>
            )}

            {keywords.length > 0 && (
              <div>
                <p className="font-bold text-black dark:text-white mb-3">Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((k: any) => (
                    <span key={k.id} className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-md text-[13px] border border-gray-300 dark:border-gray-700">
                      {k.name}
                    </span>
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
