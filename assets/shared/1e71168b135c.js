(function(){
  if (!/\/video-doctor-consultation\/book/.test(location.pathname)) return;
  function injectFooter() {
    var wrap = document.querySelector('#book-now, .cwc-latepoint-wrap');
    if (!wrap) return;
    if (document.querySelector('.cwc-book-footer-active')) return;
    var src = document.getElementById('cwc-book-footer-inject');
    if (!src) return;
    var clone = src.cloneNode(true);
    clone.id = 'cwc-book-footer-active-1';
    clone.classList.add('cwc-book-footer-active');
    clone.style.display = 'block';
    wrap.parentNode.insertBefore(clone, wrap.nextSibling);
  }
  function init() {
    injectFooter();
    setTimeout(injectFooter, 800);
    setTimeout(injectFooter, 2500);
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
;(function(){
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
;(function(){
  var AVA='/images/logo.svg';
  var WA='https://wa.me/5216242261023', TEL='tel:+5216242261023';
  function liveAva(){var a=document.querySelector('.cwc-concierge-avatar img:not(.emoji)');return a?(a.currentSrc||a.getAttribute('src')||''):'';}

  // ---- Rotating teaser (typing dots + cycling messages) inside #619 bubble ----
  function teaser(){
    var bubble=document.querySelector('.cwc-concierge-bubble');
    if(!bubble || bubble.getAttribute('data-cwc-teaser')==='1') return;
    var span=bubble.querySelector('span'); if(!span) return;
    bubble.setAttribute('data-cwc-teaser','1');
    var MSGS=["Feeling rough? I can help \uD83D\uDCA7","Need a doctor at your hotel?","Same-day lab tests, at your door","Tell me how you feel \u2014 I\u2019ll guide you","IV, doctor or nurse to your room, 24/7"];
    var i=0, showingDots=true;
    function tick(){
      span.style.opacity='0';
      setTimeout(function(){
        if(showingDots){ span.innerHTML='<span class="cwc-teaser-dots"><i></i><i></i><i></i></span>'; span.style.opacity='1'; showingDots=false; setTimeout(tick,1000); }
        else { span.textContent=MSGS[i]; span.style.opacity='1'; i=(i+1)%MSGS.length; showingDots=true; setTimeout(tick,3400); }
      },220);
    }
    tick();
  }

  // ---- Chat panel ----
  function build(){
    if(document.getElementById('cwc-chat')) return;
    var avatarSrc=liveAva()||AVA;
    var panel=document.createElement('div'); panel.id='cwc-chat'; panel.setAttribute('aria-hidden','true');
    panel.innerHTML='<div class="cwc-chat__head">'
      +'<img class="cwc-chat__ava" id="cwc-chat-ava" alt="Cabo Walk-In Clinic" src="'+avatarSrc+'">'
      +'<div class="cwc-chat__id"><strong>Cabo Walk-In Clinic</strong><span>Medical Concierge &middot; <i>online</i></span></div>'
      +'<a class="cwc-chat__hbtn" id="cwc-chat-wa" href="'+WA+'" target="_blank" rel="noopener" title="WhatsApp" aria-label="WhatsApp">WA</a>'
      +'<button class="cwc-chat__hbtn" id="cwc-chat-close" aria-label="Close">&times;</button>'
      +'</div>'
      +'<div class="cwc-chat__body" id="cwc-chat-body"></div>'
      +'<form class="cwc-chat__foot" id="cwc-chat-form"><input id="cwc-chat-input" type="text" autocomplete="off" placeholder="Describe what you need..."><button class="cwc-chat__send" type="submit" aria-label="Send">&#10148;</button></form>';
    document.body.appendChild(panel);

    var body=panel.querySelector('#cwc-chat-body');
    var form=panel.querySelector('#cwc-chat-form');
    var input=panel.querySelector('#cwc-chat-input');
    var history=[]; var greeted=false; var busy=false;
    function scroll(){ body.scrollTop=body.scrollHeight; }
    function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;}
    function bubble(role,text){ var b=el('div','cwc-msg cwc-msg--'+(role==='user'?'user':'bot'),text); body.appendChild(b); scroll(); return b; }
    function typing(on){ var t=body.querySelector('.cwc-typing'); if(on){ if(!t){ t=el('div','cwc-typing'); t.innerHTML='<i></i><i></i><i></i>'; body.appendChild(t); scroll(); } } else if(t){ t.remove(); } }
    function ivCard(c){
      var card=el('div','cwc-card');
      var top=el('div','cwc-card__top'); top.appendChild(el('h4','cwc-card__title',c.title)); top.appendChild(el('span','cwc-card__price',c.price)); card.appendChild(top);
      card.appendChild(el('p','cwc-card__blurb',c.blurb));
      var btns=el('div','cwc-card__btns');
      var b1=el('a','cwc-cbtn cwc-cbtn--navy'); b1.href=c.clinic; b1.target='_blank'; b1.rel='noopener'; b1.appendChild(document.createTextNode('Book')); b1.appendChild(el('small',null,'In-Clinic')); btns.appendChild(b1);
      var b2=el('a','cwc-cbtn cwc-cbtn--gold'); b2.href=c.mobile; b2.target='_blank'; b2.rel='noopener'; b2.appendChild(document.createTextNode('Book')); b2.appendChild(el('small',null,'Mobile')); btns.appendChild(b2);
      card.appendChild(btns);
      var more=el('a','cwc-card__more','View details'); more.href=c.page; card.appendChild(more);
      body.appendChild(card); scroll();
    }
    function svcCard(c,meta){
      var card=el('div','cwc-card');
      card.appendChild(el('h4','cwc-card__title',c.title));
      card.appendChild(el('p','cwc-card__blurb',c.blurb));
      var go=el('a','cwc-cbtn cwc-cbtn--full'); go.href=c.url; go.textContent='Learn more \u2192'; card.appendChild(go);
      var assist=el('div','cwc-card__assist');
      var ca=el('a',null,'Call'); ca.href=(meta&&meta.phone)||TEL; assist.appendChild(ca);
      var wa=el('a',null,'WhatsApp'); wa.href=(meta&&meta.whatsapp)||WA; wa.target='_blank'; wa.rel='noopener'; assist.appendChild(wa);
      card.appendChild(assist);
      body.appendChild(card); scroll();
    }
    function bookCard(c){
      var card=el('div','cwc-card');
      var top=el('div','cwc-card__top'); top.appendChild(el('h4','cwc-card__title',c.title)); top.appendChild(el('span','cwc-card__price',c.price)); card.appendChild(top);
      card.appendChild(el('p','cwc-card__blurb',c.blurb));
      var b=el('a','cwc-cbtn cwc-cbtn--full'); b.href=c.book; b.target='_blank'; b.rel='noopener'; b.textContent='Book \u2014 '+c.price; card.appendChild(b);
      body.appendChild(card); scroll();
    }
    function talkCard(meta){
      var card=el('div','cwc-card');
      card.appendChild(el('h4','cwc-card__title','Talk to someone now'));
      card.appendChild(el('p','cwc-card__blurb','Prefer to speak with our team, or is it urgent? Reach us right away.'));
      var btns=el('div','cwc-card__btns');
      var ca=el('a','cwc-cbtn cwc-cbtn--navy','Call clinic'); ca.href=(meta&&meta.phone)||TEL; btns.appendChild(ca);
      var wa=el('a','cwc-cbtn cwc-cbtn--gold','WhatsApp'); wa.href=(meta&&meta.whatsapp)||WA; wa.target='_blank'; wa.rel='noopener'; btns.appendChild(wa);
      card.appendChild(btns); body.appendChild(card); scroll();
    }
    function urgentCard(meta){
      var card=el('div','cwc-card cwc-card--urgent');
      card.appendChild(el('h4','cwc-card__title','Please seek urgent care'));
      card.appendChild(el('p','cwc-card__blurb','If this is an emergency, contact local emergency services right away. Our team can also help by phone.'));
      var btns=el('div','cwc-card__btns');
      var ca=el('a','cwc-cbtn cwc-cbtn--navy','Call clinic'); ca.href=(meta&&meta.phone)||TEL; btns.appendChild(ca);
      var wa=el('a','cwc-cbtn cwc-cbtn--gold','WhatsApp'); wa.href=(meta&&meta.whatsapp)||WA; wa.target='_blank'; wa.rel='noopener'; btns.appendChild(wa);
      card.appendChild(btns); body.appendChild(card); scroll();
    }
    function chips(list){
      var wrap=el('div','cwc-chips');
      list.forEach(function(txt){ var c=el('button','cwc-chip',txt); c.type='button'; c.addEventListener('click',function(){ wrap.remove(); if(typeof handleSpecialChip==='function' && handleSpecialChip(txt)) return; sendMsg(txt); }); wrap.appendChild(c); });
      body.appendChild(wrap); scroll();
    }
    function greet(){
      if(greeted) return; greeted=true;
      bubble('bot','Hi! I\u2019m your care concierge at Cabo Walk-In Clinic. Tell me how you\u2019re feeling or what you need \u2014 IV therapy, a doctor at your hotel, lab tests, nursing and more \u2014 and I\u2019ll point you to the right care.');
      
      // ===== IV Menu (Concierge sales flow) =====
      var IV_CATALOG = [
        {n:'Hangover Drip', s:'hangover', p:'$169', b:'Bounce back fast — anti-nausea support, IV hydration, B-complex', emoji:'💧'},
        {n:'Hydration Drip', s:'hydration', p:'$149', b:'Replenish after sun, salt water, and long Cabo days', emoji:'🌊'},
        {n:'Immune Boost', s:'immune-boost', p:'$159', b:'High-dose vitamin C and zinc — supports cold and flu recovery', emoji:'🛡️'},
        {n:'Myers Cocktail', s:'myers-cocktail', p:'$159', b:'Classic wellness blend — vitamins, magnesium, B-complex', emoji:'⭐'},
        {n:'Beauty Glow', s:'beauty-glow', p:'$189', b:'Biotin, glutathione, vitamin C — supports skin and hair', emoji:'✨'},
        {n:'NAD+ Drip', s:'nad-plus', p:'$189', b:'Cellular energy and longevity support', emoji:'🔋'},
        {n:'B-Complex Energy', s:'b-complex-energy', p:'$119', b:'B12, B-complex, amino acids — sustained energy', emoji:'⚡'}
      ];
      var IV_TOP3 = ['hangover','hydration','immune-boost'];

      function ivCard(iv){
        var card = el('div','cwc-iv-card');
        var head = el('div','cwc-iv-head');
        head.appendChild(el('span','cwc-iv-emoji', iv.emoji));
        head.appendChild(el('span','cwc-iv-name', iv.n));
        head.appendChild(el('span','cwc-iv-price', iv.p));
        card.appendChild(head);
        card.appendChild(el('div','cwc-iv-blurb', iv.b));
        var actions = el('div','cwc-iv-actions');
        var book = el('a','cwc-iv-book','Book');
        book.href = '/iv-therapy/' + iv.s + '/';
        book.target = '_blank'; book.rel = 'noopener';
        var det = el('a','cwc-iv-details','See details');
        det.href = '/iv-therapy/' + iv.s + '/';
        det.target = '_blank'; det.rel = 'noopener';
        actions.appendChild(book); actions.appendChild(det);
        card.appendChild(actions);
        return card;
      }

      function botCard(introText, cards, footText){
        var wrap = el('div','cwc-msg cwc-msg--bot');
        var inner = el('div','cwc-bubble');
        if(introText) inner.appendChild(el('p',null,introText));
        var grid = el('div','cwc-iv-grid');
        cards.forEach(function(card){ grid.appendChild(card); });
        inner.appendChild(grid);
        if(footText) inner.appendChild(el('p','cwc-iv-foot', footText));
        wrap.appendChild(inner);
        body.appendChild(wrap);
        scroll();
      }

      function showIVMenu(){
        bubble('user','View IV Menu');
        history.push({role:'user',content:'View IV Menu'});
        var cards = IV_TOP3.map(function(slug){
          var iv = IV_CATALOG.find(function(x){return x.s===slug;});
          return iv ? ivCard(iv) : null;
        }).filter(Boolean);
        botCard('Our 3 most popular drips for travelers in Cabo right now — all pharmaceutical-grade, delivered to your hotel or villa by a registered nurse:', cards, null);
        setTimeout(function(){ chips(['See more IVs','Help me pick one']); }, 250);
      }

      function showAllIVs(){
        bubble('user','See more IVs');
        history.push({role:'user',content:'See more IVs'});
        var cards = IV_CATALOG.filter(function(iv){ return IV_TOP3.indexOf(iv.s)===-1; }).map(ivCard);
        botCard('Here is the full menu beyond the top 3:', cards, 'All prices in USD. Final price may vary by add-ons. Please tell your nurse about any current medications and known allergies before the drip.');
        setTimeout(function(){ chips(['Help me pick one','Hangover','Hydration','Immune Boost']); }, 250);
      }

      function helpPickIV(){
        sendMsg('Help me pick the right IV drip. Please ask me 2 to 3 short questions about how I feel, any medications I am taking, and known allergies, then recommend ONE IV from the Cabo Walk-In Clinic menu (Hangover \$169, Hydration \$149, Immune Boost \$159, Myers Cocktail \$159, Beauty Glow \$189, NAD+ \$189, B-Complex Energy \$119) with a clear explanation. End with a reminder to tell my nurse about medications and allergies before the drip.');
      }

      function handleSpecialChip(txt){
        if(txt === 'View IV Menu'){ showIVMenu(); return true; }
        if(txt === 'See more IVs'){ showAllIVs(); return true; }
        if(txt === 'Help me pick one'){ helpPickIV(); return true; }
        return false;
      }
      // ===== End IV Menu =====

      chips(['View IV Menu','I have a hangover','Doctor to my hotel','Blood tests','Lab results']);
    }
    function sendMsg(text){
      text=(text||'').trim(); if(!text||busy) return;
      bubble('user',text); history.push({role:'user',content:text});
      busy=true; typing(true);
      var cfg=window.CWC_CHAT||{};
      if(!cfg.ajax){ typing(false); busy=false; bubble('bot','Chat is starting up \u2014 please try again in a moment, or reach us on WhatsApp.'); return; }
      var fd=new FormData(); fd.append('action','cwc_concierge_chat'); fd.append('nonce',cfg.nonce||''); fd.append('message',text); fd.append('history',JSON.stringify(history.slice(-8)));
      fetch(cfg.ajax,{method:'POST',body:fd,credentials:'same-origin'}).then(function(r){return r.json();}).then(function(j){
        typing(false); busy=false;
        var reply=(j&&j.reply)?j.reply:'Sorry, please try again.';
        bubble('bot',reply); history.push({role:'assistant',content:reply});
        var meta={phone:(j&&j.phone)||TEL,whatsapp:(j&&j.whatsapp)||WA};
        if(j&&j.escalate){ urgentCard(meta); }
        if(j&&j.cards){ j.cards.forEach(function(c){ if(c.type==='iv') ivCard(c); else if(c.type==='service') svcCard(c,meta); else if(c.type==='book') bookCard(c); else if(c.type==='emergency') talkCard(meta); }); }
      }).catch(function(){ typing(false); busy=false; bubble('bot','I had trouble connecting. You can reach our team on WhatsApp.'); });
    }
    form.addEventListener('submit',function(e){ e.preventDefault(); var v=input.value; input.value=''; sendMsg(v); });
    panel.querySelector('#cwc-chat-close').addEventListener('click',closeChat);

    window.cwcOpenChat=function(){ var s=liveAva(); var im=document.getElementById('cwc-chat-ava'); if(im&&s) im.src=s; panel.classList.add('is-open'); panel.setAttribute('aria-hidden','false'); var cc=document.querySelector('.cwc-concierge'); if(cc) cc.style.visibility='hidden'; greet(); setTimeout(function(){ if(window.innerWidth>600) input.focus(); },120); };
    window.closeChat=closeChat;
    function closeChat(){ panel.classList.remove('is-open'); panel.setAttribute('aria-hidden','true'); var cc=document.querySelector('.cwc-concierge'); if(cc) cc.style.visibility=''; }
  }

  function openChat(){ if(window.cwcOpenChat){ window.cwcOpenChat(); } }
  window.cwcConciergeGo=openChat;
  document.addEventListener('click',function(e){
    var t=e.target; if(!t||!t.closest) return;
    if(t.closest('#cwc-chat')) return;
    if(t.closest('.cwc-bubble-close')) return;
    var trig=t.closest('.cwc-concierge-avatar, .cwc-concierge-bubble, .cwc-concierge');
    if(trig){ e.preventDefault(); e.stopImmediatePropagation(); openChat(); }
  }, true);

  function boot(){ build(); teaser(); }
  if(document.readyState!=='loading'){ boot(); } else { document.addEventListener('DOMContentLoaded',boot); }
  [600,1500,3000].forEach(function(ms){ setTimeout(boot,ms); });
})();
;(function(){
  if(window.__cwcNonceWrap) return; window.__cwcNonceWrap = true;
  var _fetch = window.fetch.bind(window);
  function cwcFreshNonce(){
    return _fetch('/wp-admin/admin-ajax.php',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'action=cwc_concierge_nonce',credentials:'same-origin'})
      .then(function(r){return r.json();})
      .then(function(j){return (j&&j.success&&j.data&&j.data.nonce)?j.data.nonce:null;})
      .catch(function(){return null;});
  }
  window.fetch = function(input, init){
    try{
      var url = (typeof input==='string')?input:((input&&input.url)||'');
      var body = init && init.body;
      if(url.indexOf('admin-ajax.php')!==-1 && (body instanceof FormData) && body.get('action')==='cwc_concierge_chat'){
        return cwcFreshNonce().then(function(n){ if(n){ try{ body.set('nonce', n); }catch(e){} } return _fetch(input, init); });
      }
    }catch(e){}
    return _fetch(input, init);
  };
})();
;(function(){
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
  function drip(d){return '<a class="cwc-dcard" href="/iv-therapy/"><div class="cwc-dcard__img"><img loading="lazy" alt="'+d.n+'" src="/images/iv/'+d.s+'.webp"></div><div class="cwc-dcard__b"><h4>'+d.n+'</h4><span class="cwc-dcard__price">'+d.p+'</span><span class="cwc-dcard__more">View drip &rarr;</span></div></a>';}
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
;(function(){
  'use strict';
  var ORDER=['hangover','hydration','myers-cocktail','immune-boost','beauty-glow','nad-plus','b-complex-energy','athletic-recovery','post-flight','flu-rescue','detox','headache-rescue','mega-myers','custom-drip'];
  var DATA={
    'hangover':{t:'Hangover Drip',tag:'Recovery',p:'$169',d:'45–60 min',b:['Rehydration & electrolytes','Anti-nausea + B-complex','Headache & fatigue relief']},
    'hydration':{t:'Hydration Drip',tag:'Recovery',p:'$149',d:'30–45 min',b:['Sun & sweat recovery','Electrolyte replenishment','Day-of arrival pick-me-up']},
    'myers-cocktail':{t:'Myers Cocktail',tag:'Wellness',p:'$159',d:'45–60 min',b:['Classic vitamin + mineral blend','Energy & immune support','The original IV formula']},
    'immune-boost':{t:'Immune Boost',tag:'Immunity',p:'$159',d:'60–90 min',b:['High-dose vitamin C + zinc','Immune-system defense','Great before you fly']},
    'beauty-glow':{t:'Beauty Glow',tag:'Beauty',p:'$189',d:'45–60 min',b:['Glutathione + biotin','Skin hydration & glow','Antioxidant support']},
    'nad-plus':{t:'NAD+ Drip',tag:'Longevity',p:'$189',d:'90–150 min',b:['Cellular energy (NAD+)','Mental clarity & focus','Healthy-aging support']},
    'b-complex-energy':{t:'B-Complex Energy',tag:'Energy',p:'$169',d:'45–60 min',b:['Full B-complex boost','Sustained clean energy','No caffeine crash']},
    'athletic-recovery':{t:'Athletic Recovery',tag:'Recovery',p:'$199',d:'60–90 min',b:['Amino acids + electrolytes','Faster muscle recovery','Post-workout rehydration']},
    'post-flight':{t:'Post-Flight Drip',tag:'Recovery',p:'$159',d:'45–60 min',b:['Beat jet lag','Rehydration + B12','Recover from travel fatigue']},
    'flu-rescue':{t:'Flu Rescue',tag:'Immunity',p:'$199',d:'60–90 min',b:['Fever & body-ache relief','Fluids + anti-nausea','Immune support']},
    'detox':{t:'Detox Drip',tag:'Wellness',p:'$189',d:'60–75 min',b:['Liver support','Glutathione antioxidant','Reset after excess']},
    'headache-rescue':{t:'Headache Rescue',tag:'Recovery',p:'$169',d:'30–45 min',b:['Migraine & tension relief','Magnesium + fluids','Optional pain medication']},
    'mega-myers':{t:'Mega Myers',tag:'Wellness',p:'$279',d:'75–90 min',b:['High-dose Myers Cocktail','Maximum vitamins & minerals','Deep wellness reset']},
    'custom-drip':{t:'Custom Drip',tag:'Custom',p:'Call',d:'30–90 min',b:['Physician-designed','Tailored to how you feel','Same-day service']}
  };
  function slug(){var m=location.pathname.match(/\/iv-therapy\/([^\/]+)\/?$/);return m?m[1]:null;}
  function img(s){return '/wp-content/uploads/2026/05/cwc-hero-'+s+'-768x1029.jpg';}
  function card(s){
    var d=DATA[s];
    var a=document.createElement('a');
    a.className='cwc-rel2-card';
    a.setAttribute('href','/iv-therapy/'+s+'/');
    a.innerHTML='<div class="cwc-rel2-img"><img loading="lazy" alt="'+d.t+' IV bag" src="'+img(s)+'" onerror="this.onerror=null;this.src=this.src.replace(\'-768x1029\',\'\');"></div>'+
      '<div class="cwc-rel2-body"><span class="cwc-rel2-tag">'+d.tag+'</span><h3 class="cwc-rel2-title">'+d.t+'</h3>'+
      '<ul class="cwc-rel2-list"><li>'+d.b[0]+'</li><li>'+d.b[1]+'</li><li>'+d.b[2]+'</li></ul>'+
      '<div class="cwc-rel2-foot"><span class="cwc-rel2-price">'+d.p+' · '+d.d+'</span><span class="cwc-rel2-cta">View drip →</span></div></div>';
    return a;
  }
  function build(){
    var s=slug();if(!s||!DATA[s])return;
    var sec=document.querySelector('.cwc-iv-related');if(!sec)return;
    var grid=sec.querySelector('.cwc-iv-related__grid');if(!grid||grid.getAttribute('data-cwc-rel2'))return;
    grid.setAttribute('data-cwc-rel2','1');
    grid.classList.add('cwc-rel2-track');
    grid.innerHTML='';
    ORDER.filter(function(x){return x!==s;}).forEach(function(x){grid.appendChild(card(x));});
    var wrap=document.createElement('div');wrap.className='cwc-rel2-wrap';
    grid.parentNode.insertBefore(wrap,grid);wrap.appendChild(grid);
    var L='<svg viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var R='<svg viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    function arrow(dir,html){var b=document.createElement('button');b.type='button';b.className='cwc-rel2-arrow cwc-rel2-arrow--'+dir;b.setAttribute('aria-label',dir==='prev'?'Previous':'Next');b.innerHTML=html;b.addEventListener('click',function(e){e.preventDefault();var step=Math.max(grid.clientWidth*0.85,280);var max=grid.scrollWidth-grid.clientWidth;var target=Math.max(0,Math.min(max,grid.scrollLeft+(dir==='prev'?-step:step)));var s=grid.scrollLeft,ch=target-s,t0=performance.now();function st(n){var p=Math.min((n-t0)/420,1);grid.scrollLeft=s+ch*(0.5-Math.cos(p*Math.PI)/2);if(p<1)requestAnimationFrame(st);}requestAnimationFrame(st);});return b;}
    wrap.appendChild(arrow('prev',L));wrap.appendChild(arrow('next',R));
  }
  function run(){try{build();}catch(e){}}
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',run);}else{run();}
  setTimeout(run,900);setTimeout(run,2400);
})();
;(function(){
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