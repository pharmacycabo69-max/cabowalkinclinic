(function(){
 function fixMenu(){
  var links=document.querySelectorAll('a[href*="video-doctor-consultation"]');
  for(var i=0;i<links.length;i++){
   var a=links[i];
   if(/24\s*\/\s*7/.test(a.textContent)){
    a.innerHTML=a.innerHTML.replace(/Video Doctor\s*24\s*\/\s*7/i,'Video Doctor');
   }
  }
 }
 function fixPage(){
  if(!/video-doctor-consultation/.test(location.pathname)) return;
  var reps=[
   [/24\s*\/\s*7\s*[^\w]*\s*365/gi,'8:00am-5:00pm daily'],
   [/15-MIN\s*[^\w]*\s*24\s*\/\s*7/gi,'15-MIN - 8am to 5pm'],
   [/24\s*\/\s*7\s*[^\w]*\s*English\s*\/\s*Spanish/gi,'8:00am-5:00pm - English / Spanish'],
   [/Available\s*24\s*\/\s*7/gi,'Available 8:00am-5:00pm']
  ];
  var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),n,nodes=[];
  while(n=w.nextNode()){
   var p=n.parentElement; if(!p) continue;
   if(p.tagName==='SCRIPT'||p.tagName==='STYLE') continue;
   if(p.closest('#cwc-ov')) continue;
   if(p.closest('footer,.site-footer,.elementor-location-footer')) continue;
   if(/24\s*\/\s*7/.test(n.nodeValue)) nodes.push(n);
  }
  nodes.forEach(function(node){
   var v=node.nodeValue, ch=false;
   reps.forEach(function(r){ if(r[0].test(v)){ v=v.replace(r[0],r[1]); ch=true; } });
   if(!ch){
    var ctx=(node.parentElement.textContent||'');
    if(!/whatsapp|mobile service|reach us|direct line|ambulance|dispatch/i.test(ctx)){
     v=v.replace(/24\s*\/\s*7/g,'8:00am-5:00pm'); ch=true;
    }
   }
   if(ch) node.nodeValue=v;
  });
 }
 function boot(){ fixMenu(); fixPage(); setTimeout(function(){fixMenu();fixPage();},900); setTimeout(function(){fixMenu();fixPage();},2200); }
 if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
;(function(){
 var PHOTO='/images/dra-myriam.webp';
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
;(function(){
  function inject(){
    if (window.innerWidth < 1024) return;
    if (document.querySelector('.cwc-desktop-navbar')) return;
    var pb = document.querySelector('.cwc-promobar') || document.body.firstElementChild;
    var nb = document.createElement('div');
    nb.className = 'cwc-desktop-navbar';
    nb.innerHTML = '<a href="/" class="cwc-desktop-navbar-brand">CABO <span>·</span> WALK-IN CLINIC</a>' +
      '<ul class="cwc-desktop-navbar-links">' +
      '<li><a href="/">Home</a></li>' +
      '<li><a href="/video-doctor-consultation/">Video Doctor 24/7 — $59</a></li>' +
      '<li><a href="/iv-therapy/">IV Therapy</a></li>' +
      '<li><a href="/lab-tests/">Lab Tests</a></li>' +
      '<li><a href="/nurse-care/">Nurse Care</a></li>' +
      '<li><a href="/home-doctor/">Home Doctor</a></li>' +
      '<li><a href="/?selected_agent=any&selected_location=any&selected_service=29&background_pattern=pattern_9&latepoint=instant" class="cwc-book-cta">Book Now</a></li>' +
      '</ul>';
    pb.parentNode.insertBefore(nb, pb.nextSibling);
    var p = window.location.pathname;
    nb.querySelectorAll('a').forEach(function(a){
      try { if (new URL(a.href).pathname === p && !a.classList.contains('cwc-book-cta')) a.style.color = '#D4A85C'; } catch(e){}
    });
  }
  if (document.readyState !== 'loading') inject(); else document.addEventListener('DOMContentLoaded', inject);
  window.addEventListener('resize', inject);
})();