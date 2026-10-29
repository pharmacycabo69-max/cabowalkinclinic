(function(){
  const ham = document.querySelector('.cwc-hamburger');
  const drawer = document.getElementById('cwc-drawer');
  const overlay = document.getElementById('cwc-overlay');
  const closeBtn = document.querySelector('.cwc-drawer-close');
  if (!ham || !drawer || !overlay) return;
  function open(){
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    document.body.classList.add('cwc-drawer-open');
    ham.setAttribute('aria-expanded','true');
    drawer.setAttribute('aria-hidden','false');
  }
  function close(){
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.classList.remove('cwc-drawer-open');
    ham.setAttribute('aria-expanded','false');
    drawer.setAttribute('aria-hidden','true');
  }
  ham.addEventListener('click', open);
  overlay.addEventListener('click', close);
  closeBtn && closeBtn.addEventListener('click', close);
  drawer.querySelectorAll('.cwc-drawer-nav a, .cwc-drawer-ctas a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
;/* CWC-DRAWER-OVERRIDE-V1-JS */(function(){if(window.__cwcDrawerHook)return;window.__cwcDrawerHook=1;function ensureBackdrop(){if(document.querySelector(".cwc-drawer-backdrop"))return document.querySelector(".cwc-drawer-backdrop");var b=document.createElement("div");b.className="cwc-drawer-backdrop";b.setAttribute("aria-hidden","true");document.body.appendChild(b);b.addEventListener("click",function(){var d=document.getElementById("cwc-drawer");if(d){d.classList.remove("is-open");b.classList.remove("is-open");document.body.classList.remove("cwc-drawer-open");window.scrollTo(0,parseInt(getComputedStyle(document.body).getPropertyValue("--cwc-saved-y")||"0",10)*-1);document.body.style.setProperty("--cwc-saved-y","0px");}});return b;}function onChange(){var d=document.getElementById("cwc-drawer");if(!d)return;var b=ensureBackdrop();if(d.classList.contains("is-open")){var y=window.scrollY;document.body.style.setProperty("--cwc-saved-y",(-y)+"px");document.body.classList.add("cwc-drawer-open");b.classList.add("is-open");}else{var saved=getComputedStyle(document.body).getPropertyValue("--cwc-saved-y");document.body.classList.remove("cwc-drawer-open");b.classList.remove("is-open");if(saved){var n=parseInt(saved,10);document.body.style.removeProperty("--cwc-saved-y");document.body.style.top="";window.scrollTo(0,-n);}}}var d=document.getElementById("cwc-drawer");if(d){new MutationObserver(onChange).observe(d,{attributes:true,attributeFilter:["class"]});}document.addEventListener("keydown",function(e){if(e.key==="Escape"){var d=document.getElementById("cwc-drawer");if(d&&d.classList.contains("is-open"))d.classList.remove("is-open");}});})();/* END CWC-DRAWER-OVERRIDE-V1-JS */