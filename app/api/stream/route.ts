import { NextResponse } from 'next/server';

interface EmbedProvider {
  name: string;
  tier: string;
  movie: (id: number) => string;
  tv: (id: number, season: number, episode: number) => string;
}

const PROVIDERS: EmbedProvider[] = [
  {
    name: 'VidLink', tier: 'Tier 1',
    movie: (id) => `https://vidlink.pro/movie/${id}?autoplay=true`,
    tv: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}?autoplay=true`,
  },
  {
    name: 'VidSrc PM', tier: 'Tier 1',
    movie: (id) => `https://vidsrc.pm/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.pm/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: 'VidFast', tier: 'Tier 1',
    movie: (id) => `https://vidfast.vc/movie/${id}?autoPlay=true`,
    tv: (id, s, e) => `https://vidfast.vc/tv/${id}/${s}/${e}?autoPlay=true`,
  },
  {
    name: 'AutoEmbed', tier: 'Tier 1',
    movie: (id) => `https://autoembed.co/movie/tmdb/${id}`,
    tv: (id, s, e) => `https://autoembed.co/tv/tmdb/${id}-${s}-${e}`,
  },
  {
    name: 'MultiEmbed', tier: 'Tier 1',
    movie: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    tv: (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
  },
  {
    name: '2Embed', tier: 'Tier 2',
    movie: (id) => `https://www.2embed.cc/embed/${id}`,
    tv: (id, s, e) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`,
  },
  {
    name: '2Embed Skin', tier: 'Tier 2',
    movie: (id) => `https://www.2embed.skin/embed/${id}`,
    tv: (id, s, e) => `https://www.2embed.skin/embedtv/${id}&s=${s}&e=${e}`,
  },
  {
    name: 'NontonGo', tier: 'Tier 2',
    movie: (id) => `https://www.nontongo.win/embed/movie/${id}`,
    tv: (id, s, e) => `https://www.nontongo.win/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: 'MoviesAPI', tier: 'Tier 2',
    movie: (id) => `https://moviesapi.to/movie/${id}`,
    tv: (id, s, e) => `https://moviesapi.to/tv/${id}/${s}/${e}`,
  },
  {
    name: 'VidPhantom', tier: 'Tier 2',
    movie: (id) => `https://vidphantom.com/movie/${id}`,
    tv: (id, s, e) => `https://vidphantom.com/tv/${id}/${s}/${e}`,
  },
  {
    name: 'Filmu', tier: 'Tier 3',
    movie: (id) => `https://embed.filmu.in/movie/${id}`,
    tv: (id, s, e) => `https://embed.filmu.in/tv/${id}/${s}/${e}`,
  },
  {
    name: 'VidSrc Top', tier: 'Tier 3',
    movie: (id) => `https://vid-src.top/embed/movie/${id}`,
    tv: (id, s, e) => `https://vid-src.top/embed/tv/${id}/${s}/${e}`,
  },
];

// Used by /api/proxy — server-side only, never exported to client
export function resolveProviderUrl(
  index: number,
  id: number,
  type: 'movie' | 'tv',
  season: number,
  episode: number,
): string | null {
  const p = PROVIDERS[index];
  if (!p) return null;
  return type === 'movie' ? p.movie(id) : p.tv(id, season, episode);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get('id');
  const type = searchParams.get('type') === 'tv' ? 'tv' : 'movie';

  if (!idParam || !Number.isFinite(Number(idParam))) {
    return NextResponse.json({ error: 'Missing or invalid id' }, { status: 400 });
  }

  // ✅ Never send URLs to client — only names, tiers, indices
  return NextResponse.json({
    success: true,
    type,
    totalSources: PROVIDERS.length,
    sources: PROVIDERS.map((p, i) => ({
      index: i,
      provider: p.name,
      tier: p.tier,
    })),
  });
}