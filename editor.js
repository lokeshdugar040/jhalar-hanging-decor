// ============================================
// JHALAR Pro Editor
// ============================================
const GITHUB_OWNER = 'lokeshdugar040', GITHUB_REPO = 'jhalar-hanging-decor', GITHUB_BRANCH = 'main';
const FILES_TO_PUBLISH = ['content/site-settings.json','content/theme.json','content/products.json','content/sections.json','content/custom-css.json'];

let state = {
  settings: null, theme: null, products: [], sections: {}, sectionOrder: [],
  customCSS: '', navItems: [], footerNavItems: [], socialLinks: {},
  imageManifest: [], fontManifest: [], selectedProductId: null, viewport: 'desktop',
  changed: false, githubToken: null, darkMode: false,
  heroHighlights: [], trustItems: [], faqItems: []
};
let history = { stack: [], index: -1 };

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
  setupTabs(); setupViewport(); setupAutoSave(); setupKeyboardShortcuts(); setupDragDrop();
  setupUploadZone(); restoreDarkMode(); restoreGitHubToken();
  await loadPublishedData(); await loadImageManifest(); await loadFontManifest();
  populateAllForms(); renderSectionList(); renderProductList(); renderMediaGrid(); populateFontOptions();
  applyPreview(); updatePreviewUrl(); pushHistory();
});

// ===== TABS =====
function setupTabs() {
  document.querySelectorAll('.sidebar-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active'); tab.setAttribute('aria-selected','true');
      const p = document.getElementById('panel-'+tab.dataset.tab); if (p) p.classList.add('active');
    });
  });
}
function openPublishTab() { document.querySelector('.sidebar-tab[data-tab="publish"]').click(); }

// ===== VIEWPORT =====
function setupViewport() {}
function setViewport(m) {
  state.viewport = m;
  document.querySelectorAll('.vp-btn').forEach(b => b.classList.toggle('active', b.dataset.vp === m));
  const f = document.getElementById('preview-frame');
  f.className = m === 'tablet' ? 'mobile' : m;
  if (m === 'tablet') { f.style.width = '768px'; f.style.height = '1024px'; }
  else { f.style.width = ''; f.style.height = ''; }
}

// ===== DARK MODE =====
function restoreDarkMode() {
  try { state.darkMode = localStorage.getItem('jhalar_editor_dark') === 'true'; } catch(e) {}
  if (state.darkMode) { document.documentElement.classList.add('dark'); document.getElementById('dark-mode-btn').classList.add('active'); }
}
function toggleDarkMode() {
  state.darkMode = !state.darkMode;
  document.documentElement.classList.toggle('dark', state.darkMode);
  document.getElementById('dark-mode-btn').classList.toggle('active', state.darkMode);
  try { localStorage.setItem('jhalar_editor_dark', String(state.darkMode)); } catch(e) {}
}

// ===== KEYBOARD SHORTCUTS =====
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); publishToGitHub(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) { e.preventDefault(); redo(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') { e.preventDefault(); previewChanges(); }
  });
}

// ===== LOAD DATA =====
async function loadPublishedData() {
  try {
    const ds = localStorage.getItem('jhalar_editor_settings');
    const dt = localStorage.getItem('jhalar_editor_theme');
    const dp = localStorage.getItem('jhalar_editor_products');
    const dsec = localStorage.getItem('jhalar_editor_sections');
    const dcss = localStorage.getItem('jhalar_editor_customcss');

    const [sr,tr,pr,secr,ccr] = await Promise.all([
      fetch('content/site-settings.json'), fetch('content/theme.json'),
      fetch('content/products.json'), fetch('content/sections.json'),
      fetch('content/custom-css.json')
    ]);

    const ps = sr.ok ? await sr.json() : {};
    const pt = tr.ok ? await tr.json() : {};
    const pp = pr.ok ? await pr.json() : {products:[]};
    const psec = secr.ok ? await secr.json() : {sections:{},order:[]};
    const pcc = ccr.ok ? await ccr.json() : {css:''};

    state.settings = ds ? JSON.parse(ds) : ps;
    state.theme = dt ? JSON.parse(dt) : pt;
    state.products = dp ? JSON.parse(dp) : (pp.products||[]);
    state.sections = dsec ? JSON.parse(dsec) : (psec.sections||{});
    state.sectionOrder = psec.order||[];
    state.customCSS = dcss ? dcss : (pcc.css||'');
    state.navItems = state.settings.navItems||[];
    state.footerNavItems = state.settings.footerNavItems||[];
    state.socialLinks = state.settings.socialLinks||{};
    state.heroHighlights = state.settings.heroHighlights||[{text:'Bulk-ready supply',icon:'icon-check'},{text:'Custom colours',icon:'icon-palette'},{text:'Fast quotations',icon:'icon-clock'}];
    state.trustItems = state.settings.trustItems||[{label:'Direct Manufacturer',icon:'icon-mfr'},{label:'Custom Designs',icon:'icon-design'},{label:'Bulk & Wholesale',icon:'icon-bulk'}];
    state.faqItems = state.settings.faqItems||[
      {q:'Do you supply decorative hangings in bulk?',a:'Yes, we focus on bulk supply requirements for event decorators, wholesalers, retailers, and organisations.'},
      {q:'Can I discuss custom colours and designs?',a:'Custom colour and design discussions are available for suitable order quantities. Share your project requirements with us.'},
      {q:'How can I enquire about a product collection?',a:'You can use the B2B enquiry form or contact us directly on WhatsApp.'},
      {q:'Do you work with wholesalers and distributors?',a:'Yes, we supply wholesalers and distributors. Please provide your business details and expected quantity requirements.'}
    ];

    ensureProductIds();
    if (ds||dt||dp||dsec||dcss) { state.changed = true; updateSaveIndicator(); }
  } catch(e) { console.error('Load failed:', e); showToast('Failed to load site data.','error'); }
}

function ensureProductIds() {
  let m = 0; state.products.forEach(p => { if (p.id && p.id > m) m = p.id; });
  state.products.forEach(p => { if (!p.id) p.id = ++m; });
}

// ===== FONT MANIFEST =====
async function loadFontManifest() {
  try {
    const r = await fetch('assets/fonts/manifest.json');
    state.fontManifest = r.ok ? (await r.json()).fonts||[] : [];
  } catch(e) { console.warn('Font manifest:', e); state.fontManifest = []; }
}

function isFontFile(file) {
  const ext = (file.name.split('.').pop()||'').toLowerCase();
  return ['ttf','otf','woff','woff2'].includes(ext) ||
         /font\//.test(file.type);
}
function fontFormat(ext) {
  if (ext === 'woff2') return 'woff2';
  if (ext === 'woff') return 'woff';
  if (ext === 'otf') return 'opentype';
  return 'truetype';
}
function familyFromFilename(name) {
  let stem = name.replace(/\.(ttf|otf|woff2?)$/i,'');
  stem = stem.replace(/[_-]+/g,' ').replace(/\s+/g,' ').trim();
  return stem.replace(/\b\w/g, c => c.toUpperCase());
}
function populateFontOptions() {
  const extra = state.fontManifest.map(f => ({
    family: f.family,
    heading: `'${f.family}', Georgia, 'Times New Roman', serif`,
    body: `'${f.family}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
  }));
  const headSel = document.getElementById('ed-font-heading');
  const bodySel = document.getElementById('ed-font-body');
  if (!headSel || !bodySel) return;
  const curH = headSel.value, curB = bodySel.value;
  extra.forEach(f => {
    if (![...headSel.options].some(o => o.value === f.heading))
      headSel.add(new Option(`${f.family} (self-hosted)`, f.heading));
    if (![...bodySel.options].some(o => o.value === f.body))
      bodySel.add(new Option(`${f.family} (self-hosted)`, f.body));
  });
  if (curH) headSel.value = curH;
  if (curB) bodySel.value = curB;
}

// ===== IMAGE MANIFEST =====
async function loadImageManifest() {
  try {
    const r = await fetch('assets/images/manifest.json');
    state.imageManifest = r.ok ? (await r.json()).images||[] : [
      'assets/images/about-collage.jpg','assets/images/custom-orders.jpg','assets/images/hero-jhalar.jpg','assets/images/og-cover.jpg',
      'assets/images/products/pom-pom-pink-gota.jpg','assets/images/products/pom-pom-green-gota.jpg',
      'assets/images/products/bead-pearl-white.jpg','assets/images/products/bead-mogra-pearl.jpg',
      'assets/images/products/bell-pink-blossom.jpg','assets/images/products/bell-rose-leaf.jpg',
      'assets/images/products/floral-marigold-orange.jpg','assets/images/products/floral-red-white.jpg',
      'assets/images/products/toran-mogra.jpg','assets/images/products/toran-bandhanwar.jpg',
      'assets/images/products/tassel-tricolour.jpg','assets/images/products/tassel-red-floral.jpg',
      'assets/images/products/string-golden-bead.jpg','assets/images/products/string-temple-bell.jpg',
      'assets/images/products/custom-emerald-gota.jpg','assets/images/products/custom-sapphire.jpg'
    ];
    populateImageDropdowns();
  } catch(e) { console.warn('Manifest:', e); }
}

function populateImageDropdowns() {
  const opts = state.imageManifest.map(p => `<option value="${p}">${p.split('/').pop()}</option>`).join('');
  ['ed-prod-image','ed-hero-image','ed-seo-ogimage'].forEach(id => { const el = document.getElementById(id); if (el) el.innerHTML = opts; });
}

// ===== POPULATE ALL FORMS =====
function populateAllForms() {
  if (!state.settings) return;
  setVal('ed-whatsapp', state.settings.whatsapp||'');
  setVal('ed-phone', state.settings.phone||'');
  setVal('ed-email', state.settings.email||'');
  setVal('ed-location', state.settings.location||'');
  setVal('ed-gst', state.settings.gst||'');
  setVal('ed-hero-headline', state.settings.heroHeadline||'');
  setVal('ed-hero-intro', state.settings.heroIntro||'');
  setVal('ed-hero-image', state.settings.heroImage||'assets/images/hero-jhalar.jpg');
  setVal('ed-social-instagram', state.socialLinks.instagram?.url||'');
  setVal('ed-social-facebook', state.socialLinks.facebook?.url||'');
  setVal('ed-social-whatsapp', state.socialLinks.whatsapp?.url||'');
  setVal('ed-seo-title', state.settings.siteTitle||'');
  setVal('ed-seo-desc', state.settings.siteDescription||'');
  setVal('ed-seo-ogimage', state.settings.ogImage||'assets/images/og-cover.jpg');
  setVal('ed-custom-css', state.customCSS||'');
  setVal('ed-layout-fs-base', state.theme?.layout?.baseFontSize || '16px');
  setVal('ed-layout-section-y', parseInt(state.theme?.layout?.sectionY || '64px', 10) || 64);
  setVal('ed-layout-radius', parseInt(state.theme?.layout?.cardRadius || '20px', 10) || 20);
  setVal('ed-layout-container', parseInt(state.theme?.layout?.containerWidth || '1140px', 10) || 1140);
  const sy = getVal('ed-layout-section-y'), rl = getVal('ed-layout-radius'), ct = getVal('ed-layout-container');
  const h1 = document.getElementById('help-section-y'); if (h1) h1.textContent = sy;
  const h2 = document.getElementById('help-radius'); if (h2) h2.textContent = rl;
  const h3 = document.getElementById('help-container'); if (h3) h3.textContent = ct;
  renderNavEditor();
  renderFooterNavEditor();
  renderHighlightEditor();
  renderTrustEditor();
  renderFaqEditor();
  if (state.theme) {
    if (state.theme.colors) {
      setVal('ed-color-red', state.theme.colors['--colour-jhalar-red']||'#C82039');
      setVal('ed-color-red-dark', state.theme.colors['--colour-jhalar-red-dark']||'#A3182E');
      setVal('ed-color-red-light', state.theme.colors['--colour-jhalar-red-light']||'#E8485F');
      setVal('ed-color-gold', state.theme.colors['--colour-accent-gold']||'#C9A84C');
      setVal('ed-color-navy', state.theme.colors['--colour-deep-navy']||'#141942');
      setVal('ed-color-cream', state.theme.colors['--colour-warm-cream']||'#FFFAF1');
    }
    if (state.theme.fonts) {
      setVal('ed-font-heading', state.theme.fonts.heading||"'Playfair Display', Georgia, 'Times New Roman', serif");
      setVal('ed-font-body', state.theme.fonts.body||"'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif");
    }
  }
}

// ===== NAV EDITOR =====
function renderNavEditor() {
  const c = document.getElementById('nav-editor'); if (!c) return;
  c.innerHTML = state.navItems.map((n,i) => `
    <div class="nav-item-row" data-index="${i}">
      <span style="cursor:grab;color:var(--text3);font-size:12px"><i class="fas fa-grip-vertical"></i></span>
      <input type="text" class="nav-label" value="${escapeHtml(n.label)}" placeholder="Label">
      <input type="text" class="nav-href" value="${escapeHtml(n.href)}" placeholder="#section">
      <button class="del" onclick="removeNavItem(${i})"><i class="fas fa-times"></i></button>
    </div>
  `).join('');
  c.querySelectorAll('.nav-label').forEach((inp,i) => inp.addEventListener('input', () => { state.navItems[i].label = inp.value; markChanged(); saveDrafts(); applyPreview(); }));
  c.querySelectorAll('.nav-href').forEach((inp,i) => inp.addEventListener('input', () => { state.navItems[i].href = inp.value; markChanged(); saveDrafts(); applyPreview(); }));
}
function addNavItem() { state.navItems.push({label:'New Link',href:'#'}); renderNavEditor(); markChanged(); saveDrafts(); applyPreview(); }
function removeNavItem(i) { state.navItems.splice(i,1); renderNavEditor(); markChanged(); saveDrafts(); applyPreview(); }

// ===== FOOTER NAV EDITOR =====
function renderFooterNavEditor() {
  const c = document.getElementById('footer-nav-editor'); if (!c) return;
  c.innerHTML = state.footerNavItems.map((n,i) => `
    <div class="nav-item-row" data-index="${i}">
      <span style="cursor:grab;color:var(--text3);font-size:12px"><i class="fas fa-grip-vertical"></i></span>
      <input type="text" class="fnav-label" value="${escapeHtml(n.label)}" placeholder="Label">
      <input type="text" class="fnav-href" value="${escapeHtml(n.href)}" placeholder="#section">
      <button class="del" onclick="removeFooterNavItem(${i})"><i class="fas fa-times"></i></button>
    </div>
  `).join('');
  c.querySelectorAll('.fnav-label').forEach((inp,i) => inp.addEventListener('input', () => { state.footerNavItems[i].label = inp.value; markChanged(); saveDrafts(); applyPreview(); }));
  c.querySelectorAll('.fnav-href').forEach((inp,i) => inp.addEventListener('input', () => { state.footerNavItems[i].href = inp.value; markChanged(); saveDrafts(); applyPreview(); }));
}
function addFooterNavItem() { state.footerNavItems.push({label:'New Link',href:'#'}); renderFooterNavEditor(); markChanged(); saveDrafts(); applyPreview(); }
function removeFooterNavItem(i) { state.footerNavItems.splice(i,1); renderFooterNavEditor(); markChanged(); saveDrafts(); applyPreview(); }

// ===== HIGHLIGHT EDITOR =====
const ICON_OPTIONS = ['icon-mfr','icon-palette','icon-bulk','icon-check','icon-clock','icon-design','icon-ruler','icon-chart','icon-route','icon-phone','icon-email','icon-location','icon-invoice'];
function renderHighlightEditor() {
  const c = document.getElementById('highlight-editor'); if (!c) return;
  c.innerHTML = state.heroHighlights.map((h,i) => `
    <div class="nav-item-row" data-index="${i}">
      <select class="hl-icon" style="width:110px;flex:none">
        ${ICON_OPTIONS.map(ic => `<option value="${ic}" ${h.icon===ic?'selected':''}>${ic.replace('icon-','')}</option>`).join('')}
      </select>
      <input type="text" class="hl-text" value="${escapeHtml(h.text)}" placeholder="Highlight text">
      <button class="del" onclick="removeHighlight(${i})"><i class="fas fa-times"></i></button>
    </div>
  `).join('');
  c.querySelectorAll('.hl-icon').forEach((sel,i) => sel.addEventListener('change', () => { state.heroHighlights[i].icon = sel.value; markChanged(); saveDrafts(); applyPreview(); }));
  c.querySelectorAll('.hl-text').forEach((inp,i) => inp.addEventListener('input', () => { state.heroHighlights[i].text = inp.value; markChanged(); saveDrafts(); applyPreview(); }));
}
function addHighlight() { state.heroHighlights.push({text:'New highlight',icon:'icon-check'}); renderHighlightEditor(); markChanged(); saveDrafts(); applyPreview(); }
function removeHighlight(i) { state.heroHighlights.splice(i,1); renderHighlightEditor(); markChanged(); saveDrafts(); applyPreview(); }

// ===== TRUST EDITOR =====
function renderTrustEditor() {
  const c = document.getElementById('trust-editor'); if (!c) return;
  c.innerHTML = state.trustItems.map((t,i) => `
    <div class="nav-item-row" data-index="${i}">
      <select class="tr-icon" style="width:110px;flex:none">
        ${ICON_OPTIONS.map(ic => `<option value="${ic}" ${t.icon===ic?'selected':''}>${ic.replace('icon-','')}</option>`).join('')}
      </select>
      <input type="text" class="tr-label" value="${escapeHtml(t.label)}" placeholder="Label">
      <button class="del" onclick="removeTrustItem(${i})"><i class="fas fa-times"></i></button>
    </div>
  `).join('');
  c.querySelectorAll('.tr-icon').forEach((sel,i) => sel.addEventListener('change', () => { state.trustItems[i].icon = sel.value; markChanged(); saveDrafts(); applyPreview(); }));
  c.querySelectorAll('.tr-label').forEach((inp,i) => inp.addEventListener('input', () => { state.trustItems[i].label = inp.value; markChanged(); saveDrafts(); applyPreview(); }));
}
function addTrustItem() { state.trustItems.push({label:'New item',icon:'icon-check'}); renderTrustEditor(); markChanged(); saveDrafts(); applyPreview(); }
function removeTrustItem(i) { state.trustItems.splice(i,1); renderTrustEditor(); markChanged(); saveDrafts(); applyPreview(); }

// ===== FAQ EDITOR =====
function renderFaqEditor() {
  const c = document.getElementById('faq-editor'); if (!c) return;
  c.innerHTML = state.faqItems.map((f,i) => `
    <div class="faq-row" style="border:1px solid rgba(128,128,128,0.15);border-radius:var(--r-sm);padding:8px;margin-bottom:6px">
      <div class="form-group" style="margin-bottom:4px"><label>Question</label><input type="text" class="faq-q" value="${escapeHtml(f.q)}"></div>
      <div class="form-group" style="margin-bottom:4px"><label>Answer</label><textarea class="faq-a" rows="2">${escapeHtml(f.a)}</textarea></div>
      <button class="btn-sm danger" onclick="removeFaqItem(${i})" style="width:100%;justify-content:center"><i class="fas fa-trash"></i> Remove</button>
    </div>
  `).join('');
  c.querySelectorAll('.faq-q').forEach((inp,i) => inp.addEventListener('input', () => { state.faqItems[i].q = inp.value; markChanged(); saveDrafts(); applyPreview(); }));
  c.querySelectorAll('.faq-a').forEach((inp,i) => inp.addEventListener('input', () => { state.faqItems[i].a = inp.value; markChanged(); saveDrafts(); applyPreview(); }));
}
function addFaqItem() { state.faqItems.push({q:'New question?',a:'Answer text.'}); renderFaqEditor(); markChanged(); saveDrafts(); applyPreview(); }
function removeFaqItem(i) { state.faqItems.splice(i,1); renderFaqEditor(); markChanged(); saveDrafts(); applyPreview(); }

// ===== SECTION LIST =====
function renderSectionList() {
  const c = document.getElementById('section-list'); if (!c) return;
  if (!state.sectionOrder.length) { c.innerHTML = '<p style="color:var(--text3);font-size:12px;text-align:center;padding:16px;">No sections configured.</p>'; return; }
  c.innerHTML = state.sectionOrder.map((key,i) => {
    const s = state.sections[key]; if (!s) return '';
    const v = s.visible !== false;
    return `<div class="section-item" draggable="true" data-key="${key}" data-index="${i}">
      <button class="toggle ${v?'active':''}" onclick="toggleSection('${key}')"></button>
      <div class="info"><div class="name">${escapeHtml(s.label||key)}</div><div class="status">${v?'Visible':'Hidden'} · ${key}</div></div>
      <div class="drag-handle"><i class="fas fa-grip-vertical"></i></div>
    </div>`;
  }).join('');
}
function toggleSection(key) {
  if (!state.sections[key]) return;
  state.sections[key].visible = state.sections[key].visible === false;
  renderSectionList(); markChanged(); saveDrafts(); applyPreview();
  showToast(`${state.sections[key].label||key} ${state.sections[key].visible?'visible':'hidden'}`, 'success');
}

// ===== DRAG & DROP =====
function setupDragDrop() {
  let dragSrc = null;
  document.addEventListener('dragstart', e => {
    const item = e.target.closest('.section-item');
    if (!item) return;
    dragSrc = item.dataset.key;
    item.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  });
  document.addEventListener('dragend', e => {
    document.querySelectorAll('.section-item').forEach(el => el.classList.remove('dragging','drag-over'));
  });
  document.addEventListener('dragover', e => {
    const item = e.target.closest('.section-item');
    if (!item || item.dataset.key === dragSrc) return;
    e.preventDefault();
    document.querySelectorAll('.section-item').forEach(el => el.classList.remove('drag-over'));
    item.classList.add('drag-over');
  });
  document.addEventListener('drop', e => {
    e.preventDefault();
    const target = e.target.closest('.section-item');
    if (!target || !dragSrc || target.dataset.key === dragSrc) return;
    const from = state.sectionOrder.indexOf(dragSrc);
    const to = state.sectionOrder.indexOf(target.dataset.key);
    if (from === -1 || to === -1) return;
    state.sectionOrder.splice(from, 1);
    state.sectionOrder.splice(to, 0, dragSrc);
    renderSectionList(); markChanged(); saveDrafts(); applyPreview();
    showToast('Section reordered', 'success');
  });
}

// ===== PRODUCT LIST =====
function renderProductList() {
  const c = document.getElementById('product-list'); if (!c) return;
  if (!state.products.length) { c.innerHTML = '<p style="color:var(--text3);font-size:12px;text-align:center;padding:16px;">No products. Click <strong>Add</strong> to create one.</p>'; return; }
  c.innerHTML = state.products.map((p,i) => `
    <div class="product-list-item ${state.selectedProductId===p.id?'active':''}" data-id="${p.id}" data-index="${i}">
      <img class="thumb" src="${p.image||'assets/images/og-cover.jpg'}" alt="" onerror="this.src='assets/images/og-cover.jpg'">
      <div class="info"><div class="name">${escapeHtml(p.title||'Untitled')}</div><div class="cat">${p.category||'Uncategorised'}</div></div>
      <div class="actions">
        <button onclick="event.stopPropagation();moveProduct(${p.id},-1)" title="Up"><i class="fas fa-chevron-up"></i></button>
        <button onclick="event.stopPropagation();moveProduct(${p.id},1)" title="Down"><i class="fas fa-chevron-down"></i></button>
        <button class="del" onclick="event.stopPropagation();deleteProduct(${p.id})" title="Delete"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');
  c.querySelectorAll('.product-list-item').forEach(el => el.addEventListener('click', () => selectProduct(Number(el.dataset.id))));
  if (state.selectedProductId === null && state.products.length > 0) selectProduct(state.products[0].id);
}

function selectProduct(id) {
  state.selectedProductId = id;
  const p = state.products.find(x => x.id === id); if (!p) return;
  document.querySelectorAll('.product-list-item').forEach(el => el.classList.toggle('active', Number(el.dataset.id) === id));
  const ed = document.getElementById('product-editor'); ed.style.display = 'block';
  setVal('ed-prod-title', p.title||'');
  setVal('ed-prod-category', p.category||'');
  setVal('ed-prod-description', p.description||'');
  setVal('ed-prod-b2b', p.b2bTag||'');
  setVal('ed-prod-image', p.image||'assets/images/og-cover.jpg');
  ['ed-prod-title','ed-prod-category','ed-prod-description','ed-prod-b2b','ed-prod-image'].forEach(fid => {
    const el = document.getElementById(fid);
    if (el) { el.removeEventListener('input', onProductChange); el.removeEventListener('change', onProductChange); el.addEventListener('input', onProductChange); el.addEventListener('change', onProductChange); }
  });
}
function onProductChange() {
  const p = state.products.find(x => x.id === state.selectedProductId); if (!p) return;
  p.title = getVal('ed-prod-title'); p.category = getVal('ed-prod-category');
  p.description = getVal('ed-prod-description'); p.b2bTag = getVal('ed-prod-b2b'); p.image = getVal('ed-prod-image');
  renderProductList(); markChanged(); saveDrafts(); applyPreview();
}
function addProduct() {
  const m = state.products.reduce((a,p) => Math.max(a,p.id||0),0);
  state.products.push({id:m+1,title:'New Product',category:'Custom Designs',description:'Describe this product…',image:'assets/images/og-cover.jpg',b2bTag:'New Arrival'});
  renderProductList(); selectProduct(state.products[state.products.length-1].id); markChanged(); saveDrafts(); applyPreview();
  showToast('Product added','success');
}
function duplicateProduct() {
  const o = state.products.find(p => p.id === state.selectedProductId);
  if (!o) { showToast('Select a product first','error'); return; }
  const m = state.products.reduce((a,p) => Math.max(a,p.id||0),0);
  const c = JSON.parse(JSON.stringify(o)); c.id = m+1; c.title = o.title+' (Copy)';
  state.products.push(c); renderProductList(); selectProduct(c.id); markChanged(); saveDrafts(); applyPreview();
  showToast('Product duplicated','success');
}
function deleteProduct(id) {
  if (state.products.length <= 1) { showToast('Cannot delete the last product','error'); return; }
  const i = state.products.findIndex(p => p.id === id); if (i===-1) return;
  state.products.splice(i,1);
  if (state.selectedProductId === id) state.selectedProductId = state.products.length > 0 ? state.products[Math.min(i,state.products.length-1)].id : null;
  renderProductList(); if (state.selectedProductId === null) document.getElementById('product-editor').style.display = 'none';
  markChanged(); saveDrafts(); applyPreview(); showToast('Product deleted','success');
}
function moveProduct(id, d) {
  const i = state.products.findIndex(p => p.id === id); if (i===-1) return;
  const n = i + d; if (n < 0 || n >= state.products.length) return;
  [state.products[i], state.products[n]] = [state.products[n], state.products[i]];
  renderProductList(); markChanged(); saveDrafts(); applyPreview();
}
function exportProducts() { downloadFile(JSON.stringify({products:state.products},null,2),'products-export.json','application/json'); showToast('Products exported','success'); }
function importProducts(e) {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      if (data.products && Array.isArray(data.products)) {
        state.products = data.products; ensureProductIds();
        renderProductList(); markChanged(); saveDrafts(); applyPreview();
        showToast(`Imported ${state.products.length} products`,'success');
      } else showToast('Invalid format','error');
    } catch(e) { showToast('Invalid JSON','error'); }
  };
  reader.readAsText(file);
  e.target.value = '';
}

// ===== MEDIA =====
function renderMediaGrid() {
  const c = document.getElementById('media-grid'); if (!c) return;
  c.innerHTML = state.imageManifest.map(p => {
    const fn = p.split('/').pop();
    const escapedP = p.replace(/'/g, "\\'");
    return `<div class="media-item" onclick="selectMedia('${escapedP}')" title="${fn}">
      <img src="${p}" alt="${fn}" loading="lazy" onerror="this.closest('.media-item').innerHTML='<span style=display:flex;align-items:center;justify-content:center;height:100%;color:gray;font-size:10px>Error</span>'">
      <button class="del-overlay" onclick="event.stopPropagation();deleteMedia('${escapedP}')"><i class="fas fa-times"></i></button>
    </div>`;
  }).join('');
}
function selectMedia(path) {
  document.querySelectorAll('.media-item').forEach(el => el.classList.toggle('active', el.querySelector('img')?.src?.includes(path)));
}
function triggerUpload() { document.getElementById('file-input').click(); }
function setupUploadZone() {
  const zone = document.getElementById('upload-zone');
  if (!zone) return;
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.style.borderColor = 'var(--red)'; });
  zone.addEventListener('dragleave', () => { zone.style.borderColor = ''; });
  zone.addEventListener('drop', e => { e.preventDefault(); zone.style.borderColor = ''; handleFiles(e.dataTransfer.files); });
}
async function handleUpload(e) { handleFiles(e.target.files); e.target.value = ''; }
// ===== GITHUB COMMIT HELPER (retries non-fast-forward races) =====
async function createCommitWithRetry(token, entries, message, onLog) {
  const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' };
  const baseUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;
  let lastErr = null;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      if (onLog && attempt > 1) onLog(`Retry ${attempt}/5 — branch moved, rebuilding...`, 'act');
      const br = await fetch(`${baseUrl}/git/ref/heads/${GITHUB_BRANCH}`, {headers});
      if (!br.ok) throw new Error(`Failed to get branch: ${br.status}`);
      const bd = await br.json();
      const currentSha = bd.object.sha;
      if (onLog && attempt === 1) onLog(`Branch: ${currentSha.substring(0,7)}`, 'done');
      const commitResp = await fetch(`${baseUrl}/git/commits/${currentSha}`, {headers});
      if (!commitResp.ok) throw new Error(`Commit error: ${commitResp.status}`);
      const cd = await commitResp.json();
      if (onLog && attempt === 1) onLog(`Tree: ${cd.tree.sha.substring(0,7)}`, 'done');
      const blobs = [];
      for (const e of entries) {
        if (onLog) onLog(`Blob: ${e.path}...`, 'act');
        const body = e.base64 ? {content:e.base64, encoding:'base64'} : {content:e.content, encoding:'utf-8'};
        const blobResp = await fetch(`${baseUrl}/git/blobs`, { method:'POST', headers, body: JSON.stringify(body) });
        if (!blobResp.ok) throw new Error(`Blob error for ${e.path}: ${blobResp.status}`);
        const blob = await blobResp.json();
        blobs.push({path:e.path, mode:'100644', type:'blob', sha:blob.sha});
        if (onLog) onLog(`  ${e.path} ✓`, 'done');
      }
      const treeResp = await fetch(`${baseUrl}/git/trees`, { method:'POST', headers, body: JSON.stringify({base_tree:cd.tree.sha, tree:blobs}) });
      if (!treeResp.ok) throw new Error(`Tree error: ${treeResp.status}`);
      const td = await treeResp.json();
      const ncResp = await fetch(`${baseUrl}/git/commits`, { method:'POST', headers, body: JSON.stringify({message, tree:td.sha, parents:[currentSha]}) });
      if (!ncResp.ok) throw new Error(`Commit error: ${ncResp.status}`);
      const ncd = await ncResp.json();
      if (onLog) onLog(`Commit: ${ncd.sha.substring(0,7)}`, 'done');
      const ur = await fetch(`${baseUrl}/git/refs/heads/${GITHUB_BRANCH}`, { method:'PATCH', headers, body: JSON.stringify({sha:ncd.sha, force:false}) });
      if (ur.ok) return ncd.sha;
      if (ur.status === 422) { lastErr = new Error('Branch update error: 422 (branch moved)'); continue; }
      throw new Error(`Branch update error: ${ur.status}`);
    } catch(e) {
      lastErr = e;
      if (String(e.message).includes('422')) continue;
      throw e;
    }
  }
  throw lastErr || new Error('Failed after 5 attempts');
}

async function handleFiles(files) {
  if (!files.length) return;
  const token = getVal('ed-github-token').trim();
  if (!token) { showToast('Set a GitHub token in the Publish tab to upload files','error'); return; }
  for (const file of files) {
    const isFont = isFontFile(file);
    const isImage = file.type.startsWith('image/');
    if (!isFont && !isImage) { showToast(`Skipped ${file.name} (not an image or font)`, 'error'); continue; }
    showToast(`Uploading ${file.name}...`, 'success');
    try {
      const base64 = await fileToBase64(file);
      const path = isFont ? `assets/fonts/${file.name}` : `assets/images/${file.name}`;
      // Uploads only count when the branch update actually succeeds (retries on 422)
      await createCommitWithRetry(token, [{path, base64: base64.split(',')[1]}], `Upload ${file.name} via editor`);
      if (isFont) {
        const ext = (file.name.split('.').pop()||'').toLowerCase();
        const family = familyFromFilename(file.name);
        const entry = { family, file: path, format: fontFormat(ext), weight: 400 };
        if (!state.fontManifest.some(f => f.file === path)) state.fontManifest.push(entry);
        await updateFontManifest(token);
        // Auto-register @font-face in custom CSS so the site can render it
        const face = `@font-face { font-family: '${family}'; font-style: normal; font-weight: ${entry.weight}; font-display: swap; src: url('${path}') format('${entry.format}'); }`;
        if (!state.customCSS.includes(face)) {
          state.customCSS = (state.customCSS ? state.customCSS + '\n' : '') + face;
          setVal('ed-custom-css', state.customCSS);
        }
        populateFontOptions();
        markChanged(); saveDrafts(); applyPreview();
        showToast(`Font '${family}' uploaded — pick it in Theme → Fonts`, 'success');
      } else {
        // Update image manifest
        if (!state.imageManifest.includes(path)) {
          state.imageManifest.push(path);
          state.imageManifest.sort();
          await updateManifest(token);
        }
        renderMediaGrid();
        populateImageDropdowns();
        showToast(`Uploaded ${file.name}`, 'success');
      }
    } catch(e) { showToast(`Upload failed: ${e.message}`, 'error'); }
  }
}

async function updateFontManifest(token) {
  await createCommitWithRetry(token, [{ path:'assets/fonts/manifest.json', content: JSON.stringify({fonts:state.fontManifest},null,2) }], 'Update font manifest via editor');
}
async function updateManifest(token) {
  await createCommitWithRetry(token, [{ path:'assets/images/manifest.json', content: JSON.stringify({images:state.imageManifest},null,2) }], 'Update image manifest via editor');
}
function deleteMedia(path) {
  if (!confirm(`Delete ${path.split('/').pop()}?`)) return;
  state.imageManifest = state.imageManifest.filter(p => p !== path);
  renderMediaGrid(); populateImageDropdowns();
  showToast('Image removed from manifest (not deleted from repo)','success');
}
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader(); r.onload = () => resolve(r.result); r.onerror = reject; r.readAsDataURL(file);
  });
}

// ===== AUTO-SAVE =====
function setupAutoSave() {
  // Content fields
  ['ed-whatsapp','ed-phone','ed-email','ed-location','ed-gst','ed-hero-headline','ed-hero-intro','ed-hero-image',
   'ed-social-instagram','ed-social-facebook','ed-social-whatsapp',
   'ed-seo-title','ed-seo-desc','ed-seo-ogimage'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.addEventListener('input', onChange); el.addEventListener('change', onChange); }
  });
  // Theme fields
  ['ed-color-red','ed-color-red-dark','ed-color-red-light','ed-color-gold','ed-color-navy','ed-color-cream'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', onChange);
  });
  ['ed-font-heading','ed-font-body'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', onChange);
  });
  // Layout fields
  ['ed-layout-fs-base'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', onChange);
  });
  ['ed-layout-section-y','ed-layout-radius','ed-layout-container'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      const h = document.getElementById('help-'+id.replace('ed-layout-',''));
      if (h) h.textContent = el.value + (id === 'ed-layout-section-y' || id === 'ed-layout-radius' ? 'px' : 'px');
      onChange();
    });
  });
  // Custom CSS
  const cssEl = document.getElementById('ed-custom-css');
  if (cssEl) cssEl.addEventListener('input', onChange);
}

function onChange() {
  collectAllData(); markChanged(); saveDrafts(); applyPreview();
}

function collectAllData() {
  // Settings
  if (!state.settings) state.settings = {};
  state.settings.whatsapp = getVal('ed-whatsapp');
  state.settings.phone = getVal('ed-phone');
  state.settings.email = getVal('ed-email');
  state.settings.location = getVal('ed-location');
  state.settings.gst = getVal('ed-gst');
  state.settings.heroHeadline = getVal('ed-hero-headline');
  state.settings.heroIntro = getVal('ed-hero-intro');
  state.settings.heroImage = getVal('ed-hero-image');
  state.settings.siteTitle = getVal('ed-seo-title');
  state.settings.siteDescription = getVal('ed-seo-desc');
  state.settings.ogImage = getVal('ed-seo-ogimage');
  state.settings.navItems = state.navItems;
  state.settings.footerNavItems = state.footerNavItems;
  state.settings.heroHighlights = state.heroHighlights;
  state.settings.trustItems = state.trustItems;
  state.settings.faqItems = state.faqItems;
  state.socialLinks = {
    instagram: {url: getVal('ed-social-instagram'), label: 'Instagram'},
    facebook: {url: getVal('ed-social-facebook'), label: 'Facebook'},
    whatsapp: {url: getVal('ed-social-whatsapp'), label: 'WhatsApp'}
  };
  state.settings.socialLinks = state.socialLinks;
  // Theme
  if (!state.theme) state.theme = {colors:{},fonts:{}};
  if (!state.theme.colors) state.theme.colors = {};
  if (!state.theme.fonts) state.theme.fonts = {};
  state.theme.colors['--colour-jhalar-red'] = getVal('ed-color-red');
  state.theme.colors['--colour-jhalar-red-dark'] = getVal('ed-color-red-dark');
  state.theme.colors['--colour-jhalar-red-light'] = getVal('ed-color-red-light');
  state.theme.colors['--colour-accent-gold'] = getVal('ed-color-gold');
  state.theme.colors['--colour-deep-navy'] = getVal('ed-color-navy');
  state.theme.colors['--colour-warm-cream'] = getVal('ed-color-cream');
  state.theme.fonts.heading = getVal('ed-font-heading');
  state.theme.fonts.body = getVal('ed-font-body');
  // Layout
  if (!state.theme.layout) state.theme.layout = {};
  state.theme.layout.baseFontSize = getVal('ed-layout-fs-base') || '16px';
  state.theme.layout.sectionY = (getVal('ed-layout-section-y') || '64') + 'px';
  state.theme.layout.cardRadius = (getVal('ed-layout-radius') || '20') + 'px';
  state.theme.layout.containerWidth = (getVal('ed-layout-container') || '1140') + 'px';
  // Custom CSS
  state.customCSS = getVal('ed-custom-css');
}

// ===== HISTORY / UNDO / REDO =====
function pushHistory() {
  const snapshot = JSON.stringify({
    settings: state.settings, theme: state.theme, products: state.products,
    sections: state.sections, sectionOrder: state.sectionOrder,
    customCSS: state.customCSS, navItems: state.navItems, socialLinks: state.socialLinks
  });
  history.stack = history.stack.slice(0, history.index + 1);
  history.stack.push(snapshot);
  if (history.stack.length > 50) history.stack.shift();
  history.index = history.stack.length - 1;
}
function undo() {
  if (history.index <= 0) return;
  history.index--;
  restoreHistory();
}
function redo() {
  if (history.index >= history.stack.length - 1) return;
  history.index++;
  restoreHistory();
}
function restoreHistory() {
  const data = JSON.parse(history.stack[history.index]);
  state.settings = data.settings; state.theme = data.theme; state.products = data.products;
  state.sections = data.sections; state.sectionOrder = data.sectionOrder;
  state.customCSS = data.customCSS; state.navItems = data.navItems; state.socialLinks = data.socialLinks;
  if (state.settings) {
    state.settings.navItems = state.navItems;
    state.settings.socialLinks = state.socialLinks;
    state.footerNavItems = state.settings.footerNavItems||[];
    state.heroHighlights = state.settings.heroHighlights||[];
    state.trustItems = state.settings.trustItems||[];
    state.faqItems = state.settings.faqItems||[];
  }
  populateAllForms(); renderSectionList(); renderProductList();
  markChanged(); saveDrafts(); applyPreview();
  showToast(`Undo/Redo (${history.index+1}/${history.stack.length})`,'success');
}

// ===== PREVIEW =====
// ===== LIVE PREVIEW =====
let previewTimer = null, previewRetry = 0;
function setLiveBadge(state, text) {
  const b = document.getElementById('live-badge');
  const t = document.getElementById('live-badge-text');
  if (!b || !t) return;
  b.className = 'live-badge' + (state ? ' ' + state : '');
  t.textContent = text || (state === 'live' ? 'Live' : 'Syncing');
}
function applyPreview() { schedulePreview(); }
function schedulePreview() {
  clearTimeout(previewTimer);
  setLiveBadge('', 'Syncing');
  previewTimer = setTimeout(syncPreview, 250);
}
function syncPreview() {
  const frame = document.getElementById('preview-frame'); if (!frame) return;
  try {
    const w = frame.contentWindow;
    if (w && w.JHALAR && frame.contentDocument && frame.contentDocument.readyState === 'complete') {
      pushToIframe();
      previewRetry = 0;
      setLiveBadge('live', 'Live');
      return;
    }
  } catch(e) {}
  // JHALAR not ready yet — retry a few times, then hard-reload the iframe
  previewRetry++;
  if (previewRetry > 8) {
    previewRetry = 0;
    reloadPreview();
    return;
  }
  previewTimer = setTimeout(syncPreview, 300);
}
function reloadPreview() {
  const frame = document.getElementById('preview-frame'); if (!frame) return;
  const ld = document.getElementById('preview-loading');
  if (ld) ld.style.display = 'block';
  collectAllData();
  frame.src = 'index.html?_t=' + Date.now();
  frame.addEventListener('load', () => {
    if (ld) ld.style.display = 'none';
    previewRetry = 0;
    schedulePreview();
  }, { once: true });
}
function pushToIframe() {
  const frame = document.getElementById('preview-frame'); if (!frame) return;
  const w = frame.contentWindow; if (!w || !w.JHALAR) return;
  try {
    const s = JSON.parse(JSON.stringify(state.settings));
    s.navItems = state.navItems; s.footerNavItems = state.footerNavItems; s.socialLinks = state.socialLinks;
    s.heroHighlights = state.heroHighlights; s.trustItems = state.trustItems; s.faqItems = state.faqItems;
    s.siteTitle = getVal('ed-seo-title'); s.siteDescription = getVal('ed-seo-desc'); s.ogImage = getVal('ed-seo-ogimage');
    if (s) w.JHALAR.setSettings(s);
    if (state.theme) w.JHALAR.setTheme(state.theme);
    if (state.products) w.JHALAR.setProducts(state.products);
    if (state.sections) w.JHALAR.setSections(state.sections);
    if (state.customCSS !== undefined) w.JHALAR.setCustomCSS(state.customCSS);
  } catch(e) { console.warn('Push to iframe:', e); }
}
function previewChanges() {
  const frame = document.getElementById('preview-frame'); if (!frame) return;
  const ld = document.getElementById('preview-loading');
  if (ld) ld.style.display = 'block';
  collectAllData();
  frame.src = 'index.html?_t='+Date.now();
  frame.addEventListener('load', () => { if (ld) ld.style.display = 'none'; previewRetry = 0; setTimeout(schedulePreview, 200); }, { once: true });
  showToast('Preview refreshed','success');
}
function updatePreviewUrl() {
  const el = document.getElementById('preview-url');
  if (el) el.textContent = window.location.origin + window.location.pathname.replace('editor.html','') + 'index.html';
}

// ===== DRAFTS =====
function saveDrafts() {
  collectAllData();
  try {
    localStorage.setItem('jhalar_editor_settings', JSON.stringify(state.settings));
    localStorage.setItem('jhalar_editor_theme', JSON.stringify(state.theme));
    localStorage.setItem('jhalar_editor_products', JSON.stringify(state.products));
    localStorage.setItem('jhalar_editor_sections', JSON.stringify(state.sections));
    localStorage.setItem('jhalar_editor_customcss', state.customCSS || '');
    pushHistory();
  } catch(e) { console.warn('Save drafts:', e); }
}
function markChanged() { state.changed = true; updateSaveIndicator(); }
function updateSaveIndicator() {
  const el = document.getElementById('save-indicator');
  if (el) {
    el.innerHTML = state.changed ? '<i class="fas fa-pen"></i> Unsaved' : '<i class="fas fa-check-circle" style="color:#2e7d32"></i> Saved';
    el.style.color = state.changed ? 'var(--gold)' : '';
  }
}
async function resetToPublished() {
  if (!confirm('Reset all changes? This discards drafts.')) return;
  try {
    ['jhalar_editor_settings','jhalar_editor_theme','jhalar_editor_products','jhalar_editor_sections','jhalar_editor_customcss'].forEach(k => localStorage.removeItem(k));
    state.changed = false; updateSaveIndicator();
    await loadPublishedData(); await loadFontManifest(); populateAllForms(); populateFontOptions(); renderSectionList(); renderProductList(); applyPreview();
    showToast('Reset to published state','success');
  } catch(e) { showToast('Reset failed','error'); }
}

// ===== GITHUB TOKEN =====
function restoreGitHubToken() {
  try { const s = localStorage.getItem('jhalar_github_token'); if (s) { state.githubToken = atob(s); setVal('ed-github-token', state.githubToken); updateTokenStatus('Token restored','ok'); } } catch(e) {}
}
function saveGitHubToken() { if (state.githubToken) { try { localStorage.setItem('jhalar_github_token', btoa(state.githubToken)); } catch(e) {} } }
async function testGitHubToken() {
  const t = getVal('ed-github-token').trim(); if (!t) { updateTokenStatus('Enter a token','bad'); return; }
  state.githubToken = t; saveGitHubToken();
  updateTokenStatus('Testing...','');
  try {
    const r = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`, { headers: { 'Authorization': `Bearer ${t}`, 'Accept': 'application/vnd.github.v3+json' } });
    if (r.ok) { const d = await r.json(); updateTokenStatus(`Connected to ${d.full_name}`,'ok'); showToast('GitHub connected!','success'); }
    else if (r.status === 401) updateTokenStatus('Invalid token','bad');
    else if (r.status === 403) updateTokenStatus('Token needs "repo" scope','bad');
    else updateTokenStatus(`Error ${r.status}`,'bad');
  } catch(e) { updateTokenStatus('Network error','bad'); }
}
function updateTokenStatus(msg, type) { const el = document.getElementById('token-status'); if (el) { el.textContent = msg; el.className = 'token-status' + (type ? ' '+type : ''); } }

// ===== GITHUB PUBLISH =====
async function publishToGitHub() {
  const btn = document.getElementById('btn-publish');
  const progress = document.getElementById('publish-progress');
  const fill = document.getElementById('progress-fill');
  const status = document.getElementById('progress-status');
  const log = document.getElementById('progress-log');

  const token = getVal('ed-github-token').trim();
  if (!token) { showToast('Enter GitHub token first','error'); return; }
  state.githubToken = token; saveGitHubToken();
  collectAllData();

  const files = [
    { path: 'content/site-settings.json', content: JSON.stringify({...state.settings, navItems: state.navItems, footerNavItems: state.footerNavItems, socialLinks: state.socialLinks}, null, 2) },
    { path: 'content/theme.json', content: JSON.stringify(state.theme, null, 2) },
    { path: 'content/products.json', content: JSON.stringify({ products: state.products }, null, 2) },
    { path: 'content/sections.json', content: JSON.stringify({ sections: state.sections, order: state.sectionOrder }, null, 2) },
    { path: 'content/custom-css.json', content: JSON.stringify({ css: state.customCSS || '' }, null, 2) }
  ];

  progress.classList.add('show');
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing...';
  log.innerHTML = ''; fill.style.width = '0%'; status.textContent = 'Starting...';

  const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' };
  const baseUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;
  const commitMsg = `Theme Editor update: ${new Date().toLocaleString('en-IN', {timeZone:'Asia/Kolkata'})}`;

  try {
    addLog('Fetching branch...','act');
    const br = await fetch(`${baseUrl}/git/ref/heads/${GITHUB_BRANCH}`, {headers});
    if (!br.ok) throw new Error(`Branch error: ${br.status}`);
    const bd = await br.json();
    const currentSha = bd.object.sha;
    addLog(`Branch: ${currentSha.substring(0,7)}`,'done');
    fill.style.width = '15%';

    addLog('Fetching base tree...','act');
    const cr = await fetch(`${baseUrl}/git/commits/${currentSha}`, {headers});
    if (!cr.ok) throw new Error(`Commit error: ${cr.status}`);
    const cd = await cr.json();
    addLog(`Tree: ${cd.tree.sha.substring(0,7)}`,'done');
    fill.style.width = '20%';

    const blobs = [];
    for (let i = 0; i < files.length; i++) {
      addLog(`Blob: ${files[i].path}...`,'act');
      const blobR = await fetch(`${baseUrl}/git/blobs`, { method:'POST', headers, body: JSON.stringify({content: files[i].content, encoding:'utf-8'}) });
      if (!blobR.ok) throw new Error(`Blob error for ${files[i].path}: ${blobR.status}`);
      const bd2 = await blobR.json();
      blobs.push({path: files[i].path, mode: '100644', type: 'blob', sha: bd2.sha});
      addLog(`  ${files[i].path} ✓`,'done');
      fill.style.width = `${20 + (i+1)*12}%`;
    }

    addLog('Creating tree...','act');
    const tr = await fetch(`${baseUrl}/git/trees`, { method:'POST', headers, body: JSON.stringify({base_tree: cd.tree.sha, tree: blobs}) });
    if (!tr.ok) throw new Error(`Tree error: ${tr.status}`);
    const td = await tr.json();
    addLog(`Tree: ${td.sha.substring(0,7)}`,'done');
    fill.style.width = '65%';

    addLog('Creating commit...','act');
    const nc = await fetch(`${baseUrl}/git/commits`, { method:'POST', headers, body: JSON.stringify({message: commitMsg, tree: td.sha, parents: [currentSha]}) });
    if (!nc.ok) throw new Error(`Commit error: ${nc.status}`);
    const ncd = await nc.json();
    addLog(`Commit: ${ncd.sha.substring(0,7)}`,'done');
    fill.style.width = '80%';

    addLog('Updating branch...','act');
    const ur = await fetch(`${baseUrl}/git/refs/heads/${GITHUB_BRANCH}`, { method:'PATCH', headers, body: JSON.stringify({sha: ncd.sha, force: false}) });
    if (!ur.ok) throw new Error(`Branch update error: ${ur.status}`);
    addLog(`Branch ${GITHUB_BRANCH} updated ✓`,'done');
    fill.style.width = '100%';

    status.textContent = '✅ Published!';
    status.style.color = '#2e7d32';
    addLog('🎉 Published successfully!','done');
    addLog('GitHub Pages will rebuild in ~1-2 min.','done');

    state.changed = false; updateSaveIndicator();
    showToast('🎉 Published to GitHub!','success');
    btn.innerHTML = '<i class="fas fa-check"></i> Published!';
    setTimeout(() => { btn.disabled = false; btn.innerHTML = '<i class="fas fa-rocket"></i> Publish to GitHub'; }, 3000);
  } catch(e) {
    console.error('Publish:', e);
    status.textContent = `❌ ${e.message}`; status.style.color = 'var(--red)';
    addLog(`Error: ${e.message}`,'err');
    showToast('Publish failed: '+e.message,'error');
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-rocket"></i> Publish to GitHub';
  }
}
function addLog(msg, type) {
  const log = document.getElementById('progress-log'); if (!log) return;
  const d = document.createElement('div'); d.textContent = msg; d.className = type||'';
  log.appendChild(d); log.scrollTop = log.scrollHeight;
}

// ===== DOWNLOAD =====
function downloadSettings() { collectAllData(); downloadFile(JSON.stringify(state.settings, null, 2), 'site-settings.json', 'application/json'); showToast('site-settings.json downloaded','success'); }
function downloadTheme() { collectAllData(); downloadFile(JSON.stringify(state.theme, null, 2), 'theme.json', 'application/json'); showToast('theme.json downloaded','success'); }
function downloadProducts() { downloadFile(JSON.stringify({products: state.products}, null, 2), 'products.json', 'application/json'); showToast('products.json downloaded','success'); }
function downloadSections() { downloadFile(JSON.stringify({sections: state.sections, order: state.sectionOrder}, null, 2), 'sections.json', 'application/json'); showToast('sections.json downloaded','success'); }
function downloadCustomCSS() { downloadFile(JSON.stringify({css: state.customCSS||''}, null, 2), 'custom-css.json', 'application/json'); showToast('custom-css.json downloaded','success'); }
function downloadFile(content, name, type) {
  const blob = new Blob([content], {type}); const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

// ===== EXPORT / IMPORT ALL =====
function exportAllData() {
  collectAllData();
  const data = {
    exportedAt: new Date().toISOString(),
    settings: state.settings, theme: state.theme, products: state.products,
    sections: state.sections, sectionOrder: state.sectionOrder,
    customCSS: state.customCSS, navItems: state.navItems, socialLinks: state.socialLinks
  };
  downloadFile(JSON.stringify(data, null, 2), 'jhalar-full-backup.json', 'application/json');
  showToast('Full backup downloaded','success');
}
function importAllData(e) {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const d = JSON.parse(ev.target.result);
      if (!d.settings) { showToast('Invalid backup file','error'); return; }
      state.settings = d.settings; state.theme = d.theme; state.products = d.products||[];
      state.sections = d.sections||{}; state.sectionOrder = d.sectionOrder||[];
      state.customCSS = d.customCSS||''; state.navItems = d.navItems||state.settings.navItems||[];
      state.socialLinks = d.socialLinks||state.settings.socialLinks||{};
      state.footerNavItems = state.settings.footerNavItems||[];
      state.heroHighlights = state.settings.heroHighlights||[];
      state.trustItems = state.settings.trustItems||[];
      state.faqItems = state.settings.faqItems||[];
      ensureProductIds();
      populateAllForms(); renderSectionList(); renderProductList();
      markChanged(); saveDrafts(); applyPreview();
      showToast('Full backup restored!','success');
    } catch(e) { showToast('Invalid file','error'); }
  };
  reader.readAsText(file);
  e.target.value = '';
}

// ===== TOAST =====
function showToast(msg, type) {
  const t = document.getElementById('toast'); if (!t) return;
  t.textContent = msg; t.className = 'toast'+(type?' '+type:''); t.classList.add('show');
  clearTimeout(t._timeout); t._timeout = setTimeout(() => t.classList.remove('show'), 3000);
}

// ===== UTILITIES =====
function getVal(id) { const el = document.getElementById(id); return el ? el.value : ''; }
function setVal(id, v) { const el = document.getElementById(id); if (el) el.value = v; }
function escapeHtml(str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }