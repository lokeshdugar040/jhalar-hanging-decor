// JHALAR Hanging Decor - Product & Interaction Script
// Data sources: content/products.json (catalog) + content/site-settings.json (contact info)

let products = [];
let settings = {
  whatsapp: "918100656258",
  phone: "+91 81006 56258",
  email: "lokeshdugar040@gmail.com",
  location: "Howrah, West Bengal, India",
  gst: "Available on request"
};

// Initialize website
async function init() {
  setupSmoothScroll();
  setupMobileNav();
  setupAccordions();
  setupModal();
  updateYear();
  setupReveal();
  setupEnquiryForm();

  await Promise.allSettled([loadSettings(), loadProducts()]);
  applySiteSettings();
  renderProducts(products);
  setupFilterButtons();
}

// Load products from JSON (relative path works on any host/subpath)
async function loadProducts() {
  try {
    const response = await fetch('content/products.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    products = Array.isArray(data.products) ? data.products : [];
    if (products.length === 0) showFallbackProducts();
  } catch (error) {
    console.error('Failed to load products:', error);
    showFallbackProducts();
  }
}

// Load site settings (contact info) from JSON
async function loadSettings() {
  try {
    const response = await fetch('content/site-settings.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    settings = Object.assign({}, settings, data);
  } catch (error) {
    console.warn('Using built-in contact settings:', error);
  }
}

// Show fallback products if JSON fails
function showFallbackProducts() {
  products = [
    {
      id: 1,
      title: "Pink Pom Pom Gota Hanging",
      category: "Pom Pom Hangings",
      description: "Vibrant pink pom pom garland with gota fans and a decorative bell.",
      image: "assets/images/products/pom-pom-pink-gota.jpg",
      b2bTag: "Bestseller"
    },
    {
      id: 7,
      title: "Marigold Floral Jhalar",
      category: "Floral Jhalars",
      description: "Classic orange marigold jhalar for weddings and festive installs.",
      image: "assets/images/products/floral-marigold-orange.jpg",
      b2bTag: "Bulk-ready"
    },
    {
      id: 5,
      title: "Pink Blossom Bell Hanging",
      category: "Bell Hangings",
      description: "Pink blossom garland finished with a golden temple bell.",
      image: "assets/images/products/bell-pink-blossom.jpg",
      b2bTag: "Bestseller"
    },
    {
      id: 9,
      title: "Mogra Pearl Door Toran",
      category: "Torans",
      description: "White mogra-pearl toran with a golden bell centrepiece.",
      image: "assets/images/products/toran-mogra.jpg",
      b2bTag: "Premium"
    }
  ];
}

// Render products to grid with real imagery
function renderProducts(productList) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  if (!productList || productList.length === 0) {
    grid.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No products available right now. Please WhatsApp us for the latest catalog.</p>';
    return;
  }

  grid.innerHTML = productList.map(product => `
    <div class="product-card" data-category="${product.category}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.title} — ${product.category} by JHALAR Hanging Decor" width="1080" height="1080" loading="lazy" decoding="async">
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-title">${product.title}</h3>
        <p class="product-desc">${product.description}</p>
        <span class="product-meta">${product.b2bTag}</span>
        <button class="btn btn-primary product-details-btn" data-product-id="${product.id}" style="margin-top: 1rem; width: 100%;">
          View Details
        </button>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.product-details-btn').forEach(btn => {
    btn.addEventListener('click', () => openProductModal(Number(btn.dataset.productId)));
  });
}

// Setup category filter buttons
function setupFilterButtons() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      filterProducts(btn.dataset.filter);
    });
  });
}

// Filter products by category
function filterProducts(category) {
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    const shouldShow = category === 'all' || card.dataset.category === category;
    card.style.display = shouldShow ? 'block' : 'none';
  });
}

// Mobile navigation toggle
function setupMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.getElementById('mobile-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('active');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Accordion functionality (FAQ)
function setupAccordions() {
  const headers = document.querySelectorAll('.accordion-header');
  if (headers.length === 0) return;

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const expanded = header.getAttribute('aria-expanded') === 'true';
      const content = document.getElementById(header.getAttribute('aria-controls'));
      if (!content) return;

      headers.forEach(h => {
        h.setAttribute('aria-expanded', 'false');
        const el = document.getElementById(h.getAttribute('aria-controls'));
        if (el) el.hidden = true;
      });

      if (!expanded) {
        header.setAttribute('aria-expanded', 'true');
        content.hidden = false;
      }
    });
  });
}

// Modal functionality
function setupModal() {
  const modal = document.getElementById('product-modal');
  const closeBtn = document.getElementById('modal-close');
  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', () => closeModal(modal));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal(modal);
    }
  });
}

function closeModal(modal) {
  modal.setAttribute('aria-hidden', 'true');
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

// Open product modal with image + per-product WhatsApp message
function openProductModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('product-modal');
  if (!modal) return;

  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  setText('modal-title', product.title);
  setText('modal-category', product.category);
  setText('modal-desc', product.description);
  setText('modal-tag', product.b2bTag);

  const photo = document.getElementById('modal-photo');
  if (photo) {
    photo.src = product.image;
    photo.alt = `${product.title} — ${product.category}`;
  }

  // Per-product WhatsApp enquiry message (uses live settings number)
  const waBtn = document.getElementById('modal-wa-btn');
  if (waBtn) {
    const msg = `Hello JHALAR, I'm interested in the "${product.title}" (${product.category}). Please share bulk pricing and availability.`;
    waBtn.href = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msg)}`;
  }

  modal.setAttribute('aria-hidden', 'false');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('modal-close');
  if (closeBtn) closeBtn.focus();
}

// Push site settings into all contact touchpoints
function applySiteSettings() {
  // Text placeholders
  document.querySelectorAll('[data-contact]').forEach(el => {
    const key = el.dataset.contact;
    if (settings[key]) el.textContent = settings[key];
  });

  // Plain WhatsApp links (no prefilled message)
  document.querySelectorAll('a[data-wa]').forEach(a => {
    a.href = `https://wa.me/${settings.whatsapp}`;
  });

  // Enquiry buttons with a prefilled message
  document.querySelectorAll('a[data-wa-msg]').forEach(a => {
    const msg = a.dataset.waMsg || 'Hello JHALAR, I would like a B2B quotation.';
    a.href = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msg)}`;
  });

  // tel: / mailto: links
  document.querySelectorAll('a[data-tel]').forEach(a => {
    a.href = `tel:+${String(settings.whatsapp).replace(/\D/g, '')}`;
  });
  document.querySelectorAll('a[data-mailto]').forEach(a => {
    a.href = `mailto:${settings.email}`;
  });
}

// Update copyright year
function updateYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

// Reveal animations on scroll
function setupReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length === 0) return;

  const revealOnScroll = () => {
    revealElements.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 150) {
        el.classList.add('active');
      }
    });
  };

  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll, { passive: true });
}

// Enquiry form: static hosts (GitHub Pages) can't receive POSTs, so the form
// composes a WhatsApp message with all details and opens it for the visitor.
function setupEnquiryForm() {
  const form = document.getElementById('enquiry-form');
  if (!form) return;

  // Real-time validation feedback
  form.querySelectorAll('input[required], select[required], textarea[required]').forEach(input => {
    input.addEventListener('blur', () => {
      input.style.borderColor = input.validity.valid ? '#4caf50' : '#f44336';
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const value = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };

    const lines = [
      '*New B2B Enquiry — JHALAR Website*',
      '',
      `*Name:* ${value('name')}`,
    ];
    if (value('company')) lines.push(`*Company:* ${value('company')}`);
    lines.push(`*Buyer Type:* ${value('buyer-type')}`);
    lines.push(`*Phone:* ${value('phone')}`);
    if (value('email')) lines.push(`*Email:* ${value('email')}`);
    lines.push(`*City/State:* ${value('location')}`);
    lines.push(`*Category:* ${value('category')}`);
    if (value('quantity')) lines.push(`*Quantity:* ${value('quantity')}`);
    if (value('date')) lines.push(`*Required By:* ${value('date')}`);
    if (value('details')) lines.push(`*Details:* ${value('details')}`);

    const url = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener');

    const status = document.getElementById('form-status');
    if (status) {
      status.textContent = 'WhatsApp opened with your enquiry pre-filled — just press send.';
      status.classList.add('visible');
    }
  });
}

// Smooth scroll for anchor links
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
