// ============================================
// JHALAR Pro Editor
// ============================================
const GITHUB_OWNER = 'lokeshdugar040', GITHUB_REPO = 'jhalar-hanging-decor', GITHUB_BRANCH = 'main';
const FILES_TO_PUBLISH = ['content/site-settings.json','content/theme.json','content/products.json','content/sections.json','content/custom-css.json'];

let state = {
  settings: null, theme: null, products: [], sections: {}, sectionOrder: [],
  customCSS: '', navItems: [], footerNavItems: [], socialLinks: {},
  imageManifest: [], selectedProductId: null, viewport: 'desktop',
  changed: false, githubToken: null, darkMode: false
};
let history = { stack: [], index: -1 };

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
  setupTabs(); setupViewport(); setupAutoSave(); setupKeyboardShortcuts(); setupDragDrop();
  setupUploadZone(); restoreDarkMode(); restoreGitHubToken();
  await loadPublishedData(); await loadImageManifest();
  populateAllForms(); renderSectionList(); renderProductList(); renderMediaGrid();
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

    ensureProductIds();
    if (ds||dt||dp||dsec||dcss) { state.changed = true; updateSaveIndicator(); }
  } catch(e) { console.error('Load failed:', e); showToast('Failed to load site data.','error'); }
}

function ensureProductIds() {
  let m = 0; state.products.forEach(p => { if (p.id && p.id > m) m = p.id; });
  state.products.forEach(p => { if (!p.id) p.id = ++m; });
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
  renderNavEditor();
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
async function handleFiles(files) {
  if (!files.length) return;
  const token = getVal('ed-github-token').trim();
  if (!token) { showToast('Set a GitHub token in the Publish tab to upload images','error'); return; }
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    showToast(`Uploading ${file.name}...`, 'success');
    try {
      const base64 = await fileToBase64(file);
      const path = `assets/images/${file.name}`;
      const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' };
      const baseUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;
      // Get current commit SHA
      const br = await fetch(`${baseUrl}/git/ref/heads/${GITHUB_BRANCH}`, {headers});
      if (!br.ok) throw new Error('Failed to get branch');
      const bd = await br.json();
      // Create blob
      const blobResp = await fetch(`${baseUrl}/git/blobs`, { method:'POST', headers, body: JSON.stringify({content:base64.split(',')[1],encoding:'base64'}) });
      if (!blobResp.ok) throw new Error('Failed to create blob');
      const blob = await blobResp.json();
      // Get tree
      const commitResp = await fetch(`${baseUrl}/git/commits/${bd.object.sha}`, {headers});
      const cd = await commitResp.json();
      // Create tree
      const treeResp = await fetch(`${baseUrl}/git/trees`, { method:'POST', headers, body: JSON.stringify({base_tree:cd.tree.sha, tree:[{path, mode:'100644', type:'blob', sha:blob.sha}]}) });
      if (!treeResp.ok) throw new Error('Failed to create tree');
      const td = await treeResp.json();
      // Create commit
      const ncResp = await fetch(`${baseUrl}/git/commits`, { method:'POST', headers, body: JSON.stringify({message:`Upload ${file.name} via editor`, tree:td.sha, parents:[bd.object.sha]}) });
      if (!ncResp.ok) throw new Error('Failed to create commit');
      const ncd = await ncResp.json();
      // Update ref
      await fetch(`${baseUrl}/git/refs/heads/${GITHUB_BRANCH}`, { method:'PATCH', headers, body: JSON.stringify({sha:ncd.sha, force:false}) });
      // Update manifest
      if (!state.imageManifest.includes(path)) {
        state.imageManifest.push(path);
        state.imageManifest.sort();
        // Update manifest.json in repo
        await updateManifest(token);
      }
      renderMediaGrid();
      populateImageDropdowns();
      showToast(`Uploaded ${file.name}`, 'success');
    } catch(e) { showToast(`Upload failed: ${e.message}`, 'error'); }
  }
}
async function updateManifest(token) {
  const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' };
  const baseUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;
  const br = await fetch(`${baseUrl}/git/ref/heads/${GITHUB_BRANCH}`, {headers});
  const bd = await br.json();
  const commitResp = await fetch(`${baseUrl}/git/commits/${bd.object.sha}`, {headers});
  const cd = await commitResp.json();
  const blobResp = await fetch(`${baseUrl}/git/blobs`, { method:'POST', headers, body: JSON.stringify({content:JSON.stringify({images:state.imageManifest},null,2),encoding:'utf-8'}) });
  const blob = await blobResp.json();
  const treeResp = await fetch(`${baseUrl}/git/trees`, { method:'POST', headers, body: JSON.stringify({base_tree:cd.tree.sha, tree:[{path:'assets/images/manifest.json', mode:'100644', type:'blob', sha:blob.sha}]}) });
  const td = await treeResp.json();
  const ncResp = await fetch(`${baseUrl}/git/commits`, { method:'POST', headers, body: JSON.stringify({message:'Update image manifest via editor', tree:td.sha, parents:[bd.object.sha]}) });
  const ncd = await ncResp.json();
  await fetch(`${baseUrl}/git/refs/heads/${GITHUB_BRANCH}`, { method:'PATCH', headers, body: JSON.stringify({sha:ncd.sha, force:false}) });
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
  }
  populateAllForms(); renderSectionList(); renderProductList();
  markChanged(); saveDrafts(); applyPreview();
  showToast(`Undo/Redo (${history.index+1}/${history.stack.length})`,'success');
}

// ===== PREVIEW =====
function applyPreview() {
  const frame = document.getElementById('preview-frame'); if (!frame) return;
  const tryPush = () => { try { const w = frame.contentWindow; if (w && w.JHALAR) { pushToIframe(); return true; } } catch(e){} return false; };
  try { const d = frame.contentDocument; if (d && d.readyState === 'complete') { if (tryPush()) return; } } catch(e) {}
  if (tryPush()) return;
  frame.addEventListener('load', () => { setTimeout(tryPush, 300); }, { once: true });
}
function pushToIframe() {
  const frame = document.getElementById('preview-frame'); if (!frame) return;
  const w = frame.contentWindow; if (!w || !w.JHALAR) return;
  try {
    const s = JSON.parse(JSON.stringify(state.settings));
    s.navItems = state.navItems; s.footerNavItems = state.footerNavItems; s.socialLinks = state.socialLinks;
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
  document.getElementById('preview-loading').style.display = 'block';
  collectAllData();
  frame.src = 'index.html?_t='+Date.now();
  frame.addEventListener('load', () => { document.getElementById('preview-loading').style.display = 'none'; setTimeout(pushToIframe, 400); }, { once: true });
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
    await loadPublishedData(); populateAllForms(); renderSectionList(); renderProductList(); applyPreview();
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