(function(){
  function go(){
  if(!/(\bhome\b|page-id-290)/.test(document.body.className)) return;
  var host=document.querySelector(".elementor.elementor-290")||document.querySelector("main.site-main");
  if(!host || document.getElementById("cwc-home")) return;
  function img(kw){var im=document.querySelector('img[src*="'+kw+'"]');return im?(im.currentSrc||im.getAttribute("src")||""):"";}
  var WA="https://wa.me/5216242261023", TEL="tel:+5216242261023";
  var SERVICES=[
    {t:"Walk-In &amp; Mobile IV Therapy",d:"Hydration, recovery, immune, NAD+ and more — in our downtown clinic or delivered to your room in about 45 minutes.",href:"/iv-therapy/",kw:"mobile-iv-therapy-hotel-v2"},
    {t:"Doctor House Calls",d:"English-speaking MD to your hotel, villa or yacht, 24/7. Exams and urgent care without leaving your room.",href:"/home-doctor/",kw:"doctor-house-call-cabo"},
    {t:"In-Room Nursing &amp; Wound Care",d:"RNs for injections, wound care, post-op and recovery support wherever you are staying.",href:"/nurse-care/",kw:"in-room-nursing-wound-care"},
    {t:"Mobile Lab Tests",d:"Blood draws and full lab panels at your location, with fast and reliable results you can trust.",href:"/lab-tests/",kw:"mobile-blood-draw-lab"},
    {t:"In-Home Senior &amp; Geriatric Care",d:"Compassionate, professional care for older travelers and residents, in the comfort of home.",href:"/geriatric-care/",kw:"team-senior-rn"}
  ];
  var DRIPS=[
    {n:"Hydration Drip",s:"hydration",p:"$149"},{n:"Recovery Drip",s:"hangover",p:"$169"},
    {n:"Myers Cocktail",s:"myers-cocktail",p:"$159"},{n:"Immune Boost",s:"immune-boost",p:"$159"},
    {n:"Beauty Glow",s:"beauty-glow",p:"$189"},{n:"NAD+ Drip",s:"nad-plus",p:"$189"},
    {n:"B-Complex Energy",s:"b-complex-energy",p:"$169"},{n:"Athletic Recovery",s:"athletic-recovery",p:"$199"},
    {n:"Post-Flight Drip",s:"post-flight",p:"$159"},{n:"Immune Recovery",s:"flu-rescue",p:"$199"},
    {n:"Replenish Drip",s:"detox",p:"$189"},{n:"Hydration Plus",s:"headache-rescue",p:"$169"},
    {n:"Mega Myers",s:"mega-myers",p:"$279"},{n:"Custom Drip",s:"custom-drip",p:"Call"}
  ];
  function svc(s){var src=img(s.kw);return '<a class="cwc-scard" href="'+s.href+'"><div class="cwc-scard__media"'+(src?(' style="background-image:url('+src+')"'):'')+'></div><div class="cwc-scard__b"><h3>'+s.t+'</h3><p>'+s.d+'</p><span class="cwc-scard__more">Learn more &rarr;</span></div></a>';}
  function drip(d){return '<a class="cwc-dcard" href="/iv-therapy/"><div class="cwc-dcard__img"><img loading="lazy" alt="'+d.n+'" src="/images/iv/'+d.s+'.jpg"></div><div class="cwc-dcard__b"><h4>'+d.n+'</h4><span class="cwc-dcard__price">'+d.p+'</span><span class="cwc-dcard__more">View drip &rarr;</span></div></a>';}
  function feat(ic,t,d){return '<div class="cwc-feat__i"><div class="ic">'+ic+'</div><h4>'+t+'</h4><p>'+d+'</p></div>';}
  var heroBg=img("walk-in-clinic-cabo-interior")||img("mobile-iv-therapy-hotel-v2");
  var H="";
  H+='<section id="cwc-h-hero"'+(heroBg?(' style="background-image:url('+heroBg+')"'):'')+'><div class="cwc-wrap">'
    +'<span class="eyebrow">English-Speaking &middot; 24/7 Mobile</span>'
    +'<h1 class="serif">Premium Walk-In &amp; Mobile Healthcare<br>in <span class="gold">Cabo San Lucas</span></h1>'
    +'<p class="sub">A downtown walk-in clinic plus doctors, nurses, IV therapy and labs delivered to your hotel, villa or yacht — with transparent USD pricing and travel-insurance invoices.</p>'
    +'<div class="cwc-cta-row"><a class="cwc-btn cwc-btn--gold" href="'+WA+'" target="_blank" rel="noopener">Book Now</a><a class="cwc-btn cwc-btn--ghost" href="'+TEL+'">Call +52 (624) 226 1023</a><a class="cwc-btn cwc-btn--wa" href="'+WA+'" target="_blank" rel="noopener">WhatsApp 24/7</a></div>'
    +'<div class="cwc-trust"><span><b>&#10003;</b> Bilingual MDs &amp; RNs</span><span><b>&#10003;</b> 24/7 Mobile Service</span></div>'
    +'</div></section>';
  H+='<section class="sec sec--cream"><div class="cwc-wrap"><div class="sechead"><span class="eyebrow">Our Services</span><h2 class="serif">Everything You Need, One Trusted Team</h2><p>Six dedicated services across Cabo San Lucas, San Jos&eacute; del Cabo and the Tourist Corridor — in-clinic or wherever you are staying.</p></div><div class="cwc-grid">'+SERVICES.map(svc).join("")+'</div></div></section>';
  H+='<section id="cwc-h-iv" class="sec"><div class="cwc-wrap"><div class="sechead"><span class="eyebrow">Mobile IV Therapy</span><h2 class="serif">IV Drips Delivered to Your Room</h2><p>RNs, sealed medical-grade IVs, in-room in about 45 minutes. Same price in-clinic or mobile.</p></div><div class="cwc-rail"><button class="cwc-arrow cwc-arrow--prev" aria-label="Previous">&lsaquo;</button><div class="cwc-track">'+DRIPS.map(drip).join("")+'</div><button class="cwc-arrow cwc-arrow--next" aria-label="Next">&rsaquo;</button></div><div class="cwc-ivcta"><a class="cwc-btn cwc-btn--gold" href="/iv-therapy/">View all IV therapies &rarr;</a></div></div></section>';
  H+='<section class="sec sec--cream"><div class="cwc-wrap"><div class="sechead"><span class="eyebrow">Why Cabo Walk-In Clinic</span><h2 class="serif">Care You Can Trust, Priced With Honesty</h2></div><div class="cwc-feat">'
    +feat("$","Transparent USD Pricing","Clear published prices — $80 walk-in visit, $200 house call, IV from $149. No surprises.")
    +feat("&#10010;","English-Speaking Clinicians","English-speaking doctors and nurses, on call for your hotel, villa or yacht.")
    +feat("24/7","Same-Day &amp; Around the Clock","Walk in 9am–10pm daily; mobile dispatch 24/7 to your hotel, villa or yacht.")
    +feat("&#10003;","Travel-Insurance Invoices","Itemized invoices for Allianz, GeoBlue, IMG, Aetna Int&rsquo;l and Cigna Global reimbursement.")
    +'</div></div></section>';
  H+='<section class="sec sec--cream"><div class="cwc-wrap"><div class="sechead"><span class="eyebrow">See a Doctor</span><h2 class="serif">Talk to a Doctor — From $59</h2><p>Video, house call or in-clinic. English-speaking, no insurance needed, often within the hour.</p></div><div class="cwc-grid">'+'<a class="cwc-scard" href="/?selected_agent=any&selected_location=any&selected_service=29&background_pattern=pattern_9&latepoint=instant" target="_blank" rel="noopener"><div class="cwc-scard__b"><h3 style="margin-bottom:2px">Video Call with a Doctor</h3><div style="color:#C89F6A;font-weight:800;font-size:20px;margin:0 0 8px">$59</div><p>Secure video visit — advice and referrals, no travel.</p><span class="cwc-scard__more">Book — $59 &rarr;</span></div></a>'+'<a class="cwc-scard" href="'+WA+'" target="_blank" rel="noopener"><div class="cwc-scard__b"><h3 style="margin-bottom:2px">Doctor House Call</h3><div style="color:#C89F6A;font-weight:800;font-size:20px;margin:0 0 8px">$200</div><p>Our MD comes to your hotel, villa or yacht, 24/7.</p><span class="cwc-scard__more">Request a house call &rarr;</span></div></a>'+'<a class="cwc-scard" href="/?selected_agent=any&selected_location=any&selected_service=30&background_pattern=pattern_9&latepoint=instant" target="_blank" rel="noopener"><div class="cwc-scard__b"><h3 style="margin-bottom:2px">In-Clinic Consultation</h3><div style="color:#C89F6A;font-weight:800;font-size:20px;margin:0 0 8px">$80</div><p>See a doctor in our downtown Cabo walk-in clinic.</p><span class="cwc-scard__more">Book — $80 &rarr;</span></div></a>'+'</div></div></section>';
  H+='<section class="sec" style="background:var(--navy);color:#fff;text-align:center"><div class="cwc-wrap"><span class="eyebrow">24/7 Concierge</span><h2 class="serif" style="color:#fff;font-size:clamp(30px,4vw,46px);margin:10px 0 10px">An RN or doctor is on the way.</h2><p style="color:#dbe6f1;max-width:600px;margin:0 auto 24px;font-size:17px">Message or call our medical concierge — most mobile visits arrive within the hour, day or night.</p><div class="cwc-cta-row"><a class="cwc-btn cwc-btn--gold" href="'+TEL+'">Call +52 (624) 226 1023</a><a class="cwc-btn cwc-btn--wa" href="'+WA+'" target="_blank" rel="noopener">WhatsApp 24/7</a></div></div></section>';
  H+='<section id="cwc-h-cta"><div class="cwc-wrap"><h2 class="serif">Feel Better Today.</h2><p>Our medical concierge is one message away — most mobile visits arrive within the hour.</p><div class="cwc-cta-row"><a class="cwc-btn cwc-btn--gold" href="'+WA+'" target="_blank" rel="noopener">Book Now</a><a class="cwc-btn cwc-btn--ghost" href="'+TEL+'">Call Now</a><a class="cwc-btn cwc-btn--wa" href="'+WA+'" target="_blank" rel="noopener">WhatsApp</a></div></div></section>';
  var wrap=document.createElement("div"); wrap.id="cwc-home"; wrap.innerHTML=H;
  var ph=document.querySelector("main .page-header"); if(ph) ph.style.setProperty("display","none","important");
  Array.prototype.forEach.call(host.children,function(c){ if(c.id!=="cwc-home") c.style.setProperty("display","none","important"); });
  host.insertBefore(wrap, host.firstChild);
  Array.prototype.forEach.call(wrap.querySelectorAll(".cwc-dcard__img img"),function(im){ im.onerror=function(){ this.style.display="none"; }; });
  var track=wrap.querySelector(".cwc-track");
  var pv=wrap.querySelector(".cwc-arrow--prev"), nx=wrap.querySelector(".cwc-arrow--next");
  if(nx) nx.addEventListener("click",function(){ track.scrollBy({left:Math.round(track.clientWidth*0.8),behavior:"smooth"}); });
  if(pv) pv.addEventListener("click",function(){ track.scrollBy({left:-Math.round(track.clientWidth*0.8),behavior:"smooth"}); });
  }
  if(document.readyState!=="loading"){go();}else{document.addEventListener("DOMContentLoaded",go);}
  setTimeout(go,700);
})();