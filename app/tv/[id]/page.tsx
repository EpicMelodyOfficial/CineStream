import { getTVDetails, TMDBError } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import MediaDetail from '@/components/MediaDetail';

export default async function TVPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let show;
  let errorMsg = null;

  try {
    show = await getTVDetails(id);
  } catch (err: any) {
    errorMsg = err instanceof TMDBError ? err.message : "Failed to load TV show details.";
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

  if (!show) {
    notFound();
  }

  return <MediaDetail media={show} type="tv" />;
}

