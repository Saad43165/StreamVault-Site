import { NextResponse } from 'next/server';
import { getDetails } from '@/lib/tmdb';

// Lightweight detail lookup for the player chrome (title + poster + backdrop).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get('id'));
  const type = searchParams.get('type') === 'tv' ? 'tv' : 'movie';

  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const item = await getDetails(id, type);
  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    title: item.title,
    posterPath: item.posterPath,
    backdropPath: item.backdropPath,
  });
}
