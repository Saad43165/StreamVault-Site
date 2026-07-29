// Ad-block system ported from the StreamVault Flutter app.
// Domain list + JS injection script, adapted for the web player.

export const adBlockDomains: string[] = [
  'doubleclick.net',
  'googlesyndication.com',
  'adservice.google.com',
  'googleadservices.com',
  'google-analytics.com',
  'googletagmanager.com',
  'googletagservices.com',
  'popads.net',
  'popcash.net',
  'propellerads.com',
  'adnxs.com',
  'advertising.com',
  'adblade.com',
  'adsafeprotected.com',
  'adform.net',
  'rubiconproject.com',
  'openx.net',
  'pubmatic.com',
  'smartadserver.com',
  'criteo.com',
  'taboola.com',
  'outbrain.com',
  'revcontent.com',
  'mgid.com',
  'exoclick.com',
  'trafficjunky.net',
  'adsterra.com',
  'hilltopads.net',
  'clickadu.com',
  'juicyads.com',
  'plugrush.com',
  'ero-advertising.com',
  'traffichaus.com',
  'popunder.ru',
  'onclickads.net',
  'gotrackier.com',
  'clicksor.com',
  'adcash.com',
  'bidvertiser.com',
  'yllix.com',
  'valueclick.com',
  'zedo.com',
  'undertone.com',
  'hotjar.com',
  'mixpanel.com',
  'segment.io',
  'amplitude.com',
  'fullstory.com',
  'popmonetizer.com',
  'trafficjunky.com',
  'casalemedia.com',
  'moatads.com',
  'springserve.com',
  'spotxchange.com',
];

// JS ad-block injection script (ported from Flutter InAppWebView version).
// On the web, same-origin policy prevents injecting this into cross-origin
// embed iframes, so the iframe `sandbox` attribute (no allow-popups) is the
// primary popup blocker. This script still runs on the player page itself to
// neutralize any same-origin ads and is kept identical for parity with the app.
export const adBlockScript = `
(function(){
  if(window.__ak)return; window.__ak=true;
  window.open=function(){return null;};
  window.alert=function(){};
  window.confirm=function(){return true;};
  window.prompt=function(){return null;};
  var BAD=['doubleclick','googlesyndication','popads','trafficjunky','adclick',
    'exoclick','juicyads','hilltopads','propellerads','adsterra','admaven',
    'popcash','adcash','taboola','outbrain','mgid','revcontent','popmonetizer'];
  function bad(u){return u&&BAD.some(function(d){return u.indexOf(d)!==-1;});}
  var ox=XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open=function(m,u){if(bad(u)){this.__b=true;return;}return ox.apply(this,arguments);};
  var sx=XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send=function(){if(this.__b)return;return sx.apply(this,arguments);};
  if(window.fetch){var of=window.fetch;window.fetch=function(i,n){
    var u=(typeof i==='string')?i:(i&&i.url)||'';
    if(bad(u))return new Promise(function(){});
    return of.apply(this,arguments);
  };};
  var SK=['vidlink','vidsrc','embed','multiembed','smash','autoembed','vidfast','2embed','vsembed','vidphantom','nontongo','moviesapi','filmu','vid-src'];
  function safe(el){
    if(!el||!el.querySelector)return false;
    if(el.tagName==='VIDEO')return true;
    if(el.querySelector('video'))return true;
    var ifs=el.querySelectorAll('iframe');
    for(var i=0;i<ifs.length;i++){var s=ifs[i].src||'';if(SK.some(function(k){return s.indexOf(k)!==-1;}))return true;}
    return false;
  }
  var AD_SEL=[
    'ins.adsbygoogle','iframe[src*="doubleclick"]','iframe[src*="googlesyndication"]',
    'iframe[src*="popads"]','iframe[src*="exoclick"]','iframe[src*="juicyads"]',
    'iframe[src*="trafficjunky"]','iframe[src*="adsterra"]',
    'div[id^="div-gpt-ad"]','div[id*="google_ads"]','div[class*="adsbygoogle"]',
    'div[class*="popup"]','div[class*="pop-up"]','div[id*="popup"]',
    'div[class*="overlay"]:not([class*="player"])','div[class*="modal"]:not([class*="player"])',
    'div[class*="interstitial"]','div[class*="preroll"]'
  ];
  var AD_TXT=['advertisement','sponsored','buy now','claim prize','you won','lucky visitor'];
  function looksAd(el){
    try{var cs=window.getComputedStyle(el);var z=parseInt(cs.zIndex)||0;
      if((cs.position==='fixed'||cs.position==='absolute')&&z>100&&!safe(el))return true;}catch(e){}
    var t=(el.innerText||'').toLowerCase();
    return AD_TXT.some(function(h){return t.indexOf(h)!==-1;});
  }
  function kill(el){if(!el||!el.parentNode||safe(el))return;el.parentNode.removeChild(el);}
  function resume(){
    document.querySelectorAll('video').forEach(function(v){
      if(v.paused&&!v.ended&&v.readyState>1){v.play().catch(function(){});}
      v.muted=false;
    });
  }
  function sweep(){
    var killed=false;
    AD_SEL.forEach(function(sel){try{document.querySelectorAll(sel).forEach(function(el){kill(el);killed=true;});}catch(e){}});
    document.querySelectorAll('div[style*="z-index"],div[style*="position:fixed"],div[style*="position: fixed"]')
      .forEach(function(el){if(looksAd(el)){kill(el);killed=true;}});
    document.querySelectorAll('a').forEach(function(a){
      var h=a.href||'';if(BAD.some(function(d){return h.indexOf(d)!==-1;})){
        a.onclick=function(e){e.preventDefault();e.stopPropagation();};a.href='javascript:void(0)';}
    });
    if(killed)resume();
  }
  var SKIP=['skip','close','dismiss','got it','continue','\u00d7','\u2715','\u2716'];
  function autoSkip(){
    var sel='[class*="skip"],[id*="skip"],[aria-label*="skip"],[class*="close-ad"],[class*="closeBtn"],[class*="dismiss"]';
    var clicked=false;
    document.querySelectorAll(sel).forEach(function(el){
      var cs=window.getComputedStyle(el);
      if(cs.display!=='none'&&cs.visibility!=='hidden'&&cs.opacity!=='0'){el.click();clicked=true;}
    });
    if(!clicked){document.querySelectorAll('button,span,div,a').forEach(function(el){
      var t=(el.innerText||'').toLowerCase().trim();
      if(t.length<20&&SKIP.some(function(k){return t.indexOf(k)!==-1;})){
        var cs=window.getComputedStyle(el);
        if(cs.display!=='none'&&cs.visibility!=='hidden'){el.click();clicked=true;}
      }
    });}
    if(clicked)resume();
  }
  var observer=new MutationObserver(function(muts){
    muts.forEach(function(m){
      m.addedNodes.forEach(function(n){
        if(n.nodeType===1){
          if(looksAd(n))kill(n);
          if(n.querySelectorAll){AD_SEL.forEach(function(sel){try{n.querySelectorAll(sel).forEach(kill);}catch(e){}});}
        }
      });
    });
    resume();
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('click',function(e){
    var el=e.target;
    while(el){
      var h=(el.href||(el.getAttribute&&el.getAttribute('href'))||'')+'';
      if(BAD.some(function(d){return h.indexOf(d)!==-1;})){e.preventDefault();e.stopPropagation();return;}
      el=el.parentElement;
    }
  },true);
  sweep();
  autoSkip();
  setInterval(sweep,800);
  setInterval(autoSkip,700);
  setInterval(function(){
    document.querySelectorAll('video').forEach(function(v){
      if(v.paused&&!v.ended&&v.readyState>2){v.play().catch(function(){});}
    });
  },5000);
})();
`;

// Sandbox token string for embed iframes. Excludes `allow-popups`,
// `allow-popups-to-escape-sandbox`, and `allow-top-navigation` to block the
// primary ad vector (pop-unders) — the web equivalent of the app's
// `window.open = function(){return null;}`.
export const IFRAME_SANDBOX =
  'allow-scripts allow-same-origin allow-forms allow-presentation allow-pointer-lock';
