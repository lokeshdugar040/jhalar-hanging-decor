/* JHALAR Hanging Decor — interaction layer (progressive enhancement only) */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '919876543210'; // ← replace with the real business number (digits only, country code first)

  document.documentElement.classList.remove('no-js');

  /* ---------- Header scroll state ---------- */
  function setupHeader() {
    var header = document.getElementById('header');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile navigation ---------- */
  function setupMobileNav() {
    var toggle = document.querySelector('.mobile-toggle');
    var nav = document.getElementById('mobile-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('active', !expanded);
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function (e) {
      if (nav.classList.contains('active') && !nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Category filters ---------- */
  function setupFilters() {
    var buttons = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.product-card');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-pressed', String(b === btn));
        });
        var filter = btn.dataset.filter;
        cards.forEach(function (card) {
          var show = filter === 'all' || card.dataset.category === filter;
          card.classList.toggle('is-hidden', !show);
        });
      });
    });
  }

  /* ---------- Product modal ---------- */
  var lastTrigger = null;

  function openModal(card, trigger) {
    var modal = document.getElementById('product-modal');
    if (!modal || !card) return;

    var img = card.querySelector('.product-media img');
    var title = card.querySelector('.product-title');
    var category = card.querySelector('.product-category');
    var desc = card.querySelector('.product-desc');
    var tag = card.querySelector('.product-tag');

    var modalImg = document.getElementById('modal-image');
    if (modalImg && img) {
      modalImg.src = img.getAttribute('src');
      modalImg.alt = img.getAttribute('alt') || '';
    }
    document.getElementById('modal-title').textContent = title ? title.textContent : '';
    document.getElementById('modal-category').textContent = category ? category.textContent : '';
    document.getElementById('modal-desc').textContent = desc ? desc.textContent : '';
    document.getElementById('modal-tag').textContent = tag ? tag.textContent : '';

    var wa = document.getElementById('modal-whatsapp');
    if (wa && title) {
      var msg = 'Hello JHALAR, I would like a bulk quotation for: ' + title.textContent + '.';
      wa.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
    }

    lastTrigger = trigger || null;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var closeBtn = document.getElementById('modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    var modal = document.getElementById('product-modal');
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastTrigger) { lastTrigger.focus(); lastTrigger = null; }
  }

  function setupModal() {
    var modal = document.getElementById('product-modal');
    var closeBtn = document.getElementById('modal-close');
    if (!modal || !closeBtn) return;

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-id]');
      if (trigger && trigger.closest('.product-card')) {
        openModal(trigger.closest('.product-card'), trigger);
      }
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
    });
  }

  /* ---------- FAQ accordion ---------- */
  function setupAccordions() {
    var headers = document.querySelectorAll('.accordion-header');
    headers.forEach(function (header) {
      header.addEventListener('click', function () {
        var expanded = header.getAttribute('aria-expanded') === 'true';
        headers.forEach(function (h) {
          h.setAttribute('aria-expanded', 'false');
          var el = document.getElementById(h.getAttribute('aria-controls'));
          if (el) el.hidden = true;
        });
        if (!expanded) {
          header.setAttribute('aria-expanded', 'true');
          var content = document.getElementById(header.getAttribute('aria-controls'));
          if (content) content.hidden = false;
        }
      });
    });
  }

  /* ---------- Enquiry form → WhatsApp ---------- */
  function setupForm() {
    var form = document.getElementById('enquiry-form');
    var status = document.getElementById('form-status');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        if (status) { status.textContent = 'Please complete the required fields.'; status.className = 'form-status err'; }
        return;
      }

      function v(id) { var el = document.getElementById(id); return el && el.value ? el.value.trim() : ''; }

      var lines = [
        'Hello JHALAR, new B2B enquiry:',
        'Name: ' + v('name'),
        'Company: ' + (v('company') || '-'),
        'Buyer type: ' + v('buyer-type'),
        'Phone: ' + v('phone'),
        'Email: ' + (v('email') || '-'),
        'Location: ' + v('location'),
        'Category: ' + v('category'),
        'Quantity: ' + (v('quantity') || '-'),
        'Required by: ' + (v('date') || '-'),
        'Details: ' + (v('details') || '-')
      ];

      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank', 'noopener');

      if (status) {
        status.textContent = 'Opening WhatsApp with your enquiry… we reply within 24 hours.';
        status.className = 'form-status ok';
      }
      var btn = form.querySelector('.submit-btn');
      if (btn) { btn.disabled = true; setTimeout(function () { btn.disabled = false; }, 4000); }
    });
  }

  /* ---------- Scroll reveal (motion-safe, JS-only) ---------- */
  function setupReveal() {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var targets = document.querySelectorAll('.section, .trust-strip');
    targets.forEach(function (el) { el.classList.add('js-reveal'); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Misc ---------- */
  function updateYear() {
    var el = document.getElementById('current-year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function init() {
    setupHeader();
    setupMobileNav();
    setupFilters();
    setupModal();
    setupAccordions();
    setupForm();
    setupReveal();
    updateYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
