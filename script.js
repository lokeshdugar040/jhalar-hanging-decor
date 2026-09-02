/* ============================================
   JHALAR Hanging Decor — site script
   - WhatsApp number is configured in ONE place (WA_NUMBER)
   - Products load from content/products.json
   ============================================ */

document.documentElement.classList.add('js');

/* ---- CONFIG ------------------------------------------------- */
// ⚠️ Replace with the real WhatsApp number (country code + number, digits only).
const WA_NUMBER = '91XXXXXXXXXX';

/* ---- PRODUCT DATA ------------------------------------------- */
let products = [];

async function loadProducts() {
  const response = await fetch('content/products.json');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  products = data.products || [];
}

// Used if the JSON is unreachable (offline preview, renamed file, etc.)
const FALLBACK_PRODUCTS = [
  { id: 901, title: 'Marigold Pom Pom Garland', category: 'Pom Pom Hangings', description: 'Our most versatile bulk decor line for festivals, weddings and retail displays.', image: '/assets/images/products/marigold-pom-pom-garland', b2bTag: 'Bestseller' },
  { id: 902, title: 'Rani Pink Flower Jhalar Garland', category: 'Floral Jhalars', description: 'Vibrant hand-wound jhalar — a bestseller for wedding backdrops and festive entrances.', image: '/assets/images/products/rani-pink-flower-jhalar', b2bTag: 'Bestseller' },
  { id: 903, title: 'Marigold Door Toran Hanging', category: 'Torans', description: 'The classic festive doorway piece, supplied in bulk for retail and event installs.', image: '/assets/images/products/marigold-door-toran', b2bTag: 'Bestseller' },
  { id: 904, title: 'Pink Bead & Bell Hanging', category: 'Bead Hangings', description: 'Hand-strung bead hanging with decorative bells — a boutique favourite.', image: '/assets/images/products/pink-bead-bell-hanging', b2bTag: 'Bestseller' },
  { id: 905, title: 'Green Leaf Flower Bell Hanging', category: 'Bell Hangings', description: 'Leaf-and-flower hanging with a brass-look bell drop for traditional entrances.', image: '/assets/images/products/leaf-flower-bell-hanging', b2bTag: 'Traditional' },
  { id: 906, title: 'Orange Tassel Door Hanging', category: 'Tassel Hangings', description: 'Layered tassel door hanging — a bold traditional accent for entrances.', image: '/assets/images/products/orange-tassel-door-hanging', b2bTag: 'Bulk Ready' }
];

/* ---- UTILS --------------------------------------------------- */
function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[ch]);
}

function waLink(text) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

// Image fallback: try .jpg if .webp missing
window.__imgFallback = function (img) {
  img.onerror = null;
  if (img.src.endsWith('.webp')) img.src = img.src.replace(/\.webp$/, '.jpg');
};

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add('show'));
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => { toast.hidden = true; }, 300);
  }, 3200);
}

/* ---- INIT ---------------------------------------------------- */
async function init() {
  try {
    await loadProducts();
  } catch (err) {
    console.warn('Product JSON unavailable, using fallback catalogue.', err);
    products = FALLBACK_PRODUCTS;
  }
  renderProducts(products);
  setupFilterButtons();
  setupWhatsAppLinks();
  setupMobileNav();
  setupAccordions();
  setupModal();
  setupScrollSpy();
  setupReveal();
  setupFormValidation();
  updateYear();
}

/* ---- RENDER PRODUCTS ---------------------------------------- */
function renderProducts(productList) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  if (!productList.length) {
    grid.innerHTML = '<p class="noscript-note">No products available right now — please check back soon, or send us an enquiry.</p>';
    return;
  }

  grid.innerHTML = productList.map((product, i) => `
    <article class="product-card reveal-card" data-category="${escapeHtml(product.category)}" style="transition-delay:${(i % 6) * 45}ms">
      <figure class="product-image">
        <img src="${escapeHtml(product.image)}.webp"
             onerror="__imgFallback(this)"
             alt="${escapeHtml(product.title)} — handcrafted by JHALAR"
             loading="lazy" decoding="async" width="900" height="900">
        <span class="product-tag">${escapeHtml(product.b2bTag)}</span>
      </figure>
      <div class="product-info">
        <span class="product-category">${escapeHtml(product.category)}</span>
        <h3 class="product-title">${escapeHtml(product.title)}</h3>
        <p class="product-desc">${escapeHtml(product.description)}</p>
        <button type="button" class="btn btn-secondary product-btn" data-product-id="${product.id}">
          View Details &amp; MOQ
        </button>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.product-btn').forEach(btn => {
    btn.addEventListener('click', () => openProductModal(Number(btn.dataset.productId)));
  });

  // Staggered card entrance
  requestAnimationFrame(() => {
    grid.querySelectorAll('.reveal-card').forEach(card => card.classList.add('shown'));
  });
}

/* ---- FILTERS -------------------------------------------------- */
function setupFilterButtons() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      filterProducts(btn.dataset.filter);
    });
  });
}

function filterProducts(category) {
  document.querySelectorAll('.product-card').forEach(card => {
    card.style.display = (category === 'all' || card.dataset.category === category) ? '' : 'none';
  });
}

/* ---- WHATSAPP LINKS (single source of truth) ------------------ */
function setupWhatsAppLinks() {
  document.querySelectorAll('.whatsapp-enquiry-btn').forEach(link => {
    const text = link.dataset.waText || 'Hello JHALAR, I have a bulk decor requirement.';
    link.href = waLink(text);
  });
}

/* ---- MOBILE NAV ------------------------------------------------ */
function setupMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.getElementById('mobile-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    toggle.setAttribute('aria-label', expanded ? 'Open navigation menu' : 'Close navigation menu');
    nav.classList.toggle('active');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---- ACCORDIONS ------------------------------------------------ */
function setupAccordions() {
  const headers = document.querySelectorAll('.accordion-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const expanded = header.getAttribute('aria-expanded') === 'true';
      headers.forEach(h => {
        h.setAttribute('aria-expanded', 'false');
        const content = document.getElementById(h.getAttribute('aria-controls'));
        if (content) content.hidden = true;
      });
      if (!expanded) {
        header.setAttribute('aria-expanded', 'true');
        const content = document.getElementById(header.getAttribute('aria-controls'));
        if (content) content.hidden = false;
      }
    });
  });
}

/* ---- MODAL ------------------------------------------------------ */
let lastFocusedElement = null;

function setupModal() {
  const modal = document.getElementById('product-modal');
  const closeBtn = document.getElementById('modal-close');
  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => {
    if (modal.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'Tab') trapFocus(e, modal);
    }
  });

  const addBtn = document.getElementById('modal-add-enquiry');
  if (addBtn) addBtn.addEventListener('click', addModalProductToEnquiry);
}

function trapFocus(e, modal) {
  const focusables = modal.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault(); last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault(); first.focus();
  }
}

function openProductModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('product-modal');
  const img = document.getElementById('modal-image');
  if (!modal || !img) return;

  lastFocusedElement = document.activeElement;

  img.src = product.image + '.webp';
  img.onerror = function () { this.onerror = null; this.src = product.image + '.jpg'; };
  img.alt = product.title + ' — handcrafted by JHALAR';

  document.getElementById('modal-category').textContent = product.category;
  document.getElementById('modal-title').textContent = product.title;
  document.getElementById('modal-tag').textContent = product.b2bTag;
  document.getElementById('modal-desc').textContent = product.description;

  const waBtn = document.getElementById('modal-whatsapp');
  waBtn.href = waLink(`Hello JHALAR, I'm interested in "${product.title}" (${product.category}) seen on your website. Please share bulk pricing and MOQ.`);

  modal.dataset.productId = String(product.id);
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.getElementById('modal-close').focus();
}

function closeModal() {
  const modal = document.getElementById('product-modal');
  if (!modal || modal.getAttribute('aria-hidden') === 'true') return;
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocusedElement) lastFocusedElement.focus();
}

function addModalProductToEnquiry() {
  const modal = document.getElementById('product-modal');
  const product = products.find(p => String(p.id) === modal.dataset.productId);
  if (!product) return;

  const categorySelect = document.getElementById('category');
  if (categorySelect) {
    const match = [...categorySelect.options].find(o => o.value === product.category || o.value === 'Multiple Categories');
    if (match) { categorySelect.value = match.value; }
  }
  const details = document.getElementById('details');
  if (details) {
    details.value = details.value
      ? details.value + `\n• ${product.title} (qty: )`
      : `Interested in:\n• ${product.title} (qty: )`;
  }
  closeModal();
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  showToast(`"${product.title}" added to your enquiry.`);
}

/* ---- SCROLL SPY (active nav link) ------------------------------ */
function setupScrollSpy() {
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-list a')];
  if (!('IntersectionObserver' in window) || !sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px' });

  sections.forEach(section => observer.observe(section));
}

/* ---- REVEAL ON SCROLL ------------------------------------------- */
function setupReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || reduced) {
    revealEls.forEach(el => el.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

/* ---- FORM --------------------------------------------------------- */
function setupFormValidation() {
  const form = document.getElementById('enquiry-form');
  if (!form) return;

  // Real-time feedback
  form.querySelectorAll('input[required], select[required]').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') validateField(input);
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Honeypot: bots fill it, humans never see it
    if (form.querySelector('[name="website"]').value) return;

    const fields = [...form.querySelectorAll('input[required], select[required]')];
    const allValid = fields.map(validateField).every(Boolean);
    if (!allValid) {
      fields.find(f => f.getAttribute('aria-invalid') === 'true')?.focus();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const original = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const body = new URLSearchParams(new FormData(form)).toString();
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      form.hidden = true;
      document.getElementById('form-success').hidden = false;
      document.getElementById('form-success').scrollIntoView({ behavior: 'smooth', block: 'center' });
      setupWhatsAppLinks(); // ensure fresh wa links
    } catch (err) {
      console.warn('Form submission failed:', err);
      document.getElementById('form-error').hidden = false;
      showToast('Could not send — please try WhatsApp instead.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = original;
    }
  });
}

function validateField(input) {
  const valid = input.checkValidity();
  input.setAttribute('aria-invalid', String(!valid));
  const error = input.closest('.form-group')?.querySelector('.field-error');
  if (error) error.hidden = valid;
  input.classList.toggle('invalid', !valid);
  return valid;
}

/* ---- MISC ------------------------------------------------------ */
function updateYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---- BOOT -------------------------------------------------------- */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
