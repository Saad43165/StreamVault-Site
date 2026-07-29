import Navbar from '@/components/site/navbar';
import Footer from '@/components/site/footer';
import {
  Download,
  Shield,
  Layers,
  PlayCircle,
  MonitorPlay,
  Users,
  CheckCircle2,
  Smartphone,
  FileDown,
  Settings,
  Rocket,
} from 'lucide-react';

const features = [
  {
    icon: Layers,
    title: '12+ Sources',
    desc: 'Aggregate streams from over a dozen providers for maximum availability.',
  },
  {
    icon: Shield,
    title: 'No Ads',
    desc: 'Enjoy an uninterrupted, ad-free viewing experience every time.',
  },
  {
    icon: MonitorPlay,
    title: 'Mini Player',
    desc: 'Keep watching in a floating window while using other apps.',
  },
  {
    icon: FileDown,
    title: 'Downloads',
    desc: 'Save movies and episodes for offline viewing on the go.',
  },
  {
    icon: Users,
    title: 'Multi-Profile',
    desc: 'Separate watchlists and continue-watching for everyone at home.',
  },
  {
    icon: PlayCircle,
    title: '4K & HD',
    desc: 'Crystal-clear playback up to 4K with adaptive streaming.',
  },
];

const steps = [
  {
    icon: FileDown,
    title: 'Download the APK',
    desc: 'Tap the download button above to get the latest StreamVault APK file.',
  },
  {
    icon: Settings,
    title: 'Enable unknown sources',
    desc: 'In your Android settings, allow installs from unknown sources for your browser.',
  },
  {
    icon: Rocket,
    title: 'Install & launch',
    desc: 'Open the downloaded file, install, and start streaming instantly.',
  },
];

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? '2.4.1';

export default function DownloadPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        {/* Hero */}
        <section className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy + download */}
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-vault-accent bg-vault-accent/10 px-3 py-1 rounded-full mb-4">
                <Smartphone className="w-3.5 h-3.5" />
                Android App
              </span>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-balance">
                Stream smarter with the <span className="text-vault-accent">StreamVault</span> app
              </h1>
              <p className="text-white/60 text-lg mb-8 max-w-lg">
                12+ sources, zero ads, mini player, offline downloads and
                multi-profile support — all in one beautiful, fast app.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-8">
                <a
                  href="#download"
                  className="inline-flex items-center gap-2 bg-vault-accent hover:bg-vault-accent-hover text-white font-bold px-7 py-3.5 rounded-lg transition-all hover:scale-105 shadow-lg shadow-vault-accent/30"
                >
                  <Download className="w-5 h-5" />
                  Download APK
                </a>
                <div className="text-sm text-white/50">
                  <p className="font-semibold text-white">Version {APP_VERSION}</p>
                  <p>Android 7.0+ • 48 MB</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                {['Free', 'No ads', 'No sign-up'].map((b) => (
                  <span key={b} className="inline-flex items-center gap-1.5 text-white/60">
                    <CheckCircle2 className="w-4 h-4 text-vault-accent" />
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: phone mockup */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-64 h-[520px] rounded-[2.5rem] border-[6px] border-white/10 bg-gradient-to-b from-vault-bg to-black overflow-hidden shadow-2xl">
                  <div className="flex flex-col h-full p-4 gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">
                        Stream<span className="text-vault-accent">Vault</span>
                      </span>
                      <Users className="w-4 h-4 text-white/40" />
                    </div>
                    <div className="aspect-video rounded-lg bg-gradient-to-br from-vault-accent/40 to-vault-accent/10 flex items-center justify-center">
                      <PlayCircle className="w-10 h-10 text-white/80" />
                    </div>
                    <div className="w-2/3 h-3 rounded-full bg-white/15" />
                    <div className="w-1/2 h-2 rounded-full bg-white/10" />
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className={`aspect-[2/3] rounded-lg ${
                            i % 3 === 0 ? 'bg-vault-accent/30' : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="mt-auto flex items-center justify-around bg-white/5 rounded-xl py-2">
                      <PlayCircle className="w-5 h-5 text-vault-accent" />
                      <Layers className="w-5 h-5 text-white/40" />
                      <Download className="w-5 h-5 text-white/40" />
                      <Users className="w-5 h-5 text-white/40" />
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-6 bg-vault-accent/20 blur-3xl -z-10 rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
            Everything you need
          </h2>
          <p className="text-white/50 text-center mb-10 max-w-xl mx-auto">
            Packed with features designed for the best streaming experience.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl bg-vault-card border border-white/5 hover:border-vault-accent/30 p-6 transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-vault-accent/10 group-hover:bg-vault-accent/20 flex items-center justify-center mb-4 transition-colors">
                  <f.icon className="w-6 h-6 text-vault-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Download + install steps */}
        <section id="download" className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-2xl bg-gradient-to-br from-vault-card to-vault-accent/10 border border-vault-accent/20 p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-vault-accent/20 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 relative">
              Get StreamVault for Android
            </h2>
            <p className="text-white/60 mb-6 relative">
              Version {APP_VERSION} • Updated July 2026 • 48 MB
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-vault-accent hover:bg-vault-accent-hover text-white font-bold px-8 py-4 rounded-lg transition-all hover:scale-105 shadow-lg shadow-vault-accent/30 relative"
            >
              <Download className="w-5 h-5" />
              Download APK Now
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="relative rounded-2xl bg-vault-card border border-white/5 p-6"
              >
                <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-vault-accent text-white text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <s.icon className="w-8 h-8 text-vault-accent mb-3" />
                <h3 className="font-semibold mb-1.5">{s.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
