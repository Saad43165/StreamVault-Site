import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Play, Star, Calendar, Tv, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/site/navbar';
import Footer from '@/components/site/footer';
import CastSection from '@/components/site/cast-section';
import ReadMore from '@/components/site/read-more';
import SectionRow from '@/components/site/section-row';
import DownloadBanner from '@/components/site/download-banner';
import EpisodeBrowser from '@/components/site/episode-browser';
import { getDetails, getCredits, getSimilar, getSeasons } from '@/lib/tmdb';
import { imageUrl } from '@/lib/media-images';

export const revalidate = 3600;

export default async function TVDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();

  const [show, credits, similar, seasons] = await Promise.all([
    getDetails(id, 'tv'),
    getCredits(id, 'tv'),
    getSimilar(id, 'tv'),
    getSeasons(id),
  ]);

  if (!show) notFound();

  const backdrop = imageUrl(show.backdropPath || show.posterPath, 'original');
  const poster = imageUrl(show.posterPath, 'w500');

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Backdrop */}
        <div className="relative h-[55vh] min-h-[420px] w-full">
          {backdrop && (
            <Image
              src={backdrop}
              alt={show.title}
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
              href="/tv"
              className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white bg-black/40 backdrop-blur px-3 py-1.5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-40 sm:-mt-48 relative z-10">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="shrink-0 mx-auto sm:mx-0">
              <div className="relative w-40 sm:w-48 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-white/10">
                {poster ? (
                  <Image
                    src={poster}
                    alt={show.title}
                    fill
                    sizes="192px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-vault-card" />
                )}
              </div>
            </div>

            <div className="flex-1 pt-2 sm:pt-8 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <Tv className="w-4 h-4 text-vault-accent" />
                <span className="text-xs font-semibold text-vault-accent uppercase tracking-wide">
                  TV Series
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-balance mb-3">
                {show.title}
              </h1>
              {show.tagline && (
                <p className="text-vault-accent text-sm italic mb-3">
                  &ldquo;{show.tagline}&rdquo;
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4 text-sm">
                <span className="inline-flex items-center gap-1.5 font-semibold">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {show.rating.toFixed(1)}
                </span>
                {show.releaseYear && (
                  <span className="inline-flex items-center gap-1.5 text-white/70">
                    <Calendar className="w-4 h-4" />
                    {show.releaseYear}
                  </span>
                )}
                <span className="text-white/70">
                  {seasons.filter((s) => s.seasonNumber >= 1).length} Seasons
                </span>
              </div>

              {show.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-5">
                  {show.genres.map((g) => (
                    <span
                      key={g}
                      className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/70"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}

              <div className="mb-6 max-w-2xl mx-auto sm:mx-0">
                <h2 className="text-sm font-semibold text-white/80 mb-1.5">Synopsis</h2>
                <ReadMore text={show.overview} />
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <Link
                  href={`/watch?id=${show.id}&type=tv&season=1&episode=1`}
                  className="inline-flex items-center gap-2 bg-vault-accent hover:bg-vault-accent-hover text-white font-bold px-7 py-3 rounded-lg transition-all hover:scale-105 shadow-lg shadow-vault-accent/30"
                >
                  <Play className="w-5 h-5 fill-white" />
                  Watch S1:E1
                </Link>
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

        {/* Episodes */}
        <div className="mt-10">
          <EpisodeBrowser seasons={seasons} tvId={show.id} showBackdrop={show.backdropPath} />
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
  const show = await getDetails(Number(params.id), 'tv');
  if (!show) return { title: 'TV Show — StreamVault' };
  return {
    title: `${show.title} — StreamVault`,
    description: show.overview?.slice(0, 160),
  };
}
