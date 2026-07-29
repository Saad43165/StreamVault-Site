import Navbar from '@/components/site/navbar';
import Footer from '@/components/site/footer';
import { Info, Mail, Shield, Heart } from 'lucide-react';

export const metadata = { title: 'About — StreamVault' };

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl sm:text-4xl font-black mb-2">About StreamVault</h1>
          <p className="text-white/50 mb-10">
            Your home for movies and TV shows in HD.
          </p>

          <div className="space-y-6">
            <div className="rounded-2xl bg-vault-card border border-white/5 p-6">
              <Info className="w-8 h-8 text-vault-accent mb-3" />
              <h2 className="text-lg font-semibold mb-2">Who we are</h2>
              <p className="text-white/60 leading-relaxed">
                StreamVault is a free streaming platform that brings together
                thousands of movies and TV shows from across the globe. From the
                latest blockbusters to beloved classics, Bollywood hits to
                Pakistani dramas — we make it easy to find and watch what you love.
              </p>
            </div>

            <div className="rounded-2xl bg-vault-card border border-white/5 p-6">
              <Shield className="w-8 h-8 text-vault-accent mb-3" />
              <h2 className="text-lg font-semibold mb-2">Our promise</h2>
              <p className="text-white/60 leading-relaxed">
                No ads, no sign-ups, no hassle. We aggregate streams from multiple
                providers so you always have a working source, and our mobile app
                adds a mini player, offline downloads and multi-profile support.
              </p>
            </div>

            <div className="rounded-2xl bg-vault-card border border-white/5 p-6">
              <Mail className="w-8 h-8 text-vault-accent mb-3" />
              <h2 className="text-lg font-semibold mb-2">Contact us</h2>
              <p className="text-white/60 leading-relaxed">
                Questions, feedback or partnership inquiries? Reach our team at{' '}
                <a
                  href="mailto:hello@streamvault.app"
                  className="text-vault-accent hover:underline"
                >
                  hello@streamvault.app
                </a>
                .
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-vault-card to-vault-accent/10 border border-vault-accent/20 p-6 flex items-start gap-4">
              <Heart className="w-8 h-8 text-vault-accent shrink-0" />
              <div>
                <h2 className="text-lg font-semibold mb-1">Disclaimer</h2>
                <p className="text-white/60 leading-relaxed text-sm">
                  StreamVault does not host any media files on its servers. All
                  content is aggregated from third-party providers. We are not
                  responsible for the accuracy, compliance, copyright, or any
                  other aspect of the content linked to or from this website.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
