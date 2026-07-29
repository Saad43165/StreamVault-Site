'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { cn } from '@/lib/utils';

const tabs = [
  { label: 'All', value: '', href: (q: string) => `/search?q=${encodeURIComponent(q)}` },
  { label: 'Movies', value: 'movie', href: (q: string) => `/search?q=${encodeURIComponent(q)}&type=movie` },
  { label: 'TV Shows', value: 'tv', href: (q: string) => `/search?q=${encodeURIComponent(q)}&type=tv` },
];

function FilterTabsInner({ query }: { query: string }) {
  const params = useSearchParams();
  const current = params.get('type') ?? '';

  return (
    <div className="flex items-center gap-2">
      {tabs.map((tab) => {
        const active = current === tab.value;
        return (
          <Link
            key={tab.label}
            href={tab.href(query)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              active
                ? 'bg-vault-accent text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white',
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

export default function FilterTabs({ query }: { query: string }) {
  return (
    <Suspense fallback={null}>
      <FilterTabsInner query={query} />
    </Suspense>
  );
}
