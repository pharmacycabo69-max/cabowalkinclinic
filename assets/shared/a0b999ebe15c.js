(function(){
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