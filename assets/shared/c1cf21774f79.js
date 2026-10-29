(function(){
      var CWC={ajax:'https://www.cabowalkinclinic.com/wp-admin/admin-ajax.php',nonce:'968617a7bf',cookieKey:'cwc_thg_popup',cookieDays:30};
      function getCookie(n){return document.cookie.split(';').map(function(c){return c.trim();}).find(function(c){return c.indexOf(n+'=')===0;});}
      function setCookie(n,v,days){var d=new Date();d.setTime(d.getTime()+days*24*60*60*1000);document.cookie=n+'='+v+'; expires='+d.toUTCString()+'; path=/; SameSite=Lax';}
      function alreadyHandled(){return getCookie(CWC.cookieKey);}
      var isMobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||window.innerWidth<768;
      var shown=false,armedExitIntent=false;
      function show(){
        if(shown||alreadyHandled())return;
        var ov=document.getElementById('cwc-popup-overlay');if(!ov)return;
        ov.classList.add('cwc-open');ov.setAttribute('aria-hidden','false');shown=true;
        setCookie(CWC.cookieKey+'_seen','1',1);
        try{var f=document.querySelector('#cwc-popup-form input[type="email"]');if(f)setTimeout(function(){f.focus();},350);}catch(e){}
      }
      function close(){var ov=document.getElementById('cwc-popup-overlay');if(!ov)return;ov.classList.remove('cwc-open');ov.setAttribute('aria-hidden','true');}
      function suppress(){setCookie(CWC.cookieKey,'closed',CWC.cookieDays);}
      var timerSeconds=isMobile?60:30;
      setTimeout(show,timerSeconds*1000);
      if(!isMobile){
        function exitIntentHandler(e){if(e.clientY<=5&&armedExitIntent&&!shown)show();}
        setTimeout(function(){armedExitIntent=true;},5000);
        document.addEventListener('mouseleave',exitIntentHandler);
        document.addEventListener('mouseout',function(e){if(e.relatedTarget===null&&e.clientY<=10&&armedExitIntent&&!shown)show();});
      }
      document.addEventListener('DOMContentLoaded',function(){
        var closeBtn=document.getElementById('cwc-popup-close');
        var overlay=document.getElementById('cwc-popup-overlay');
        if(closeBtn)closeBtn.addEventListener('click',function(){close();suppress();});
        if(overlay)overlay.addEventListener('click',function(e){if(e.target===overlay){close();suppress();}});
        document.addEventListener('keydown',function(e){if(e.key==='Escape'){close();suppress();}});
        var form=document.getElementById('cwc-popup-form');
        if(form)form.addEventListener('submit',function(e){
          e.preventDefault();
          var btn=document.getElementById('cwc-popup-submit');
          var msg=document.getElementById('cwc-popup-message');
          var emailInput=form.querySelector('input[name="email"]');
          var hpInput=form.querySelector('input[name="cwc_hp"]');
          msg.className='cwc-popup-message';msg.textContent='';
          var email=(emailInput.value||'').trim();
          if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){msg.className='cwc-popup-message cwc-error';msg.textContent='Please enter a valid email address.';return;}
          btn.disabled=true;btn.textContent='Sending…';
          var fd=new FormData();
          fd.append('action','cwc_submit_lead');
          fd.append('nonce',CWC.nonce);
          fd.append('email',email);
          fd.append('cwc_hp',hpInput.value||'');
          fd.append('page',window.location.href);
          fetch(CWC.ajax,{method:'POST',credentials:'same-origin',body:fd})
            .then(function(r){return r.json();})
            .then(function(d){
              if(d&&d.success){
                form.style.display='none';
                msg.className='cwc-popup-message cwc-success';
                msg.textContent=(d.data&&d.data.msg)||'Check your email — the guide is on its way.';
                setCookie(CWC.cookieKey,'subscribed',365);
                setTimeout(close,4500);
              }else{
                btn.disabled=false;btn.textContent='Email me the guide';
                msg.className='cwc-popup-message cwc-error';
                msg.textContent=(d&&d.data&&d.data.msg)||'Sorry, something went wrong. Please try again.';
              }
            })
            .catch(function(){
              btn.disabled=false;btn.textContent='Email me the guide';
              msg.className='cwc-popup-message cwc-error';
              msg.textContent='Network error. Please try again or email help@cabowalkinclinic.com.';
            });
        });
      });
    })();
;(function(){
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