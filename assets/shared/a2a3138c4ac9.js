(function(){
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