'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Info, Star } from 'lucide-react';
import { heroImage } from '@/lib/media-images';
import type { MediaItem } from '@/lib/mock-data';

export default function Hero({ items }: { items: MediaItem[] }) {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (items.length) setIndex(Math.floor(Math.random() * items.length));
  }, [items.length]);

  if (!items.length) return null;
  const media = items[index];
  const href = media.type === 'movie' ? `/movie/${media.id}` : `/tv/${media.id}`;
  const backdrop = heroImage(media.backdropPath || media.posterPath);

  return (
    <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden">
      {/* Backdrop */}
      {backdrop && (
        <Image
          src={backdrop}
          alt={media.title}
          fill
          priority
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-vault-bg via-vault-bg/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-vault-bg/90 via-vault-bg/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-16 sm:pb-24">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 bg-vault-accent text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                Featured
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/80">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                {media.rating.toFixed(1)}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-balance mb-4 drop-shadow-lg">
              {media.title}
            </h1>
            <p className="text-sm sm:text-base text-white/80 line-clamp-3 mb-6 max-w-xl">
              {media.overview}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/watch?id=${media.id}&type=${media.type}`}
                className="inline-flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-lg hover:bg-white/90 transition-all hover:scale-105 shadow-xl"
              >
                <Play className="w-5 h-5 fill-black" />
                Watch Now
              </Link>
              <Link
                href={href}
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/25 transition-all border border-white/20"
              >
                <Info className="w-5 h-5" />
                More Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
