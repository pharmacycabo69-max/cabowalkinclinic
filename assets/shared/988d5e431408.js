const registerAllyAction = () => {
					if ( ! window?.ElementorProFrontendConfig || ! window?.elementorFrontend?.utils?.urlActions ) {
						return;
					}

					elementorFrontend.utils.urlActions.addAction( 'allyWidget:open', () => {
						if (window?.ea11yWidget?.widget?.open) {
							return window.ea11yWidget.widget.isOpen()
								? window.ea11yWidget.widget.close()
								: window.ea11yWidget.widget.open();
						}
					} );
				};

				const waitingLimit = 30;
				let retryCounter = 0;

				const waitForElementorPro = () => {
					return new Promise( ( resolve ) => {
						const intervalId = setInterval( () => {
							if ( retryCounter === waitingLimit ) {
								resolve( null );
							}

							retryCounter++;

							if ( window.elementorFrontend && window?.elementorFrontend?.utils?.urlActions ) {
								clearInterval( intervalId );
								resolve( window.elementorFrontend );
							}
								}, 100 ); // Check every 100 milliseconds for availability of elementorFrontend
					});
				};

				waitForElementorPro().then( () => { registerAllyAction(); });
;const lazyloadRunObserver = () => {
					const lazyloadBackgrounds = document.querySelectorAll( `.e-con.e-parent:not(.e-lazyloaded)` );
					const lazyloadBackgroundObserver = new IntersectionObserver( ( entries ) => {
						entries.forEach( ( entry ) => {
							if ( entry.isIntersecting ) {
								let lazyloadBackground = entry.target;
								if( lazyloadBackground ) {
									lazyloadBackground.classList.add( 'e-lazyloaded' );
								}
								lazyloadBackgroundObserver.unobserve( entry.target );
							}
						});
					}, { rootMargin: '200px 0px 200px 0px' } );
					lazyloadBackgrounds.forEach( ( lazyloadBackground ) => {
						lazyloadBackgroundObserver.observe( lazyloadBackground );
					} );
				};
				const events = [
					'DOMContentLoaded',
					'elementor/lazyload/observe',
				];
				events.forEach( ( event ) => {
					document.addEventListener( event, lazyloadRunObserver );
				} );
;(function(){
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
;(function(){
  var SEL = '.elementor-element-2ea667c';
  var running = false;
  function fixOne(sec){
    if(!sec || window.innerWidth >= 768 || running) return;
    running = true;
    try {
      sec.querySelectorAll('.elementor-container, .elementor-row, .elementor-widget-wrap, .elementor-inner-section, .elementor-section, .elementor-column-gap-extended').forEach(function(el){
        el.style.setProperty('width','100%','important');
        el.style.setProperty('max-width','100%','important');
        el.style.setProperty('display','block','important');
        el.style.setProperty('padding','0','important');
        el.style.setProperty('margin','0','important');
        el.style.setProperty('overflow','visible','important');
      });
      sec.querySelectorAll('.elementor-column, .elementor-inner-column, [class*="elementor-col-"]').forEach(function(el){
        el.style.setProperty('width','100%','important');
        el.style.setProperty('max-width','100%','important');
        el.style.setProperty('flex','0 0 100%','important');
        el.style.setProperty('display','block','important');
        el.style.setProperty('margin','0 0 14px 0','important');
        el.style.setProperty('padding','0','important');
      });
      sec.querySelectorAll('.elementor-widget, .elementor-widget-html, .elementor-widget-text-editor, .elementor-widget-icon-list, .elementor-widget-heading, .elementor-widget-container').forEach(function(el){
        el.style.setProperty('width','100%','important');
        el.style.setProperty('max-width','100%','important');
        el.style.setProperty('display','block','important');
      });
      sec.querySelectorAll('.elementor-widget-html, .elementor-widget-text-editor').forEach(function(el){
        el.style.setProperty('background','#FFFFFF','important');
        el.style.setProperty('border','1px solid rgba(212,168,92,0.22)','important');
        el.style.setProperty('border-radius','12px','important');
        el.style.setProperty('box-shadow','0 4px 16px -4px rgba(20,40,60,0.08)','important');
        el.style.setProperty('padding','18px','important');
        el.style.setProperty('margin','0 0 14px 0','important');
      });
      sec.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div').forEach(function(el){
        el.style.setProperty('display','block','important');
        el.style.setProperty('writing-mode','horizontal-tb','important');
        el.style.setProperty('white-space','normal','important');
      });
      sec.querySelectorAll('span, em, strong, a, i').forEach(function(el){
        el.style.setProperty('display','inline','important');
      });
      sec.querySelectorAll('.elementor-icon-list-items, .elementor-widget-icon-list ul').forEach(function(el){
        el.style.setProperty('display','flex','important');
        el.style.setProperty('flex-direction','row','important');
        el.style.setProperty('flex-wrap','nowrap','important');
      });
      sec.querySelectorAll('.elementor-icon-list-item').forEach(function(el){
        el.style.setProperty('display','inline-block','important');
      });
    } finally { running = false; }
  }
  function fixAll(){ document.querySelectorAll(SEL).forEach(fixOne); }
  function init(){
    fixAll();
    [50, 200, 500, 1000, 2000, 4000, 7000, 12000].forEach(function(t){ setTimeout(fixAll, t); });
    window.addEventListener('resize', function(){ setTimeout(fixAll, 50); });
    window.addEventListener('load', fixAll);
    window.addEventListener('orientationchange', fixAll);
  }
  if(document.readyState !== 'loading'){ init(); } else { document.addEventListener('DOMContentLoaded', init); }
})();
;(function(){
  if (!/\/video-doctor-consultation\//.test(location.pathname)) return;
  var BOOKING = '/video-doctor-consultation/book/';
  var ALLOWED_OUTBOUND = /24-7-doctor-house-call|how-it-works|faqs|wa\.me|whatsapp|^#/i;
  function isBookCTA(a){
    var text = (a.innerText || a.textContent || '').trim();
    if (!text || text.length > 40) return false;
    if (!/^book(\s|$)|^book\s*(now|→|\$)/i.test(text)) return false;
    if (/cabo\s*care|join|concierge|see\s*all|walkthrough|iv\s*drip/i.test(text)) return false;
    return true;
  }
  function applyBookNow() {
    var nodes = document.querySelectorAll('a.elementor-button, .elementor-button-wrapper a, a.cwc-cta-book, a[href*="book"], a[href*="consultation"], a[href*="latepoint"], a[href^="tel:"], #cwc-floating-desktop');
    nodes.forEach(function(a){
      if (!isBookCTA(a)) return;
      var rewritten = false;
      Array.from(a.childNodes).forEach(function(n){
        if (n.nodeType === 3 && n.nodeValue.trim()) { n.nodeValue = 'Book Now'; rewritten = true; }
      });
      if (!rewritten) {
        var span = a.querySelector('.elementor-button-text, span:not([class*="icon"])');
        if (span) span.textContent = 'Book Now';
      }
      var h = (a.getAttribute('href') || '').toString();
      if (!ALLOWED_OUTBOUND.test(h)) {
        a.setAttribute('href', BOOKING);
        a.setAttribute('data-cwc-book-now', '1');
      }
    });
  }
  function run() {
    applyBookNow();
    setTimeout(applyBookNow, 400);
    setTimeout(applyBookNow, 1200);
    setTimeout(applyBookNow, 2500);
    setTimeout(applyBookNow, 5000);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else { run(); }
  // Click-capture: intercept Book Now clicks and force navigation regardless of href value
  document.addEventListener('click', function(e){
    var a = e.target.closest('a');
    if (!a) return;
    if (a.getAttribute('data-cwc-book-now') === '1' || isBookCTA(a)) {
      var h = (a.getAttribute('href') || '').toString();
      if (ALLOWED_OUTBOUND.test(h)) return;
      e.preventDefault();
      e.stopPropagation();
      window.location.href = BOOKING;
    }
  }, true);
})();