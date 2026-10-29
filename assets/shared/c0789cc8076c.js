(function(){
 var PHOTO='/images/dra-myriam.jpg';
 function card(){
  var d=document.createElement('div');
  d.className='cwc-vd'; d.id='cwc-card';
  d.innerHTML='<div class="cwc-vd__badge"><span class="cwc-vd__dot"></span>AVAILABLE NOW</div>'
   +'<div class="cwc-vd__top">'
   +'<div class="cwc-vd__ph"><img src="'+PHOTO+'" alt="Dra. Myriam Palacios Alarcon" onerror="this.style.display=\'none\'"></div>'
   +'<div class="cwc-vd__txt"><p class="cwc-vd__nm">Dra. Myriam Palacios Alarc&oacute;n</p>'
   +'<p class="cwc-vd__ro">M&eacute;dico General &middot; English &amp; Spanish</p>'
   +'<p class="cwc-vd__st">C&eacute;dula profesional 11664989</p></div></div>'
   +'<a class="cwc-vd__cta" href="#" role="button"><span>Book Video Consultation'
   +'<small>$59 flat &middot; 25 min &middot; 8:00am&ndash;5:00pm</small></span></a>'
   +'<p class="cwc-vd__ft">Secure encrypted video &middot; No app needed &middot; Not for emergencies</p>';
  return d;
 }
 function build(){
  if(document.querySelector('.cwc-vd')) return true;
  var p=location.pathname.replace(/\/+$/,'');
  if(!(p===''||/video-doctor-consultation$/.test(p))) return true;
  var h1=document.querySelector('h1');
  if(!h1) return false;
  var wrap=h1.parentElement;
  if(!wrap) return false;
  var guard=0;
  while(wrap && wrap.clientWidth < 320 && guard++ < 6 && wrap.parentElement){ wrap=wrap.parentElement; }
  if(!wrap) return false;
  var sec=wrap.closest('section')||wrap.parentElement;
  if(sec) sec.classList.add('cwc-hero-sec');
  document.body.classList.add('cwc-tight');

  var grid=document.createElement('div'); grid.className='cwc-hero-grid';
  var left=document.createElement('div'); left.className='cwc-hero-l';
  var right=document.createElement('div'); right.className='cwc-hero-r';
  var kids=[].slice.call(wrap.children);
  kids.forEach(function(k){ left.appendChild(k); });
  right.appendChild(card());
  grid.appendChild(left); grid.appendChild(right);
  wrap.appendChild(grid);
  return true;
 }
 function boot(){ if(build()) return; var n=0,t=setInterval(function(){ if(build()||++n>40) clearInterval(t); },250); }
 if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();