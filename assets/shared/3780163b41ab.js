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