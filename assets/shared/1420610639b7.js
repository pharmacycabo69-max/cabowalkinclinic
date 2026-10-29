(function(){
  function place(){
    var s = document.getElementById('cwc-h-onecall');
    if (!s) return;
    if (!document.body.classList.contains('home')) return;
    var hero = document.getElementById('cwc-h-hero');
    if (hero && hero.parentNode && s.previousElementSibling !== hero){
      hero.parentNode.insertBefore(s, hero.nextSibling);
    }
  }
  if (document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', place); } else { place(); }
})();
;/* CWC — IV Catalog Card Photos. Maps each therapy (by title) to its themed photo as
   background of .cwc-icard__placeholder (icon hidden). Retries on ready/load + poll +
   MutationObserver because the grid is built/restyled slightly after load. Links untouched. */
(function(){
  var B="https://www.cabowalkinclinic.com/wp-content/uploads/2026/05/cwc-card-";
  var MAP={"hangover drip":"hangover","hydration drip":"hydration","myers cocktail":"myers","immune boost":"immune","beauty glow":"beauty","nad+ drip":"nad","b-complex energy":"bcomplex","athletic recovery":"athletic","post-flight drip":"postflight","flu rescue":"flu","detox drip":"detox","headache rescue":"headache","mega myers":"megamyers","custom drip":"custom"};
  function applyAll(){
    var cards=document.querySelectorAll(".cwc-iv-catalog-grid .cwc-icard");var done=0;
    cards.forEach(function(card){
      var t=card.querySelector(".cwc-icard__title");if(!t)return;
      var key=MAP[t.textContent.trim().toLowerCase()];if(!key)return;
      var ph=card.querySelector(".cwc-icard__placeholder")||card.querySelector(".cwc-icard__media");if(!ph)return;
      if(ph.getAttribute("data-cwc-photo")!==key){
        ph.style.setProperty("background-image","url("+B+key+".jpg)","important");
        ph.style.setProperty("background-size","cover","important");
        ph.style.setProperty("background-position","center","important");
        ph.style.setProperty("background-repeat","no-repeat","important");
        ph.setAttribute("data-cwc-photo",key);
        var svg=ph.querySelector("svg");if(svg)svg.style.display="none";
      }
      done++;
    });
    return done;
  }
  function boot(){
    applyAll();var tries=0;
    var iv=setInterval(function(){var n=applyAll();if(n>=14||++tries>25){clearInterval(iv);}},250);
    try{var mo=new MutationObserver(function(){applyAll();});mo.observe(document.body,{childList:true,subtree:true});setTimeout(function(){mo.disconnect();},9000);}catch(e){}
  }
  if(document.readyState!=="loading")boot();else document.addEventListener("DOMContentLoaded",boot);
  window.addEventListener("load",applyAll);
})();