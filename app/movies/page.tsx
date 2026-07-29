import Navbar from '@/components/site/navbar';
import Footer from '@/components/site/footer';
import MediaGrid from '@/components/site/media-grid';
import SectionRow from '@/components/site/section-row';
import {
  getPopularMovies,
  getTrending,
  getActionMovies,
  getComedyMovies,
  getSciFiMovies,
  getHorrorMovies,
  getBollywood,
  getUpcoming,
} from '@/lib/tmdb';

export const revalidate = 3600;

export default async function MoviesPage() {
  const [movies, trending, action, comedy, scifi, horror, bollywood, upcoming] = await Promise.all([
    getPopularMovies(),
    getTrending(),
    getActionMovies(),
    getComedyMovies(),
    getSciFiMovies(),
    getHorrorMovies(),
    getBollywood(),
    getUpcoming(),
  ]);
  const movieTrending = trending.filter((m) => m.type === 'movie');

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-black mb-2">Movies</h1>
          <p className="text-white/50 mb-8">
            Browse our most popular movies, updated daily.
          </p>
        </div>

        <div className="space-y-10 pb-4">
          {movieTrending.length > 0 && (
            <SectionRow title="Trending Movies" items={movieTrending} accent />
          )}
          <SectionRow title="Popular Movies" items={movies} />
          <SectionRow title="Action & Adventure" items={action} />
          <SectionRow title="Comedy" items={comedy} />
          <SectionRow title="Sci-Fi" items={scifi} />
          <SectionRow title="Horror" items={horror} />
          <SectionRow title="Coming Soon" items={upcoming} />
          <SectionRow title="Bollywood" items={bollywood} />
        </div>

        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 mt-8">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
            <span className="w-1.5 h-5 rounded-full bg-vault-accent" />
            All Popular Movies
          </h2>
          <MediaGrid items={movies} />
        </div>
      </main>
      <Footer />
    </>
  );
}
