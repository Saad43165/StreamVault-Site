
// public/ad-blocker-sw.js
// Service Worker — intercepts all fetch/navigate requests and blocks ad domains.
// Install by registering from the watch page only.

const AD_DOMAINS = [
  'doubleclick.net','googlesyndication.com','adservice.google.com',
  'googleadservices.com','googletagmanager.com','googletagservices.com',
  'popads.net','popcash.net','propellerads.com','adnxs.com',
  'advertising.com','adblade.com','rubiconproject.com','openx.net',
  'pubmatic.com','smartadserver.com','criteo.com','taboola.com',
  'outbrain.com','revcontent.com','mgid.com','exoclick.com',
  'trafficjunky.net','trafficjunky.com','adsterra.com','hilltopads.net',
  'clickadu.com','juicyads.com','plugrush.com','onclickads.net',
  'gotrackier.com','adcash.com','bidvertiser.com','yllix.com',
  'valueclick.com','zedo.com','undertone.com','popmonetizer.com',
  'casalemedia.com','moatads.com','springserve.com','spotxchange.com',
  'adsafeprotected.com','adform.net','admaven.com','pounder.ru',
  'popunder.ru','traffichaus.com','clicksor.com','plugrush.com',
  'adcash.com','yllix.com','hilltopads.com','adspyglass.com',
  'go.ad2up.com','adf.ly','bc.vc','sh.st','ouo.io',
  'shorte.st','linkbucks.com','adfoc.us',
];

function isAdUrl(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return AD_DOMAINS.some((d) => host === d || host.endsWith('.' + d));
  } catch {
    return false;
  }
}

// On install, activate immediately without waiting
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  const url = e.request.url;
  const destination = e.request.destination;

  // Block ad domain requests entirely
  if (isAdUrl(url)) {
    e.respondWith(new Response('', { status: 204, statusText: 'Blocked by StreamVault' }));
    return;
  }

  // Block navigation requests (new tab attempts) to ad domains
  // destination === 'document' means it's a page navigation
  if (destination === 'document' && isAdUrl(url)) {
    e.respondWith(new Response('Blocked', { status: 204 }));
    return;
  }

  // Allow everything else through normally
  // (don't intercept video/media — it breaks the player)
  if (
    destination === 'video' ||
    destination === 'audio' ||
    destination === 'track' ||
    url.includes('.m3u8') ||
    url.includes('.mp4') ||
    url.includes('.ts') ||
    url.includes('manifest')
  ) {
    return; // let browser handle natively
  }

  // Default: pass through
});