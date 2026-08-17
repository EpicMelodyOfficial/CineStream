import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { getImageUrl } from '@/lib/tmdb';

interface Media {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type?: 'movie' | 'tv' | 'person';
}

export default function MovieCard({ movie }: { movie: Media }) {
  if (!movie || !movie.id || movie.media_type === 'person') return null;

  const title = movie.title || movie.name || 'Untitled';
  const dateStr = movie.release_date || movie.first_air_date;
  
  let formattedDate = '';
  if (dateStr) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      if (!isNaN(date.getTime())) {
        formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    } else {
      formattedDate = dateStr;
    }
  }

  const rating = typeof movie.vote_average === 'number' && movie.vote_average > 0 ? movie.vote_average.toFixed(1) : 'NR';
  const type = movie.media_type || (movie.name ? 'tv' : 'movie');

  return (
    <Link href={`/${type}/${movie.id}`} className="group flex flex-col gap-3">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-[#1c1c1e] transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-white/5">
        <Image
          src={getImageUrl(movie.poster_path)}
          alt={title}
          fill
          referrerPolicy="no-referrer"
          className="object-cover transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
        />
      </div>
      
      <div className="flex flex-col gap-1 px-1">
        <h3 className="line-clamp-1 text-[15px] font-semibold tracking-tight text-white transition-colors">
          {title}
        </h3>
        <div className="flex items-center justify-between text-[14px] text-gray-400">
          <span>{formattedDate}</span>
          <div className="flex items-center gap-1 text-[13px] font-medium">
            <Star className="h-3.5 w-3.5 fill-current text-white" />
            <span>{rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
