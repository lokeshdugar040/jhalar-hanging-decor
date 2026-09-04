// JHALAR Hanging Decor - Pro Engine
// Data sources: content/*.json

let products = [];
let settings = {
  whatsapp: "918100656258",
  phone: "+91 81006 56258",
  email: "lokeshdugar040@gmail.com",
  location: "Howrah, West Bengal, India",
  gst: "Available on request",
  heroHeadline: "Handcrafted Jhalars & Festive Hangings — Made to Order in Bulk",
  heroIntro: "Pom pom garlands, floral jhalars, bead and bell hangings, torans and tassels — made to order at our Howrah workshop and supplied in bulk across India.",
  heroImage: "assets/images/hero-jhalar.jpg",
  siteTitle: "JHALAR | Jhalar & Festive Hangings Manufacturer — Wholesale & Bulk",
  siteDescription: "Pom pom garlands, floral jhalars, torans, bead and bell hangings — handcrafted in Howrah, made to order and supplied in bulk across India.",
  ogImage: "assets/images/og-cover.jpg",
  navItems: [{label:"Collection",href:"#collection"},{label:"Custom Orders",href:"#custom-orders"},{label:"About",href:"#about"},{label:"FAQ",href:"#faq"},{label:"Contact",href:"#contact"}],
  footerNavItems: [{label:"Collection",href:"#collection"},{label:"Custom Orders",href:"#custom-orders"},{label:"About",href:"#about"},{label:"Contact",href:"#contact"}],
  socialLinks: {instagram:{url:"#",label:"Instagram"},facebook:{url:"#",label:"Facebook"},whatsapp:{url:"https://wa.me/918100656258",label:"WhatsApp"}},
  sectionCopy: {
    heroTag: {icon:"icon-mfr", text:"Howrah Manufacturer | B2B Supply"},
    heroPrimary: {label:"Explore Product Collection", href:"#collection"},
    heroSecondary: {label:"WhatsApp for B2B Enquiry", href:"https://wa.me/918100656258"},
    why: {
      label:"Why JHALAR",
      title:"Factory-Direct, Made to Order, Built to Scale",
      intro:"Everything is made in our own workshop — priced factory-direct and built to order at scale.",
      features:[
        {icon:"icon-mfr", title:"Factory-Direct Pricing", text:"You buy straight from the workshop — no middlemen, sharper prices, faster answers."},
        {icon:"icon-palette", title:"Made-to-Order Design", text:"Colours, motifs and lengths built to your brief — from brand palettes to festive themes."},
        {icon:"icon-bulk", title:"Bulk & Wholesale Ready", text:"From a few dozen to several thousand pieces per design — with the same finish from first piece to last."}
      ]
    },
    collection: {
      label:"Our Collection",
      title:"Jhalars, Torans, Tassels & More",
      intro:"Sixteen core designs across eight categories — every style produced in bulk quantities.",
      note:"Need something specific? "
    },
    customOrders: {
      label:"Made to Order",
      title:"Your Design, Made to Order",
      intro:"Send your palette, sizes and quantity — we develop a sample first, then produce at scale.",
      image:"assets/images/custom-orders.jpg",
      chips:[
        {icon:"icon-palette", text:"Colour matching"},
        {icon:"icon-ruler", text:"Size & length options"},
        {icon:"icon-chart", text:"Order quantity planning"}
      ],
      processLabel:"How it works",
      steps:[
        {title:"Share Your Brief", text:"Tell us the category, quantity, colours and where it will be used."},
        {title:"Confirm Design & Quantity", text:"We agree the colours, sizing and design references before production."},
        {title:"Receive Quote & Lead Time", text:"Get your quote and delivery date — confirm when you're ready."}
      ]
    },
    about: {
      label:"About JHALAR",
      title:"Handcrafted in Howrah, Supplied Across India",
      intro:"JHALAR is the manufacturer — every jhalar and toran is hand-finished by our karigars in Howrah and supplied directly to you.",
      image:"assets/images/about-collage.jpg",
      values:[
        {icon:"icon-check", text:"Hand-finished detailing"},
        {icon:"icon-check", text:"One point of contact, quote to dispatch"},
        {icon:"icon-check", text:"Sampling before bulk production"}
      ]
    },
    faq: {label:"FAQ", title:"Frequently Asked Questions"},
    contact: {
      label:"Get in Touch",
      title:"Start a B2B Enquiry",
      intro:"Tell us what you need and the team will get back with options, prices and lead times."
    },
    footerTagline:"Handcrafted jhalars and festive hangings, made in Howrah and supplied across India."
  }
};

let theme = {
  colors: {
    "--colour-jhalar-red": "#C82039",
    "--colour-jhalar-red-dark": "#A3182E",
    "--colour-jhalar-red-light": "#E8485F",
    "--colour-accent-gold": "#C9A84C",
    "--colour-deep-navy": "#141942",
    "--colour-warm-cream": "#FFFAF1",
    "--brand-background": "#FFFFFF",
    "--brand-alt-background": "#F9F7F4",
    "--brand-text": "#4A4752",
    "--brand-muted": "#7A7780",
    "--brand-heading": "#1F1D24",
    "--brand-border": "#F0EFEB",
    "--brand-header-background": "#FFFFFF",
    "--brand-footer-background": "#141942",
    "--brand-footer-text": "#FFFFFF"
  },
  fonts: {
    heading: "'Playfair Display', Georgia, 'Times New Roman', serif",
    body: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
  },
  layout: {
    baseFontSize: "16px",
    sectionY: "96px",
    cardRadius: "20px",
    containerWidth: "1140px",
    headerHeight: "72px",
    productColumns: "3",
    buttonRadius: "9999px",
    shadowIntensity: "0.12",
    revealAnimation: true,
    headingWeight: "600",
    headingTracking: "-0.01em",
    headingLeading: "1.18",
    bodyWeight: "400",
    bodyTracking: "0",
    bodyLeading: "1.7",
    titleSize: "fluid",
    heroTitleSize: "fluid",
    cardTitleSize: "fluid",
    cardPad: "24px",
    gridGap: "24px",
    sectionHeaderGap: "48px",
    sectionAlign: "center",
    heroColumns: "split",
    featureColumns: "3",
    splitLayout: "split",
    aboutLayout: "split",
    processColumns: "3",
    contactLayout: "split",
    trustLayout: "auto",
    faqWidth: "740px",
    footerColumns: "4",
    featureGap: "24px",
    productGap: "24px",
    splitGap: "48px",
    processGap: "24px",
    contactGap: "24px",
    faqGap: "12px",
    trustGap: "12px",
    footerGap: "48px",
    productPad: "24px",
    faqPad: "20px",
    footerPad: "80px",
    trustPad: "16px"
  }
};

let sections = {};
let sectionOrder = [];
let customCSS = '';
let livePushed = { settings:false, theme:false, products:false, sections:false, css:false };

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
  applySectionOrder();
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
    if (livePushed.products) return;
    products = Array.isArray(d.products) ? d.products : [];
    if (!products.length) showFallbackProducts();
  } catch(e) { console.error('Products load failed:', e); if (!livePushed.products) showFallbackProducts(); }
}

async function loadSettings() {
  try {
    const r = await fetch('content/site-settings.json');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const d = await r.json();
    if (livePushed.settings) return;
    settings = Object.assign({}, settings, d);
  } catch(e) { console.warn('Settings fallback:', e); }
}

async function loadTheme() {
  try {
    const r = await fetch('content/theme.json');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const d = await r.json();
    if (livePushed.theme) return;
    if (d.colors) theme.colors = Object.assign({}, theme.colors, d.colors);
    if (d.fonts) theme.fonts = Object.assign({}, theme.fonts, d.fonts);
    if (d.layout) theme.layout = Object.assign({}, theme.layout, d.layout);
  } catch(e) { console.warn('Theme fallback:', e); }
}

async function loadSections() {
  try {
    const r = await fetch('content/sections.json');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const d = await r.json();
    if (livePushed.sections) return;
    sections = d.sections || {};
    sectionOrder = Array.isArray(d.order) ? d.order : Object.keys(sections);
  } catch(e) { console.warn('Sections fallback:', e);
    if (livePushed.sections) return;
    document.querySelectorAll('[data-section]').forEach(el => { sections[el.dataset.section] = { visible: true }; });
    if (!sectionOrder.length) sectionOrder = document.querySelectorAll('[data-section]').length ? Array.from(document.querySelectorAll('[data-section]')).map(el=>el.dataset.section) : [];
  }
}

async function loadCustomCSS() {
  try {
    const r = await fetch('content/custom-css.json');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const d = await r.json();
    if (livePushed.css) return;
    customCSS = d.css || '';
  } catch(e) { customCSS = ''; }
}

// ===== APPLIERS =====
const THEME_COLOR_ALIASES = {
  '--colour-jhalar-red': ['--red'],
  '--colour-jhalar-red-dark': ['--red-dark'],
  '--colour-jhalar-red-light': ['--red-light'],
  '--colour-accent-gold': ['--gold', '--gold-dark'],
  '--colour-deep-navy': ['--navy'],
  '--colour-warm-cream': ['--cream', '--cream-alt'],
  '--brand-background': ['--white', '--card-bg'],
  '--brand-alt-background': ['--off-white'],
  '--brand-text': ['--gray-700', '--body-text'],
  '--brand-muted': ['--gray-500', '--muted'],
  '--brand-heading': ['--gray-900', '--heading'],
  '--brand-border': ['--gray-100', '--gray-200'],
  '--brand-header-background': ['--header-bg'],
  '--brand-footer-background': ['--footer-bg'],
  '--brand-footer-text': ['--footer-text']
};

function applyTheme() {
  const root = document.documentElement;
  if (theme.colors) {
    Object.entries(theme.colors).forEach(([k,v]) => {
      if (!v) return;
      root.style.setProperty(k, v);
      const aliases = THEME_COLOR_ALIASES[k] || [];
      aliases.forEach(alias => root.style.setProperty(alias, v));
    });
  }
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
    if (l.headerHeight) root.style.setProperty('--header-h', l.headerHeight);
    if (l.buttonRadius) root.style.setProperty('--button-radius', l.buttonRadius);
    if (l.shadowIntensity) root.style.setProperty('--shadow-alpha', l.shadowIntensity);
    // typography
    if (l.headingWeight) {
      root.style.setProperty('--heading-weight', l.headingWeight);
      // Display headings (h1/h2) stay at least Bold so the hierarchy survives any weight choice
      const hw = Number(l.headingWeight) || 600;
      root.style.setProperty('--heading-weight-strong', String(Math.max(700, hw)));
    }
    if (l.headingTracking) root.style.setProperty('--heading-tracking', l.headingTracking);
    if (l.headingLeading) root.style.setProperty('--heading-leading', l.headingLeading);
    if (l.bodyWeight) root.style.setProperty('--body-weight', l.bodyWeight);
    if (l.bodyTracking) root.style.setProperty('--body-tracking', l.bodyTracking);
    if (l.bodyLeading) root.style.setProperty('--body-leading', l.bodyLeading);
    // Base font size scales the whole rem-based type scale proportionally
    if (l.baseFontSize) {
      root.style.setProperty('--fs-base', l.baseFontSize);
      root.style.fontSize = l.baseFontSize;
    }
    if (l.titleSize && l.titleSize !== 'fluid') root.style.setProperty('--title-size', l.titleSize);
    if (l.heroTitleSize && l.heroTitleSize !== 'fluid') root.style.setProperty('--hero-title-size', l.heroTitleSize);
    if (l.cardTitleSize && l.cardTitleSize !== 'fluid') root.style.setProperty('--card-title-size', l.cardTitleSize);
    // inner spacing
    if (l.cardPad) root.style.setProperty('--card-pad', l.cardPad);
    if (l.gridGap) root.style.setProperty('--grid-gap', l.gridGap);
    if (l.sectionHeaderGap) root.style.setProperty('--section-header-gap', l.sectionHeaderGap);
    if (l.sectionAlign) {
      root.style.setProperty('--section-align', l.sectionAlign);
      root.style.setProperty('--section-header-margin', l.sectionAlign === 'left' ? '0 0 var(--section-header-gap,3rem)' : '0 auto var(--section-header-gap,3rem)');
      root.style.setProperty('--section-subtitle-margin', l.sectionAlign === 'left' ? '0' : '0 auto');
      root.style.setProperty('--faq-margin', l.sectionAlign === 'left' ? '0' : '0 auto');
    }
    // rows / columns
    if (l.heroColumns) root.style.setProperty('--hero-cols', l.heroColumns === 'stack' ? '1fr' : '1.1fr .9fr');
    if (l.featureColumns) root.style.setProperty('--feature-cols', l.featureColumns);
    if (l.splitLayout) root.style.setProperty('--split-cols', l.splitLayout === 'stack' ? '1fr' : '1.1fr 1fr');
    if (l.aboutLayout) root.style.setProperty('--about-cols', l.aboutLayout === 'stack' ? '1fr' : '1fr 1.1fr');
    if (l.processColumns) root.style.setProperty('--process-cols', l.processColumns);
    if (l.contactLayout) root.style.setProperty('--contact-cols', l.contactLayout === 'stack' ? '1fr' : '1.15fr .85fr');
    if (l.trustLayout) root.style.setProperty('--trust-direction', l.trustLayout === 'stack' ? 'column' : 'row');
    if (l.faqWidth) root.style.setProperty('--faq-width', l.faqWidth);
    if (l.footerColumns) root.style.setProperty('--footer-cols', l.footerColumns === '2' ? '1.4fr 1fr' : (l.footerColumns === '3' ? '1.2fr 1fr 1fr' : '1.4fr 1fr 1.2fr 1fr'));
    if (l.featureGap) root.style.setProperty('--feature-gap', l.featureGap);
    if (l.productGap) root.style.setProperty('--product-gap', l.productGap);
    if (l.splitGap) root.style.setProperty('--split-gap', l.splitGap);
    if (l.processGap) root.style.setProperty('--process-gap', l.processGap);
    if (l.contactGap) root.style.setProperty('--contact-gap', l.contactGap);
    if (l.faqGap) root.style.setProperty('--faq-gap', l.faqGap);
    if (l.trustGap) root.style.setProperty('--trust-gap', l.trustGap);
    if (l.footerGap) root.style.setProperty('--footer-gap', l.footerGap);
    if (l.productPad) root.style.setProperty('--product-pad', l.productPad);
    if (l.faqPad) root.style.setProperty('--faq-pad', l.faqPad);
    if (l.footerPad) root.style.setProperty('--footer-pad', l.footerPad);
    if (l.trustPad) root.style.setProperty('--trust-pad', l.trustPad);
    root.style.setProperty('--grid-min', l.productColumns === '2' ? '380px' : (l.productColumns === '4' ? '260px' : '300px'));
  }
  const mt = document.querySelector('meta[name="theme-color"]');
  if (mt && theme.colors && theme.colors['--colour-jhalar-red']) mt.content = theme.colors['--colour-jhalar-red'];
  applyRevealMode();
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

function applySectionOrder() {
  const main = document.querySelector('main');
  if (!main || !Array.isArray(sectionOrder) || !sectionOrder.length) return;
  sectionOrder.forEach(key => {
    const el = main.querySelector(`[data-section="${key}"]`);
    if (el) main.appendChild(el);
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
    navList.innerHTML = settings.navItems.map(n => `<li><a href="${esc(n.href)}">${esc(n.label)}</a></li>`).join('');
  }
  // Mobile nav
  const mobileList = document.querySelector('.mobile-nav-list');
  if (mobileList && settings.navItems && settings.navItems.length) {
    mobileList.innerHTML = settings.navItems.map(n => `<li><a href="${esc(n.href)}" class="mobile-link">${esc(n.label)}</a></li>`).join('');
  }
  // Footer nav
  const footerList = document.querySelector('.footer-links ul');
  if (footerList && settings.footerNavItems) {
    const lines = settings.footerNavItems.map(n => `<li><a href="${esc(n.href)}">${esc(n.label)}</a></li>`);
    if (!lines.some(l => /privacy\.html/.test(l))) lines.push('<li><a href="privacy.html">Privacy Policy</a></li>');
    footerList.innerHTML = lines.join('');
  }
  // Social links
  const socialContainer = document.querySelector('.footer-social ul');
  if (socialContainer && settings.socialLinks) {
    socialContainer.innerHTML = '';
    const sl = settings.socialLinks;
    if (sl.instagram) socialContainer.innerHTML += `<li><a href="${esc(sl.instagram.url)}" aria-label="Instagram"><i class="fab fa-instagram"></i> ${esc(sl.instagram.label)}</a></li>`;
    if (sl.facebook) socialContainer.innerHTML += `<li><a href="${esc(sl.facebook.url)}" aria-label="Facebook"><i class="fab fa-facebook"></i> ${esc(sl.facebook.label)}</a></li>`;
    if (sl.whatsapp) socialContainer.innerHTML += `<li><a href="${esc(sl.whatsapp.url)}" data-wa target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i> ${esc(sl.whatsapp.label)}</a></li>`;
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
    {id:1,title:"Pink Pom Pom Gota Hanging",category:"Pom Pom Hangings",description:"Pink pom poms, gota fans and a finish bell — a bestseller for haldi, mehndi and wedding decor.",image:"assets/images/products/pom-pom-pink-gota.jpg",b2bTag:"Bestseller"},
    {id:7,title:"Marigold Floral Jhalar",category:"Floral Jhalars",description:"Full-petal orange marigold jhalar — the standard for Diwali, Durga Puja and weddings.",image:"assets/images/products/floral-marigold-orange.jpg",b2bTag:"Bulk-ready"},
    {id:5,title:"Pink Blossom Bell Hanging",category:"Bell Hangings",description:"Pink blossoms around a golden temple bell — a signature entrance piece.",image:"assets/images/products/bell-pink-blossom.jpg",b2bTag:"Bestseller"},
    {id:9,title:"Mogra Pearl Door Toran",category:"Torans",description:"Mogra-pearl toran with a bell centrepiece for doorways and stage frames.",image:"assets/images/products/toran-mogra.jpg",b2bTag:"Premium"}
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
    <div class="product-card" data-category="${esc(p.category)}">
      <div class="product-image"><img src="${esc(p.image)}" alt="${esc(p.title)} - ${esc(p.category)}" width="1080" height="1080" loading="lazy" decoding="async"></div>
      <div class="product-info">
        <span class="product-category">${esc(p.category)}</span>
        <h3 class="product-title">${esc(p.title)}</h3>
        <p class="product-desc">${esc(p.description)}</p>
        <span class="product-meta">${esc(p.b2bTag)}</span>
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

function svgIcon(name, cls, size) {
  return `<svg class="icon ${cls||''}" aria-hidden="true" width="${size||18}" height="${size||18}"><use href="assets/icons.svg#${esc(name||'icon-check')}"/></svg>`;
}

function setText(sel, text, asHtml) {
  const el = document.querySelector(sel);
  if (!el) return;
  el[asHtml ? 'innerHTML' : 'textContent'] = text == null ? '' : (asHtml ? text : esc(text));
}

function applySiteSettings() {
  const copy = settings.sectionCopy || {};

  document.querySelectorAll('[data-contact]').forEach(el => { const k = el.dataset.contact; if (settings[k]) el.textContent = settings[k]; });
  document.querySelectorAll('a[data-wa]').forEach(a => { a.href = `https://wa.me/${settings.whatsapp}`; });
  document.querySelectorAll('a[data-wa-msg]').forEach(a => { a.href = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(a.dataset.waMsg||'Hello JHALAR, I would like a B2B quotation.')}`; });
  document.querySelectorAll('a[data-tel]').forEach(a => { a.href = `tel:+${String(settings.whatsapp).replace(/\\D/g,'')}`; });
  document.querySelectorAll('a[data-mailto]').forEach(a => { a.href = `mailto:${settings.email}`; });

  // Hero
  if (settings.heroHeadline) setText('.hero-title', settings.heroHeadline);
  if (settings.heroIntro) setText('.hero-desc', settings.heroIntro);
  if (settings.heroImage) { const t = document.querySelector('.hero-img'); if (t) t.src = settings.heroImage; }
  if (copy.heroTag) { const tag = document.querySelector('.hero .tag'); if (tag) tag.innerHTML = svgIcon(copy.heroTag.icon, '', 18) + ' ' + esc(copy.heroTag.text); }
  const heroActions = document.querySelectorAll('.hero-actions a');
  if (copy.heroPrimary && heroActions[0]) { heroActions[0].textContent = copy.heroPrimary.label; heroActions[0].href = copy.heroPrimary.href || '#collection'; }
  if (copy.heroSecondary && heroActions[1]) {
    heroActions[1].innerHTML = '<i class="fab fa-whatsapp" aria-hidden="true"></i> ' + esc(copy.heroSecondary.label);
    heroActions[1].href = copy.heroSecondary.href || settings.socialLinks?.whatsapp?.url || `https://wa.me/${settings.whatsapp}`;
  }

  // Hero highlights
  if (Array.isArray(settings.heroHighlights) && settings.heroHighlights.length) {
    const ul = document.querySelector('.hero-highlights');
    if (ul) ul.innerHTML = settings.heroHighlights.map(h => `<li>${svgIcon(h.icon,'',18)} ${esc(h.text)}</li>`).join('');
  }

  // Trust bar
  if (Array.isArray(settings.trustItems) && settings.trustItems.length) {
    const bar = document.querySelector('.trust-bar-inner');
    if (bar) bar.innerHTML = settings.trustItems.map((t,i) => `${i ? '<div class="trust-bar-divider" aria-hidden="true"></div>' : ''}<div class="trust-bar-item">${svgIcon(t.icon,'',16)} ${esc(t.label)}</div>`).join('');
  }

  // Why JHALAR
  if (copy.why) {
    setText('#why-jhalar .eyebrow', copy.why.label);
    setText('#why-jhalar .section-title', copy.why.title);
    setText('#why-jhalar .section-subtitle', copy.why.intro);
    const grid = document.querySelector('#why-jhalar .feature-grid');
    if (grid && Array.isArray(copy.why.features)) {
      grid.innerHTML = copy.why.features.map(f => `
        <div class="feature-card">
          <div class="feature-icon">${svgIcon(f.icon,'',20)}</div>
          <h3>${esc(f.title)}</h3>
          <p>${esc(f.text)}</p>
        </div>
      `).join('');
    }
  }

  // Collection
  if (copy.collection) {
    setText('#collection .eyebrow', copy.collection.label);
    setText('#collection .section-title', copy.collection.title);
    setText('#collection .section-subtitle', copy.collection.intro);
    const note = document.querySelector('#collection .collection-note');
    if (note) note.innerHTML = esc(copy.collection.note) + ' <a href="https://wa.me/' + esc(settings.whatsapp) + '" data-wa target="_blank" rel="noopener">Message us on WhatsApp</a>';
  }

  // Custom orders
  if (copy.customOrders) {
    const cs = copy.customOrders;
    setText('#custom-orders .eyebrow', cs.label);
    setText('#custom-orders h2', cs.title);
    const customIntro = document.querySelector('#custom-orders .split-text > p');
    if (customIntro) customIntro.textContent = cs.intro;
    if (cs.image) { const img = document.querySelector('#custom-orders .split-img'); if (img) img.src = cs.image; }
    const chips = document.querySelector('#custom-orders .chips');
    if (chips && Array.isArray(cs.chips)) chips.innerHTML = cs.chips.map(c => `<span class="chip">${svgIcon(c.icon,'',16)} ${esc(c.text)}</span>`).join('');
    const pl = document.querySelector('#custom-orders .process-label');
    if (pl) pl.innerHTML = svgIcon('icon-route','',18) + ' ' + esc(cs.processLabel || 'How it works');
    const steps = document.querySelector('#custom-orders .process-grid');
    if (steps && Array.isArray(cs.steps)) {
      steps.innerHTML = cs.steps.map((s,i) => `
        <div class="step">
          <div class="step-num">${String(i+1).padStart(2,'0')}</div>
          <div><div class="step-title">${esc(s.title)}</div><p class="step-desc">${esc(s.text)}</p></div>
        </div>
      `).join('');
    }
  }

  // About
  if (copy.about) {
    const ab = copy.about;
    setText('#about .eyebrow', ab.label);
    setText('#about h2', ab.title);
    const aboutIntro = document.querySelector('#about .split-text > p');
    if (aboutIntro) aboutIntro.textContent = ab.intro;
    if (ab.image) { const img = document.querySelector('#about .split-img'); if (img) img.src = ab.image; }
    const vals = document.querySelector('#about .values');
    if (vals && Array.isArray(ab.values)) vals.innerHTML = ab.values.map(v => `<li>${svgIcon(v.icon,'',20)} ${esc(v.text)}</li>`).join('');
  }

  // FAQ
  if (copy.faq) {
    setText('#faq .eyebrow', copy.faq.label);
    setText('#faq .section-title', copy.faq.title);
  }
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

  // Contact
  if (copy.contact) {
    setText('#contact .eyebrow', copy.contact.label);
    setText('#contact h2', copy.contact.title);
    setText('#contact .section-subtitle', copy.contact.intro);
  }

  // Footer
  if (copy.footerTagline) setText('.footer-tagline', copy.footerTagline);
}
function updateYear() { const e = document.getElementById('current-year'); if (e) e.textContent = String(new Date().getFullYear()); }

function applyRevealMode() {
  const off = theme.layout?.revealAnimation === false;
  document.body.classList.toggle('no-reveal', off);
  if (off) document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
  else document.querySelectorAll('.reveal').forEach(el => el.classList.remove('active'));
}

function setupReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const fn = () => {
    if (document.body.classList.contains('no-reveal')) return;
    els.forEach(el => { if (el.getBoundingClientRect().top < window.innerHeight - 150) el.classList.add('active'); });
  };
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
    const lines = ['*New B2B Enquiry - JHALAR Website*','',`*Name:* ${v('name')}`];
    if (v('company')) lines.push(`*Company:* ${v('company')}`);
    lines.push(`*Buyer Type:* ${v('buyer-type')}`,`*Phone:* ${v('phone')}`);
    if (v('email')) lines.push(`*Email:* ${v('email')}`);
    lines.push(`*City/State:* ${v('location')}`,`*Category:* ${v('category')}`);
    if (v('quantity')) lines.push(`*Quantity:* ${v('quantity')}`);
    if (v('date')) lines.push(`*Date Required:* ${v('date')}`);
    if (v('details')) lines.push(`*Details:* ${v('details')}`);
    window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(lines.join('\\n'))}`, '_blank', 'noopener');
    const st = document.getElementById('form-status');
    if (st) { st.textContent = 'WhatsApp opened with your enquiry pre-filled - just press send.'; st.classList.add('visible'); }
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
  setSettings: (ns) => { livePushed.settings = true; settings = Object.assign({}, settings, ns); applySiteSettings(); applyNavigation(); applySEO(); try { localStorage.setItem('jhalar_settings', JSON.stringify(settings)); } catch(e){} },
  setTheme: (nt) => {
    livePushed.theme = true;
    if (nt.colors) theme.colors = Object.assign({}, theme.colors, nt.colors);
    if (nt.fonts) theme.fonts = Object.assign({}, theme.fonts, nt.fonts);
    if (nt.layout) theme.layout = Object.assign({}, theme.layout, nt.layout);
    applyTheme();
    try { localStorage.setItem('jhalar_theme', JSON.stringify(theme)); } catch(e){}
  },
  setProducts: (np) => { livePushed.products = true; products = Array.isArray(np) ? np : []; renderProducts(products); setupFilterButtons(); try { localStorage.setItem('jhalar_products', JSON.stringify(products)); } catch(e){} },
  setSections: (ns) => {
    livePushed.sections = true;
    if (ns && ns.sections) { sections = ns.sections; if (Array.isArray(ns.order)) sectionOrder = ns.order; }
    else sections = ns || {};
    applySectionVisibility();
    applySectionOrder();
    try { localStorage.setItem('jhalar_sections', JSON.stringify(sections)); localStorage.setItem('jhalar_section_order', JSON.stringify(sectionOrder)); } catch(e){}
  },
  setCustomCSS: (css) => { livePushed.css = true; customCSS = css || ''; applyCustomCSS(); try { localStorage.setItem('jhalar_custom_css', css); } catch(e){} }
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
