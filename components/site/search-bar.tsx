'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';

function SearchBarInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');

  useEffect(() => {
    setQuery(params.get('q') ?? '');
  }, [params]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  return (
    <form onSubmit={submit} className="relative w-full max-w-2xl">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies and TV shows..."
        autoFocus
        className="w-full bg-vault-card border border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-base text-white placeholder:text-white/40 focus:outline-none focus:border-vault-accent focus:bg-white/5 transition-all"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery('');
            router.push('/search');
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
          aria-label="Clear"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </form>
  );
}

export default function SearchBar() {
  return (
    <Suspense fallback={<div className="w-full max-w-2xl h-12 bg-vault-card rounded-xl" />}>
      <SearchBarInner />
    </Suspense>
  );
}
