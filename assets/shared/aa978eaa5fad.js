(function(){
  function isMobile(){ return window.matchMedia('(max-width: 1023px)').matches; }
  window.cwcOpenDrawerV10 = function(){
    if (!isMobile()) return;
    var d = document.getElementById('cwc-drawer-v10');
    var b = document.getElementById('cwc-backdrop-v10');
    if (!d || !b) return;
    d.style.transform = 'translateX(0)';
    b.style.opacity = '1';
    b.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';
    document.querySelectorAll('#cwc-drawer, .cwc-drawer-backdrop, #cwc-overlay').forEach(function(el){
      el.style.display='none'; el.style.visibility='hidden'; el.style.opacity='0'; el.style.pointerEvents='none';
      if (el.classList) el.classList.remove('is-open');
    });
  };
  window.cwcCloseDrawerV10 = function(){
    var d = document.getElementById('cwc-drawer-v10');
    var b = document.getElementById('cwc-backdrop-v10');
    if (!d || !b) return;
    d.style.transform = 'translateX(100%)';
    b.style.opacity = '0';
    b.style.pointerEvents = 'none';
    document.body.style.overflow = '';
  };
  document.addEventListener('click', function(e){
    var t = e.target.closest('.cwc-hamburger, button[class*="hamburger"], [aria-label="Menu"], [aria-label="Open menu"]');
    if (t && isMobile()) {
      e.preventDefault(); e.stopPropagation();
      window.cwcOpenDrawerV10();
    }
  }, true);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') window.cwcCloseDrawerV10(); });
})();
;var mf = {"postType":"page","restURI":"https://www.cabowalkinclinic.com/wp-json/metform/v1/forms/views/","minMsg1":"Minimum length should be ","Msg2":" character long.","maxMsg1":"Maximum length should be ","maxNum":"Maximum number should be ","minNum":"Minimum number should be "};
//# sourceURL=metform-app-js-extra