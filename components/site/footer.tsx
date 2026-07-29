import Link from 'next/link';
import { Play, Github, Twitter, Instagram, Youtube } from 'lucide-react';

const footerLinks = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/about' },
    ],
  },
  {
    title: 'Discover',
    links: [
      { label: 'Movies', href: '/movies' },
      { label: 'TV Shows', href: '/tv' },
      { label: 'Trending', href: '/' },
      { label: 'Search', href: '/search' },
    ],
  },
  {
    title: 'Download',
    links: [
      { label: 'Android APK', href: '/download' },
      { label: 'Features', href: '/download' },
      { label: 'Install Guide', href: '/download' },
    ],
  },
];

const socials = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Github, href: '#', label: 'GitHub' },
];

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/5 bg-gradient-to-b from-vault-bg to-black">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-vault-accent flex items-center justify-center shadow-lg shadow-vault-accent/30">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Stream<span className="text-vault-accent">Vault</span>
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Stream thousands of movies and TV shows in HD. No ads, multi-source
              playback, and a built-in mini player.
            </p>
            <div className="flex items-center gap-2 mt-5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-vault-accent flex items-center justify-center transition-colors"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/50 hover:text-vault-accent transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-10 pt-6 border-t border-white/5">
          <p className="text-xs text-white/40 leading-relaxed">
            <strong className="text-white/60">Disclaimer:</strong> StreamVault does
            not host any media files on its servers. All content is aggregated from
            third-party providers. We are not responsible for the accuracy,
            compliance, copyright, or any other aspect of the content linked to or
            from this website. For any copyright concerns, please contact the
            respective third-party providers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} StreamVault. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/about" className="text-xs text-white/40 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/about" className="text-xs text-white/40 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
