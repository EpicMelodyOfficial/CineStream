// lib/tmdb.ts

const BASE_URL = 'https://api.themoviedb.org/3';

export class TMDBError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'TMDBError';
    this.status = status;
  }
}

async function fetchTMDB(endpoint: string, params: Record<string, string> = {}, retries = 1): Promise<any> {
  const TMDB_API_KEY = process.env.TMDB_API_KEY?.trim();
  
  if (!TMDB_API_KEY) {
    throw new TMDBError("TMDB_API_KEY is missing. Please add it to your environment variables.");
  }

  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...params
  });

  const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      // Cache for 1 hour
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      if (response.status >= 500 && retries > 0) {
        // Retry once on server-side 5xx errors
        await new Promise((res) => setTimeout(res, 500));
        return fetchTMDB(endpoint, params, retries - 1);
      }
      throw new TMDBError(`TMDB API Error: ${response.status} ${response.statusText}`, response.status);
    }

    return await response.json();
  } catch (error: any) {
    if (error instanceof TMDBError) {
      throw error;
    }
    if (retries > 0) {
      await new Promise((res) => setTimeout(res, 500));
      return fetchTMDB(endpoint, params, retries - 1);
    }
    throw new TMDBError(`Network error while contacting TMDB: ${error.message || 'Unknown error'}`);
  }
}

export async function getPopularMovies() {
  return fetchTMDB('/movie/popular');
}

export async function getNowPlayingMovies() {
  return fetchTMDB('/movie/now_playing');
}

export async function getPopularTVShows() {
  return fetchTMDB('/tv/popular');
}

export async function getOnTheAirTVShows() {
  return fetchTMDB('/tv/on_the_air');
}

export async function getStreamingMovies() {
  return fetchTMDB('/discover/movie', {
    with_watch_providers: '8|119|337|384',
    watch_region: 'US'
  });
}

export async function getForRentMovies() {
  return fetchTMDB('/discover/movie', {
    with_watch_monetization_types: 'rent',
    watch_region: 'US'
  });
}

export async function getFreeMovies() {
  return fetchTMDB('/discover/movie', {
    with_watch_monetization_types: 'free',
    watch_region: 'US'
  });
}

export async function getFreeTVShows() {
  return fetchTMDB('/discover/tv', {
    with_watch_monetization_types: 'free',
    watch_region: 'US'
  });
}

export async function getTrending(timeWindow: 'day' | 'week' = 'day') {
  return fetchTMDB(`/trending/all/${timeWindow}`);
}

export async function searchMedia(query: string) {
  if (!query || !query.trim()) return { results: [] };
  return fetchTMDB('/search/multi', { query: query.trim() });
}

export async function getMediaVideos(id: string | number, type: 'movie' | 'tv' = 'movie') {
  return fetchTMDB(`/${type}/${id}/videos`);
}

export async function getSeasonDetails(tvId: string | number, seasonNumber: number) {
  return fetchTMDB(`/tv/${tvId}/season/${seasonNumber}`);
}

export async function getMovieDetails(id: string) {
  return fetchTMDB(`/movie/${id}`, { 
    append_to_response: 'reviews,watch/providers,credits,recommendations,videos,keywords' 
  });
}

export async function getTVDetails(id: string) {
  return fetchTMDB(`/tv/${id}`, { 
    append_to_response: 'reviews,watch/providers,credits,recommendations,videos,keywords' 
  });
}

export async function getMediaImages(id: string | number, type: 'movie' | 'tv' = 'movie') {
  return fetchTMDB(`/${type}/${id}/images`, { include_image_language: 'en,null' });
}

export function getImageUrl(path: string | null | undefined, size: 'w500' | 'original' = 'w500') {
  if (!path) return 'https://picsum.photos/seed/movie/500/750';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `https://image.tmdb.org/t/p/${size}${cleanPath}`;
}

