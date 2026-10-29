(function(){
  'use strict';
  var TEL='tel:+5216242261023';
  var MAP={
    'hangover':[1,15],'hydration':[2,16],'myers-cocktail':[3,17],'immune-boost':[4,18],
    'beauty-glow':[5,19],'nad-plus':[6,20],'b-complex-energy':[7,21],'athletic-recovery':[8,22],
    'post-flight':[9,23],'flu-rescue':[10,24],'detox':[11,25],'headache-rescue':[12,26],
    'mega-myers':[13,27],'custom-drip':[14,28]
  };
  var PHONE='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.9a15.3 15.3 0 006.5 6.5l2.2-2.2a1 1 0 011-.24 11.4 11.4 0 003.5.56 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.6a1 1 0 011 1c0 1.2.2 2.4.56 3.5a1 1 0 01-.25 1l-2.2 2.3z" fill="currentColor"/></svg>';
  function link(id){return '/?selected_agent=any&selected_location=any&selected_service='+id+'&background_pattern=pattern_9&latepoint=instant';}
  function slug(){var m=location.pathname.match(/\/iv-therapy\/([^\/]+)\/?$/);return m?m[1]:null;}
  function btn(cls,href,t,s){return '<a class="cwc-lp-btn '+cls+'" href="'+href+'"><span class="cwc-lp-btn__t">'+t+'</span><span class="cwc-lp-btn__s">'+s+'</span></a>';}
  function block(ids){
    var w=document.createElement('div');w.className='cwc-lp-block';
    w.innerHTML='<div class="cwc-lp-book-row">'+btn('cwc-lp-btn--clinic',link(ids[0]),'Book','Clinic')+btn('cwc-lp-btn--mobile',link(ids[1]),'Book','Mobile')+'</div>'+
      '<div class="cwc-lp-trust"><span>Instant booking</span><span>RNs</span></div>'+
      '<div class="cwc-lp-assist"><a href="'+TEL+'">'+PHONE+'<span>Need help choosing? <strong>Call us</strong></span></a></div>';
    return w;
  }
  function build(){
    var s=slug();if(!s||!MAP[s])return;
    var ids=MAP[s];
    var price=document.querySelector('.cwc-iv-hero__price');
    if(price&&price.parentNode&&!price.parentNode.querySelector('.cwc-lp-block')){price.insertAdjacentElement('afterend',block(ids));}
    var heroCta=document.querySelector('.cwc-iv-hero__cta');
    if(heroCta&&heroCta.parentNode){heroCta.parentNode.removeChild(heroCta);}
    ['.cwc-iv-compare__cta','.cwc-iv-ing__cta','.cwc-iv-benefits__cta'].forEach(function(sel){
      var nodes=document.querySelectorAll(sel);
      for(var i=0;i<nodes.length;i++){var cta=nodes[i];if(cta.querySelector('.cwc-lp-block'))continue;cta.style.setProperty('display','block','important');cta.style.setProperty('text-align','center','important');cta.innerHTML='';cta.appendChild(block(ids));}
    });
  }
  function run(){try{build();}catch(e){}}
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',run);}else{run();}
  setTimeout(run,800);setTimeout(run,2200);
})();
;/* CWC — CTA Phone Routing v1 (2026-05-21)
   Forces all conversion CTAs across cabowalkinclinic.com to dial
   tel:+5216242261023 — except WhatsApp / SMS / nav / forms / social.
   Pattern-matched at runtime so future buttons auto-route.
*/
(function(){
  'use strict';
  var TEL = 'tel:+5216242261023';
  var WA  = 'https://wa.me/5216242261023';

  // CTA texts that should call (tel:)
  var TEL_PATTERNS = [
    /^book now$/i,
    /^book by /i,
    /^book this drip$/i,
    /^book this panel$/i,
    /^book a house call$/i,
    /^book visit$/i,
    /^book your /i,
    /^book$/i,
    /^call now$/i,
    /^call$/i,
    /^call \+?52/i,
    /^call 24\/?7$/i,
    /^call to /i,
    /^call house call$/i,
    /^call for your custom/i,
    /^order$/i,
    /^order now$/i,
    /^schedule (a draw|visit|consultation|now)$/i,
    /^schedule$/i,
    /^reserve$/i,
    /^request a (doctor|free in-home assessment)$/i,
    /^request a free/i,
    /^request$/i,
    /^inquire now$/i,
    /^inquire$/i,
    /^tap to call/i,
    /^appointment$/i,
    /^get started$/i,
    /^consult/i,
    /^\+?52 ?\(?624\)? ?409 ?5065/
  ];

  // texts that should be WhatsApp
  var WA_PATTERNS = [
    /whatsapp/i,
    /chat on wa/i,
    /message us/i,
    /text us on/i
  ];

  // Never touch — nav, info, forms, FAQ
  var SKIP_PATTERNS = [
    /^skip to content$/i,
    /^home$/i, /^iv therapy$/i, /^lab tests?$/i, /^nurse care$/i, /^home doctor$/i, /^geriatric/i,
    /^learn more/i,
    /^see (iv menu|all services|lab menu)/i,
    /^view (the iv menu|gallery|all|our privacy policy|lab)/i,
    /^get directions$/i,
    /^our story$/i, /^visit us$/i, /^faq/i, /^blog/i, /^contact$/i,
    /^privacy/i, /^terms/i, /^cookies/i, /^hipaa/i,
    /^email me the guide$/i,
    /^×$/, /^x$/i, /^close$/i,
    /^how /i, /^are /i, /^do /i, /^what /i, /^can /i,
    /^\d/
  ];

  function classify(text, href){
    var t = (text || '').replace(/\s+/g, ' ').trim();
    if (t.length === 0 || t.length > 60) return null;
    if (SKIP_PATTERNS.some(function(p){ return p.test(t); })) return null;
    if (WA_PATTERNS.some(function(p){ return p.test(t); })){
      return /wa\.me/.test(href) ? null : 'wa';
    }
    if (/^text$/i.test(t)) return null; // FAB SMS keeps sms:
    if (TEL_PATTERNS.some(function(p){ return p.test(t); })){
      return href === TEL ? null : 'tel';
    }
    return null;
  }

  function apply(){
    var anchors = document.querySelectorAll('a');
    var changed = 0, ctel = 0, cwa = 0;
    for (var i = 0; i < anchors.length; i++){
      var a = anchors[i];
      if (a.closest && (a.closest('#wpadminbar') || a.closest('.ab-item') || a.closest('.elementor-editor'))) continue;
      var text = (a.textContent || '').trim();
      var href = a.getAttribute('href') || '';
      if (/latepoint/i.test(href)) continue; // CWC: never reroute LatePoint booking links
      var action = classify(text, href);
      if (action === 'tel'){
        a.setAttribute('href', TEL);
        a.removeAttribute('target');
        a.dataset.cwcRouted = 'tel';
        changed++; ctel++;
      } else if (action === 'wa'){
        a.setAttribute('href', WA);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener');
        a.dataset.cwcRouted = 'wa';
        changed++; cwa++;
      }
    }
    window.__cwcCtaRouted = {changed: changed, tel: ctel, wa: cwa, ts: Date.now()};
  }

  function run(){ apply(); }

  if (document.readyState === 'complete' || document.readyState === 'interactive'){
    setTimeout(run, 200);
  } else {
    document.addEventListener('DOMContentLoaded', function(){ setTimeout(run, 200); });
  }
  // Re-apply later for dynamically rendered widgets (popups, Elementor Pro forms, etc.)
  setTimeout(run, 1500);
  setTimeout(run, 4000);
})();