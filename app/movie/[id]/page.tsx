import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Play, Star, Clock, Calendar, ChevronLeft, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/site/navbar';
import Footer from '@/components/site/footer';
import CastSection from '@/components/site/cast-section';
import ReadMore from '@/components/site/read-more';
import SectionRow from '@/components/site/section-row';
import DownloadBanner from '@/components/site/download-banner';
import { getDetails, getCredits, getSimilar } from '@/lib/tmdb';
import { imageUrl } from '@/lib/media-images';
import type { MediaItem } from '@/lib/mock-data';

export const revalidate = 3600;

export default async function MovieDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();

  const [movie, credits, similar] = await Promise.all([
    getDetails(id, 'movie'),
    getCredits(id, 'movie'),
    getSimilar(id, 'movie'),
  ]);

  if (!movie) notFound();

  const backdrop = imageUrl(movie.backdropPath || movie.posterPath, 'original');
  const poster = imageUrl(movie.posterPath, 'w500');

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Backdrop */}
        <div className="relative h-[55vh] min-h-[420px] w-full">
          {backdrop && (
            <Image
              src={backdrop}
              alt={movie.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-vault-bg via-vault-bg/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-vault-bg/80 to-transparent" />

          <div className="absolute top-20 left-4 sm:left-6 lg:left-8 z-10">
            <Link
              href="/movies"
              className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white bg-black/40 backdrop-blur px-3 py-1.5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </div>

        {/* Header content */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-40 sm:-mt-48 relative z-10">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Poster */}
            <div className="shrink-0 mx-auto sm:mx-0">
              <div className="relative w-40 sm:w-48 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-white/10">
                {poster ? (
                  <Image
                    src={poster}
                    alt={movie.title}
                    fill
                    sizes="192px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-vault-card" />
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 pt-2 sm:pt-8 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-balance mb-3">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-vault-accent text-sm italic mb-3">
                  &ldquo;{movie.tagline}&rdquo;
                </p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4 text-sm">
                <span className="inline-flex items-center gap-1.5 font-semibold">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {movie.rating.toFixed(1)}
                </span>
                {movie.releaseYear && (
                  <span className="inline-flex items-center gap-1.5 text-white/70">
                    <Calendar className="w-4 h-4" />
                    {movie.releaseYear}
                  </span>
                )}
                {movie.runtime ? (
                  <span className="inline-flex items-center gap-1.5 text-white/70">
                    <Clock className="w-4 h-4" />
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </span>
                ) : null}
              </div>

              {/* Genres */}
              {movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-5">
                  {movie.genres.map((g) => (
                    <span
                      key={g}
                      className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/70"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}

              {/* Synopsis */}
              <div className="mb-6 max-w-2xl mx-auto sm:mx-0">
                <h2 className="text-sm font-semibold text-white/80 mb-1.5">Synopsis</h2>
                <ReadMore text={movie.overview} />
              </div>

              {/* Actions - Multiple provider options */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <a
                  href={`https://vidsrc.pm/embed/movie/${movie.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-vault-accent hover:bg-vault-accent-hover text-white font-bold px-7 py-3 rounded-lg transition-all hover:scale-105 shadow-lg shadow-vault-accent/30"
                >
                  <Play className="w-5 h-5 fill-white" />
                  Watch Now
                </a>
                <a
                  href={`https://multiembed.mov/?video_id=${movie.id}&tmdb=1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-3 rounded-lg transition-colors border border-white/15 text-sm"
                >
                  Mirror 2
                </a>
                <Link
                  href="/download"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg transition-colors border border-white/15"
                >
                  Download App
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Cast */}
        <div className="mt-12">
          <CastSection cast={credits.cast} crew={credits.crew} />
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-12">
            <SectionRow title="More Like This" items={similar} accent />
          </div>
        )}

        <DownloadBanner />
      </main>
      <Footer />
    </>
  );
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const movie = await getDetails(Number(params.id), 'movie');
  if (!movie) return { title: 'Movie — StreamVault' };
  return {
    title: `${movie.title} (${movie.releaseYear}) — StreamVault`,
    description: movie.overview?.slice(0, 160),
  };
}