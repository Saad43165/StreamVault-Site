import { NextResponse } from 'next/server';
import { resolveProviderUrl } from '@/app/api/stream/route';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get('id');
  const type = searchParams.get('type') === 'tv' ? 'tv' : 'movie';
  const source = Number(searchParams.get('source')) || 0;
  const season = Number(searchParams.get('season')) || 1;
  const episode = Number(searchParams.get('episode')) || 1;

  if (!idParam || !Number.isFinite(Number(idParam))) {
    return new NextResponse('Missing id', { status: 400 });
  }

  const providerUrl = resolveProviderUrl(source, Number(idParam), type, season, episode);
  if (!providerUrl) {
    return new NextResponse('Invalid source', { status: 400 });
  }

  // Use a redirect with COOP header rather than proxying HTML.
  // Proxying HTML breaks JS-heavy players (they load via dynamic JS, not static HTML).
  // Instead we redirect to the real URL but set Cross-Origin-Opener-Policy so the
  // provider page cannot reference window.opener — this kills the pop-under ad mechanism.
  const response = NextResponse.redirect(providerUrl, { status: 302 });

  // COOP: same-origin — any new tab the provider opens cannot access window.opener
  // This is the browser-enforced popup killer that actually works
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none');
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set('Cache-Control', 'no-store');

  return response;
}