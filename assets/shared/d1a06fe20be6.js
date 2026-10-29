(function(){
  function inject(){
    if (window.innerWidth < 1024) return;
    if (document.querySelector('.cwc-desktop-navbar')) return;
    var pb = document.querySelector('.cwc-promobar') || document.body.firstElementChild;
    var nb = document.createElement('div');
    nb.className = 'cwc-desktop-navbar';
    nb.innerHTML = '<a href="/" class="cwc-desktop-navbar-brand">CABO <span>·</span> WALK-IN CLINIC</a>' +
      '<ul class="cwc-desktop-navbar-links">' +
      '<li><a href="/">Home</a></li>' +
      '<li><a href="/video-doctor-consultation/">Video Doctor 24/7 — $59</a></li>' +
      '<li><a href="/iv-therapy/">IV Therapy</a></li>' +
      '<li><a href="/lab-tests/">Lab Tests</a></li>' +
      '<li><a href="/nurse-care/">Nurse Care</a></li>' +
      '<li><a href="/home-doctor/">Home Doctor</a></li>' +
      '<li><a href="/?selected_agent=any&selected_location=any&selected_service=29&background_pattern=pattern_9&latepoint=instant" class="cwc-book-cta">Book Now</a></li>' +
      '</ul>';
    pb.parentNode.insertBefore(nb, pb.nextSibling);
    var p = window.location.pathname;
    nb.querySelectorAll('a').forEach(function(a){
      try { if (new URL(a.href).pathname === p && !a.classList.contains('cwc-book-cta')) a.style.color = '#D4A85C'; } catch(e){}
    });
  }
  if (document.readyState !== 'loading') inject(); else document.addEventListener('DOMContentLoaded', inject);
  window.addEventListener('resize', inject);
})();