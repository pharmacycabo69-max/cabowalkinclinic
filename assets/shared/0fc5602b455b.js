(function(){
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