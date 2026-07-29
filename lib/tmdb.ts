import 'server-only';
import {
  MOVIES,
  TV_SHOWS,
  BOLLYWOOD,
  PAKISTANI,
  MOCK_TRENDING,
  MOCK_CAST,
  MOCK_CREW,
  getMockById,
  getMockSimilar,
  getMockSeasons,
  searchMock,
  type MediaItem,
  type MediaType,
  type Season,
  type CastMember,
  type CrewMember,
} from './mock-data';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_KEY = process.env.TMDB_API_KEY?.trim();
const TMDB_TOKEN = process.env.TMDB_API_READ_TOKEN?.trim();

const HAS_VALID_TOKEN = !!TMDB_TOKEN && TMDB_TOKEN.split('.').length === 3 && TMDB_TOKEN.length > 20;
const HAS_VALID_KEY =
  !!TMDB_KEY &&
  !TMDB_KEY.includes('YOUR_') &&
  TMDB_KEY.length >= 20 &&
  /^[a-f0-9]{32}$/i.test(TMDB_KEY);
const USE_LIVE = HAS_VALID_TOKEN || HAS_VALID_KEY;

// 🔍 DEBUG: Log API status
console.log('═══════════════════════════════════');
console.log('🔍 TMDB API STATUS');
console.log('   USE_LIVE:', USE_LIVE);
console.log('   Has API Key:', HAS_VALID_KEY);
console.log('   Has Token:', HAS_VALID_TOKEN);
console.log('═══════════════════════════════════');

async function tmdbFetch<T>(path: string, params: Record<string, string | number> = {}): Promise<T | null> {
  if (!USE_LIVE) {
    console.log(`⚠️ MOCK MODE - Skipping API call: ${path}`);
    return null;
  }
  const url = new URL(`${TMDB_BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const headers: Record<string, string> = {};
  if (HAS_VALID_TOKEN) headers.Authorization = `Bearer ${TMDB_TOKEN}`;
  else if (HAS_VALID_KEY) url.searchParams.set('api_key', TMDB_KEY!);
  try {
    const res = await fetch(url.toString(), {
      headers,
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.log(`❌ TMDB API Error: ${path} → ${res.status} ${res.statusText}`);
      return null;
    }
    const data = await res.json();
    console.log(`✅ TMDB API Success: ${path} → ${(data as any)?.results?.length || '?'} results`);
    return data as T;
  } catch (err) {
    console.log(`❌ TMDB API Exception: ${path} → ${err}`);
    return null;
  }
}

interface TMDBResult {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  popularity?: number;
  genre_ids?: number[];
  runtime?: number;
  tagline?: string;
  genres?: { id: number; name: string }[];
  media_type?: string;
}

function mapResult(r: TMDBResult, type: MediaType): MediaItem {
  const title = r.title || r.name || 'Untitled';
  const date = r.release_date || r.first_air_date || '';
  const genres = (r.genres?.map((g) => g.name) ?? []) as string[];
  
  // 🔍 DEBUG: Log missing images
  if (!r.poster_path && !r.backdrop_path) {
    console.log(`🖼️ NO IMAGES: "${title}" (ID: ${r.id}, Type: ${type})`);
  } else {
    console.log(`🖼️ HAS IMAGES: "${title}" | poster: ${r.poster_path ? 'YES' : 'NO'} | backdrop: ${r.backdrop_path ? 'YES' : 'NO'}`);
  }
  
  return {
    id: r.id,
    tmdbId: r.id,
    type,
    title,
    overview: r.overview || '',
    posterPath: r.poster_path || '',
    backdropPath: r.backdrop_path || '',
    releaseYear: date ? date.slice(0, 4) : '',
    rating: Math.round((r.vote_average ?? 0) * 10) / 10,
    genres,
    runtime: r.runtime,
    tagline: r.tagline,
  };
}

interface TMDBListResponse {
  results: TMDBResult[];
  total_pages?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY FETCHERS
// ═══════════════════════════════════════════════════════════════════════════

export async function getTrending(): Promise<MediaItem[]> {
  if (!USE_LIVE) return MOCK_TRENDING;
  const data = await tmdbFetch<TMDBListResponse>('/trending/all/day', { page: 1 });
  if (!data?.results?.length) return MOCK_TRENDING;
  return data.results
    .filter((r) => r.id && (r.media_type === 'movie' || r.media_type === 'tv'))
    .slice(0, 20)
    .map((r) => mapResult(r, (r as { media_type?: MediaType }).media_type === 'tv' ? 'tv' : 'movie'));
}

export async function getPopularMovies(): Promise<MediaItem[]> {
  if (!USE_LIVE) return MOVIES;
  const data = await tmdbFetch<TMDBListResponse>('/discover/movie', {
    sort_by: 'popularity.desc',
    page: 1,
  });
  if (!data?.results?.length) return MOVIES;
  return data.results.slice(0, 20).map((r) => mapResult(r, 'movie'));
}

export async function getPopularTV(): Promise<MediaItem[]> {
  if (!USE_LIVE) return TV_SHOWS;
  const data = await tmdbFetch<TMDBListResponse>('/discover/tv', {
    sort_by: 'popularity.desc',
    page: 1,
  });
  if (!data?.results?.length) return TV_SHOWS;
  return data.results.slice(0, 20).map((r) => mapResult(r, 'tv'));
}

async function getByProvider(providerId: number): Promise<MediaItem[]> {
  const [movies, tv] = await Promise.all([
    tmdbFetch<TMDBListResponse>('/discover/movie', {
      with_watch_providers: providerId,
      watch_region: 'US',
      sort_by: 'popularity.desc',
      page: 1,
    }),
    tmdbFetch<TMDBListResponse>('/discover/tv', {
      with_watch_providers: providerId,
      watch_region: 'US',
      sort_by: 'popularity.desc',
      page: 1,
    }),
  ]);
  const merged: { item: MediaItem; pop: number }[] = [];
  if (movies?.results) {
    for (const r of movies.results) merged.push({ item: mapResult(r, 'movie'), pop: r.popularity ?? 0 });
  }
  if (tv?.results) {
    for (const r of tv.results) merged.push({ item: mapResult(r, 'tv'), pop: r.popularity ?? 0 });
  }
  merged.sort((a, b) => b.pop - a.pop);
  return merged.slice(0, 20).map((m) => m.item);
}

export async function getNetflix(): Promise<MediaItem[]> {
  if (!USE_LIVE) return [...TV_SHOWS, ...MOVIES].slice(0, 20);
  const items = await getByProvider(8);
  return items.length ? items : [...TV_SHOWS, ...MOVIES].slice(0, 20);
}

export async function getPrime(): Promise<MediaItem[]> {
  if (!USE_LIVE) return MOVIES.slice(0, 10);
  const items = await getByProvider(9);
  return items.length ? items : MOVIES.slice(0, 10);
}

export async function getDisney(): Promise<MediaItem[]> {
  if (!USE_LIVE) return [...MOVIES].reverse().slice(0, 10);
  const items = await getByProvider(337);
  return items.length ? items : [...MOVIES].reverse().slice(0, 10);
}

async function getByGenre(genreId: number): Promise<MediaItem[]> {
  const data = await tmdbFetch<TMDBListResponse>('/discover/movie', {
    with_genres: genreId,
    sort_by: 'popularity.desc',
    page: 1,
  });
  if (!data?.results?.length) return MOVIES;
  return data.results.slice(0, 20).map((r) => mapResult(r, 'movie'));
}

export async function getActionMovies(): Promise<MediaItem[]> {
  if (!USE_LIVE) return MOVIES;
  return getByGenre(28);
}

export async function getComedyMovies(): Promise<MediaItem[]> {
  if (!USE_LIVE) return MOVIES;
  return getByGenre(35);
}

export async function getSciFiMovies(): Promise<MediaItem[]> {
  if (!USE_LIVE) return MOVIES.slice(1);
  return getByGenre(878);
}

export async function getHorrorMovies(): Promise<MediaItem[]> {
  if (!USE_LIVE) return [...MOVIES].reverse();
  return getByGenre(27);
}

export async function getUpcoming(): Promise<MediaItem[]> {
  if (!USE_LIVE) return MOVIES.slice(0, 6);
  const data = await tmdbFetch<TMDBListResponse>('/movie/upcoming', { page: 1 });
  if (!data?.results?.length) return MOVIES.slice(0, 6);
  const nowStr = new Date().toISOString().split('T')[0];
  const future = data.results
    .filter((r) => (r.release_date ?? '') > nowStr)
    .slice(0, 20)
    .map((r) => mapResult(r, 'movie'));
  return future.length ? future : data.results.slice(0, 20).map((r) => mapResult(r, 'movie'));
}

export async function getBollywood(): Promise<MediaItem[]> {
  if (!USE_LIVE) return BOLLYWOOD;
  const data = await tmdbFetch<TMDBListResponse>('/discover/movie', {
    with_original_language: 'hi',
    sort_by: 'popularity.desc',
    page: 1,
  });
  if (!data?.results?.length) return BOLLYWOOD;
  return data.results.slice(0, 20).map((r) => mapResult(r, 'movie'));
}

export async function getPakistani(): Promise<MediaItem[]> {
  if (!USE_LIVE) return PAKISTANI;
  const data = await tmdbFetch<TMDBListResponse>('/discover/tv', {
    with_original_language: 'ur',
    sort_by: 'popularity.desc',
    page: 1,
  });
  if (!data?.results?.length) return PAKISTANI;
  return data.results.slice(0, 20).map((r) => mapResult(r, 'tv'));
}

// ═══════════════════════════════════════════════════════════════════════════
// DETAILS, CREDITS, SIMILAR, SEASONS
// ═══════════════════════════════════════════════════════════════════════════

interface TMDBDetail extends TMDBResult {
  runtime?: number;
  episode_run_time?: number[];
  tagline?: string;
  genres?: { id: number; name: string }[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
}

export async function getDetails(id: number, type: MediaType): Promise<MediaItem | null> {
  console.log(`🔍 getDetails: ${type}/${id}`);
  const fallback = getMockById(id, type);
  if (!USE_LIVE) {
    console.log(`⚠️ MOCK MODE - getDetails returning mock for ${type}/${id}`);
    return fallback ?? null;
  }
  const data = await tmdbFetch<TMDBDetail>(`/${type}/${id}`, {
    append_to_response: 'videos,credits',
  });
  if (!data) {
    console.log(`❌ getDetails FAILED for ${type}/${id}, using fallback`);
    return fallback ?? null;
  }
  const item = mapResult(data, type);
  if (type === 'tv' && data.episode_run_time?.length) {
    item.runtime = data.episode_run_time[0];
  }
  return item;
}

interface TMDBCredits {
  cast: { id: number; name: string; character: string; profile_path: string }[];
  crew: { id: number; name: string; job: string; department: string; profile_path: string }[];
}

export async function getCredits(id: number, type: MediaType): Promise<{ cast: CastMember[]; crew: CrewMember[] }> {
  const fallbackCast = MOCK_CAST[type]?.[String(id)] ?? [];
  const fallbackCrew = MOCK_CREW[type]?.[String(id)] ?? [];
  if (!USE_LIVE) return { cast: fallbackCast, crew: fallbackCrew };
  const data = await tmdbFetch<TMDBCredits>(`/${type}/${id}/credits`);
  if (!data) return { cast: fallbackCast, crew: fallbackCrew };
  return {
    cast: (data.cast || []).slice(0, 12).map((c) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profilePath: c.profile_path || '',
    })),
    crew: (data.crew || []).slice(0, 6).map((c) => ({
      id: c.id,
      name: c.name,
      job: c.job,
      department: c.department,
      profilePath: c.profile_path || '',
    })),
  };
}

export async function getSimilar(id: number, type: MediaType): Promise<MediaItem[]> {
  if (!USE_LIVE) return getMockSimilar(id, type);
  const data = await tmdbFetch<TMDBListResponse>(`/${type}/${id}/recommendations`);
  if (!data?.results?.length) {
    const similar = await tmdbFetch<TMDBListResponse>(`/${type}/${id}/similar`);
    if (!similar?.results?.length) return getMockSimilar(id, type);
    return similar.results.slice(0, 12).map((r) => mapResult(r, type));
  }
  return data.results.slice(0, 12).map((r) => mapResult(r, type));
}

interface TMDBSeason {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
  poster_path: string;
  overview: string;
  episodes?: {
    id: number;
    episode_number: number;
    season_number: number;
    name: string;
    overview: string;
    still_path: string;
    runtime: number;
    air_date: string;
  }[];
}

export async function getSeasons(id: number): Promise<Season[]> {
  if (!USE_LIVE) return getMockSeasons(id);
  const data = await tmdbFetch<{ seasons: TMDBSeason[] }>(`/tv/${id}`);
  if (!data?.seasons?.length) return getMockSeasons(id);
  const valid = data.seasons.filter((s) => s.season_number >= 0);
  return Promise.all(
    valid.map(async (s) => {
      const detail = await tmdbFetch<{ episodes: TMDBSeason['episodes'] }>(`/tv/${id}/season/${s.season_number}`);
      return {
        id: s.id,
        seasonNumber: s.season_number,
        name: s.name,
        episodeCount: s.episode_count,
        posterPath: s.poster_path || '',
        overview: s.overview || '',
        episodes: (detail?.episodes || []).map((e) => ({
          id: e.id,
          episodeNumber: e.episode_number,
          seasonNumber: e.season_number,
          name: e.name,
          overview: e.overview || '',
          stillPath: e.still_path || '',
          runtime: e.runtime || 0,
          airDate: e.air_date || '',
        })),
      } satisfies Season;
    }),
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// INTELLIGENT SEARCH
// ═══════════════════════════════════════════════════════════════════════════

const VOWEL_SWAPS: Record<string, string[]> = {
  a: ['e', 'u', 'o'],
  e: ['a', 'i'],
  i: ['e', 'y'],
  o: ['u', 'a'],
  u: ['o', 'a'],
};

function levenshtein(s1: string, s2: string): number {
  const a = s1.length;
  const b = s2.length;
  if (a === 0) return b;
  if (b === 0) return a;
  const costs = Array.from({ length: b + 1 }, (_, i) => i);
  for (let i = 1; i <= a; i++) {
    let lastValue = i;
    for (let j = 0; j <= b; j++) {
      if (j === 0) { costs[j] = i; } else {
        let newValue = costs[j - 1];
        if (s1[i - 1] !== s2[j - 1]) newValue = 1 + Math.min(costs[j], newValue, lastValue);
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    costs[b] = lastValue;
  }
  return costs[b];
}

function similarity(a: string, b: string): number {
  const x = a.toLowerCase().trim();
  const y = b.toLowerCase().trim();
  if (!x || !y) return 0;
  const maxLen = Math.max(x.length, y.length);
  return 1 - levenshtein(x, y) / maxLen;
}

function generateQueryVariants(query: string): string[] {
  const variants = new Set<string>();
  const lower = query.toLowerCase().trim();
  if (!lower) return [];
  for (let i = 0; i < lower.length; i++) {
    const swaps = VOWEL_SWAPS[lower[i]];
    if (swaps) for (const swap of swaps) variants.add(lower.slice(0, i) + swap + lower.slice(i + 1));
  }
  const singled = lower.replace(/(.)\1+/g, '$1');
  if (singled !== lower) variants.add(singled);
  if (lower && !/[aeiou]$/.test(lower)) variants.add(lower + lower[lower.length - 1]);
  variants.delete(lower);
  return Array.from(variants).slice(0, 6);
}

interface SearchResultRow extends TMDBResult { _matchedVia?: string; }

export async function searchMedia(query: string, type?: MediaType): Promise<MediaItem[]> {
  if (!query.trim()) return [];
  if (!USE_LIVE) return searchMock(query, type);
  console.log(`🔍 SEARCH: "${query}"`);
  const resultsById = new Map<number, SearchResultRow>();
  const runQueryBatch = async (q: string) => {
    const targets: { path: string; t: MediaType }[] = type
      ? [{ path: `/search/${type}`, t: type }]
      : [{ path: '/search/movie', t: 'movie' as MediaType }, { path: '/search/tv', t: 'tv' as MediaType }, { path: '/search/multi', t: 'movie' as MediaType }];
    const responses = await Promise.all(targets.map((tgt) => tmdbFetch<TMDBListResponse>(tgt.path, { query: q, page: 1, include_adult: 'false' })));
    for (const data of responses) {
      if (!data?.results) continue;
      for (const item of data.results) {
        if (!item.id) continue;
        let mediaType = item.media_type as MediaType | undefined;
        if (!mediaType) mediaType = item.first_air_date ? 'tv' : 'movie';
        if (mediaType !== 'movie' && mediaType !== 'tv') continue;
        if (type && mediaType !== type) continue;
        resultsById.set(item.id, { ...item, media_type: mediaType });
      }
    }
  };
  await runQueryBatch(query);
  if (resultsById.size < 4) { const variants = generateQueryVariants(query); if (variants.length) await Promise.all(variants.map(runQueryBatch)); }
  await searchByPerson(query, resultsById, type);
  console.log(`🔍 SEARCH RESULTS: ${resultsById.size} items found for "${query}"`);
  const allResults = Array.from(resultsById.values());
  const queryLower = query.toLowerCase();
  allResults.sort((a, b) => {
    const score = (item: SearchResultRow): number => {
      const title = (item.title ?? item.name ?? '') as string;
      const pop = item.popularity ?? 0;
      const sim = similarity(title, query);
      const exactBonus = title.toLowerCase() === queryLower ? 100 : 0;
      const castBonus = item._matchedVia ? 15 : 0;
      return pop + sim * 50 + exactBonus + castBonus;
    };
    return score(b) - score(a);
  });
  return allResults.slice(0, 24).map((r) => mapResult(r, (r.media_type as MediaType) ?? 'movie'));
}

async function searchByPerson(query: string, resultsById: Map<number, SearchResultRow>, type?: MediaType): Promise<void> {
  const peopleData = await tmdbFetch<TMDBListResponse>('/search/person', { query, page: 1, include_adult: 'false' });
  if (!peopleData?.results?.length) return;
  const people = peopleData.results.filter((p) => similarity(p.name ?? '', query) > 0.35).sort((a, b) => similarity(b.name ?? '', query) - similarity(a.name ?? '', query)).slice(0, 2);
  for (const person of people) {
    if (!person.id) continue;
    const credits = await tmdbFetch<{ cast: TMDBResult[] }>(`/person/${person.id}/combined_credits`);
    if (!credits?.cast) continue;
    const top = [...credits.cast].sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0)).slice(0, 15);
    for (const credit of top) {
      if (!credit.id) continue;
      let mediaType = credit.media_type as MediaType | undefined;
      if (!mediaType) mediaType = credit.first_air_date ? 'tv' : 'movie';
      if (mediaType !== 'movie' && mediaType !== 'tv') continue;
      if (type && mediaType !== type) continue;
      if (resultsById.has(credit.id)) { resultsById.get(credit.id)!._matchedVia = person.name; }
      else { resultsById.set(credit.id, { ...credit, media_type: mediaType, _matchedVia: person.name }); }
    }
  }
}

function normalizeImagePath(path: string | null | undefined): string {
  if (!path) return '';
  const value = String(path).trim();
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return value.startsWith('/') ? value : `/${value}`;
}

export function imageUrl(path: string | null | undefined, size = 'w500'): string {
  const normalized = normalizeImagePath(path);
  const result = normalized ? `https://image.tmdb.org/t/p/${size}${normalized}` : '';
  if (!result && path) console.log(`⚠️ imageUrl: EMPTY result for path: "${path}"`);
  return result;
}

export function heroImage(path: string | null | undefined): string {
  return imageUrl(path, 'original');
}

export const isLiveTMDB = USE_LIVE;