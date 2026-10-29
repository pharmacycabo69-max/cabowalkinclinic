(function(){
  if(window.__cwcNonceWrap) return; window.__cwcNonceWrap = true;
  var _fetch = window.fetch.bind(window);
  function cwcFreshNonce(){
    return _fetch('/wp-admin/admin-ajax.php',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'action=cwc_concierge_nonce',credentials:'same-origin'})
      .then(function(r){return r.json();})
      .then(function(j){return (j&&j.success&&j.data&&j.data.nonce)?j.data.nonce:null;})
      .catch(function(){return null;});
  }
  window.fetch = function(input, init){
    try{
      var url = (typeof input==='string')?input:((input&&input.url)||'');
      var body = init && init.body;
      if(url.indexOf('admin-ajax.php')!==-1 && (body instanceof FormData) && body.get('action')==='cwc_concierge_chat'){
        return cwcFreshNonce().then(function(n){ if(n){ try{ body.set('nonce', n); }catch(e){} } return _fetch(input, init); });
      }
    }catch(e){}
    return _fetch(input, init);
  };
})();