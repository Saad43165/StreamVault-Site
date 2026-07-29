// api/proxy.js  (or pages/api/proxy.js)
// Fetches the embed page SERVER-SIDE, strips all ad scripts,
// and serves clean HTML from your own domain.
// The real provider URL never reaches the browser.

import { resolveUrl } from './stream.js';

const AD_SCRIPT_PATTERNS = [
  'doubleclick', 'googlesyndication', 'adservice.google', 'googleadservices',
  'googletagmanager', 'popads', 'popcash', 'propellerads', 'adnxs',
  'rubiconproject', 'openx.net', 'pubmatic', 'criteo', 'taboola', 'outbrain',
  'exoclick', 'trafficjunky', 'adsterra', 'hilltopads', 'clickadu',
  'juicyads', 'plugrush', 'onclickads', 'adcash', 'bidvertiser',
  'yllix', 'valueclick', 'popmonetizer', 'casalemedia', 'moatads',
];

// Injected into <head> of every proxied page — runs before any other script
const BLOCKER_SCRIPT = `
<script>
(function(){
  // Kill all popup attempts
  window.open = function(){ return null; };
  try { Object.defineProperty(window,'open',{value:function(){return null;},writable:false}); } catch(e){}

  // Neutralise all _blank anchors before they fire
  document.addEventListener('click', function(e){
    var el = e.target;
    while(el && el.tagName !== 'A') el = el.parentElement;
    if(el && (el.target === '_blank' || el.target === '_new')){
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);

  // Block XHR to ad domains
  var BAD = ${JSON.stringify(AD_SCRIPT_PATTERNS)};
  var _xopen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(m, u){
    if(BAD.some(function(d){ return String(u).indexOf(d) !== -1; })){ this.__blocked=true; return; }
    return _xopen.apply(this, arguments);
  };
  var _xsend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(){ if(this.__blocked) return; return _xsend.apply(this,arguments); };

  // Block fetch to ad domains
  var _fetch = window.fetch;
  if(_fetch) window.fetch = function(i,o){
    var u = typeof i === 'string' ? i : (i && i.url) || '';
    if(BAD.some(function(d){ return u.indexOf(d) !== -1; })) return new Promise(function(){});
    return _fetch.apply(this, arguments);
  };
})();
</script>`;

function stripAds(html, providerOrigin) {
  return html
    // Remove <script src="...ad-domain...">
    .replace(
      new RegExp(
        `<script[^>]+src=["'][^"']*(?:${AD_SCRIPT_PATTERNS.join('|')})[^"']*["'][^>]*>[\\s\\S]*?<\\/script>`,
        'gi'
      ),
      ''
    )
    // Remove inline scripts with popup/ad patterns
    .replace(
      /<script(?![^>]*src)[^>]*>([\s\S]*?(?:window\.open|popunder|pop_under|adsbygoogle|googletag\.cmd|_gaq\.push)[\s\S]*?)<\/script>/gi,
      ''
    )
    // Change all _blank anchors to _self to stop new tabs
    .replace(/target=["']_blank["']/gi, 'target="_self"')
    .replace(/target=["']_new["']/gi, 'target="_self"')
    // Inject our blocker at top of <head>
    .replace(/<head([^>]*)>/i, `<head$1>${BLOCKER_SCRIPT}`);
}

export default async function handler(req, res) {
  const { id, type = 'movie', source = '0', season = '1', episode = '1' } = req.query;

  if (!id || isNaN(Number(id))) {
    return res.status(400).send('Missing id');
  }

  const providerUrl = resolveUrl(
    Number(source),
    id,
    type,
    Number(season),
    Number(episode)
  );

  if (!providerUrl) {
    return res.status(400).send('Invalid source index');
  }

  try {
    const upstream = await fetch(providerUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': new URL(providerUrl).origin + '/',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      signal: AbortSignal.timeout(10000),
    });

    const contentType = upstream.headers.get('content-type') || 'text/html';
    if (!contentType.includes('text/html')) {
      return res.status(502).send('Non-HTML upstream response');
    }

    const html = await upstream.text();
    const clean = stripAds(html, new URL(providerUrl).origin);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    // Prevent the proxied page from being framed by anyone except your domain
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    // Block popup windows at the browser level via CSP
    res.setHeader(
      'Content-Security-Policy',
      [
        "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
        // No allow-popups = browser refuses window.open and target=_blank
        "sandbox allow-scripts allow-same-origin allow-forms allow-presentation allow-pointer-lock",
      ].join('; ')
    );

    return res.status(200).send(clean);
  } catch (err) {
    console.error('[proxy] fetch error:', err);
    return res.status(502).send('Upstream fetch failed');
  }
}