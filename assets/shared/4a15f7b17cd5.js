(function(){
  function setup(){
    var bar=document.querySelector('.cwc-promobar');
    var header=document.querySelector('.cwc-header');
    if(!bar||!header) return;
    function apply(){
      var bh=bar.offsetHeight;
      header.style.setProperty('top', bh+'px', 'important');
      document.body.style.setProperty('padding-top', (header.offsetHeight+bh)+'px', 'important');
    }
    var inner=document.querySelector('.cwc-header-inner');
    if(inner && !inner.querySelector('.cwc-cta-book')){
      var cta=inner.querySelector('.cwc-cta');
      var ham=inner.querySelector('.cwc-hamburger');
      var a=document.createElement('a');
      a.className='cwc-cta-book';
      a.href='https://wa.me/5216242261023';
      a.textContent='Book Now';
      if(ham){ inner.insertBefore(a, ham); }
      else if(cta){ inner.insertBefore(a, cta); }
      else { inner.appendChild(a); }
    }
    apply();
    window.addEventListener('resize', apply);
    window.addEventListener('load', apply);
    setTimeout(apply, 400);
  }
  if(document.readyState!=='loading') setup();
  else document.addEventListener('DOMContentLoaded', setup);
})();