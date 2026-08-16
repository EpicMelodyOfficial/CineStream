import { getPopularMovies, searchMedia, getNowPlayingMovies, getPopularTVShows, getMediaImages, TMDBError, getTrending, getOnTheAirTVShows, getStreamingMovies, getForRentMovies, getFreeMovies, getFreeTVShows } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import HeroSlider from '@/components/HeroSlider';
import TrendingRow from '@/components/TrendingRow';
import LatestTrailersRow from '@/components/LatestTrailersRow';
import WhatsPopularRow from '@/components/WhatsPopularRow';
import FreeToWatchRow from '@/components/FreeToWatchRow';
import { AlertCircle, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Suspense } from 'react';

// Reusable component for horizontal scrolling lists
function MediaRow({ title, items }: { title: string, items: any[] }) {
  if (!items || items.length === 0) return null;
  
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
          {title}
        </h2>
        <button className="text-[13px] font-semibold text-white/50 hover:text-white transition-colors flex items-center gap-1">
          See All <ChevronRight className="h-3.5 w-3.5" />
        </button>
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

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = params.q;
  
  let searchResults = [];
  let popularMovies = [];
  let nowPlaying = [];
  let popularTVShows = [];
  let trendingToday = [];
  let trendingWeek = [];
  let onTheAir = [];
  let streaming = [];
  let forRent = [];
  let freeMovies = [];
  let freeTv = [];
  let errorMsg = null;

  try {
    if (query) {
      const data = await searchMedia(query);
      searchResults = data?.results || [];
    } else {
      const [popMoviesData, nowPlayingData, popTVData, trendingTodayData, trendingWeekData, onTheAirData, streamingData, forRentData, freeMoviesData, freeTvData] = await Promise.all([
        getPopularMovies(),
        getNowPlayingMovies(),
        getPopularTVShows(),
        getTrending('day'),
        getTrending('week'),
        getOnTheAirTVShows(),
        getStreamingMovies(),
        getForRentMovies(),
        getFreeMovies(),
        getFreeTVShows()
      ]);
      popularMovies = popMoviesData?.results || [];
      nowPlaying = nowPlayingData?.results || [];
      popularTVShows = popTVData?.results || [];
      trendingToday = trendingTodayData?.results || [];
      trendingWeek = trendingWeekData?.results || [];
      onTheAir = onTheAirData?.results || [];
      streaming = streamingData?.results || [];
      forRent = forRentData?.results || [];
      freeMovies = freeMoviesData?.results || [];
      freeTv = freeTvData?.results || [];

      // Fetch logos for top 5 nowPlaying items for the Hero Slider
      const top5NowPlaying = nowPlaying.filter((m: any) => m.backdrop_path).slice(0, 5);
      await Promise.all(top5NowPlaying.map(async (item: any) => {
        try {
          const type = item.media_type || (item.name ? 'tv' : 'movie');
          const images = await getMediaImages(item.id, type);
          if (images.logos && images.logos.length > 0) {
            // Find English logo or the first available one
            const enLogo = images.logos.find((l: any) => l.iso_639_1 === 'en');
            item.logo_path = (enLogo || images.logos[0]).file_path;
          }
        } catch (e) {
          // Ignore if logo fetch fails
        }
      }));
    }
  } catch (err: any) {
    errorMsg = err instanceof TMDBError ? err.message : "Failed to fetch media.";
  }

  // Get a random backdrop from the highest profile available list
  let randomBackdrop = null;
  const backdropSource = query ? searchResults : nowPlaying;
  if (backdropSource.length > 0) {
    const validMovies = backdropSource.filter((m: any) => m.backdrop_path);
    if (validMovies.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(10, validMovies.length));
      randomBackdrop = validMovies[randomIndex].backdrop_path;
    }
  }

  return (
    <>
      <main className="flex-1 w-full relative overflow-hidden flex flex-col">
        
        {/* Apple TV+ Style Hero Slider (Edge-to-edge, only show when not searching) */}
        {!query && nowPlaying.length > 0 && (
          <div className="w-full">
            <HeroSlider items={nowPlaying.filter((m: any) => m.backdrop_path)} />
          </div>
        )}

        <div className={`container mx-auto px-4 md:px-8 max-w-[1400px] relative z-20 ${!query ? 'mt-8 md:mt-12' : 'pt-24 mt-8 md:mt-12'}`}>
          {errorMsg ? (
            <div className="rounded-2xl bg-red-500/10 p-6 border border-red-500/20 max-w-2xl mx-auto flex gap-4 items-start text-red-400 backdrop-blur-xl mb-12">
              <AlertCircle className="h-6 w-6 shrink-0" />
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-red-300">Configuration Required</h3>
                <p className="text-sm">{errorMsg}</p>
                <p className="text-sm mt-2">
                  To fix this, go to your project settings and add a valid <strong>TMDB_API_KEY</strong> secret.
                </p>
              </div>
            </div>
          ) : query ? (
            <div className="space-y-8 mb-24">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                  Search Results for "{query}"
                </h2>
              </div>
              
              {searchResults.length === 0 ? (
                <div className="text-center py-24 text-white/50">
                  No movies or shows found matching &quot;{query}&quot;. Try a different search term.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {searchResults.map((item: any) => (
                    <MovieCard key={item.id} movie={item} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 mb-24">
              <TrendingRow today={trendingToday} week={trendingWeek} />
              <LatestTrailersRow 
                popular={popularMovies}
                streaming={streaming}
                onTv={onTheAir} 
                forRent={forRent}
                inTheaters={nowPlaying} 
              />
              <WhatsPopularRow 
                streaming={streaming}
                onTv={onTheAir} 
                forRent={forRent}
                inTheaters={nowPlaying} 
              />
              <FreeToWatchRow 
                movies={freeMovies} 
                tv={freeTv} 
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
