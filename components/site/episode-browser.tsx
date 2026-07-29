'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, ChevronDown, Calendar, Clock, Tv } from 'lucide-react';
import { imageUrl } from '@/lib/media-images';
import type { Season } from '@/lib/mock-data';

// Per-show episode stills (real TMDB backdrop paths) so each series shows
// its own imagery instead of one shared placeholder. Keyed by tvId.
const SHOW_STILLS: Record<string, string[]> = {
  '1399': ['/suopoADq0k8YZrLBdhdsoNCoAS0.jpg', '/2Swn1Qtb1NGE2S6hGaRTzm8PxGz.jpg', '/ajKtKJhu1LpZbHWF7tiVbwve9Kh.jpg'],
  '66732': ['/56v2KjBlY4a1hJm7sQj8q1Y9KSM.jpg', '/nMReLr7TrvA6gN6s2KZ9P5xQ4oR.jpg', '/49WJfeN0moxb9IPf9uHjsk47gSF.jpg'],
  '60625': ['/gFZriCkpJYsApPZEF3jhcL1CKjV.jpg', '/reEMJA1uzscCpnpeNmvCLpenWHv.jpg'],
};

function stillFor(tvId: number, epNumber: number, fallbackPath: string): string | null {
  const stills = SHOW_STILLS[String(tvId)];
  if (stills?.length) return stills[epNumber % stills.length];
  if (fallbackPath) return fallbackPath;
  return null;
}

function EpisodeCard({
  ep,
  tvId,
  fallbackBackdrop,
}: {
  ep: Season['episodes'][number];
  tvId: number;
  fallbackBackdrop: string;
}) {
  const [imgError, setImgError] = useState(false);
  const still = stillFor(tvId, ep.episodeNumber, ep.stillPath || fallbackBackdrop);
  const stillUrl = still ? imageUrl(still, 'w500') : null;

  return (
    <Link
      href={`/watch?id=${tvId}&type=tv&season=${ep.seasonNumber}&episode=${ep.episodeNumber}`}
      className="group rounded-xl overflow-hidden bg-vault-card border border-white/5 hover:border-vault-accent/40 transition-all hover:scale-[1.02]"
    >
      <div className="relative aspect-video overflow-hidden bg-vault-card">
        {stillUrl && !imgError ? (
          <Image
            src={stillUrl}
            alt={ep.name}
            fill
            sizes="(max-width:640px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-vault-accent/20 via-vault-card to-black flex flex-col items-center justify-center gap-2">
            <Tv className="w-8 h-8 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-vault-accent/90 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur text-xs font-bold px-2 py-0.5 rounded">
          E{ep.episodeNumber}
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold line-clamp-1 mb-1">
          {ep.episodeNumber}. {ep.name}
        </p>
        <p className="text-xs text-white/50 line-clamp-2 mb-2">{ep.overview}</p>
        <div className="flex items-center gap-3 text-[11px] text-white/40">
          {ep.runtime > 0 && (
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {ep.runtime}m
            </span>
          )}
          {ep.airDate && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {ep.airDate}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function EpisodeBrowser({
  seasons,
  tvId,
  showBackdrop,
}: {
  seasons: Season[];
  tvId: number;
  showBackdrop?: string;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(
    seasons.find((s) => s.seasonNumber >= 1) ?? seasons[0],
  );

  if (!seasons.length) {
    return <p className="text-white/40 text-sm">No season information available.</p>;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-10">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-xl font-bold">Episodes</h2>
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/15 hover:border-vault-accent rounded-lg px-4 py-2 text-sm font-medium transition-colors min-w-[160px] justify-between"
          >
            <span>{selected?.name}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 mt-2 z-20 min-w-[200px] bg-vault-card border border-white/10 rounded-lg shadow-2xl overflow-hidden animate-fade-in">
                {seasons.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelected(s);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors flex items-center justify-between ${
                      selected?.id === s.id ? 'text-vault-accent' : 'text-white/80'
                    }`}
                  >
                    <span>{s.name}</span>
                    <span className="text-xs text-white/40">{s.episodeCount} ep</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {selected?.overview && (
        <p className="text-sm text-white/50 mb-5 max-w-2xl">{selected.overview}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {selected?.episodes.map((ep) => (
          <EpisodeCard key={ep.id} ep={ep} tvId={tvId} fallbackBackdrop={showBackdrop ?? ''} />
        ))}
      </div>
    </section>
  );
}
