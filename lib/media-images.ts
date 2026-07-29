function normalizeImagePath(path: string | null | undefined): string {
  if (!path) return '';
  const value = String(path).trim();
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return value.startsWith('/') ? value : `/${value}`;
}

export function imageUrl(path: string | null | undefined, size = 'w500'): string {
  const normalized = normalizeImagePath(path);
  return normalized ? `https://image.tmdb.org/t/p/${size}${normalized}` : '';
}

export function heroImage(path: string | null | undefined): string {
  return imageUrl(path, 'original');
}
