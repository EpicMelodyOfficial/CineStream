// lib/tmdb.ts

const BASE_URL = 'https://api.themoviedb.org/3';

export class TMDBError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TMDBError';
  }
}

async function fetchTMDB(endpoint: string, params: Record<string, string> = {}) {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  
  if (!TMDB_API_KEY) {
    throw new TMDBError("TMDB_API_KEY is missing. Please add it to your environment variables.");
  }

  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...params
  });

  const response = await fetch(`${BASE_URL}${endpoint}?${queryParams.toString()}`, {
    // Cache for 1 hour to avoid hitting API limits
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new TMDBError(`TMDB API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
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
  return fetchTMDB('/search/multi', { query });
}

export async function getMediaVideos(id: string | number, type: 'movie' | 'tv' = 'movie') {
  return fetchTMDB(`/${type}/${id}/videos`);
}

export async function getMovieDetails(id: string) {
  // append_to_response allows us to fetch related data in a single request!
  return fetchTMDB(`/movie/${id}`, { 
    append_to_response: 'reviews,watch/providers,credits' 
  });
}

export async function getTVDetails(id: string) {
  return fetchTMDB(`/tv/${id}`, { 
    append_to_response: 'reviews,watch/providers,credits' 
  });
}

export async function getMediaImages(id: string | number, type: 'movie' | 'tv' = 'movie') {
  return fetchTMDB(`/${type}/${id}/images`, { include_image_language: 'en,null' });
}

export function getImageUrl(path: string | null, size: 'w500' | 'original' = 'w500') {
  if (!path) return 'https://picsum.photos/seed/movie/500/750'; // Fallback
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
