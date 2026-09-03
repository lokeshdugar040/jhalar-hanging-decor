// font-awesome-loader.js
// Loads Font Awesome asynchronously so it does not render-block first paint,
// while staying CSP-safe (script-src 'self', no inline event handlers).
(function () {
  'use strict';
  var href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';

  // If a non-JS environment loaded the noscript stylesheet, do nothing.
  var existing = document.querySelector('link[data-fa]');
  if (existing && existing.rel === 'stylesheet') return;

  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.crossOrigin = 'anonymous';
  link.setAttribute('data-fa', '');
  link.onload = function () { link.rel = 'stylesheet'; };
  document.head.appendChild(link);
})();
