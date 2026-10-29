(function(){
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