(function(){
if(!/\/video-doctor-consultation\/pricing/.test(location.pathname))return;
var LP='https://www.cabowalkinclinic.com/?selected_agent=any&selected_location=any&selected_service=29&background_pattern=pattern_9&latepoint=instant';
function tag(){
var hs=document.querySelectorAll('main#content h2');
hs.forEach(function(h2){
var t=(h2.innerText||'').trim();
if(/cabo\s*care\+?\s*membership/i.test(t)){
h2.setAttribute('data-cwc-membership','1');
var n=h2.nextElementSibling,c=[];
while(n&&n.tagName!=='H2'){c.push(n);n=n.nextElementSibling;}
c.forEach(function(el,i){el.setAttribute('data-cwc-membership-body','1');if(i===c.length-1)el.setAttribute('data-cwc-membership-end','1');});
}
if(/money[\s-]?back\s+guarantee/i.test(t)){
h2.setAttribute('data-cwc-guarantee','1');
var n=h2.nextElementSibling,c=[];
while(n&&n.tagName!=='H2'){c.push(n);n=n.nextElementSibling;}
c.forEach(function(el,i){el.setAttribute('data-cwc-guarantee-body','1');if(i===c.length-1)el.setAttribute('data-cwc-guarantee-end','1');});
}
if(/^ready\s+to\s+book/i.test(t))h2.setAttribute('data-cwc-final-cta','1');
});
}
function book(){
document.querySelectorAll('main#content a').forEach(function(a){
var t=(a.textContent||'').trim().toLowerCase();
var h=a.getAttribute('href')||'';
if(/\b(book|agendar|start\s+my\s+video\s+consultation)\b/i.test(t)){
if(h.indexOf('latepoint=instant')===-1){a.setAttribute('href',LP);a.removeAttribute('target');a.removeAttribute('onclick');}
}
/* FIX2: Join Cabo Care+ -> LatePoint instant */
if(/join\s+cabo\s+care/i.test(t)){
if(h.indexOf('latepoint=instant')===-1){a.setAttribute('href',LP);a.removeAttribute('target');a.removeAttribute('onclick');}
}
});
}
function init(){tag();book();setTimeout(function(){tag();book();},600);setTimeout(function(){tag();book();},2000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();