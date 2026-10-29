(function(){
  function fullClose(){
    var drawer=document.querySelector('#cwc-drawer');
    var bd=document.querySelector('.cwc-drawer-backdrop');
    var ham=document.querySelector('.cwc-hamburger');
    if(drawer){drawer.classList.remove('is-open');drawer.setAttribute('aria-hidden','true')}
    if(bd){
      bd.classList.remove('is-open');
      bd.style.setProperty('opacity','0','important');
      bd.style.setProperty('pointer-events','none','important');
      setTimeout(function(){if(bd.classList.contains('is-open'))return;bd.style.setProperty('visibility','hidden','important')},250);
    }
    if(ham){ham.setAttribute('aria-expanded','false')}
    document.body.classList.remove('cwc-drawer-open');
    document.documentElement.classList.remove('cwc-drawer-open');
    var saved=parseInt(document.body.style.top||'0',10);
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    if(saved){window.scrollTo(0,-saved)}
  }
  function bindOnce(el,ev,fn){if(!el||el.__cwcV6Bound)return;el.__cwcV6Bound=true;el.addEventListener(ev,fn)}
  function init(){
    var close=document.querySelector('.cwc-drawer-close');
    var bd=document.querySelector('.cwc-drawer-backdrop');
    bindOnce(close,'click',fullClose);
    bindOnce(bd,'click',fullClose);
    document.querySelectorAll('#cwc-drawer .cwc-drawer-nav a,#cwc-drawer .cwc-drawer-call,#cwc-drawer .cwc-drawer-wa').forEach(function(a){
      bindOnce(a,'click',function(){setTimeout(fullClose,40)});
    });
    document.addEventListener('keydown',function(e){if(e.key==='Escape')fullClose()});
  }
  if(document.readyState!=='loading'){init()}else{document.addEventListener('DOMContentLoaded',init)}
  setTimeout(init,300);setTimeout(init,1200);
  // Expose for debugging
  window.cwcCloseDrawer=fullClose;
})();
;(function(){
  function nuke(){
    document.querySelectorAll('#cwc-drawer .cwc-drawer-nav a').forEach(function(a){
      a.style.setProperty('color','#FFFFFF','important');
      a.style.setProperty('-webkit-text-fill-color','#FFFFFF','important');
      a.style.setProperty('-webkit-font-smoothing','subpixel-antialiased','important');
      a.style.setProperty('font-weight','800','important');
      a.style.setProperty('-webkit-text-stroke','0.8px #FFFFFF','important');
      a.style.setProperty('opacity','1','important');
      a.style.setProperty('filter','none','important');
    });
    var logo=document.querySelector('#cwc-drawer .cwc-drawer-logo .cwc-logo-word');
    if(logo){
      logo.style.setProperty('color','#FFFFFF','important');
      logo.style.setProperty('-webkit-text-fill-color','#FFFFFF','important');
      logo.style.setProperty('-webkit-font-smoothing','subpixel-antialiased','important');
      logo.style.setProperty('-webkit-text-stroke','0.5px #FFFFFF','important');
    }
    document.querySelectorAll('#cwc-drawer .cwc-drawer-call,#cwc-drawer .cwc-drawer-wa').forEach(function(el){
      el.style.setProperty('color','#FFFFFF','important');
      el.style.setProperty('-webkit-text-fill-color','#FFFFFF','important');
      el.style.setProperty('-webkit-font-smoothing','subpixel-antialiased','important');
      el.style.setProperty('font-weight','800','important');
      el.style.setProperty('-webkit-text-stroke','0.7px #FFFFFF','important');
    });
  }
  if(document.readyState!=='loading'){nuke()}else{document.addEventListener('DOMContentLoaded',nuke)}
  setTimeout(nuke,200);setTimeout(nuke,800);setTimeout(nuke,1800);
})();
;(function(){
  function killAllOverlays(){
    var sel='.cwc-drawer-backdrop, #cwc-overlay, .cwc-overlay';
    document.querySelectorAll(sel).forEach(function(el){
      el.classList.remove('is-open');
      el.style.setProperty('opacity','0','important');
      el.style.setProperty('pointer-events','none','important');
      el.style.setProperty('visibility','hidden','important');
      el.style.setProperty('backdrop-filter','none','important');
      el.style.setProperty('-webkit-backdrop-filter','none','important');
    });
  }
  function fullCloseV8(){
    var drawer=document.querySelector('#cwc-drawer');
    var ham=document.querySelector('.cwc-hamburger');
    if(drawer){drawer.classList.remove('is-open');drawer.setAttribute('aria-hidden','true')}
    if(ham){ham.setAttribute('aria-expanded','false')}
    killAllOverlays();
    document.body.classList.remove('cwc-drawer-open');
    document.documentElement.classList.remove('cwc-drawer-open');
    var saved=parseInt((document.body.style.top||'0').replace('px',''),10);
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    if(saved&&saved<0){window.scrollTo(0,-saved)}
  }
  function restoreOverlay(){
    // When opening, restore the backdrop's normal styles by removing inline overrides
    var sel='.cwc-drawer-backdrop, #cwc-overlay, .cwc-overlay';
    document.querySelectorAll(sel).forEach(function(el){
      ['opacity','pointer-events','visibility','backdrop-filter','-webkit-backdrop-filter'].forEach(function(p){el.style.removeProperty(p)});
    });
  }
  function bind(el,ev,fn){if(!el||el.__cwcV8)return;el.__cwcV8=true;el.addEventListener(ev,fn)}
  function initV8(){
    var ham=document.querySelector('.cwc-hamburger');
    var close=document.querySelector('.cwc-drawer-close');
    var bd=document.querySelector('.cwc-drawer-backdrop');
    var ov=document.querySelector('#cwc-overlay,.cwc-overlay');
    bind(ham,'click',function(){setTimeout(restoreOverlay,5)});
    bind(close,'click',fullCloseV8);
    bind(bd,'click',fullCloseV8);
    bind(ov,'click',fullCloseV8);
    document.querySelectorAll('#cwc-drawer .cwc-drawer-nav a,#cwc-drawer .cwc-drawer-call,#cwc-drawer .cwc-drawer-wa').forEach(function(a){bind(a,'click',function(){setTimeout(fullCloseV8,40)})});
    bind(document,'keydown',function(e){if(e.key==='Escape')fullCloseV8()});
  }
  if(document.readyState!=='loading'){initV8()}else{document.addEventListener('DOMContentLoaded',initV8)}
  setTimeout(initV8,300);setTimeout(initV8,1200);
  // Also kill any leftover overlays on load
  killAllOverlays();
  window.cwcCloseDrawerV8=fullCloseV8;
})();