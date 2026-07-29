import { NextResponse } from 'next/server';

// Server-side stream resolver. Mirrors the Flutter app's StreamResolverService:
// returns working embed URLs from 12 verified provider mirrors. The provider
// list stays server-side — the frontend only receives resolved embed URLs to
// load in a sandboxed iframe.

interface EmbedProvider {
  name: string;
  movie: (id: number) => string;
  tv: (id: number, season: number, episode: number) => string;
}

// All working providers (verified mirrors), ordered by reliability tiers.
const PROVIDERS: EmbedProvider[] = [
  // Tier 1 — Most reliable
  {
    name: 'VidLink',
    movie: (id) => `https://vidlink.pro/movie/${id}?autoplay=true`,
    tv: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}?autoplay=true`,
  },
  {
    name: 'VidSrc PM',
    movie: (id) => `https://vidsrc.pm/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.pm/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: 'VidFast',
    movie: (id) => `https://vidfast.vc/movie/${id}?autoPlay=true`,
    tv: (id, s, e) => `https://vidfast.vc/tv/${id}/${s}/${e}?autoPlay=true`,
  },
  {
    name: 'AutoEmbed',
    movie: (id) => `https://autoembed.co/movie/tmdb/${id}`,
    tv: (id, s, e) => `https://autoembed.co/tv/tmdb/${id}-${s}-${e}`,
  },
  {
    name: 'MultiEmbed',
    movie: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    tv: (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
  },
  // Tier 2 — Good coverage
  {
    name: '2Embed',
    movie: (id) => `https://www.2embed.cc/embed/${id}`,
    tv: (id, s, e) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`,
  },
  {
    name: '2Embed Skin',
    movie: (id) => `https://www.2embed.skin/embed/${id}`,
    tv: (id, s, e) => `https://www.2embed.skin/embedtv/${id}&s=${s}&e=${e}`,
  },
  {
    name: 'NontonGo',
    movie: (id) => `https://www.nontongo.win/embed/movie/${id}`,
    tv: (id, s, e) => `https://www.nontongo.win/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: 'MoviesAPI',
    movie: (id) => `https://moviesapi.to/movie/${id}`,
    tv: (id, s, e) => `https://moviesapi.to/tv/${id}/${s}/${e}`,
  },
  {
    name: 'VidPhantom',
    movie: (id) => `https://vidphantom.com/movie/${id}`,
    tv: (id, s, e) => `https://vidphantom.com/tv/${id}/${s}/${e}`,
  },
  // Tier 3 — Backup mirrors
  {
    name: 'Filmu',
    movie: (id) => `https://embed.filmu.in/movie/${id}`,
    tv: (id, s, e) => `https://embed.filmu.in/tv/${id}/${s}/${e}`,
  },
  {
    name: 'VidSrc Top',
    movie: (id) => `https://vid-src.top/embed/movie/${id}`,
    tv: (id, s, e) => `https://vid-src.top/embed/tv/${id}/${s}/${e}`,
  },
];

const TIER_LABEL = ['Tier 1', 'Tier 1', 'Tier 1', 'Tier 1', 'Tier 1', 'Tier 2', 'Tier 2', 'Tier 2', 'Tier 2', 'Tier 2', 'Tier 3', 'Tier 3'];

export interface StreamSource {
  provider: string;
  url: string;
  tier: string;
}

function buildSources(id: number, type: 'movie' | 'tv', season = 1, episode = 1): StreamSource[] {
  return PROVIDERS.map((p, i) => ({
    provider: p.name,
    url: type === 'movie' ? p.movie(id) : p.tv(id, season, episode),
    tier: TIER_LABEL[i] ?? 'Tier 3',
  }));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get('id');
  const type = searchParams.get('type') === 'tv' ? 'tv' : 'movie';
  const season = Number(searchParams.get('season')) || 1;
  const episode = Number(searchParams.get('episode')) || 1;

  if (!idParam || !Number.isFinite(Number(idParam))) {
    return NextResponse.json({ error: 'Missing or invalid id' }, { status: 400 });
  }

  const sources = buildSources(Number(idParam), type, season, episode);
  const index = Math.min(Math.max(Number(searchParams.get('source')) || 0, 0), sources.length - 1);
  const current = sources[index];

  return NextResponse.json({
    success: true,
    type,
    totalSources: sources.length,
    sources,
    current,
  });
}
