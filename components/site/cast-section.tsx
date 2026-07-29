import Image from 'next/image';
import { User } from 'lucide-react';
import { imageUrl } from '@/lib/media-images';
import type { CastMember, CrewMember } from '@/lib/mock-data';

export default function CastSection({
  cast,
  crew,
}: {
  cast: CastMember[];
  crew: CrewMember[];
}) {
  if (!cast.length && !crew.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-12">
      <h2 className="text-xl font-bold mb-5">Cast & Crew</h2>

      {crew.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {crew.map((c) => (
            <span
              key={`${c.id}-${c.job}`}
              className="inline-flex items-center gap-1.5 text-sm bg-white/5 border border-white/10 rounded-full px-3 py-1.5"
            >
              <span className="text-white/50">{c.job}:</span>
              <span className="font-medium">{c.name}</span>
            </span>
          ))}
        </div>
      )}

      {cast.length > 0 && (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {cast.map((member) => {
            const img = member.profilePath
              ? imageUrl(member.profilePath, 'w185')
              : null;
            return (
              <div
                key={member.id}
                className="shrink-0 w-24 sm:w-28 text-center group"
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-vault-card border-2 border-white/10 group-hover:border-vault-accent transition-colors">
                  {img ? (
                    <Image
                      src={img}
                      alt={member.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <User className="w-10 h-10 text-white/20" />
                    </div>
                  )}
                </div>
                <p className="text-xs font-semibold mt-2 line-clamp-1">{member.name}</p>
                <p className="text-[11px] text-white/50 line-clamp-1">{member.character}</p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
