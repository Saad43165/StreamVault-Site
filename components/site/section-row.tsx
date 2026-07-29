'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MediaCard from './media-card';
import type { MediaItem } from '@/lib/mock-data';

interface SectionRowProps {
  title: string;
  items: MediaItem[];
  accent?: boolean;
}

export default function SectionRow({ title, items, accent }: SectionRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (!items.length) return null;

  return (
    <section className="group/row relative">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold">
            {accent && <span className="w-1.5 h-5 rounded-full bg-vault-accent" />}
            {title}
          </h2>
        </div>
      </div>

      <div className="relative">
        {/* Scroll buttons */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="hidden md:flex absolute left-0 top-0 bottom-0 z-10 w-12 items-center justify-center bg-gradient-to-r from-vault-bg/80 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <span className="w-9 h-9 rounded-full bg-black/60 backdrop-blur flex items-center justify-center hover:bg-vault-accent transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </span>
        </button>
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="hidden md:flex absolute right-0 top-0 bottom-0 z-10 w-12 items-center justify-center bg-gradient-to-l from-vault-bg/80 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <span className="w-9 h-9 rounded-full bg-black/60 backdrop-blur flex items-center justify-center hover:bg-vault-accent transition-colors">
            <ChevronRight className="w-5 h-5" />
          </span>
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-2"
        >
          {items.map((item, i) => (
            <MediaCard key={`${item.type}-${item.id}`} media={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
