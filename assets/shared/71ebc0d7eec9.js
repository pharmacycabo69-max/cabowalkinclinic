(function(){
  function hideOldFooter() {
    try {
      var selectors = [
        'footer.elementor-location-footer',
        '[data-elementor-type="footer"]',
        'footer[data-elementor-type="footer"]',
        '.elementor-location-footer'
      ];
      selectors.forEach(function(sel){
        document.querySelectorAll(sel).forEach(function(el){
          // Don't touch our own new footer
          if (el.classList && el.classList.contains('cwc-footer-v10')) return;
          el.style.setProperty('display','none','important');
          el.setAttribute('data-cwc-hidden','1');
        });
      });
    } catch(e) {}
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideOldFooter);
  } else {
    hideOldFooter();
  }
  // Re-run after a tick in case Elementor injects late
  setTimeout(hideOldFooter, 500);
  setTimeout(hideOldFooter, 1500);
})();