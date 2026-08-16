'use server';

import { getMediaVideos, getSeasonDetails } from '@/lib/tmdb';

export async function fetchTrailerVideo(id: string | number, type: 'movie' | 'tv') {
  try {
    const data = await getMediaVideos(id, type);
    return data;
  } catch (error) {
    console.error('Error fetching trailer:', error);
    throw new Error('Failed to fetch trailer');
  }
}

export async function fetchSeasonData(tvId: string | number, seasonNumber: number) {
  try {
    const data = await getSeasonDetails(tvId, seasonNumber);
    return data;
  } catch (error) {
    console.error('Error fetching season details:', error);
    throw new Error('Failed to fetch season details');
  }
}
