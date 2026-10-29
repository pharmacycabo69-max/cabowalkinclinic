(function(){
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