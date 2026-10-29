(function(){
  window.dataLayer=window.dataLayer||[];
  var LABELS={whatsapp_click:'',phone_click:'',booking_submit:''}; /* paste Google Ads conversion labels, e.g. 'AW-16881895258/AbC123' */
  function ev(n,extra){
    var d={event:n,page_path:location.pathname};for(var k in extra||{})d[k]=extra[k];
    dataLayer.push(d);
    try{if(typeof gtag==='function'){gtag('event',n,d);if(LABELS[n])gtag('event','conversion',{send_to:LABELS[n]});}}catch(e){}
    try{if(typeof fbq==='function'){fbq('track',n==='booking_submit'?'Lead':'Contact');}}catch(e){}
  }
  window.cwcTrack=ev;
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;
    var h=a.getAttribute('href')||'';
    if(/wa\.me|api\.whatsapp\.com/.test(h))ev('whatsapp_click',{link_url:h});
    else if(/^tel:/.test(h))ev('phone_click',{link_url:h});
  },true);
  document.addEventListener('submit',function(e){
    var f=e.target;if(!f||!f.matches)return;
    if(f.matches('[data-booking],.latepoint-form,form[class*="latepoint"]'))ev('booking_submit',{form:f.id||f.className});
  },true);
  document.addEventListener('latepoint:booking_completed',function(){ev('booking_submit');});
})();