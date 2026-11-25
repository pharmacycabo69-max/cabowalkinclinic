/* Cabo Walk-In Clinic - shared UI v3: accessible mobile menu, services menu, clinic-hours status, gentle reveal. */
(function(){
  var root=document.documentElement; root.classList.add('js');

  /* Mobile menu */
  var hdr=document.querySelector('header.top');
  var btn=hdr&&hdr.querySelector('.nav-toggle'), nav=hdr&&hdr.querySelector('nav.main');
  function set(open){
    if(!hdr||!btn) return;
    hdr.classList.toggle('nav-open',open);
    btn.setAttribute('aria-expanded',open?'true':'false');
    var l=btn.querySelector('.nt-label'); if(l) l.textContent=open?(root.lang==='es'?'Cerrar':'Close'):(root.lang==='es'?'Menú':'Menu');
  }
  if(btn&&nav){
    btn.addEventListener('click',function(){ var open=btn.getAttribute('aria-expanded')!=='true'; set(open); if(open){ var a=nav.querySelector('a,button'); a&&a.focus(); } });
    document.addEventListener('click',function(e){ if(hdr.classList.contains('nav-open')&&!hdr.contains(e.target)) set(false); });
    nav.addEventListener('click',function(e){ if(e.target.closest('a')) set(false); });
    window.addEventListener('resize',function(){ if(window.innerWidth>1000) set(false); });
  }

  /* Services menu (disclosure button) */
  var svc=document.querySelector('.nav-svc'), sb=svc&&svc.querySelector('button');
  function svcSet(o){ if(!svc) return; svc.classList.toggle('open',o); sb.setAttribute('aria-expanded',o?'true':'false'); }
  if(sb){
    sb.addEventListener('click',function(e){ e.stopPropagation(); svcSet(!svc.classList.contains('open')); });
    document.addEventListener('click',function(e){ if(!svc.contains(e.target)) svcSet(false); });
  }
  document.addEventListener('keydown',function(e){
    if(e.key!=='Escape') return;
    if(svc&&svc.classList.contains('open')){ svcSet(false); sb.focus(); return; }
    if(hdr&&hdr.classList.contains('nav-open')){ set(false); btn&&btn.focus(); }
  });

  /* Clinic hours status: posted hours only (9:00-17:00 daily, Cabo time). Not a live availability signal. */
  try{
    var now=new Date(new Date().toLocaleString('en-US',{timeZone:'America/Mazatlan'}));
    var m=now.getHours()*60+now.getMinutes(), open=m>=540&&m<1020, es=root.lang==='es';
    var txt=open?(es?'Abierto ahora · hasta las 5 PM':'Open now · until 5 PM'):(es?'Cerrado ahora · abre a las 9 AM':'Closed now · opens 9 AM');
    document.querySelectorAll('[data-open-status]').forEach(function(el){ el.classList.toggle('is-open',open); var t=el.querySelector('.st'); if(t) t.textContent=txt; });
  }catch(e){}

  /* Gentle reveal on scroll */
  var els=document.querySelectorAll('.rise');
  if('IntersectionObserver' in window&&els.length){
    var io=new IntersectionObserver(function(es){ es.forEach(function(x){ if(x.isIntersecting){ x.target.classList.add('in'); io.unobserve(x.target); } }); },{rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el){ io.observe(el); });
  } else { els.forEach(function(el){ el.classList.add('in'); }); }
})();
