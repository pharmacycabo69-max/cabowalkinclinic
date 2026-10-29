(function(){
  function place(){
    var s = document.getElementById('cwc-h-onecall');
    if (!s) return;
    if (!document.body.classList.contains('home')) return;
    var hero = document.getElementById('cwc-h-hero');
    if (hero && hero.parentNode && s.previousElementSibling !== hero){
      hero.parentNode.insertBefore(s, hero.nextSibling);
    }
  }
  if (document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', place); } else { place(); }
})();
;/* CWC — IV Catalog Card Photos. Maps each therapy (by title) to its themed photo as
   background of .cwc-icard__placeholder (icon hidden). Retries on ready/load + poll +
   MutationObserver because the grid is built/restyled slightly after load. Links untouched. */
(function(){
  var B="https://www.cabowalkinclinic.com/wp-content/uploads/2026/05/cwc-card-";
  var MAP={"hangover drip":"hangover","hydration drip":"hydration","myers cocktail":"myers","immune boost":"immune","beauty glow":"beauty","nad+ drip":"nad","b-complex energy":"bcomplex","athletic recovery":"athletic","post-flight drip":"postflight","flu rescue":"flu","detox drip":"detox","headache rescue":"headache","mega myers":"megamyers","custom drip":"custom"};
  function applyAll(){
    var cards=document.querySelectorAll(".cwc-iv-catalog-grid .cwc-icard");var done=0;
    cards.forEach(function(card){
      var t=card.querySelector(".cwc-icard__title");if(!t)return;
      var key=MAP[t.textContent.trim().toLowerCase()];if(!key)return;
      var ph=card.querySelector(".cwc-icard__placeholder")||card.querySelector(".cwc-icard__media");if(!ph)return;
      if(ph.getAttribute("data-cwc-photo")!==key){
        ph.style.setProperty("background-image","url("+B+key+".jpg)","important");
        ph.style.setProperty("background-size","cover","important");
        ph.style.setProperty("background-position","center","important");
        ph.style.setProperty("background-repeat","no-repeat","important");
        ph.setAttribute("data-cwc-photo",key);
        var svg=ph.querySelector("svg");if(svg)svg.style.display="none";
      }
      done++;
    });
    return done;
  }
  function boot(){
    applyAll();var tries=0;
    var iv=setInterval(function(){var n=applyAll();if(n>=14||++tries>25){clearInterval(iv);}},250);
    try{var mo=new MutationObserver(function(){applyAll();});mo.observe(document.body,{childList:true,subtree:true});setTimeout(function(){mo.disconnect();},9000);}catch(e){}
  }
  if(document.readyState!=="loading")boot();else document.addEventListener("DOMContentLoaded",boot);
  window.addEventListener("load",applyAll);
})();
;(function(){
  /* concierge now loads site-wide (path guard removed 2026-05-21) */
  if(document.querySelector('.cwc-concierge')) return;
  /* ---- ONE place to change the action later (e.g. open AI chat) ---- */
  var WHATSAPP_URL = 'https://wa.me/5216242261023';
  function cwcConciergeGo(){ window.open(WHATSAPP_URL, '_blank', 'noopener'); }
  var IMG = '/images/logo.svg';
  function build(){
    var wrap = document.createElement('div');
    wrap.className = 'cwc-concierge';
    wrap.innerHTML =
      '<div class="cwc-concierge-bubble" id="cwcBubble" role="button" tabindex="0">'
        + '<button class="cwc-bubble-close" aria-label="Close message">&times;</button>'
        + "<span>Hi! I'll be your personal <strong>IV Concierge</strong></span>"
      + '</div>'
      + '<a class="cwc-concierge-avatar" href="' + WHATSAPP_URL + '" target="_blank" rel="noopener" aria-label="Chat with our IV Concierge on WhatsApp">'
        + '<img fetchpriority="high" src="' + IMG + '" alt="IV Concierge — Cabo Walk-In Clinic" width="320" height="320" loading="eager" fetchpriority="high" decoding="async">'
        + '<span class="cwc-concierge-online" aria-hidden="true"></span>'
      + '</a>';
    document.body.appendChild(wrap);
    var bubble = wrap.querySelector('#cwcBubble');
    var closeBtn = wrap.querySelector('.cwc-bubble-close');
    var avatar = wrap.querySelector('.cwc-concierge-avatar');
    avatar.addEventListener('click', function(e){ e.preventDefault(); cwcConciergeGo(); });
    bubble.addEventListener('click', function(e){ if(e.target === closeBtn) return; cwcConciergeGo(); });
    bubble.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); cwcConciergeGo(); } });
    closeBtn.addEventListener('click', function(e){ e.stopPropagation(); bubble.classList.add('is-hidden'); try{ sessionStorage.setItem('cwcConciergeBubbleClosed','1'); }catch(err){} });
    if(sessionStorage.getItem('cwcConciergeBubbleClosed')==='1'){ bubble.classList.add('is-hidden'); }
    setTimeout(function(){ wrap.classList.add('is-ready'); }, 700);
  }
  if(document.readyState!=='loading') build();
  else document.addEventListener('DOMContentLoaded', build);
})();
;(function(){
  if(!/\/iv-therapy\/?$/.test(location.pathname)) return;
  var IMG='/images/logo.svg';
  var PHONE='tel:+5216242261023', WA='https://wa.me/5216242261023';
  function build(){
    var root=document.querySelector('.elementor-473')||document.body;
    if(!document.querySelector('.cwc-ivhero')){
      var h1=document.querySelector('.elementor-473 h1') || document.querySelector('h1');
      var oldHero=h1 ? (h1.closest('.elementor-top-section')||h1.closest('section')) : null;
      var title=h1 ? h1.textContent.trim() : 'Mobile IV Therapy in Cabo San Lucas';
      var sub='';
      if(oldHero){ var tw=oldHero.querySelector('.elementor-widget-text-editor'); if(tw) sub=tw.textContent.trim(); }
      if(!sub) sub='Hydration, hangover, immunity, beauty, and athletic recovery drips — delivered in-room by a RN. Most arrivals within 45 minutes.';
      var sec=document.createElement('section'); sec.className='cwc-ivhero';
      sec.innerHTML=''
        +'<div class="cwc-ivhero-card">'
          
          +'<div class="cwc-ivhero-eyebrow"><span class="dot"></span>Concierge IV Therapy<span class="dot"></span></div>'
          +'<h1 class="cwc-ivhero-title"></h1>'
          +'<p class="cwc-ivhero-sub"></p>'
          +'<div class="cwc-ivhero-cta">'
            +'<a class="cwc-btn-book" href="'+WA+'">Book Now</a>'
            +'<a class="cwc-btn-call" href="'+PHONE+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.7 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.74-1.27a2 2 0 0 1 2.11-.45c.74.34 1.53.57 2.34.7A2 2 0 0 1 22 16.92z"></path></svg>Call Now</a>'
          +'</div>'
          +'<div class="cwc-ivhero-photo"><img alt="registered nurse administering a mobile IV drip in Cabo San Lucas" loading="eager"></div>'
        +'</div>'
        +'<a class="cwc-ivhero-menu-link" href="#cwc-drip-menu">View the IV Menu &darr;</a>';
      sec.querySelector('.cwc-ivhero-title').textContent=title;
      sec.querySelector('.cwc-ivhero-sub').textContent=sub;
      sec.querySelector('.cwc-ivhero-photo img').src=IMG;
      if(oldHero && oldHero.parentNode){
        root.insertBefore(sec, root.firstChild);
        oldHero.style.display='none';
        oldHero.setAttribute('aria-hidden','true');
        oldHero.querySelectorAll('h1').forEach(function(o){
          var d=document.createElement('div'); d.className=o.className; d.innerHTML=o.innerHTML;
          o.parentNode.replaceChild(d,o);
        });
      } else { root.insertBefore(sec, root.firstChild); }
    }
    var books=[].slice.call(document.querySelectorAll('.elementor-button')).filter(function(b){
      return /Book this drip/i.test(b.textContent); });
    var menuSection=null;
    books.forEach(function(b){
      var col=b.closest('.elementor-col-33')||b.closest('.elementor-column');
      if(!col) return;
      col.classList.add('cwc-drip');
      if(!menuSection){ menuSection=col.closest('.elementor-top-section')||col.closest('section'); }
      [].slice.call(col.querySelectorAll('.elementor-widget-heading')).forEach(function(h){
        var t=h.textContent.trim();
        if(/^(MOST POPULAR|NEW|PREMIUM|FEATURED)$/i.test(t)){ h.classList.add('cwc-badge-wrap'); }
        else if(/^[A-Z][A-Z\s&\+]{2,21}$/.test(t) && !/\$/.test(t)){ h.classList.add('cwc-cat'); }
      });
      [].slice.call(col.querySelectorAll('.elementor-widget-text-editor')).forEach(function(tw){
        var t=tw.textContent.trim();
        if(/^\$\s?\d/.test(t) || /^Call\s*[·.]/.test(t)){ tw.classList.add('cwc-price'); }
      });
    });
    if(menuSection){ menuSection.id='cwc-drip-menu'; menuSection.classList.add('cwc-drip-menu'); }
  }
  if(document.readyState!=='loading') build();
  else document.addEventListener('DOMContentLoaded', build);
})();