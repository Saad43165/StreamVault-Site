import Link from 'next/link';
import { Download, Smartphone, Zap } from 'lucide-react';

export default function DownloadBanner() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 my-16">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-vault-card via-vault-card to-vault-accent/20 border border-vault-accent/20 p-8 sm:p-12">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-vault-accent/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-vault-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-vault-accent bg-vault-accent/10 px-3 py-1 rounded-full mb-4">
              <Zap className="w-3.5 h-3.5" />
              Mobile App
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Take StreamVault anywhere
            </h2>
            <p className="text-white/60 max-w-lg mb-6 mx-auto md:mx-0">
              12+ streaming sources, zero ads, mini player, offline downloads and
              multi-profile support. All in one beautiful app.
            </p>
            <Link
              href="/download"
              className="inline-flex items-center gap-2 bg-vault-accent hover:bg-vault-accent-hover text-white font-bold px-6 py-3 rounded-lg transition-all hover:scale-105 shadow-lg shadow-vault-accent/30"
            >
              <Download className="w-5 h-5" />
              Download for Android
            </Link>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <div className="relative">
              <div className="w-40 h-72 rounded-[2rem] border-4 border-white/10 bg-gradient-to-b from-vault-bg to-black overflow-hidden shadow-2xl">
                <div className="flex flex-col items-center justify-center h-full p-4 gap-3">
                  <Smartphone className="w-10 h-10 text-vault-accent" />
                  <div className="w-full h-1.5 rounded-full bg-white/10" />
                  <div className="w-3/4 h-1.5 rounded-full bg-white/10" />
                  <div className="w-5/6 h-1.5 rounded-full bg-white/10" />
                  <div className="grid grid-cols-2 gap-2 w-full mt-2">
                    <div className="aspect-[2/3] rounded-lg bg-vault-accent/30" />
                    <div className="aspect-[2/3] rounded-lg bg-white/10" />
                    <div className="aspect-[2/3] rounded-lg bg-white/10" />
                    <div className="aspect-[2/3] rounded-lg bg-vault-accent/30" />
                  </div>
                </div>
              </div>
              <div className="absolute -inset-4 bg-vault-accent/20 blur-2xl -z-10 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
