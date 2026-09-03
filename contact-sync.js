// JHALAR contact-sync.js
// Shared contact/data init for pages that are NOT the main single-page app
// (404.html, privacy.html). Keeps a single source of truth in
// content/site-settings.json and applies it via [data-contact] hooks.
// Always CSP-safe: loads 'self', uses data-* attributes, no inline JS.

(function () {
  'use strict';

  function applySettings(settings) {
    if (!settings) return;

    // Apply any [data-contact] field (phone/email/location/gst).
    document.querySelectorAll('[data-contact]').forEach(function (el) {
      var key = el.getAttribute('data-contact');
      if (key && settings[key]) el.textContent = settings[key];
    });

    // Phone/tel links.
    var telDigits = String(settings.phone || '').replace(/\D/g, '');
    document.querySelectorAll('a[data-tel]').forEach(function (a) {
      a.href = 'tel:+' + telDigits;
    });

    // WhatsApp links.
    var wa = settings.whatsapp || '';
    document.querySelectorAll('a[data-wa]').forEach(function (a) {
      a.href = 'https://wa.me/' + String(wa).replace(/\D/g, '');
    });
    document.querySelectorAll('a[data-wa-msg]').forEach(function (a) {
      var msg = a.getAttribute('data-wa-msg') || '';
      a.href = 'https://wa.me/' + String(wa).replace(/\D/g, '') + '?text=' + encodeURIComponent(msg);
    });

    // mailto links.
    document.querySelectorAll('a[data-mailto]').forEach(function (a) {
      a.href = 'mailto:' + (settings.email || '');
    });
  }

  function updateYear() {
    var el = document.getElementById('current-year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function init() {
    updateYear();
    fetch('content/site-settings.json')
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(applySettings)
      .catch(function () { /* fall back to the values baked into the HTML */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
