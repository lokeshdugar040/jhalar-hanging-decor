// JHALAR Hanging Decor - Pro Engine
// Data sources: content/*.json

let products = [];
let settings = {
  whatsapp: "918100656258",
  phone: "+91 81006 56258",
  email: "lokeshdugar040@gmail.com",
  location: "Howrah, West Bengal, India",
  gst: "Available on request",
  heroImage: "assets/images/hero-jhalar.jpg",
  siteTitle: "JHALAR Hanging Decor | B2B Manufacturer & Wholesale Supplier",
  siteDescription: "JHALAR manufactures handcrafted decorative hangings...",
  ogImage: "assets/images/og-cover.jpg",
  navItems: [{label:"Collection",href:"#collection"},{label:"Custom Orders",href:"#custom-orders"},{label:"About",href:"#about"},{label:"FAQ",href:"#faq"},{label:"Contact",href:"#contact"}],
  footerNavItems: [{label:"Collection",href:"#collection"},{label:"Custom Orders",href:"#custom-orders"},{label:"About",href:"#about"},{label:"Contact",href:"#contact"}],
  socialLinks: {instagram:{url:"#",label:"Instagram"},facebook:{url:"#",label:"Facebook"},whatsapp:{url:"https://wa.me/918100656258",label:"WhatsApp"}}
};

let theme = {
  colors: {
    "--colour-jhalar-red": "#C82039",
    "--colour-jhalar-red-dark": "#A3182E",
    "--colour-jhalar-red-light": "#E8485F",
    "--colour-accent-gold": "#C9A84C",
    "--colour-deep-navy": "#141942",
    "--colour-warm-cream": "#FFFAF1"
  },
  fonts: {
    "heading": "'Playfair Display', Georgia, 'Times New Roman', serif",
    "body": "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  }
};

let sections = {};
let customCSS = '';

// ===== INIT =====
async function init() {
  setupSmoothScroll();
  setupMobileNav();
  setupAccordions();
  setupModal();
  updateYear();
  setupReveal();
  setupEnquiryForm();

  await Promise.allSettled([loadSettings(), loadProducts(), loadTheme(), loadSections(), loadCustomCSS()]);
  applySiteSettings();
  applyTheme();
  applySectionVisibility();
  applyNavigation();
  applySEO();
  applyCustomCSS();
  renderProducts(products);
  setupFilterButtons();
}

// ===== LOADERS =====
async function loadProducts() {
  try {
    const r = await fetch('content/products.json');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const d = await r.json();
    products = Array.isArray(d.products) ? d.products : [];
    if (!products.length) showFallbackProducts();
  } catch(e) { console.error('Products load failed:', e); showFallbackProducts(); }
}

async function loadSettings() {
  try {
    const r = await fetch('content/site-settings.json');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    settings = Object.assign({}, settings, await r.json());
  } catch(e) { console.warn('Settings fallback:', e); }
}

async function loadTheme() {
  try {
    const r = await fetch('content/theme.json');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const d = await r.json();
    if (d.colors) theme.colors = Object.assign({}, theme.colors, d.colors);
    if (d.fonts) theme.fonts = Object.assign({}, theme.fonts, d.fonts);
  } catch(e) { console.warn('Theme fallback:', e); }
}

async function loadSections() {
  try {
    const r = await fetch('content/sections.json');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const d = await r.json();
    sections = d.sections || {};
  } catch(e) { console.warn('Sections fallback:', e);
    document.querySelectorAll('[data-section]').forEach(el => { sections[el.dataset.section] = { visible: true }; });
  }
}

async function loadCustomCSS() {
  try {
    const r = await fetch('content/custom-css.json');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const d = await r.json();
    customCSS = d.css || '';
  } catch(e) { customCSS = ''; }
}

// ===== APPLIERS =====
function applyTheme() {
  const root = document.documentElement;
  if (theme.colors) Object.entries(theme.colors).forEach(([k,v]) => root.style.setProperty(k, v));
  if (theme.fonts) {
    if (theme.fonts.heading) root.style.setProperty('--serif', theme.fonts.heading);
    if (theme.fonts.body) root.style.setProperty('--sans', theme.fonts.body);
  }
  if (theme.layout) {
    const l = theme.layout;
    if (l.baseFontSize) root.style.setProperty('--fs-base', l.baseFontSize);
    if (l.sectionY) root.style.setProperty('--section-y', l.sectionY);
    if (l.cardRadius) root.style.setProperty('--radius-lg', l.cardRadius);
    if (l.containerWidth) root.style.setProperty('--container', l.containerWidth);
  }
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function applySectionVisibility() {
  document.querySelectorAll('[data-section]').forEach(el => {
    const s = sections[el.dataset.section];
    el.style.display = (s && s.visible === false) ? 'none' : '';
  });
}

function applyCustomCSS() {
  let el = document.getElementById('jhalar-custom-css');
  if (!el) { el = document.createElement('style'); el.id = 'jhalar-custom-css'; document.head.appendChild(el); }
  el.textContent = customCSS || '';
}

function applyNavigation() {
  // Desktop nav
  const navList = document.querySelector('.desktop-nav .nav-list');
  if (navList && settings.navItems && settings.navItems.length) {
    navList.innerHTML = settings.navItems.map(n => `<li><a href="${n.href}">${n.label}</a></li>`).join('');
  }
  // Mobile nav
  const mobileList = document.querySelector('.mobile-nav-list');
  if (mobileList && settings.navItems && settings.navItems.length) {
    mobileList.innerHTML = settings.navItems.map(n => `<li><a href="${n.href}" class="mobile-link">${n.label}</a></li>`).join('');
  }
  // Footer nav
  const footerList = document.querySelector('.footer-links ul');
  if (footerList && settings.footerNavItems && settings.footerNavItems.length) {
    footerList.innerHTML = settings.footerNavItems.map(n => `<li><a href="${n.href}">${n.label}</a></li>`).join('');
  }
  // Social links
  const socialContainer = document.querySelector('.footer-social ul');
  if (socialContainer && settings.socialLinks) {
    socialContainer.innerHTML = '';
    const sl = settings.socialLinks;
    if (sl.instagram) socialContainer.innerHTML += `<li><a href="${sl.instagram.url}" aria-label="Instagram"><i class="fab fa-instagram"></i> ${sl.instagram.label}</a></li>`;
    if (sl.facebook) socialContainer.innerHTML += `<li><a href="${sl.facebook.url}" aria-label="Facebook"><i class="fab fa-facebook"></i> ${sl.facebook.label}</a></li>`;
    if (sl.whatsapp) socialContainer.innerHTML += `<li><a href="${sl.whatsapp.url}" data-wa target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i> ${sl.whatsapp.label}</a></li>`;
  }
}

function applySEO() {
  if (settings.siteTitle) document.title = settings.siteTitle;
  if (settings.siteDescription) {
    let m = document.querySelector('meta[name="description"]');
    if (m) m.content = settings.siteDescription;
    m = document.querySelector('meta[property="og:description"]');
    if (m) m.content = settings.siteDescription;
    m = document.querySelector('meta[name="twitter:description"]');
    if (m) m.content = settings.siteDescription;
  }
  if (settings.ogImage) {
    const img = settings.ogImage.startsWith('http') ? settings.ogImage : 'https://lokeshdugar040.github.io/jhalar-hanging-decor/' + settings.ogImage;
    let m = document.querySelector('meta[property="og:image"]');
    if (m) m.content = img;
    m = document.querySelector('meta[name="twitter:image"]');
    if (m) m.content = img;
  }
}

function showFallbackProducts() {
  products = [
    {id:1,title:"Pink Pom Pom Gota Hanging",category:"Pom Pom Hangings",description:"Vibrant pink pom pom garland with gota fans and a decorative bell.",image:"assets/images/products/pom-pom-pink-gota.jpg",b2bTag:"Bestseller"},
    {id:7,title:"Marigold Floral Jhalar",category:"Floral Jhalars",description:"Classic orange marigold jhalar for weddings and festive installs.",image:"assets/images/products/floral-marigold-orange.jpg",b2bTag:"Bulk-ready"},
    {id:5,title:"Pink Blossom Bell Hanging",category:"Bell Hangings",description:"Pink blossom garland finished with a golden temple bell.",image:"assets/images/products/bell-pink-blossom.jpg",b2bTag:"Bestseller"},
    {id:9,title:"Mogra Pearl Door Toran",category:"Torans",description:"White mogra-pearl toran with a golden bell centrepiece.",image:"assets/images/products/toran-mogra.jpg",b2bTag:"Premium"}
  ];
}

function renderProducts(productList) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  if (!productList || !productList.length) {
    grid.innerHTML = '<p style="text-align:center;color:#666;padding:2rem;">No products available right now. Please WhatsApp us for the latest catalog.</p>';
    return;
  }
  grid.innerHTML = productList.map(p => `
    <div class="product-card" data-category="${p.category}">
      <div class="product-image"><img src="${p.image}" alt="${p.title} — ${p.category}" width="1080" height="1080" loading="lazy" decoding="async"></div>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3 class="product-title">${p.title}</h3>
        <p class="product-desc">${p.description}</p>
        <span class="product-meta">${p.b2bTag}</span>
        <button class="btn btn-primary product-details-btn" data-product-id="${p.id}" style="margin-top:1rem;width:100%;">View Details</button>
      </div>
    </div>
  `).join('');
  grid.querySelectorAll('.product-details-btn').forEach(b => b.addEventListener('click', () => openProductModal(Number(b.dataset.productId))));
}

function setupFilterButtons() {
  const btns = document.querySelectorAll('.filter-btn');
  if (!btns.length) return;
  btns.forEach(b => b.addEventListener('click', () => {
    btns.forEach(x => { x.classList.remove('active'); x.setAttribute('aria-selected','false'); });
    b.classList.add('active'); b.setAttribute('aria-selected','true');
    filterProducts(b.dataset.filter);
  }));
}

function filterProducts(cat) {
  document.querySelectorAll('.product-card').forEach(c => c.style.display = (cat === 'all' || c.dataset.category === cat) ? 'block' : 'none');
}

// ===== UI SETUP =====
function setupMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.getElementById('mobile-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const exp = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!exp));
    nav.classList.toggle('open');
  });
  nav.querySelectorAll('a').forEach(l => l.addEventListener('click', () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); }));
}

function setupAccordions() {
  document.querySelectorAll('.accordion-header').forEach(h => h.addEventListener('click', () => {
    const exp = h.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.accordion-header').forEach(x => { x.setAttribute('aria-expanded','false'); const c = document.getElementById(x.getAttribute('aria-controls')); if (c) c.hidden = true; });
    if (!exp) { h.setAttribute('aria-expanded','true'); const c = document.getElementById(h.getAttribute('aria-controls')); if (c) c.hidden = false; }
  }));
}

function setupModal() {
  const modal = document.getElementById('product-modal');
  const close = document.getElementById('modal-close');
  if (!modal || !close) return;
  close.addEventListener('click', () => closeModal(modal));
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(modal); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal(modal); });
}

function closeModal(modal) { modal.setAttribute('aria-hidden','true'); modal.style.display = 'none'; document.body.style.overflow = ''; }

function openProductModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const modal = document.getElementById('product-modal');
  if (!modal) return;
  const s = (id, t) => { const e = document.getElementById(id); if (e) e.textContent = t; };
  s('modal-title', p.title); s('modal-category', p.category); s('modal-desc', p.description); s('modal-tag', p.b2bTag);
  const ph = document.getElementById('modal-photo');
  if (ph) { ph.src = p.image; ph.alt = p.title; }
  const wa = document.getElementById('modal-wa-btn');
  if (wa) wa.href = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Hello JHALAR, I\'m interested in the "'+p.title+'" ('+p.category+'). Please share bulk pricing and availability.')}`;
  modal.setAttribute('aria-hidden','false'); modal.style.display = 'flex'; document.body.style.overflow = 'hidden';
  const cb = document.getElementById('modal-close'); if (cb) cb.focus();
}

function applySiteSettings() {
  document.querySelectorAll('[data-contact]').forEach(el => { const k = el.dataset.contact; if (settings[k]) el.textContent = settings[k]; });
  document.querySelectorAll('a[data-wa]').forEach(a => { a.href = `https://wa.me/${settings.whatsapp}`; });
  document.querySelectorAll('a[data-wa-msg]').forEach(a => { a.href = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(a.dataset.waMsg||'Hello JHALAR, I would like a B2B quotation.')}`; });
  document.querySelectorAll('a[data-tel]').forEach(a => { a.href = `tel:+${String(settings.whatsapp).replace(/\D/g,'')}`; });
  document.querySelectorAll('a[data-mailto]').forEach(a => { a.href = `mailto:${settings.email}`; });
  if (settings.heroHeadline) { const t = document.querySelector('.hero-title'); if (t) t.textContent = settings.heroHeadline; }
  if (settings.heroIntro) { const t = document.querySelector('.hero-desc'); if (t) t.textContent = settings.heroIntro; }
  if (settings.heroImage) { const t = document.querySelector('.hero-img'); if (t) t.src = settings.heroImage; }
  // Hero highlights
  if (Array.isArray(settings.heroHighlights) && settings.heroHighlights.length) {
    const ul = document.querySelector('.hero-highlights');
    if (ul) {
      ul.innerHTML = settings.heroHighlights.map(h => `<li><svg class="icon" aria-hidden="true" width="18" height="18"><use href="assets/icons.svg#${esc(h.icon||'icon-check')}"/></svg> ${esc(h.text)}</li>`).join('');
    }
  }
  // Trust bar
  if (Array.isArray(settings.trustItems) && settings.trustItems.length) {
    const bar = document.querySelector('.trust-bar-inner');
    if (bar) {
      bar.innerHTML = settings.trustItems.map((t,i) => `
        ${i ? '<div class="trust-bar-divider" aria-hidden="true"></div>' : ''}
        <div class="trust-bar-item"><svg class="icon" aria-hidden="true" width="16" height="16"><use href="assets/icons.svg#${esc(t.icon||'icon-check')}"/></svg> ${esc(t.label)}</div>
      `).join('');
    }
  }
  // FAQ
  if (Array.isArray(settings.faqItems) && settings.faqItems.length) {
    const acc = document.querySelector('.accordion');
    if (acc) {
      acc.innerHTML = settings.faqItems.map((f,i) => `
        <div class="accordion-item">
          <button class="accordion-header" aria-expanded="false" aria-controls="faq-${i}">${esc(f.q)}</button>
          <div class="accordion-content" id="faq-${i}" hidden><p>${esc(f.a)}</p></div>
        </div>
      `).join('');
      setupAccordions();
    }
  }
}

function updateYear() { const e = document.getElementById('current-year'); if (e) e.textContent = String(new Date().getFullYear()); }

function setupReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const fn = () => els.forEach(el => { if (el.getBoundingClientRect().top < window.innerHeight - 150) el.classList.add('active'); });
  fn(); window.addEventListener('scroll', fn, { passive: true });
}

function setupEnquiryForm() {
  const form = document.getElementById('enquiry-form');
  if (!form) return;
  form.querySelectorAll('input[required], select[required], textarea[required]').forEach(i => i.addEventListener('blur', () => { i.style.borderColor = i.validity.valid ? '#4caf50' : '#f44336'; }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const v = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    const lines = ['*New B2B Enquiry — JHALAR Website*','',`*Name:* ${v('name')}`];
    if (v('company')) lines.push(`*Company:* ${v('company')}`);
    lines.push(`*Buyer Type:* ${v('buyer-type')}`,`*Phone:* ${v('phone')}`);
    if (v('email')) lines.push(`*Email:* ${v('email')}`);
    lines.push(`*City/State:* ${v('location')}`,`*Category:* ${v('category')}`);
    if (v('quantity')) lines.push(`*Quantity:* ${v('quantity')}`);
    if (v('date')) lines.push(`*Required By:* ${v('date')}`);
    if (v('details')) lines.push(`*Details:* ${v('details')}`);
    window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(lines.join('\\n'))}`, '_blank', 'noopener');
    const st = document.getElementById('form-status');
    if (st) { st.textContent = 'WhatsApp opened with your enquiry pre-filled — just press send.'; st.classList.add('visible'); }
  });
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', function(e) {
    const h = this.getAttribute('href');
    if (h && h.length > 1) { const t = document.querySelector(h); if (t) { e.preventDefault(); t.scrollIntoView({ behavior:'smooth', block:'start' }); } }
  }));
}

// ===== JHALAR API =====
window.JHALAR = {
  getProducts: () => products,
  getSettings: () => settings,
  getTheme: () => theme,
  getSections: () => sections,
  getCustomCSS: () => customCSS,
  setSettings: (ns) => { settings = Object.assign({}, settings, ns); applySiteSettings(); applyNavigation(); applySEO(); try { localStorage.setItem('jhalar_settings', JSON.stringify(settings)); } catch(e){} },
  setTheme: (nt) => { if (nt.colors) theme.colors = Object.assign({}, theme.colors, nt.colors); if (nt.fonts) theme.fonts = Object.assign({}, theme.fonts, nt.fonts); applyTheme(); try { localStorage.setItem('jhalar_theme', JSON.stringify(theme)); } catch(e){} },
  setProducts: (np) => { products = Array.isArray(np) ? np : []; renderProducts(products); setupFilterButtons(); try { localStorage.setItem('jhalar_products', JSON.stringify(products)); } catch(e){} },
  setSections: (ns) => { sections = ns || {}; applySectionVisibility(); try { localStorage.setItem('jhalar_sections', JSON.stringify(sections)); } catch(e){} },
  setCustomCSS: (css) => { customCSS = css || ''; applyCustomCSS(); try { localStorage.setItem('jhalar_custom_css', css); } catch(e){} }
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();