import Navbar from '@/components/site/navbar';
import Footer from '@/components/site/footer';
import { HeroSkeleton, SectionRowSkeleton } from '@/components/site/skeletons';

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HeroSkeleton />
        <div className="space-y-10 pt-10">
          <SectionRowSkeleton />
          <SectionRowSkeleton />
          <SectionRowSkeleton />
          <SectionRowSkeleton />
          <SectionRowSkeleton />
        </div>
      </main>
      <Footer />
    </>
  );
}
