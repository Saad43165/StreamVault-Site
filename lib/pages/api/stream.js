export default async function handler(req, res) {
  const { id, type, season = 1, episode = 1 } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing ID' });
  }

  const isMovie = type === 'movie';

  // All mirrors hidden here - never exposed to users
  const providers = [
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
      name: 'MultiEmbed',
      movie: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
      tv: (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
    },
  ];

  const primary = providers[0];
  const url = isMovie ? primary.movie(id) : primary.tv(id, season, episode);

  res.status(200).json({
    url: url,
    source: primary.name,
    mirrors: providers.map(p => ({
      name: p.name,
      url: isMovie ? p.movie(id) : p.tv(id, season, episode),
    })),
  });
}