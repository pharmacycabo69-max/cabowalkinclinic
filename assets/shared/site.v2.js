/* Cabo Walk-In Clinic - shared UI v2: accessible mobile menu. */
(function(){
  var hdr=document.querySelector('header.top'); if(!hdr) return;
  var btn=hdr.querySelector('.nav-toggle'), nav=hdr.querySelector('nav.main');
  if(!btn||!nav) return;
  function set(open){
    hdr.classList.toggle('nav-open',open);
    btn.setAttribute('aria-expanded',open?'true':'false');
    btn.querySelector('.nt-label') && (btn.querySelector('.nt-label').textContent=open?'Close':'Menu');
  }
  btn.addEventListener('click',function(){ var open=btn.getAttribute('aria-expanded')!=='true'; set(open); if(open){ var a=nav.querySelector('a'); a&&a.focus(); } });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&hdr.classList.contains('nav-open')){ set(false); btn.focus(); } });
  document.addEventListener('click',function(e){ if(hdr.classList.contains('nav-open')&&!hdr.contains(e.target)) set(false); });
  nav.addEventListener('click',function(e){ if(e.target.closest('a')) set(false); });
  window.addEventListener('resize',function(){ if(window.innerWidth>1000) set(false); });
})();
