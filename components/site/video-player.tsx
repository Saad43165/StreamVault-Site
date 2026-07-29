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
  provider: string;
  url: string;
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
  // Timestamp of last user-intended click so we can distinguish real play-clicks from ad-clicks
  const lastClickTime = useRef<number>(0);
  // Whether the overlay should eat the next iframe focus (ad-click)
  const overlayActive = useRef<boolean>(true);

  const id = searchParams.id;
  const type = searchParams.type === 'tv' ? 'tv' : 'movie';
  const season = Number(searchParams.season) || 1;
  const episode = Number(searchParams.episode) || 1;

  const buildUrl = (idx: number) => {
    const base = `/api/stream?id=${id}&type=${type}`;
    if (type === 'tv') return `${base}&season=${season}&episode=${episode}&source=${idx}`;
    return `${base}&source=${idx}`;
  };

  const backHref = type === 'tv' ? `/tv/${id}` : `/movie/${id}`;

  // ── Ad defense setup ──────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    // 1. Inject adblock DOM sweeper
    const script = document.createElement('script');
    script.textContent = adBlockScript;
    document.head.appendChild(script);

    // 2. Kill window.open — blocks popup/pop-under
    const originalOpen = window.open.bind(window);
    window.open = () => null;

    // 3. Override anchor .click() — stops programmatic <a target="_blank"> triggers
    const originalAnchorClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function (this: HTMLAnchorElement) {
      if (this.target === '_blank' || this.target === '_new') return;
      originalAnchorClick.call(this);
    };

    // 4. Document capture-phase click listener — intercepts ALL clicks including
    //    those from inside the iframe that bubble to the document, blocking any
    //    <a target="_blank"> that points to a non-video domain
    const videoHosts = [
      'vidsrc', 'multiembed', '2embed', 'autoembed', 'smashystream',
      'vidlink', 'vidfast', 'vsembed', 'vidphantom', 'nontongo',
      'moviesapi', 'filmu', 'vid-src', 'embedsu',
    ];
    const onDocClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (anchor && (anchor.target === '_blank' || anchor.target === '_new')) {
        const isVideoHost = videoHosts.some((h) => (anchor.href || '').includes(h));
        if (!isVideoHost) {
          e.preventDefault();
          e.stopImmediatePropagation();
          setAdBlocked(true);
          if (adBlockedTimer.current) clearTimeout(adBlockedTimer.current);
          adBlockedTimer.current = setTimeout(() => setAdBlocked(false), 2000);
        }
      }
    };
    document.addEventListener('click', onDocClick, true);

    // 5. beforeunload — stops iframe navigating the parent page away
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);

    // 6. blur — if a tab still opens somehow, yank focus back immediately
    const onBlur = () => {
      setTimeout(() => window.focus(), 0);
      setAdBlocked(true);
      if (adBlockedTimer.current) clearTimeout(adBlockedTimer.current);
      adBlockedTimer.current = setTimeout(() => setAdBlocked(false), 2000);
      overlayActive.current = true;
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
  }, []);

  // ── Stream fetch ────────────────────────────────────────────────────────────
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
    overlayActive.current = true;

    fetch(buildUrl(sourceIndex))
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceIndex, id, type, season, episode]);

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
    // Re-arm the overlay after each new load — first click after load is almost always an ad
    overlayActive.current = true;
  };

  const enterFullscreen = () => {
    const frame = document.getElementById('player-wrap');
    if (!document.fullscreenElement) frame?.requestFullscreen?.();
    else document.exitFullscreen();
  };

  // ── Overlay click handler ───────────────────────────────────────────────────
  // The overlay sits invisibly on top of the iframe at all times.
  // When a click comes through (which would have gone to the iframe and triggered an ad):
  //   - We eat it, show "Ad blocked", then disarm the overlay for 4s so the
  //     user can interact with the player normally (play/pause etc).
  //   - After 4s of inactivity the overlay re-arms for the next ad attempt.
  const overlayRearmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (!overlayActive.current) return; // overlay is disarmed, let click pass to iframe

    e.preventDefault();
    e.stopPropagation();

    // Show blocked toast
    setAdBlocked(true);
    if (adBlockedTimer.current) clearTimeout(adBlockedTimer.current);
    adBlockedTimer.current = setTimeout(() => setAdBlocked(false), 2000);

    // Disarm overlay for 4s so the user can control the player
    overlayActive.current = false;
    if (overlayRearmTimer.current) clearTimeout(overlayRearmTimer.current);
    overlayRearmTimer.current = setTimeout(() => {
      overlayActive.current = true;
    }, 4000);
  };

  const displayTitle = title?.title ?? (type === 'tv' ? `S${season}:E${episode}` : `Title #${id}`);
  const nextEpisodeHref =
    type === 'tv' ? `/watch?id=${id}&type=tv&season=${season}&episode=${episode + 1}` : null;
  const heroArt = title?.backdropPath ? imageUrl(title.backdropPath, 'original') : null;

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
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 backdrop-blur text-emerald-300 text-xs font-semibold px-4 py-2 rounded-full shadow-lg animate-fade-in">
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
                  <div className="absolute right-0 mt-2 z-20 min-w-[240px] max-h-[70vh] overflow-y-auto scrollbar-thin bg-vault-card border border-white/10 rounded-lg shadow-2xl overflow-hidden animate-fade-in">
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
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-4 animate-fade-in z-20">
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

        {!loading && !error && data && (
          <div className="w-full h-full relative bg-black">

            {iframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 pointer-events-none">
                <Loader2 className="w-12 h-12 text-vault-accent animate-spin" />
                <p className="text-white/70 text-sm font-medium">
                  Loading {data.current.provider}...
                </p>
                <p className="text-white/40 text-xs">
                  If video doesn&apos;t appear, switch sources (press{' '}
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">S</kbd>)
                </p>
              </div>
            )}

            {/*
              AD BLOCKER OVERLAY
              Always rendered on top of the iframe (z-[6]).
              Uses pointer-events:none normally so mouse moves/hovers pass through,
              but on click it intercepts via onClickCapture at the capture phase.

              How it works:
              - overlayActive.current = true  → first click is eaten (ad blocked)
              - overlayActive.current = false → overlay is disarmed, clicks pass to iframe (play/pause)
              - After 4s idle, overlay re-arms automatically for the next ad trigger
            */}
            <div
              className="absolute inset-0 z-[6]"
              style={{ pointerEvents: 'all', background: 'transparent' }}
              onClickCapture={handleOverlayClick}
            />

            <iframe
              ref={iframeRef}
              key={data.current.url}
              src={data.current.url}
              title={data.current.provider}
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
                  <span className="text-vault-accent">{data.current.provider}</span>
                  <span className="mx-1.5 text-white/20">·</span>
                  {data.current.tier}
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