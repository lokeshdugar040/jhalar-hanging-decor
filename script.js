(function () {
  'use strict';

  const REPOSITORY = {
    owner: 'lokeshdugar040',
    repo: 'jhalar-hanging-decor',
    branch: 'main',
    contentPath: 'content/products'
  };

  const fallbackProducts = [{
    id: 'premium-pom-pom-hanging',
    name: 'Premium Pom Pom Hanging',
    category: 'Pom Pom Hangings',
    description_short: 'Handcrafted premium wool pom pom hangings for festive events, wholesale orders and B2B décor requirements.',
    image_main: '',
    moq: 50,
    status: 'published'
  }];

  let products = [];
  const els = {};

  function cacheElements() {
    els.header = document.getElementById('header');
    els.mobileToggle = document.querySelector('.mobile-toggle');
    els.mobileNav = document.getElementById('mobile-nav');
    els.mobileLinks = document.querySelectorAll('.mobile-link');
    els.productGrid = document.getElementById('product-grid');
    els.filters = document.getElementById('product-filters');
    els.currentYear = document.getElementById('current-year');
    els.navLinks = document.querySelectorAll('.nav-list a, .mobile-link');
  }

  function decodeBase64(value) {
    const decoded = atob(value.replace(/\n/g, ''));
    return decodeURIComponent(Array.prototype.map.call(decoded, function (char) {
      return '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  function parseScalar(value) {
    const trimmed = value.trim();
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
    return trimmed.replace(/^['\"]|['\"]$/g, '');
  }

  function parseFrontmatter(markdown) {
    const match = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
    if (!match) return { data: {}, body: markdown };
    const data = {};
    const lines = match[1].split('\n');
    let activeList = null;

    lines.forEach(function (line) {
      if (/^\s*-\s+/.test(line) && activeList) {
        data[activeList].push(parseScalar(line.replace(/^\s*-\s+/, '')));
        return;
      }
      const pair = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
      if (!pair) return;
      const key = pair[1];
      const rawValue = pair[2];
      if (rawValue === '') {
        data[key] = [];
        activeList = key;
      } else if (rawValue === '[]') {
        data[key] = [];
        activeList = null;
      } else {
        data[key] = parseScalar(rawValue);
        activeList = null;
      }
    });

    return { data: data, body: match[2].trim() };
  }

  async function loadProducts() {
    const base = 'https://api.github.com/repos/' + REPOSITORY.owner + '/' + REPOSITORY.repo + '/contents/' + REPOSITORY.contentPath + '?ref=' + REPOSITORY.branch;
    try {
      const directoryResponse = await fetch(base);
      if (!directoryResponse.ok) throw new Error('Could not read product folder');
      const files = await directoryResponse.json();
      const markdownFiles = files.filter(function (file) { return file.type === 'file' && file.name.endsWith('.md') && file.name !== 'README.md'; });
      const loaded = await Promise.all(markdownFiles.map(async function (file) {
        const fileResponse = await fetch(file.url);
        if (!fileResponse.ok) return null;
        const fileData = await fileResponse.json();
        const parsed = parseFrontmatter(decodeBase64(fileData.content));
        return Object.assign({ id: file.name.replace(/\.md$/, '') }, parsed.data, { description_full: parsed.body });
      }));
      return loaded.filter(function (product) { return product && product.status === 'published'; });
    } catch (error) {
      console.warn('Could not load products from GitHub. Showing sample product.', error);
      return fallbackProducts;
    }
  }

  function getCategories(items) {
    return Array.from(new Set(items.map(function (item) { return item.category; }).filter(Boolean))).sort();
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>'\"]/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char];
    });
  }

  function placeholder(name) {
    return '<div class="product-placeholder" aria-hidden="true"><span>JHALAR</span><small>' + escapeHtml(name) + '</small></div>';
  }

  function renderFilters(active) {
    const categories = getCategories(products);
    const values = ['all'].concat(categories);
    els.filters.innerHTML = values.map(function (value) {
      const label = value === 'all' ? 'All Products' : value;
      return '<button class="filter-btn ' + (value === active ? 'active' : '') + '" data-filter="' + escapeHtml(value) + '" type="button" role="tab" aria-selected="' + (value === active ? 'true' : 'false') + '">' + escapeHtml(label) + '</button>';
    }).join('');

    els.filters.querySelectorAll('.filter-btn').forEach(function (button) {
      button.addEventListener('click', function () {
        renderFilters(button.dataset.filter);
        renderProducts(button.dataset.filter);
      });
    });
  }

  function renderProducts(filter) {
    const visible = filter === 'all' ? products : products.filter(function (product) { return product.category === filter; });
    if (!visible.length) {
      els.productGrid.innerHTML = '<p class="empty-products">No published products in this category yet.</p>';
      return;
    }
    els.productGrid.innerHTML = visible.map(function (product) {
      const image = product.image_main ? '<img src="' + escapeHtml(product.image_main) + '" alt="' + escapeHtml(product.name) + '" loading="lazy">' : placeholder(product.name);
      return '<article class="product-card"><div class="product-image">' + image + '</div><div class="product-info"><span class="product-category">' + escapeHtml(product.category) + '</span><h3 class="product-title">' + escapeHtml(product.name) + '</h3><p class="product-desc">' + escapeHtml(product.description_short) + '</p><div class="product-meta">MOQ: ' + escapeHtml(product.moq || 'On request') + '</div></div></article>';
    }).join('');
  }

  function throttle(fn, wait) {
    let timer = null;
    return function () {
      if (timer) return;
      timer = setTimeout(function () { timer = null; }, wait);
      fn();
    };
  }

  function initNavigation() {
    if (els.mobileToggle && els.mobileNav) {
      els.mobileToggle.addEventListener('click', function () {
        const open = els.mobileToggle.getAttribute('aria-expanded') === 'true';
        els.mobileToggle.setAttribute('aria-expanded', String(!open));
        els.mobileNav.classList.toggle('open', !open);
      });
      els.mobileLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          els.mobileToggle.setAttribute('aria-expanded', 'false');
          els.mobileNav.classList.remove('open');
        });
      });
    }

    els.navLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  async function init() {
    cacheElements();
    if (els.currentYear) els.currentYear.textContent = new Date().getFullYear();
    if (els.header) window.addEventListener('scroll', throttle(function () {
      els.header.classList.toggle('scrolled', window.scrollY > 20);
    }, 50), { passive: true });
    initNavigation();
    products = await loadProducts();
    renderFilters('all');
    renderProducts('all');
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
}());
