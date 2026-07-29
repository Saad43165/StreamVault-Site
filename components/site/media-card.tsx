'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { imageUrl } from '@/lib/media-images';
import type { MediaItem } from '@/lib/mock-data';

interface MediaCardProps {
  media: MediaItem;
  className?: string;
  index?: number;
}

export default function MediaCard({ media, className, index = 0 }: MediaCardProps) {
  const href = media.type === 'movie' ? `/movie/${media.id}` : `/tv/${media.id}`;
  const poster = imageUrl(media.posterPath, 'w500');

  return (
    <Link
      href={href}
      className={cn(
        'group relative shrink-0 w-[140px] sm:w-[160px] md:w-[180px] rounded-xl overflow-hidden bg-vault-card block animate-fade-in',
        className,
      )}
      style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        {poster ? (
          <Image
            src={poster}
            alt={media.title}
            fill
            sizes="180px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-vault-card to-vault-bg">
            <Play className="w-8 h-8 text-white/20" />
          </div>
        )}

        {/* Top rating badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-md px-1.5 py-0.5 text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          {media.rating.toFixed(1)}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <div className="w-full">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-vault-accent mx-auto mb-2 scale-90 group-hover:scale-100 transition-transform">
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
            <p className="text-xs font-semibold text-center line-clamp-1">{media.title}</p>
            <p className="text-[10px] text-white/60 text-center">{media.releaseYear}</p>
          </div>
        </div>
      </div>

      {/* Title bar (visible by default on mobile, hidden on hover for desktop) */}
      <div className="p-2.5 sm:hidden">
        <p className="text-xs font-medium line-clamp-1">{media.title}</p>
        <p className="text-[10px] text-white/50">{media.releaseYear}</p>
      </div>
    </Link>
  );
}
