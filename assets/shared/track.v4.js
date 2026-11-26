(function(){
  window.dataLayer=window.dataLayer||[];
  var LABELS={whatsapp_click:'',phone_click:'',booking_submit:'',booking_paid:''}; /* paste Google Ads conversion labels, e.g. 'AW-16881895258/AbC123' */
  function ev(n,extra){extra=extra||{};delete extra.service;delete extra.method;
    var d={event:n,page_path:location.pathname};for(var k in extra||{})d[k]=extra[k];
    dataLayer.push(d);
    try{if(typeof gtag==='function'){gtag('event',n,d);if(LABELS[n])gtag('event','conversion',{send_to:LABELS[n]});}}catch(e){}
    try{if(typeof fbq==='function'){fbq('track',n==='booking_submit'?'Lead':'Contact');}}catch(e){}
  }
  window.cwcTrack=ev;
  /* attribution: keep ad click ids and UTMs (no personal or health data) for 90 days; sent with the booking so paid deposits can be matched to campaigns */
  try{var q=new URLSearchParams(location.search),keys=['gclid','gbraid','wbraid','utm_source','utm_medium','utm_campaign'],got={};keys.forEach(function(k){var v=q.get(k);if(v)got[k]=v.slice(0,120);});
    var old={};try{old=JSON.parse(localStorage.getItem('cwc_attr')||'{}');}catch(e){}
    if(old.t&&Date.now()-old.t>7776000000)old={};
    if(Object.keys(got).length){got.t=Date.now();localStorage.setItem('cwc_attr',JSON.stringify(got));}else if(!old.t){localStorage.removeItem('cwc_attr');}}catch(e){}
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;
    var h=a.getAttribute('href')||'';
    /* privacy: never send the prefilled WhatsApp text (may contain health info) to analytics or ads */
    if(/wa\.me|api\.whatsapp\.com/.test(h))ev('whatsapp_click',{link_url:h.split('?')[0]});
    else if(/^tel:/.test(h))ev('phone_click',{link_url:'tel'});
    else if(/maps\.app\.goo\.gl|google\.com\/maps/.test(h))ev('directions_click');
    if(a.hasAttribute('data-book'))ev('booking_start',{});
  },true);
  document.addEventListener('submit',function(e){
    var f=e.target;if(!f||!f.matches)return;
    if(f.matches('[data-booking],.latepoint-form,form[class*="latepoint"]'))ev('booking_submit',{form:f.id||f.className});
  },true);
  document.addEventListener('latepoint:booking_completed',function(){ev('booking_submit');});

  try{if(/^\/thanks\/?$/.test(location.pathname)&&!sessionStorage.getItem('cwc_paid')){sessionStorage.setItem('cwc_paid','1');setTimeout(function(){ev('booking_paid');},300);}}catch(e){}
})();