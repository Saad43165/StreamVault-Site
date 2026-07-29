import { NextResponse } from 'next/server';
import { resolveProviderUrl } from '@/app/api/stream/route';

const AD_PATTERNS = [
  'doubleclick', 'googlesyndication', 'adservice.google', 'googleadservices',
  'googletagmanager', 'popads', 'popcash', 'propellerads', 'adnxs',
  'rubiconproject', 'openx.net', 'pubmatic', 'criteo', 'taboola', 'outbrain',
  'exoclick', 'trafficjunky', 'adsterra', 'hilltopads', 'clickadu',
  'juicyads', 'plugrush', 'onclickads', 'adcash', 'bidvertiser',
  'yllix', 'valueclick', 'popmonetizer', 'casalemedia', 'moatads',
];

const BLOCKER = `<script>
(function(){
  window.open=function(){return null;};
  try{Object.defineProperty(window,'open',{value:function(){return null;},writable:false});}catch(e){}
  var BAD=${JSON.stringify(AD_PATTERNS)};
  document.addEventListener('click',function(e){
    var el=e.target;
    while(el&&el.tagName!=='A')el=el.parentElement;
    if(el&&(el.target==='_blank'||el.target==='_new')){
      var h=el.href||'';
      var bad=BAD.some(function(d){return h.indexOf(d)!==-1;});
      if(bad){e.preventDefault();e.stopImmediatePropagation();}
      else{el.target='_self';}
    }
  },true);
  var _xo=XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open=function(m,u){
    if(BAD.some(function(d){return String(u).indexOf(d)!==-1;})){this.__b=true;return;}
    return _xo.apply(this,arguments);
  };
  var _xs=XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send=function(){if(this.__b)return;return _xs.apply(this,arguments);};
  if(window.fetch){var _f=window.fetch;window.fetch=function(i,o){
    var u=typeof i==='string'?i:(i&&i.url)||'';
    if(BAD.some(function(d){return u.indexOf(d)!==-1;}))return new Promise(function(){});
    return _f.apply(this,arguments);
  };}
})();
</script>`;

function sanitize(html: string): string {
  return html
    .replace(
      new RegExp(
        `<script[^>]+src=["'][^"']*(?:${AD_PATTERNS.join('|')})[^"']*["'][^>]*>[\\s\\S]*?<\\/script>`,
        'gi'
      ),
      ''
    )
    .replace(
      /<script(?![^>]*src)[^>]*>([\s\S]*?(?:window\.open|popunder|pop_under|adsbygoogle|googletag\.cmd)[\s\S]*?)<\/script>/gi,
      ''
    )
    .replace(/target=["']_blank["']/gi, 'target="_self"')
    .replace(/target=["']_new["']/gi, 'target="_self"')
    .replace(/<head([^>]*)>/i, `<head$1>${BLOCKER}`);
}

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

    const ct = upstream.headers.get('content-type') || '';
    if (!ct.includes('text/html')) {
      return new NextResponse('Non-HTML response from upstream', { status: 502 });
    }

    const html = await upstream.text();
    const clean = sanitize(html);

    return new NextResponse(clean, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Frame-Options': 'SAMEORIGIN',
        'Content-Security-Policy':
          "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; " +
          "sandbox allow-scripts allow-same-origin allow-forms allow-presentation allow-pointer-lock",
      },
    });
  } catch (err) {
    console.error('[proxy]', err);
    return new NextResponse('Upstream fetch failed', { status: 502 });
  }
}