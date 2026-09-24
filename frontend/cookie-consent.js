/* Cookie consent banner — lightweight vanilla JS, no dependencies.
   Shows a small bottom banner, remembers Accept/Decline in localStorage.
   Include before </body>:  <script src="cookie-consent.js"></script>
   (Use src="/cookie-consent.js" when served from the site root.) */
(function () {
  'use strict';
  var KEY = 'cc-choice';
  try { if (localStorage.getItem(KEY)) return; } catch (e) { return; }

  var css =
    '.ccb{position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;' +
    'background:#141b33;border:1px solid #26315c;border-radius:14px;' +
    'color:#f0f2ff;font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;' +
    'padding:12px 14px;box-shadow:0 8px 30px rgba(0,0,0,.45);display:flex;' +
    'gap:10px;align-items:center;flex-wrap:wrap;}' +
    '.ccb p{margin:0;flex:1 1 200px;color:#9aa3c7}' +
    '.ccb p b{color:#f0f2ff}' +
    '.ccb a{color:#00d4ff}' +
    '.ccb button{border:0;border-radius:10px;padding:10px 18px;font-weight:700;' +
    'cursor:pointer;font-size:14px;min-height:44px}' +
    '.ccb .cc-ok{background:#7c5cff;color:#fff}' +
    '.ccb .cc-no{background:transparent;color:#9aa3c7;border:1px solid #26315c}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var bar = document.createElement('div');
  bar.className = 'ccb';
  bar.setAttribute('role', 'dialog');
  bar.setAttribute('aria-label', 'Cookie consent');
  bar.innerHTML =
    '<p><b>We use cookies.</b> We and our partners (including Google AdSense) use cookies ' +
    'to keep the site working and to show ads. See our <a href="privacy.html">privacy policy</a>.</p>';

  function done(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
    bar.remove();
  }
  var ok = document.createElement('button');
  ok.className = 'cc-ok';
  ok.textContent = 'Accept';
  ok.onclick = function () { done('accepted'); };
  var no = document.createElement('button');
  no.className = 'cc-no';
  no.textContent = 'Decline';
  no.onclick = function () { done('declined'); };
  bar.appendChild(ok);
  bar.appendChild(no);
  document.body.appendChild(bar);
})();
