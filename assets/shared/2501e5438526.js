(function(){
 function fixMenu(){
  var links=document.querySelectorAll('a[href*="video-doctor-consultation"]');
  for(var i=0;i<links.length;i++){
   var a=links[i];
   if(/24\s*\/\s*7/.test(a.textContent)){
    a.innerHTML=a.innerHTML.replace(/Video Doctor\s*24\s*\/\s*7/i,'Video Doctor');
   }
  }
 }
 function fixPage(){
  if(!/video-doctor-consultation/.test(location.pathname)) return;
  var reps=[
   [/24\s*\/\s*7\s*[^\w]*\s*365/gi,'8:00am-5:00pm daily'],
   [/15-MIN\s*[^\w]*\s*24\s*\/\s*7/gi,'15-MIN - 8am to 5pm'],
   [/24\s*\/\s*7\s*[^\w]*\s*English\s*\/\s*Spanish/gi,'8:00am-5:00pm - English / Spanish'],
   [/Available\s*24\s*\/\s*7/gi,'Available 8:00am-5:00pm']
  ];
  var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),n,nodes=[];
  while(n=w.nextNode()){
   var p=n.parentElement; if(!p) continue;
   if(p.tagName==='SCRIPT'||p.tagName==='STYLE') continue;
   if(p.closest('#cwc-ov')) continue;
   if(p.closest('footer,.site-footer,.elementor-location-footer')) continue;
   if(/24\s*\/\s*7/.test(n.nodeValue)) nodes.push(n);
  }
  nodes.forEach(function(node){
   var v=node.nodeValue, ch=false;
   reps.forEach(function(r){ if(r[0].test(v)){ v=v.replace(r[0],r[1]); ch=true; } });
   if(!ch){
    var ctx=(node.parentElement.textContent||'');
    if(!/whatsapp|mobile service|reach us|direct line|ambulance|dispatch/i.test(ctx)){
     v=v.replace(/24\s*\/\s*7/g,'8:00am-5:00pm'); ch=true;
    }
   }
   if(ch) node.nodeValue=v;
  });
 }
 function boot(){ fixMenu(); fixPage(); setTimeout(function(){fixMenu();fixPage();},900); setTimeout(function(){fixMenu();fixPage();},2200); }
 if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();