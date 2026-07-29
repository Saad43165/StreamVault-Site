'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, Loader2, AlertTriangle, RefreshCw, List, Layers,
  ShieldCheck, ChevronRight, Maximize,
} from 'lucide-react';
import { adBlockScript } from '@/lib/adblock';
import { imageUrl } from '@/lib/media-images';

interface StreamSource {
  index: number;
  provider: string;
  tier: string;
}

interface StreamData {
  success: boolean;
  type: string;
  totalSources: number;
  sources: StreamSource[];
  current: StreamSource;
}

interface TitleInfo {
  title: string;
  posterPath: string;
  backdropPath: string;
  totalEpisodes?: number;
}

// Build proxy URL — real provider URL never leaves the server
function buildProxyUrl(
  id: string,
  type: string,
  sourceIndex: number,
  season: number,
  episode: number,
): string {
  const base = `/api/proxy?id=${id}&type=${type}&source=${sourceIndex}`;
  if (type === 'tv') return `${base}&season=${season}&episode=${episode}`;
  return base;
}

export default function VideoPlayer({
  searchParams,
}: {
  searchParams: { id?: string; type?: string; season?: string; episode?: string };
}) {
  const [data, setData] = useState<StreamData | null>(null);
  const [title, setTitle] = useState<TitleInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [showSources, setShowSources] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [adBlocked, setAdBlocked] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const autoRotateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const adBlockedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const id = searchParams.id;
  const type = searchParams.type === 'tv' ? 'tv' : 'movie';
  const season = Number(searchParams.season) || 1;
  const episode = Number(searchParams.episode) || 1;

  const backHref = type === 'tv' ? `/tv/${id}` : `/movie/${id}`;

  const showAdBlocked = () => {
    setAdBlocked(true);
    if (adBlockedTimer.current) clearTimeout(adBlockedTimer.current);
    adBlockedTimer.current = setTimeout(() => setAdBlocked(false), 2000);
  };

  // ── Ad defense ──────────────────────────────────────────────────────────────
  useEffect(() => {
    // Inject DOM sweeper
    const script = document.createElement('script');
    script.textContent = adBlockScript;
    document.head.appendChild(script);

    // Kill window.open
    const originalOpen = window.open.bind(window);
    window.open = () => null;

    // Kill programmatic anchor .click() to _blank
    const originalAnchorClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function (this: HTMLAnchorElement) {
      if (this.target === '_blank' || this.target === '_new') return;
      originalAnchorClick.call(this);
    };

    // Block _blank anchor clicks at capture phase
    const onDocClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (anchor && (anchor.target === '_blank' || anchor.target === '_new')) {
        e.preventDefault();
        e.stopImmediatePropagation();
        showAdBlocked();
      }
    };
    document.addEventListener('click', onDocClick, true);

    // Stop iframe from navigating parent away
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);

    // If focus leaves (new tab opened anyway), yank it back
    const onBlur = () => {
      setTimeout(() => window.focus(), 0);
      showAdBlocked();
    };
    window.addEventListener('blur', onBlur);

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
      window.open = originalOpen;
      HTMLAnchorElement.prototype.click = originalAnchorClick;
      document.removeEventListener('click', onDocClick, true);
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('blur', onBlur);
      if (adBlockedTimer.current) clearTimeout(adBlockedTimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Stream metadata fetch (no URLs returned) ────────────────────────────────
  useEffect(() => {
    if (!id) {
      setError('No media ID provided.');
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    setReady(false);

    fetch(`/api/stream?id=${id}&type=${type}`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load stream');
        return r.json();
      })
      .then((d: StreamData) => {
        if (cancelled) return;
        setData(d);
        setLoading(false);
        setIframeLoading(true);
      })
      .catch(() => {
        if (cancelled) return;
        setError('We could not load this stream. Please try another source.');
        setLoading(false);
      });

    return () => {
      cancelled = true;
      if (autoRotateTimer.current) clearTimeout(autoRotateTimer.current);
    };
  }, [id, type]);

  // Re-load iframe when source index changes (without re-fetching metadata)
  useEffect(() => {
    if (!data) return;
    setIframeLoading(true);
    setReady(false);
  }, [sourceIndex]);

  // ── Title fetch ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    fetch(`/api/details?id=${id}&type=${type}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((t: TitleInfo | null) => { if (t) setTitle(t); })
      .catch(() => {});
  }, [id, type]);

  // ── Auto-rotate if iframe never loads ───────────────────────────────────────
  useEffect(() => {
    if (!iframeLoading || !data) return;
    autoRotateTimer.current = setTimeout(() => {
      setIframeLoading(false);
      setReady(true);
    }, 12000);
    return () => { if (autoRotateTimer.current) clearTimeout(autoRotateTimer.current); };
  }, [iframeLoading, data, sourceIndex]);

  // ── Auto-hide controls ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;
    let hideTimer: ReturnType<typeof setTimeout>;
    const showAndHide = () => {
      setControlsVisible(true);
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setControlsVisible(false), 3500);
    };
    showAndHide();
    window.addEventListener('mousemove', showAndHide);
    window.addEventListener('touchstart', showAndHide, { passive: true });
    return () => {
      window.removeEventListener('mousemove', showAndHide);
      window.removeEventListener('touchstart', showAndHide);
      clearTimeout(hideTimer);
    };
  }, [ready]);

  const tryAnotherSource = useCallback(() => {
    if (!data) return;
    setSourceIndex((i) => (i + 1) % data.sources.length);
  }, [data]);

  // ── Keyboard shortcuts ──────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) document.exitFullscreen();
        else window.location.href = backHref;
      } else if (e.key === 'n' || e.key === 'N') {
        tryAnotherSource();
      } else if (e.key === 'f' || e.key === 'F') {
        const frame = document.getElementById('player-wrap');
        if (!document.fullscreenElement) frame?.requestFullscreen?.();
        else document.exitFullscreen();
      } else if (e.key === 's' || e.key === 'S') {
        setShowSources((s) => !s);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [backHref, tryAnotherSource]);

  const handleIframeLoad = () => {
    setIframeLoading(false);
    setReady(true);
  };

  const enterFullscreen = () => {
    const frame = document.getElementById('player-wrap');
    if (!document.fullscreenElement) frame?.requestFullscreen?.();
    else document.exitFullscreen();
  };

  const displayTitle = title?.title ?? (type === 'tv' ? `S${season}:E${episode}` : `Title #${id}`);
  const nextEpisodeHref =
    type === 'tv' ? `/watch?id=${id}&type=tv&season=${season}&episode=${episode + 1}` : null;
  const heroArt = title?.backdropPath ? imageUrl(title.backdropPath, 'original') : null;
  const proxyUrl = id
    ? buildProxyUrl(id, type, sourceIndex, season, episode)
    : null;

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col select-none">

      {/* Ambient backdrop while loading */}
      {!ready && heroArt && (
        <div className="absolute inset-0 z-0">
          <Image
            src={heroArt}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-30 blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}

      {/* Ad blocked toast */}
      {adBlocked && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 backdrop-blur text-emerald-300 text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
            <ShieldCheck className="w-3.5 h-3.5" />
            Ad blocked
          </div>
        </div>
      )}

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div
        className={`absolute top-0 inset-x-0 z-30 flex items-center justify-between p-4 bg-gradient-to-b from-black/90 to-transparent transition-opacity duration-300 ${
          controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white bg-black/40 backdrop-blur px-3 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur px-2.5 py-1.5 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5" />
            Ad-block
          </span>
          <button
            onClick={enterFullscreen}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white bg-black/40 backdrop-blur px-3 py-2 rounded-lg transition-colors"
            aria-label="Fullscreen"
          >
            <Maximize className="w-4 h-4" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
          {data && (
            <div className="relative">
              <button
                onClick={() => setShowSources((s) => !s)}
                className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white bg-black/40 backdrop-blur px-3 py-2 rounded-lg transition-colors"
              >
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">Sources</span>
                <span className="text-xs text-white/40">({sourceIndex + 1}/{data.totalSources})</span>
              </button>
              {showSources && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSources(false)} />
                  <div className="absolute right-0 mt-2 z-20 min-w-[240px] max-h-[70vh] overflow-y-auto scrollbar-thin bg-vault-card border border-white/10 rounded-lg shadow-2xl overflow-hidden">
                    {data.sources.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => { setSourceIndex(i); setShowSources(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors flex items-center justify-between ${
                          i === sourceIndex ? 'text-vault-accent bg-vault-accent/5' : 'text-white/80'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <List className="w-3.5 h-3.5" />
                          {s.provider}
                        </span>
                        <span className="text-[10px] text-white/40">{s.tier}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Player area ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center relative" id="player-wrap">

        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20">
            <Loader2 className="w-12 h-12 text-vault-accent animate-spin" />
            <p className="text-white/60 text-sm">Preparing your stream...</p>
          </div>
        )}

        {error && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-4 z-20">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold">Playback error</h2>
            <p className="text-white/50 max-w-md">{error}</p>
            <div className="flex items-center gap-3">
              {data && (
                <button
                  onClick={tryAnotherSource}
                  className="inline-flex items-center gap-2 bg-vault-accent hover:bg-vault-accent-hover text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try another source
                </button>
              )}
              <Link
                href={backHref}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Go back
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && data && proxyUrl && (
          <div className="w-full h-full relative bg-black">
            {iframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 pointer-events-none">
                <Loader2 className="w-12 h-12 text-vault-accent animate-spin" />
                <p className="text-white/70 text-sm font-medium">
                  Loading {data.sources[sourceIndex]?.provider ?? 'stream'}...
                </p>
                <p className="text-white/40 text-xs">
                  If video doesn&apos;t appear, switch sources (press{' '}
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">S</kbd>)
                </p>
              </div>
            )}

            {/*
              The iframe loads /api/proxy which fetches the provider server-side,
              strips ad scripts, and serves the HTML from your own domain.
              No sandbox needed — the proxy CSP header handles popup blocking.
              No overlay needed — clicks go directly to the player.
            */}
            <iframe
              ref={iframeRef}
              key={proxyUrl}
              src={proxyUrl}
              title={data.sources[sourceIndex]?.provider ?? 'Stream'}
              className="absolute inset-0 w-full h-full border-0"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture; web-share"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              onLoad={handleIframeLoad}
            />
          </div>
        )}
      </div>

      {/* ── Bottom bar ──────────────────────────────────────── */}
      {!loading && !error && data && (
        <div
          className={`absolute bottom-0 inset-x-0 z-30 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${
            controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {title?.posterPath && (
                <div className="relative w-10 h-14 rounded overflow-hidden shrink-0 hidden sm:block">
                  <Image
                    src={imageUrl(title.posterPath, 'w92')}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{displayTitle}</p>
                <p className="text-xs text-white/50 truncate">
                  <span className="text-vault-accent">
                    {data.sources[sourceIndex]?.provider ?? 'Stream'}
                  </span>
                  <span className="mx-1.5 text-white/20">·</span>
                  {data.sources[sourceIndex]?.tier ?? ''}
                  {type === 'tv' && (
                    <>
                      <span className="mx-1.5 text-white/20">·</span>
                      S{season}:E{episode}
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {nextEpisodeHref && (
                <Link
                  href={nextEpisodeHref}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-vault-accent hover:bg-vault-accent-hover px-3 py-2 rounded-lg transition-colors"
                >
                  Next Episode
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              )}
              <button
                onClick={tryAnotherSource}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-white bg-black/40 backdrop-blur px-3 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Next source
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}