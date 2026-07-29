import Navbar from '@/components/site/navbar';
import Footer from '@/components/site/footer';
import Hero from '@/components/site/hero';
import SectionRow from '@/components/site/section-row';
import DownloadBanner from '@/components/site/download-banner';
import {
  getTrending,
  getPopularMovies,
  getPopularTV,
  getNetflix,
  getPrime,
  getDisney,
  getActionMovies,
  getComedyMovies,
  getSciFiMovies,
  getHorrorMovies,
  getUpcoming,
  getBollywood,
  getPakistani,
} from '@/lib/tmdb';

export const revalidate = 3600;

export default async function Home() {
  const [
    trending,
    popularMovies,
    popularTV,
    netflix,
    prime,
    disney,
    action,
    comedy,
    scifi,
    horror,
    upcoming,
    bollywood,
    pakistani,
  ] = await Promise.all([
    getTrending(),
    getPopularMovies(),
    getPopularTV(),
    getNetflix(),
    getPrime(),
    getDisney(),
    getActionMovies(),
    getComedyMovies(),
    getSciFiMovies(),
    getHorrorMovies(),
    getUpcoming(),
    getBollywood(),
    getPakistani(),
  ]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Hero items={trending} />
        <div className="relative z-10 -mt-10 space-y-10 sm:space-y-12 pb-10">
          <SectionRow title="Trending Now" items={trending} accent />
          <SectionRow title="Popular Movies" items={popularMovies} />
          <SectionRow title="Popular TV Shows" items={popularTV} />
          <SectionRow title="On Netflix" items={netflix} />
          <SectionRow title="On Prime Video" items={prime} />
          <SectionRow title="On Disney+" items={disney} />
          <SectionRow title="Action & Adventure" items={action} />
          <SectionRow title="Comedy" items={comedy} />
          <SectionRow title="Sci-Fi" items={scifi} />
          <SectionRow title="Horror" items={horror} />
          <SectionRow title="Coming Soon" items={upcoming} />
          <SectionRow title="Bollywood" items={bollywood} />
          <SectionRow title="Pakistani" items={pakistani} />
        </div>
        <DownloadBanner />
      </main>
      <Footer />
    </>
  );
}
