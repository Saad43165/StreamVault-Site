import Link from 'next/link';
import Image from 'next/image';
import { Star, Play } from 'lucide-react';
import { imageUrl } from '@/lib/media-images';
import type { MediaItem } from '@/lib/mock-data';

export default function MediaGrid({ items }: { items: MediaItem[] }) {
  if (!items.length) {
    return (
      <div className="py-20 text-center text-white/40">
        <p>No results found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
      {items.map((media, i) => {
        const href =
          media.type === 'movie' ? `/movie/${media.id}` : `/tv/${media.id}`;
        const poster = imageUrl(media.posterPath, 'w500');
        return (
          <Link
            key={`${media.type}-${media.id}`}
            href={href}
            className="group relative rounded-xl overflow-hidden bg-vault-card block animate-fade-in"
            style={{ animationDelay: `${Math.min(i * 30, 400)}ms` }}
          >
            <div className="relative aspect-[2/3] overflow-hidden">
              {poster ? (
                <Image
                  src={poster}
                  alt={media.title}
                  fill
                  sizes="(max-width:640px) 33vw, (max-width:1024px) 20vw, 16vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-vault-card to-vault-bg">
                  <Play className="w-8 h-8 text-white/20" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-md px-1.5 py-0.5 text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                {media.rating.toFixed(1)}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-vault-accent scale-90 group-hover:scale-100 transition-transform">
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                </div>
              </div>
            </div>
            <div className="p-2.5">
              <p className="text-xs font-medium line-clamp-1">{media.title}</p>
              <p className="text-[10px] text-white/50">{media.releaseYear}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
