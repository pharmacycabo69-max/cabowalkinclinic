(function(){
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