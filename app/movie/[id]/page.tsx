import { getMovieDetails, getImageUrl, TMDBError } from '@/lib/tmdb';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, Clock, Calendar, ArrowLeft, Play, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';
  const runtimeHours = movie.runtime ? Math.floor(movie.runtime / 60) : 0;
  const runtimeMins = movie.runtime ? movie.runtime % 60 : 0;
  
  // Try to find US watch providers, fallback to first available if US doesn't exist
  const providersData = movie['watch/providers']?.results || {};
  const providers = providersData['US'] || Object.values(providersData)[0];
  const reviews = movie.reviews?.results || [];
  const cast = movie.credits?.cast?.slice(0, 5) || [];

  return (
    <>
      {/* Ambient Blurred Background for Movie Page */}
      <div className="fixed inset-0 z-[-1] overflow-hidden bg-black pointer-events-none">
        <Image
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt="Ambient Background"
          fill
          className="object-cover opacity-30 blur-[100px] scale-110"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <main className="pb-20">
        {/* Backdrop Header */}
        <div className="relative h-[50vh] md:h-[65vh] w-full overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={getImageUrl(movie.backdrop_path, 'original')}
              alt={movie.title}
              fill
              referrerPolicy="no-referrer"
              className="object-cover opacity-50"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </div>
          
          <div className="container relative mx-auto h-full px-4 flex items-end pb-8 max-w-[1400px]">
            <Link href="/" className="absolute top-20 left-4 inline-flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-[15px] font-medium text-white backdrop-blur-2xl transition-colors hover:bg-black/60">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-40 relative z-10 max-w-[1400px]">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          
          {/* Poster Column */}
          <div className="w-56 shrink-0 md:w-80 mx-auto md:mx-0">
            <div className="aspect-[2/3] w-full overflow-hidden rounded-2xl bg-[#1c1c1e] shadow-2xl">
              <Image
                src={getImageUrl(movie.poster_path)}
                alt={movie.title}
                width={500}
                height={750}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>

          {/* Details Column */}
          <div className="flex-1 flex flex-col justify-end md:pt-40">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-4 text-center md:text-left">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8 text-[15px] font-medium text-gray-400">
              <div className="flex items-center gap-1.5">
                {year}
              </div>
              <div className="flex items-center gap-1.5">
                {runtimeHours > 0 ? `${runtimeHours}h ` : ''}{runtimeMins}m
              </div>
              <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-md">
                <Star className="h-4 w-4 fill-white text-white" />
                <span className="text-white">{rating}</span>
              </div>
              <div className="flex items-center gap-2">
                {movie.genres?.map((g: any) => (
                  <span key={g.id} className="rounded-md bg-[#1c1c1e] px-2.5 py-1 text-xs text-white">
                    {g.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-12 text-center md:text-left text-gray-400 leading-relaxed text-[17px] max-w-3xl">
              {movie.overview}
            </div>

            {/* Watch Providers Section */}
            {providers && (providers.flatrate || providers.rent || providers.buy) && (
              <div className="rounded-3xl bg-[#1c1c1e] p-8 mb-12">
                <h3 className="flex items-center gap-2 text-xl font-medium text-white mb-6">
                  <Play className="h-5 w-5 text-white" />
                  Where to Watch
                </h3>
                
                <div className="space-y-6">
                  {providers.flatrate && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Stream</h4>
                      <div className="flex flex-wrap gap-3">
                        {providers.flatrate.map((p: any) => (
                          <div key={p.provider_id} className="flex items-center gap-3 rounded-xl bg-black px-3 py-2" title={p.provider_name}>
                            <Image 
                              src={getImageUrl(p.logo_path, 'original')} 
                              alt={p.provider_name} 
                              width={28} 
                              height={28} 
                              className="rounded-md"
                              referrerPolicy="no-referrer"
                            />
                            <span className="text-sm font-medium text-white">{p.provider_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {providers.rent && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Rent or Buy</h4>
                      <div className="flex flex-wrap gap-3">
                        {providers.rent.map((p: any) => (
                          <div key={p.provider_id} className="flex items-center gap-3 rounded-xl bg-black px-3 py-2" title={p.provider_name}>
                            <Image 
                              src={getImageUrl(p.logo_path, 'original')} 
                              alt={p.provider_name} 
                              width={28} 
                              height={28} 
                              className="rounded-md"
                              referrerPolicy="no-referrer"
                            />
                            <span className="text-sm font-medium text-white">{p.provider_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cast & Crew and Reviews Grid */}
        <div className="grid md:grid-cols-[1fr_320px] gap-16 mt-20">
          
          {/* Reviews Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              User Reviews
              <span className="text-[13px] font-semibold text-gray-400 rounded-full bg-[#1c1c1e] px-2.5 py-0.5">
                {reviews.length}
              </span>
            </h2>
            
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review: any) => (
                  <div key={review.id} className="rounded-3xl bg-[#1c1c1e] p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-12 w-12 overflow-hidden rounded-full bg-black">
                        {review.author_details?.avatar_path ? (
                          <Image
                            src={getImageUrl(review.author_details.avatar_path, 'original')}
                            alt={review.author}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-lg font-bold text-gray-500">
                            {review.author.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-white">A review by {review.author}</div>
                        <div className="text-[13px] text-gray-400 mt-0.5">
                          {new Date(review.created_at).toLocaleDateString()} 
                          {review.author_details?.rating && ` • ${review.author_details.rating}/10`}
                        </div>
                      </div>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed line-clamp-6 hover:line-clamp-none transition-all">
                      <ReactMarkdown>{review.content}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 border-dashed p-12 text-center text-gray-500">
                No reviews found for this movie yet.
              </div>
            )}
          </div>

          {/* Cast Sidebar */}
          <div>
            <h2 className="text-xl font-bold text-white mb-8">Top Cast</h2>
            <div className="space-y-5">
              {cast.map((actor: any) => (
                <div key={actor.id} className="flex items-center gap-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[#1c1c1e]">
                    {actor.profile_path ? (
                      <Image
                        src={getImageUrl(actor.profile_path)}
                        alt={actor.name}
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-600">
                        <Star className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[15px] font-medium text-white">{actor.name}</span>
                    <span className="text-[13px] text-gray-500">{actor.character}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
    </>
  );
}
