/* Calendly popup - assets load on first click, links fall back to a new tab if JS is off */
(function () {
  var CAL_URL = 'https://calendly.com/bhaskarjgoswami';
  var loading = false;

  function openPopup() {
    window.Calendly.initPopupWidget({ url: CAL_URL });
  }

  function loadAssets() {
    if (loading) return;
    loading = true;
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(css);
    var js = document.createElement('script');
    js.src = 'https://assets.calendly.com/assets/external/widget.js';
    js.onload = openPopup;
    document.head.appendChild(js);
  }

  document.querySelectorAll('[data-calendly]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      if (window.Calendly) { openPopup(); } else { loadAssets(); }
    });
  });
})();
