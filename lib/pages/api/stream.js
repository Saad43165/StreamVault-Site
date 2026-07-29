// api/stream.js  (or pages/api/stream.js for Next.js pages router)
// Provider URLs are NEVER sent to the client — only names + indices.

const PROVIDERS = [
  {
    name: 'VidLink',
    tier: 'Tier 1',
    movie: (id) => `https://vidlink.pro/movie/${id}?autoplay=true`,
    tv:    (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}?autoplay=true`,
  },
  {
    name: 'VidSrc PM',
    tier: 'Tier 1',
    movie: (id) => `https://vidsrc.pm/embed/movie/${id}`,
    tv:    (id, s, e) => `https://vidsrc.pm/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: 'VidFast',
    tier: 'Tier 1',
    movie: (id) => `https://vidfast.vc/movie/${id}?autoPlay=true`,
    tv:    (id, s, e) => `https://vidfast.vc/tv/${id}/${s}/${e}?autoPlay=true`,
  },
  {
    name: 'AutoEmbed',
    tier: 'Tier 1',
    movie: (id) => `https://autoembed.co/movie/tmdb/${id}`,
    tv:    (id, s, e) => `https://autoembed.co/tv/tmdb/${id}-${s}-${e}`,
  },
  {
    name: 'MultiEmbed',
    tier: 'Tier 1',
    movie: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    tv:    (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
  },
  {
    name: '2Embed',
    tier: 'Tier 2',
    movie: (id) => `https://www.2embed.cc/embed/${id}`,
    tv:    (id, s, e) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`,
  },
  {
    name: '2Embed Skin',
    tier: 'Tier 2',
    movie: (id) => `https://www.2embed.skin/embed/${id}`,
    tv:    (id, s, e) => `https://www.2embed.skin/embedtv/${id}&s=${s}&e=${e}`,
  },
  {
    name: 'NontonGo',
    tier: 'Tier 2',
    movie: (id) => `https://www.nontongo.win/embed/movie/${id}`,
    tv:    (id, s, e) => `https://www.nontongo.win/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: 'MoviesAPI',
    tier: 'Tier 2',
    movie: (id) => `https://moviesapi.to/movie/${id}`,
    tv:    (id, s, e) => `https://moviesapi.to/tv/${id}/${s}/${e}`,
  },
  {
    name: 'VidPhantom',
    tier: 'Tier 2',
    movie: (id) => `https://vidphantom.com/movie/${id}`,
    tv:    (id, s, e) => `https://vidphantom.com/tv/${id}/${s}/${e}`,
  },
  {
    name: 'Filmu',
    tier: 'Tier 3',
    movie: (id) => `https://embed.filmu.in/movie/${id}`,
    tv:    (id, s, e) => `https://embed.filmu.in/tv/${id}/${s}/${e}`,
  },
  {
    name: 'VidSrc Top',
    tier: 'Tier 3',
    movie: (id) => `https://vid-src.top/embed/movie/${id}`,
    tv:    (id, s, e) => `https://vid-src.top/embed/tv/${id}/${s}/${e}`,
  },
];

// Called by /api/proxy internally — never reaches the client
function resolveUrl(index, id, type, season, episode) {
  const p = PROVIDERS[index];
  if (!p) return null;
  return type === 'movie' ? p.movie(id) : p.tv(id, Number(season), Number(episode));
}

export default async function handler(req, res) {
  // Allow /api/proxy to call resolveUrl directly (same-process import)
  if (req.method === 'POST' && req.headers['x-internal'] === process.env.INTERNAL_SECRET) {
    const { index, id, type, season = 1, episode = 1 } = req.body ?? {};
    const url = resolveUrl(Number(index), id, type, season, episode);
    if (!url) return res.status(400).json({ error: 'Invalid source index' });
    return res.status(200).json({ url });
  }

  // Public GET — returns ONLY metadata, zero URLs
  const { id, type = 'movie' } = req.query;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Missing or invalid id' });
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({
    success: true,
    type,
    totalSources: PROVIDERS.length,
    // ✅ Only names + tiers — no URLs ever sent to browser
    sources: PROVIDERS.map((p, i) => ({
      index: i,
      provider: p.name,
      tier: p.tier,
    })),
  });
}

export { resolveUrl };