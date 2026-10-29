(function(){
  if (!/\/video-doctor-consultation\/book/.test(location.pathname)) return;
  function injectFooter() {
    var wrap = document.querySelector('#book-now, .cwc-latepoint-wrap');
    if (!wrap) return;
    if (document.querySelector('.cwc-book-footer-active')) return;
    var src = document.getElementById('cwc-book-footer-inject');
    if (!src) return;
    var clone = src.cloneNode(true);
    clone.id = 'cwc-book-footer-active-1';
    clone.classList.add('cwc-book-footer-active');
    clone.style.display = 'block';
    wrap.parentNode.insertBefore(clone, wrap.nextSibling);
  }
  function init() {
    injectFooter();
    setTimeout(injectFooter, 800);
    setTimeout(injectFooter, 2500);
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();