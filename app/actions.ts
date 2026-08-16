'use server';

import { getMediaVideos } from '@/lib/tmdb';

export async function fetchTrailerVideo(id: string | number, type: 'movie' | 'tv') {
  try {
    const data = await getMediaVideos(id, type);
    return data;
  } catch (error) {
    console.error('Error fetching trailer:', error);
    throw new Error('Failed to fetch trailer');
  }
}
