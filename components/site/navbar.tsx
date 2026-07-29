'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Search, Menu, X, Film, Tv, Download, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/movies', label: 'Movies', icon: Film },
  { href: '/tv', label: 'TV Shows', icon: Tv },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
  };

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-vault-bg/90 backdrop-blur-xl border-b border-white/5'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent',
      )}
    >
      <nav className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-vault-accent flex items-center justify-center shadow-lg shadow-vault-accent/30 group-hover:scale-105 transition-transform">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">
              Stream<span className="text-vault-accent">Vault</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    active
                      ? 'text-white bg-white/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Search */}
          <form
            onSubmit={submitSearch}
            className="hidden sm:flex flex-1 max-w-md items-center"
          >
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-vault-accent transition-colors" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, TV shows..."
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-vault-accent focus:bg-white/10 transition-all"
              />
            </div>
          </form>

          {/* Download button */}
          <Link
            href="/download"
            className="hidden md:inline-flex items-center gap-2 bg-vault-accent hover:bg-vault-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-vault-accent/20"
          >
            <Download className="w-4 h-4" />
            Download App
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 pt-2 animate-fade-in">
            <form onSubmit={submitSearch} className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-vault-accent"
                />
              </div>
            </form>
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <link.icon className="w-4 h-4 text-vault-accent" />
                  {link.label}
                </Link>
              ))}
              <Link
                href="/download"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold bg-vault-accent/15 text-vault-accent hover:bg-vault-accent/25 transition-colors mt-1"
              >
                <Download className="w-4 h-4" />
                Download App
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
