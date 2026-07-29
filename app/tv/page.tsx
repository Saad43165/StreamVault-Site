import Navbar from '@/components/site/navbar';
import Footer from '@/components/site/footer';
import MediaGrid from '@/components/site/media-grid';
import SectionRow from '@/components/site/section-row';
import {
  getPopularTV,
  getTrending,
  getNetflix,
  getPrime,
  getDisney,
  getPakistani,
} from '@/lib/tmdb';

export const revalidate = 3600;

export default async function TVPage() {
  const [shows, trending, netflix, prime, disney, pakistani] = await Promise.all([
    getPopularTV(),
    getTrending(),
    getNetflix(),
    getPrime(),
    getDisney(),
    getPakistani(),
  ]);
  const tvTrending = trending.filter((m) => m.type === 'tv');

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-black mb-2">TV Shows</h1>
          <p className="text-white/50 mb-8">
            Discover popular series and binge-worthy seasons.
          </p>
        </div>

        <div className="space-y-10 pb-4">
          {tvTrending.length > 0 && (
            <SectionRow title="Trending TV Shows" items={tvTrending} accent />
          )}
          <SectionRow title="Popular TV Shows" items={shows} />
          <SectionRow title="On Netflix" items={netflix} />
          <SectionRow title="On Prime Video" items={prime} />
          <SectionRow title="On Disney+" items={disney} />
          <SectionRow title="Pakistani" items={pakistani} />
        </div>

        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 mt-8">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
            <span className="w-1.5 h-5 rounded-full bg-vault-accent" />
            All Popular TV Shows
          </h2>
          <MediaGrid items={shows} />
        </div>
      </main>
      <Footer />
    </>
  );
}
