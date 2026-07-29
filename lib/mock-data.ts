// Comprehensive fallback dataset used when no valid TMDB API key is configured.
// Image paths are real TMDB CDN assets (publicly accessible without a key).
// If a valid TMDB_API_KEY is provided in .env, the live API is used instead.

export const IMG = (path: string | null | undefined, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : '';

export type MediaType = 'movie' | 'tv';

export interface MediaItem {
  id: number;
  tmdbId: number;
  type: MediaType;
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseYear: string;
  rating: number;
  genres: string[];
  runtime?: number;
  tagline?: string;
}

export interface Episode {
  id: number;
  episodeNumber: number;
  seasonNumber: number;
  name: string;
  overview: string;
  stillPath: string;
  runtime: number;
  airDate: string;
}

export interface Season {
  id: number;
  seasonNumber: number;
  name: string;
  episodeCount: number;
  posterPath: string;
  overview: string;
  episodes: Episode[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profilePath: string;
}

const m = (
  id: number,
  title: string,
  overview: string,
  poster: string,
  backdrop: string,
  year: string,
  rating: number,
  genres: string[],
  runtime: number,
  tagline = '',
): MediaItem => ({
  id,
  tmdbId: id,
  type: 'movie',
  title,
  overview,
  posterPath: poster,
  backdropPath: backdrop,
  releaseYear: year,
  rating,
  genres,
  runtime,
  tagline,
});

const t = (
  id: number,
  title: string,
  overview: string,
  poster: string,
  backdrop: string,
  year: string,
  rating: number,
  genres: string[],
  tagline = '',
): MediaItem => ({
  id,
  tmdbId: id,
  type: 'tv',
  title,
  overview,
  posterPath: poster,
  backdropPath: backdrop,
  releaseYear: year,
  rating,
  genres,
  tagline,
});

export const MOVIES: MediaItem[] = [
  m(27205, 'Inception', 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.', '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', '/8ZTVqvKDQ8emSGUEMjsS4yHAwr1.jpg', '2010', 8.4, ['Action', 'Science Fiction', 'Thriller'], 148, 'Your mind is the scene of the crime.'),
  m(299536, 'Avengers: Infinity War', 'As the Avengers and their allies have continued to protect the world from threats too large for any one hero, a new danger has emerged from the cosmic shadows: Thanos.', '/lmZFxXgJE3vgrciwuDib0N8CfQo.jpg', '/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', '2018', 8.3, ['Adventure', 'Action', 'Science Fiction'], 149, 'An entire universe. Once and for all.'),
  m(603, 'The Matrix', 'Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.', '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', '/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg', '1999', 8.2, ['Action', 'Science Fiction'], 136, 'Welcome to the Real World.'),
  m(155, 'The Dark Knight', 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.', '/qJ2tW6WMUDux911t6y7wxRNJdcq.jpg', '/nMKdUUepR0i5zn0y1T2CsTKuJNh.jpg', '2008', 8.5, ['Action', 'Crime', 'Drama', 'Thriller'], 152, 'Why so serious?'),
  m(680, 'Pulp Fiction', 'A burger-loving hit man, his philosophical partner, a drug-addled gangster\'s moll and a washed-up boxer converge in this sprawling, comedic crime caper.', '/d5iIlRp5XxfmJQnLDKTdmIuLdeE.jpg', '/suaEOtk1N1sgg2MTM7oZd2cfVb3.jpg', '1994', 8.5, ['Thriller', 'Crime'], 154, 'You won\'t know the facts until you\'ve seen the fiction.'),
  m(278, 'The Shawshank Redemption', 'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work.', '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', '/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg', '1994', 8.7, ['Drama', 'Crime'], 142, 'Fear can hold you prisoner. Hope can set you free.'),
  m(24428, 'The Avengers', 'When an unexpected enemy emerges and threatens global safety, Nick Fury finds himself in need of a team to pull the world back from the brink of disaster.', '/RYMX2wbE2wqNpIkyM98qLNuQ3.jpg', '/9BBTo6ANMwotfoaFL4cT0IoBohB.jpg', '2012', 7.7, ['Science Fiction', 'Action', 'Adventure'], 143),
  m(1726, 'Iron Man', 'After surviving an unexpected attack in enemy territory, an industrialist builds a high-tech suit of armor and vows to protect the world as Iron Man.', '/78lPtwv72e4qYMiTwHCQZr4h3s9.jpg', '/8j58iEBw9hdz91hLiPlaejYc2MU.jpg', '2008', 7.6, ['Action', 'Adventure', 'Science Fiction'], 126),
  m(11, 'Star Wars', 'Princess Leia is captured and held hostage by the evil Imperial forces. Luke Skywalker and Han Solo work together to rescue her and bring peace to the galaxy.', '/6FfCUptB5uCkmUFhgXfUz6IVsvM.jpg', '/zqkmTXzjkHaXaLBVqCh24Y6UdpA.jpg', '1977', 8.2, ['Adventure', 'Action', 'Science Fiction'], 121),
  m(19995, 'Avatar', 'In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.', '/jRXYjXNq0Cs2TcJjLkki24MLb7M.jpg', '/Yc9q6QuWrG9B0snr4Q5JGz2W1uR.jpg', '2009', 7.6, ['Action', 'Adventure', 'Fantasy', 'Science Fiction'], 162),
  m(283566, 'Doctor Strange', 'After his career is destroyed, a brilliant but arrogant surgeon gets a new lease on life when a sorcerer takes him under her wing and trains him to defend the world against evil.', '/bQS43RSLaXA2ZUcNPKX7Rt1TgS7.jpg', '/hETuU0ksyVXlUMPgvLBf9b1rIeI.jpg', '2016', 7.4, ['Action', 'Adventure', 'Fantasy'], 115),
  m(671, "Harry Potter and the Philosopher's Stone", 'Harry Potter has lived under the stairs at his aunt and uncle\'s house his whole life. On his 11th birthday he discovers that he is the orphaned son of two powerful wizards.', '/wuMc08IPKEatf9rnMNXMPIDokuN.jpg', '/hziiv14OkM45mOzphUHHoPsi1tK.jpg', '2001', 7.9, ['Adventure', 'Fantasy'], 152),
  m(558, 'Spider-Man 2', 'Peter Parker is going through a major identity crisis. Burned out from being Spider-Man, he decides to shelve his hero persona, until Doc Ock arrives.', '/15c9CSwgFL9aP00pF9OUGZcjm7c.jpg', '/oeNkpJV6a9Esp1rXjkVgE5SP.jpg', '2004', 7.3, ['Action', 'Adventure', 'Science Fiction'], 127),
  m(76341, 'Mad Max: Fury Road', 'An apocalyptic story set in the furthest reaches of our planet, in a stark desert landscape where humanity is broken, and most everyone is crazed fighting for the necessities of life.', '/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg', '/gqrnQA6Xpp358VEDBuj4sW9iYxM.jpg', '2015', 7.6, ['Action', 'Adventure', 'Science Fiction'], 120),
  m(157433, 'Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival as the Earth faces a catastrophic future.', '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', '/pbrkL804c8yAv3zBZR4QPEafpAR.jpg', '2014', 8.3, ['Adventure', 'Drama', 'Science Fiction'], 169, 'Mankind was born on Earth. It was never meant to die here.'),
  m(122, 'The Lord of the Rings: The Return of the King', 'Aragorn is revealed as the heir to the ancient kings as he, Gandalf and the other members of the broken fellowship struggle to save Gondor.', '/rOzpIwpYJK3Rx6iAQwSYDt6JTiT.jpg', '/9baXp1Xd3FhRJrCr5g9Xx8L69Hv.jpg', '2003', 8.5, ['Adventure', 'Fantasy', 'Action'], 201),
];

export const TV_SHOWS: MediaItem[] = [
  t(1399, 'Game of Thrones', 'Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war.', '/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg', '/suopoADq0k8YZrLBdhdsoNCoAS0.jpg', '2011', 8.4, ['Sci-Fi & Fantasy', 'Drama', 'Action & Adventure'], 'Winter is coming.'),
  t(60625, 'Money Heist', 'Eight thieves take hostages and lock themselves in the Royal Mint of Spain as a criminal mastermind manipulates the police to carry out his plan.', '/reEMJA1uzscCpnpeNmvCLpenWHv.jpg', '/gFZriCkpJYsApPZEF3jhcL1CKjV.jpg', '2017', 8.3, ['Crime', 'Drama', 'Action & Adventure'], 'The perfect heist needs the perfect team.'),
  t(66732, 'Stranger Things', 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.', '/49WJfeN0moxb9IPf9uHjsk47gSF.jpg', '/56v2KjBlY4a1hJm7sQj8q1Y9KSM.jpg', '2016', 8.6, ['Sci-Fi & Fantasy', 'Mystery', 'Drama'], 'When the world turns upside down, you turn it back.'),
  t(1396, 'Breaking Bad', 'When Walter White, a chemistry teacher, is diagnosed with Stage III cancer, he turns to a life of crime, producing and selling methamphetamine.', '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', '/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg', '2008', 8.9, ['Drama', 'Crime', 'Thriller'], 'Remember my name.'),
  t(60735, 'The Flash', 'After a particle accelerator causes a freak storm, CSI Investigator Barry Allen is struck by lightning and falls into a coma.', '/wHa6KOJAoNTFLFtp7wguUJKSnju.jpg', '/n7Z9rPq1yEhfv6Tdsjmj4tWeb9N.jpg', '2014', 7.7, ['Sci-Fi & Fantasy', 'Drama', 'Action & Adventure']),
  t(71912, 'The Witcher', 'Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.', '/7vjaCdMw15FEbXfL3c7VxR4Csgy.jpg', '/jBJWaqoSCiHLW6xDrXK7pZg3Jty.jpg', '2019', 8.1, ['Sci-Fi & Fantasy', 'Drama', 'Action & Adventure'], 'Destiny is a beast.'),
  t(76479, 'The Boys', 'A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers.', '/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg', '/mGVrXeIjyecj6TKLpQeypa0hJtI.jpg', '2019', 8.4, ['Sci-Fi & Fantasy', 'Action & Adventure', 'Drama', 'Comedy']),
  t(84958, 'Loki', 'After stealing the Tesseract during the events of Avengers: Endgame, an alternate version of Loki is brought to the Time Variance Authority.', '/voHUmluYmKyleFgYboYfSyvYpfk.jpg', '/r2s56g6fHxqW5eT9eHnM3eZXJpl.jpg', '2021', 8.2, ['Sci-Fi & Fantasy', 'Drama', 'Action & Adventure']),
  t(94605, 'Arcane', 'Amid the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and clashing convictions.', '/abf8tHznhSvl9BAElD2cQeRr7do.jpg', '/q8eejQcg1bAqImEV8jh8RtBD3aH.jpg', '2021', 8.7, ['Animation', 'Drama', 'Sci-Fi & Fantasy', 'Action & Adventure']),
  t(85271, 'WandaVision', 'Wanda Maximoff and Vision—two super-powered beings living idealized suburban lives—begin to suspect that everything is not as it seems.', '/glKDfE6btIRcVB5JrnpDtc1TJAo.jpg', '/inUqbeC8PVDqHSBtMTuGg3e3UyM.jpg', '2021', 8.2, ['Sci-Fi & Fantasy', 'Drama', 'Mystery']),
];

// Bollywood + Pakistani selections (reusing real IDs in the catalog)
export const BOLLYWOOD: MediaItem[] = [
  m(535581, 'Radhe', 'Radhe is a hardcore encounter cop who is on a mission to clean the city of drug mafia.', '/g6Gt7fUp1l7AylVjIZag7qRwPTg.jpg', '/oKA1wqubGvxH61cPFJtqgXxq0Yc.jpg', '2021', 6.1, ['Action', 'Crime', 'Thriller'], 121),
  m(447365, 'Pathaan', 'An Indian agent races against a doomsday clock as a ruthless mercenary leads a dangerous terror syndicate.', '/j4Y7HoY6S6OaScx6v5KfA3x9UxT.jpg', '/lUVuKxDKNb15JI8Smpd7BxSxA3E.jpg', '2023', 7.0, ['Action', 'Adventure', 'Thriller'], 146),
  m(872585, 'Jawan', 'A high-octane action thriller which outlines the emotional journey of a man set to rectify the wrongs in society.', '/9XYpdm9ovQPrz7xt1c1CptRfJz4.jpg', '/b3lvuJTx8X55PYZBrx7vSmzJaI.jpg', '2023', 7.2, ['Action', 'Thriller', 'Crime'], 169),
  m(361748, 'RRR', 'A fictitious story about two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s.', '/nEufeZlyAOLqO2brrs0yeF1lgXn.jpg', '/9faGSWS3X0BmGWmc9j1iKngy5WH.jpg', '2022', 7.8, ['Action', 'Drama', 'History'], 187),
  m(597, '3 Idiots', 'Two friends are searching for their long lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently.', '/66A9MjXeRzV2Y5sfQqXcU6smfMy.jpg', '/y0JwzHcF1EuyUjzo5WZ7T8tQb2z.jpg', '2009', 8.0, ['Comedy', 'Drama'], 170),
];

export const PAKISTANI: MediaItem[] = [
  t(97732, 'Ertugrul', 'The heroic story of Ertugrul Ghazi, the father of Osman who founded the Ottoman Empire.', '/dZI3rU0gqP3qK2eIu94f5YfXpQf.jpg', '/oHfZfY6Xe4t2wBvY9wZ8pB3sJkR.jpg', '2014', 7.9, ['Action & Adventure', 'Drama', 'History']),
  m(950287, 'The Legend of Maula Jatt', 'A reboot of the 1979 cult classic, following the legendary rivalry between Maula Jatt and Noori Natt.', '/sXu4nYnCk6v0r5rZ4mI7p2G3yUg.jpg', '/yHsZ5Vt6n0BnE2xLxqPZ3cM8oDk.jpg', '2022', 8.2, ['Action', 'Drama'], 152),
  t(139013, 'Churails', 'Four women from very different walks of life form an underground detective agency to expose unfaithful men in Karachi.', '/eTg7l3pD7l4X5fUaI6kO9pM2nJr.jpg', '/n5nE2VlU3hWq0cQ1jS7fG4rX1cM.jpg', '2020', 7.5, ['Drama', 'Crime', 'Mystery']),
  t(120168, 'Meray Paas Tum Ho', 'A married man falls for another woman, shattering the life of his devoted wife and young son.', '/kP9kW5yV8bGd0C2Ji8XjV0vR3oN.jpg', '/h3R0HxQ8lN3q9rXrW3nC1vY6wJa.jpg', '2019', 8.6, ['Drama', 'Romance']),
];

const ALL_MEDIA = [...MOVIES, ...TV_SHOWS, ...BOLLYWOOD, ...PAKISTANI];

export function searchMock(query: string, type?: MediaType): MediaItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return ALL_MEDIA.filter(
    (x) =>
      (!type || x.type === type) &&
      (x.title.toLowerCase().includes(q) ||
        x.genres.some((g) => g.toLowerCase().includes(q))),
  );
}

export function getMockById(id: number, type: MediaType): MediaItem | undefined {
  return ALL_MEDIA.find((x) => x.id === id && x.type === type);
}

export function getMockSimilar(id: number, type: MediaType): MediaItem[] {
  const target = getMockById(id, type);
  if (!target) return [];
  return ALL_MEDIA.filter(
    (x) => x.type === type && x.id !== id && x.genres.some((g) => target.genres.includes(g)),
  ).slice(0, 12);
}

export const MOCK_TRENDING = [...MOVIES.slice(0, 8), ...TV_SHOWS.slice(0, 4)];

export const MOCK_CAST: Record<string, Record<string, CastMember[]>> = {
  movie: {
    '27205': [
      { id: 1, name: 'Leonardo DiCaprio', character: 'Cobb', profilePath: '/wo2hMrpnNtwCfNUtH5Drlghy5g3.jpg' },
      { id: 2, name: 'Joseph Gordon-Levitt', character: 'Arthur', profilePath: '/yGnwpJhjLzLCpBgVhS3m9tbJt9N.jpg' },
      { id: 3, name: 'Elliot Page', character: 'Ariadne', profilePath: '/qRHTXcaQMyINeOYXuAqfOlqP3uV.jpg' },
      { id: 4, name: 'Tom Hardy', character: 'Eames', profilePath: '/tUlxTiyexfDvfDogZixzuyJWjjm.jpg' },
      { id: 5, name: 'Ken Watanabe', character: 'Saito', profilePath: '/wjtYpgBJ5rMeoq3oKA8nEcvRjZL.jpg' },
    ],
    '299536': [
      { id: 6, name: 'Robert Downey Jr.', character: 'Tony Stark', profilePath: '/5qHNjAsjocC4dX9RZivO4yW3LzK.jpg' },
      { id: 7, name: 'Chris Hemsworth', character: 'Thor', profilePath: '/lZHQfWLe5lxjlx5eSiUQfoIOc0f.jpg' },
      { id: 8, name: 'Mark Ruffalo', character: 'Bruce Banner', profilePath: '/z3dvKqM4M6cW4xZpBhGk6qJrWqG.jpg' },
      { id: 9, name: 'Scarlett Johansson', character: 'Black Widow', profilePath: '/6nsSiZ2vDtSEg3YoWqNw5dCi0xW.jpg' },
    ],
  },
  tv: {
    '1399': [
      { id: 10, name: 'Emilia Clarke', character: 'Daenerys Targaryen', profilePath: '/mR7OZIa5cRkIPdkuTFCuQYOif2v.jpg' },
      { id: 11, name: 'Kit Harington', character: 'Jon Snow', profilePath: '/3xCgDIDMTcViIfTQkVfTSzZOd1f.jpg' },
      { id: 12, name: 'Peter Dinklage', character: 'Tyrion Lannister', profilePath: '/qLHAd54QX6rIk2cVtCRi6dR1RzG.jpg' },
    ],
    '66732': [
      { id: 13, name: 'Millie Bobby Brown', character: 'Eleven', profilePath: '/xOPvWaPfjzRJIFvkZxBG6z9E4O5.jpg' },
      { id: 14, name: 'Finn Wolfhard', character: 'Mike Wheeler', profilePath: '/l7c86fcYgIoy3jUcT0aJzE3oF8v.jpg' },
    ],
  },
};

export const MOCK_CREW: Record<string, Record<string, CrewMember[]>> = {
  movie: {
    '27205': [
      { id: 100, name: 'Christopher Nolan', job: 'Director', department: 'Directing', profilePath: '/xuAIuKNTpQDo6tXfDfY3xZq2p7y.jpg' },
      { id: 101, name: 'Emma Thomas', job: 'Producer', department: 'Production', profilePath: '' },
    ],
  },
};

const epNames = [
  'Pilot', 'The Awakening', 'Crossroads', 'Reckoning', 'Aftermath', 'The Return',
  'Loyalties', 'The Turning Point', 'Endgame', 'New Dawn', 'Shadows', 'Ascension',
];

// Real TMDB still backdrops rotated per episode so mock shows have varied art.
const EPISODE_STILLS = [
  '/56v2KjBlY4a1hJm7sQj8q1Y9KSM.jpg',
  '/suopoADq0k8YZrLBdhdsoNCoAS0.jpg',
  '/2Swn1Qtb1NGE2S6hGaRTzm8PxGz.jpg',
  '/nMReLr7TrvA6gN6s2KZ9P5xQ4oR.jpg',
  '/gFZriCkpJYsApPZEF3jhcL1CKjV.jpg',
  '/49WJfeN0moxb9IPf9uHjsk47gSF.jpg',
  '/reEMJA1uzscCpnpeNmvCLpenWHv.jpg',
  '/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
];

function makeEpisodes(seasonNumber: number, count: number): Episode[] {
  return Array.from({ length: count }, (_, i) => ({
    id: seasonNumber * 100 + i + 1,
    episodeNumber: i + 1,
    seasonNumber,
    name: `${epNames[(seasonNumber + i) % epNames.length]}`,
    overview:
      'When a mysterious threat emerges, the team must risk everything to uncover the truth and protect those they love before it is too late.',
    stillPath: EPISODE_STILLS[(seasonNumber + i) % EPISODE_STILLS.length],
    runtime: 45,
    airDate: `202${seasonNumber - 1}-0${(i % 9) + 1}-1${(i % 9) + 1}`,
  }));
}

export const MOCK_SEASONS: Record<string, Season[]> = {
  '1399': [
    { id: 1, seasonNumber: 1, name: 'Season 1', episodeCount: 10, posterPath: '/ztkUQwU7aU6oDfB7U0t5f8yY7pM.jpg', overview: 'The first season of the epic saga.', episodes: makeEpisodes(1, 10) },
    { id: 2, seasonNumber: 2, name: 'Season 2', episodeCount: 10, posterPath: '/9SOgn2nU6c5oqgEjDqY7pR3tF7K.jpg', overview: 'The war for the throne intensifies.', episodes: makeEpisodes(2, 10) },
    { id: 3, seasonNumber: 3, name: 'Season 3', episodeCount: 10, posterPath: '/r2s56g6fHxqW5eT9eHnM3eZXJpl.jpg', overview: 'Alliances shift and betrayals mount.', episodes: makeEpisodes(3, 10) },
  ],
  '66732': [
    { id: 11, seasonNumber: 1, name: 'Season 1', episodeCount: 8, posterPath: '/49WJfeN0moxb9IPf9uHjsk47gSF.jpg', overview: 'A boy vanishes in a small town.', episodes: makeEpisodes(1, 8) },
    { id: 12, seasonNumber: 2, name: 'Season 2', episodeCount: 9, posterPath: '/2wmTngn1tYC1AvfnrFLhxeD82hz.jpg', overview: 'The upside down grows.', episodes: makeEpisodes(2, 9) },
    { id: 13, seasonNumber: 3, name: 'Season 3', episodeCount: 8, posterPath: '/56v2KjBlY4a1hJm7sQj8q1Y9KSM.jpg', overview: 'Summer brings new horrors.', episodes: makeEpisodes(3, 8) },
  ],
  '60625': [
    { id: 21, seasonNumber: 1, name: 'Part 1', episodeCount: 13, posterPath: '/reEMJA1uzscCpnpeNmvCLpenWHv.jpg', overview: 'The heist begins.', episodes: makeEpisodes(1, 13) },
    { id: 22, seasonNumber: 2, name: 'Part 2', episodeCount: 9, posterPath: '/gFZriCkpJYsApPZEF3jhcL1CKjV.jpg', overview: 'The aftermath unfolds.', episodes: makeEpisodes(2, 9) },
  ],
};

function defaultSeasons(id: number): Season[] {
  return [
    { id, seasonNumber: 1, name: 'Season 1', episodeCount: 8, posterPath: '', overview: 'The first season.', episodes: makeEpisodes(1, 8) },
    { id, seasonNumber: 2, name: 'Season 2', episodeCount: 8, posterPath: '', overview: 'The second season.', episodes: makeEpisodes(2, 8) },
  ];
}

export function getMockSeasons(id: number): Season[] {
  return MOCK_SEASONS[String(id)] ?? defaultSeasons(id);
}
