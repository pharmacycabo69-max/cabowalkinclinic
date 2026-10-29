(function(){
  var WA='https://wa.me/5216242261023', TEL='tel:+5216242261023';
  var VIDEO='/?selected_agent=any&selected_location=any&selected_service=29&background_pattern=pattern_9&latepoint=instant';
  var INCLINIC='/?selected_agent=any&selected_location=any&selected_service=30&background_pattern=pattern_9&latepoint=instant';
  var bookWA={label:'Book on WhatsApp',href:WA,style:'gold',blank:true};
  var callBtn={label:'Call +52 (624) 226 1023',href:TEL,style:'ghost'};
  var waBtn={label:'WhatsApp 24/7',href:WA,style:'wa',blank:true};
  var IDS={'491':'lab','479':'doctor','477':'Nurse','510':'geriatric'};
  var CONFIG={
    lab:{kw:'mobile-blood-draw-lab',eyebrow:'Mobile Lab Tests \u00B7 Results in 24\u201348h',h1:'Lab Tests at Your Hotel or Villa',
      sub:'Blood draws and full panels brought to you by a nurse \u2014 no doctor referral needed, results by email in 24\u201348 hours, and an itemized invoice for your travel insurance.',
      ctas:[bookWA,callBtn],
      trust:['Registered Nurses','No Referral Needed','Results 24\u201348h','Travel-Insurance Invoice'],
      how:[{n:'1',t:'Pick your panel',d:'Choose from the menu below, or just tell us what you need on WhatsApp.'},{n:'2',t:'We draw at your location',d:'A nurse comes to your hotel, villa or yacht \u2014 no clinic visit needed.'},{n:'3',t:'Get results by email',d:'Secure digital results in 24\u201348 hours, with an optional doctor review.'}],
      menu:{eyebrow:'Lab Panels',h2:'Choose Your Panel',sub:'Transparent USD pricing. Same price at your location or in-clinic.',cards:[
        {title:'Wellness Panel',price:'$149',blurb:'CBC, metabolic, lipids, thyroid and vitamin D \u2014 a full health snapshot.'},
        {title:'Pre-Travel / Fit-to-Fly',price:'$99',blurb:'Tests and certificate you may need before flying or cruising home.'},
        {title:'STD / STI Panel',price:'$129',blurb:'Confidential, comprehensive screening with discreet digital results.'},
        {title:'Thyroid & Hormone',price:'$159',blurb:'TSH, T3/T4 and key hormones for energy, mood and metabolism.'},
        {title:'Vitamin & Energy',price:'$119',blurb:'B12, vitamin D, iron and magnesium \u2014 find what is draining you.'},
        {title:'Custom Panel',price:'Call',blurb:'Tell us what you need and we will build the right panel for you.'}
      ]},
      callout:'We provide an itemized English invoice for your travel insurance \u2014 Allianz, GeoBlue, IMG, Aetna International and Cigna Global.',
      xsell:{h4:'Add a doctor video review \u2014 $59',p:'Have an English-speaking doctor walk you through your results by video.',btn:{label:'Add Video Review \u2014 $59',href:VIDEO,style:'gold',blank:true}},
      final:{h2:'Get tested without leaving your room.',sub:'Book a mobile lab draw today \u2014 results in 24\u201348 hours.'}},
    doctor:{kw:'doctor-house-call-cabo',eyebrow:'Doctor Visits \u00B7 English-Speaking \u00B7 24/7',h1:'See a Doctor \u2014 Video, House Call or In-Clinic',
      sub:'Talk to an English-speaking doctor without leaving your room \u2014 by video, at your hotel or villa, or in our downtown clinic. No insurance needed, flat USD pricing, often within the hour.',
      ctas:[{label:'Talk to a doctor now',href:WA,style:'gold',blank:true},callBtn],
      trust:['English-Speaking MDs','No Insurance Needed','Same-Day \u00B7 24/7','Flat USD Pricing'],
      how:[{n:'1',t:'Tell us your symptoms',d:'Message us on WhatsApp or call \u2014 we help you pick the right visit.'},{n:'2',t:'Choose video, house call or clinic',d:'A video visit, a doctor to your room, or our downtown walk-in clinic.'},{n:'3',t:'Get seen \u2014 often within the hour',d:'Advice or a referral, with clear next steps.'}],
      menu:{eyebrow:'Doctor Options',h2:'Three Ways to See a Doctor',sub:'Flat USD pricing, no insurance needed, English-speaking physicians.',cards:[
        {title:'Video Call with a Doctor',price:'$59',blurb:'Secure video visit \u2014 advice and referrals, no travel.',btn:{label:'Book \u2014 $59',href:VIDEO,style:'navy',blank:true}},
        {title:'Doctor House Call',price:'$200',blurb:'Our MD comes to your hotel, villa or yacht, 24/7.',btn:{label:'Request a house call',href:WA,style:'gold',blank:true}},
        {title:'In-Clinic Consultation',price:'$80',blurb:'See a doctor in our downtown Cabo walk-in clinic.',btn:{label:'Book \u2014 $80',href:INCLINIC,style:'navy',blank:true}}
      ]},
      callout:'Need help choosing? Message our team on WhatsApp and we will point you to the right service.',
      final:{h2:'A doctor is one message away.',sub:'Video, house call or clinic \u2014 English-speaking, 24/7.'}},
    nurse:{kw:'in-room-nursing-wound-care',eyebrow:'In-Room Nursing & Wound Care \u00B7 RNs',h1:'Professional Nursing Care, Where You\u2019re Staying',
      sub:'Registered nurses for injections, wound care, IV lines, post-op and recovery support \u2014 at your hotel, villa or residence in Los Cabos.',
      ctas:[{label:'Book a free in-home assessment',href:WA,style:'gold',blank:true},callBtn],
      trust:['English-Speaking RNs','Background-Checked','Same-Day \u00B7 24/7','Insured Care'],
      how:[{n:'1',t:'Free in-home assessment',d:'A registered nurse visits to understand your needs \u2014 at no cost.'},{n:'2',t:'We build your care plan',d:'A clear plan and schedule tailored to you or your family member.'},{n:'3',t:'Your nurse arrives on schedule',d:'Professional, compassionate care wherever you are staying.'}],
      menu:{eyebrow:'Nursing Services',h2:'What Our Nurses Provide',sub:'Hospital-grade care, delivered to your door.',cards:[
        {title:'Wound Care & Dressing',blurb:'Expert cleaning, dressing changes and monitoring to heal safely.'},
        {title:'Injections & IM Meds',blurb:'Prescribed injections and intramuscular medications, administered safely.'},
        {title:'IV Lines & Infusions',blurb:'IV fluids and infusions managed by a RN.'},
        {title:'Post-Op Recovery',blurb:'Recovery support and monitoring after surgery or a hospital stay.'},
        {title:'Catheter & Line Care',blurb:'Care and maintenance of catheters, ports and central lines.'},
        {title:'Vitals & Monitoring',blurb:'Regular vitals, health checks and clear updates you can rely on.'}
      ]},
      final:{h2:'Care you can trust, where you need it.',sub:'Book a free in-home assessment with a RN today.'}},
    geriatric:{kw:'team-senior-rn',eyebrow:'In-Home Senior & Geriatric Care',h1:'Compassionate Senior Care in Los Cabos',
      sub:'Traveling parents, recovering relatives or aging family in Cabo \u2014 our nurses keep them safe and cared for, so you have peace of mind from anywhere.',
      ctas:[{label:'Book a free in-home assessment',href:WA,style:'gold',blank:true},callBtn],
      trust:['English-Speaking RNs','Background-Checked','24/7 Availability','Family Peace of Mind'],
      how:[{n:'1',t:'Free in-home assessment',d:'A nurse meets your family member and understands their needs.'},{n:'2',t:'Personalized Cabo Care Plan',d:'A tailored plan covering health, safety, mobility and companionship.'},{n:'3',t:'Trusted nurse care begins',d:'Consistent, compassionate care \u2014 with updates you can rely on.'}],
      menu:{eyebrow:'Senior Care Services',h2:'The Cabo Care Plan',sub:'Comprehensive in-home support for older adults and recovery.',cards:[
        {title:'Personal Care & Companionship',blurb:'Daily living support, mobility help and warm companionship.'},
        {title:'Medication Management',blurb:'Right meds, right time \u2014 organized and monitored by an RN.'},
        {title:'Post-Hospital Recovery',blurb:'Safe recovery at home after surgery or hospitalization.'},
        {title:'Mobility & Fall Prevention',blurb:'Support and safety to prevent falls and keep moving confidently.'},
        {title:'Chronic Condition Support',blurb:'Ongoing care for diabetes, heart, respiratory and other conditions.'},
        {title:'24/7 Live-In Options',blurb:'Around-the-clock care when a loved one needs constant support.'}
      ]},
      callout:'Recovering from surgery or hospital? We combine <b>nursing, mobile labs and a house-call doctor</b> into one recovery plan.',
      final:{h2:'Keep your family safe \u2014 from anywhere.',sub:'Book a free in-home assessment for your loved one in Cabo.'}}
  };

  function go(){
    var pid=null,bc=document.body.className;
    for(var k in IDS){ if(bc.indexOf('page-id-'+k)!==-1){ pid=k; break; } }
    if(!pid) return;
    var host=document.querySelector('.elementor.elementor-'+pid)||document.querySelector('main.site-main');
    if(!host || document.getElementById('cwc-sp')) return;
    var cfg=CONFIG[IDS[pid]];
    function img(kw){var im=document.querySelector('img[src*="'+kw+'"]');return im?(im.currentSrc||im.getAttribute('src')||''):'';}
    function btn(b){return '<a class="btn btn--'+b.style+'" href="'+b.href+'"'+(b.blank?' target="_blank" rel="noopener"':'')+'>'+b.label+'</a>';}
    function ctaRow(arr){return '<div class="cta-row">'+arr.map(btn).join('')+'</div>';}
    var bg=img(cfg.kw);
    var H='';
    H+='<section class="hero"'+(bg?(' style="background-image:url('+bg+')"'):'')+'><div class="wrap">'
      +'<span class="eyebrow">'+cfg.eyebrow+'</span>'
      +'<h1 class="serif">'+cfg.h1+'</h1>'
      +'<p class="sub">'+cfg.sub+'</p>'
      +ctaRow(cfg.ctas)
      +'<div class="trust">'+cfg.trust.map(function(t){return '<span><b>\u2713</b> '+t+'</span>';}).join('')+'</div>'
      +'</div></section>';
    H+='<section class="sec"><div class="wrap"><div class="head"><span class="eyebrow">How it works</span><h2 class="serif">Simple, fast, premium.</h2></div><div class="how">'
      +cfg.how.map(function(s){return '<div class="how__i"><div class="how__n">'+s.n+'</div><h4>'+s.t+'</h4><p>'+s.d+'</p></div>';}).join('')
      +'</div></div></section>';
    H+='<section class="sec sec--cream"><div class="wrap"><div class="head"><span class="eyebrow">'+cfg.menu.eyebrow+'</span><h2 class="serif">'+cfg.menu.h2+'</h2><p>'+cfg.menu.sub+'</p></div><div class="grid">'
      +cfg.menu.cards.map(function(c){
         if(c.price){ return '<div class="card"><div class="card__top"><h3 class="card__t">'+c.title+'</h3><span class="card__p">'+c.price+'</span></div><p class="card__b">'+c.blurb+'</p>'+(c.btn?btn(c.btn):'')+'</div>'; }
         return '<div class="card card--feature"><h3 class="card__t">'+c.title+'</h3><p class="card__b">'+c.blurb+'</p></div>';
       }).join('')
      +'</div>'
      +(cfg.xsell?('<div class="xsell"><h4>'+cfg.xsell.h4+'</h4><p>'+cfg.xsell.p+'</p>'+btn(cfg.xsell.btn)+'</div>'):'')
      +'</div></section>';
    if(cfg.callout){ H+='<section class="sec" style="padding:30px 0"><div class="wrap"><div class="callout"><p>'+cfg.callout+'</p></div></div></section>'; }
    H+='<section class="final"><div class="wrap"><h2 class="serif">'+cfg.final.h2+'</h2><p>'+cfg.final.sub+'</p>'+ctaRow([cfg.ctas[0],callBtn,waBtn])+'</div></section>';
    var wrap=document.createElement('div'); wrap.id='cwc-sp'; wrap.innerHTML=H;
    var ph=document.querySelector('main .page-header'); if(ph) ph.style.setProperty('display','none','important');
    Array.prototype.forEach.call(host.children,function(c){ if(c.id!=='cwc-sp') c.style.setProperty('display','none','important'); });
    host.insertBefore(wrap, host.firstChild);
  }
  if(document.readyState!=='loading'){go();}else{document.addEventListener('DOMContentLoaded',go);}
  [600,1500].forEach(function(ms){setTimeout(go,ms);});
})();