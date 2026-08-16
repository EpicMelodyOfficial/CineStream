import { getMovieDetails, TMDBError } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import MediaDetail from '@/components/MediaDetail';

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let movie;
  let errorMsg = null;

  try {
    movie = await getMovieDetails(id);
  } catch (err: any) {
    errorMsg = err instanceof TMDBError ? err.message : "Failed to load movie details.";
  }

  if (errorMsg) {
    return (
      <div className="container mx-auto px-4 py-20 text-center flex justify-center">
        <div className="rounded-xl bg-red-500/10 p-6 border border-red-500/20 max-w-2xl flex gap-4 items-start text-red-400">
          <AlertCircle className="h-6 w-6 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    notFound();
  }

  return <MediaDetail media={movie} type="movie" />;
}

