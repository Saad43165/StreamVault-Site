import Navbar from '@/components/site/navbar';
import Footer from '@/components/site/footer';
import MediaGrid from '@/components/site/media-grid';
import SearchBar from '@/components/site/search-bar';
import FilterTabs from '@/components/site/filter-tabs';
import { Search as SearchIcon } from 'lucide-react';
import { searchMedia } from '@/lib/tmdb';
import type { MediaType } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: { q?: string; type?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (searchParams.q ?? '').trim();
  const typeParam = searchParams.type;
  const type: MediaType | undefined =
    typeParam === 'movie' || typeParam === 'tv' ? typeParam : undefined;

  const results = query ? await searchMedia(query, type) : [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-black mb-1">Search</h1>
          <p className="text-white/50 text-sm mb-6">
            Find your next favorite movie or TV show.
          </p>

          <SearchBar />

          {query && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 mb-6">
              <FilterTabs query={query} />
              <p className="text-sm text-white/50">
                {results.length} result{results.length === 1 ? '' : 's'} for
                &ldquo;<span className="text-white">{query}</span>&rdquo;
              </p>
            </div>
          )}

          {!query ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <SearchIcon className="w-8 h-8 text-white/30" />
              </div>
              <h2 className="text-lg font-semibold mb-1">Start searching</h2>
              <p className="text-white/50 text-sm max-w-sm">
                Type a movie or TV show name above to see results.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <SearchIcon className="w-8 h-8 text-white/30" />
              </div>
              <h2 className="text-lg font-semibold mb-1">No results found</h2>
              <p className="text-white/50 text-sm max-w-sm">
                We couldn&apos;t find anything for &ldquo;{query}&rdquo;. Try a
                different title or check the spelling.
              </p>
            </div>
          ) : (
            <MediaGrid items={results} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
