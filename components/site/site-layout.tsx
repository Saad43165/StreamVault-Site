import Navbar from '@/components/site/navbar';
import Footer from '@/components/site/footer';

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
