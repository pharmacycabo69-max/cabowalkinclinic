(function(){
 var AJAX='https://www.cabowalkinclinic.com/wp-admin/admin-ajax.php', WA='5216242261023';
 var nonce='',slots=[],groups={},order=[],curDay=null,chosen=null,loaded=false;
 function q(i){return document.getElementById(i);}
 function tz(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'';}catch(e){return '';}}
 function err(m){var e=q('cwc-err');e.textContent=m;e.style.display='block';}
 function noerr(){q('cwc-err').style.display='none';}
 function openM(){q('cwc-ov').classList.remove('cwc-hide');document.body.style.overflow='hidden';if(!loaded)load();}
 function closeM(){q('cwc-ov').classList.add('cwc-hide');document.body.style.overflow='';}
 function load(){
  var fd=new FormData();fd.append('action','cwc_get_available_slots');fd.append('client_tz',tz());
  fetch(AJAX,{method:'POST',body:fd,credentials:'same-origin'}).then(function(r){return r.json();})
   .then(function(j){if(!j||!j.ok){err('Could not load available times.');return;}nonce=j.nonce||'';slots=j.slots||[];loaded=true;render();})
   .catch(function(){err('Could not load available times.');});
 }
 function render(){
  groups={};order=[];
  slots.forEach(function(ts){var d=new Date(ts*1000);
   var k=d.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'});
   if(!groups[k]){groups[k]=[];order.push(k);}groups[k].push(ts);});
  var dw=q('cwc-days');dw.innerHTML='';
  if(!order.length){q('cwc-slots').innerHTML='<div class="cwc-empty">No times available right now.</div>';return;}
  order.forEach(function(k,i){var p=k.split(' ');var b=document.createElement('button');
   b.type='button';b.className='cwc-day'+(i===0?' on':'');
   b.innerHTML='<b>'+p[0].replace(',','')+'</b><span>'+p.slice(1).join(' ')+'</span>';
   b.onclick=function(){curDay=k;Array.prototype.forEach.call(dw.children,function(c){c.classList.remove('on');});b.classList.add('on');paint();};
   dw.appendChild(b);});
  curDay=order[0];paint();
  var t=tz();
  q('cwc-tz').textContent=(t&&t!=='America/Mazatlan')?('Times shown in your time zone ('+t.replace(/_/g,' ')+') - Clinic hours 8:00am-5:00pm Los Cabos'):'All times are Los Cabos time - 8:00am to 5:00pm';
 }
 function paint(){
  var w=q('cwc-slots');w.innerHTML='';
  (groups[curDay]||[]).forEach(function(ts){var b=document.createElement('button');
   b.type='button';b.className='cwc-slot'+(chosen===ts?' on':'');
   b.textContent=new Date(ts*1000).toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'});
   b.onclick=function(){chosen=ts;Array.prototype.forEach.call(w.children,function(c){c.classList.remove('on');});b.classList.add('on');noerr();};
   w.appendChild(b);});
  if(!w.children.length)w.innerHTML='<div class="cwc-empty">No times left this day.</div>';
 }
 function submitF(ev){
  ev.preventDefault();noerr();
  if(!chosen){err('Please pick a day and time.');return;}
  var nm=q('cwc-name').value.trim(),em=q('cwc-email').value.trim(),ph=q('cwc-phone').value.trim();
  if(nm.length<2){err('Please enter your full name.');return;}
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){err('Please enter a valid email address.');return;}
  if(ph.replace(/\D/g,'').length<5){err('Please enter a valid phone number.');return;}
  if(!q('cwc-consent').checked){err('Please accept the terms and privacy policy.');return;}
  var b=q('cwc-submit');b.disabled=true;b.textContent='Booking...';
  var fd=new FormData();
  fd.append('action','cwc_book_consultation');fd.append('_ajax_nonce',nonce);
  fd.append('name',nm);fd.append('email',em);fd.append('phone',ph);
  fd.append('country_code',q('cwc-cc').value);fd.append('language',q('cwc-lang').value);
  fd.append('reason',q('cwc-reason').value);fd.append('consultation_time',String(chosen));
  fd.append('client_tz',tz());fd.append('consent','1');
  fetch(AJAX,{method:'POST',body:fd,credentials:'same-origin'}).then(function(r){return r.json();})
   .then(function(j){b.disabled=false;b.textContent='Confirm booking';
    if(!j||!j.ok){err((j&&j.error)||'Something went wrong.');if(j&&j.reload_slots){loaded=false;chosen=null;load();}return;}
    doneF(j,em);})
   .catch(function(){b.disabled=false;b.textContent='Confirm booking';err('Network error.');});
 }
 function doneF(j,em){
  q('cwc-step-form').style.display='none';q('cwc-done').style.display='block';
  var d=new Date(j.time*1000);
  q('cwc-done-when').textContent=d.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'})+' at '+d.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'});
  q('cwc-done-tz').textContent=tz()?('('+tz().replace(/_/g,' ')+')'):'';
  if(j.room_url){q('cwc-join').href=j.room_url;q('cwc-room').textContent=j.room_url;}
  else{q('cwc-join').style.display='none';}
  if(j.calendar){q('cwc-calrow').innerHTML='<a href="'+j.calendar.google+'" target="_blank" rel="noopener">Google Calendar</a><a href="'+j.calendar.outlook+'" target="_blank" rel="noopener">Outlook</a>';}
  if(!j.email_sent){var w=q('cwc-warn');w.style.display='block';
   w.innerHTML='<strong>Save this link now.</strong> We could not email the confirmation to '+em+'. Screenshot it or message us on <a href="https://wa.me/'+WA+'">WhatsApp</a>.';}
 }
 function bind(){
  document.addEventListener('click',function(e){
   var c=e.target.closest('[data-cwc-close]');
   if(c){e.preventDefault();closeM();return;}
   var b=e.target.closest('.cwc-vd__cta,[data-cwc-open],a[href*="video-doctor-consultation/book"]');
   if(b){e.preventDefault();e.stopPropagation();openM();}
  },true);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeM();});
  var f=q('cwc-form');if(f)f.addEventListener('submit',submitF);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();