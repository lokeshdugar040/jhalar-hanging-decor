// JHALAR Hanging Decor - Product & Interaction Script

// Product Data (to be replaced with CMS data)
const products = [
  {
    id: 1,
    title: "Premium Pom Pom Hanging",
    category: "Pom Pom Hangings",
    description: "Handcrafted decorative pom pom hangings perfect for events and celebrations.",
    image: "/assets/images/products/pom-pom-sample.jpg",
    b2bTag: "Bulk-ready"
  }
  // Add more products here or fetch from CMS
];

// Initialize website
function init() {
  renderProducts(products);
  setupFilterButtons();
  setupMobileNav();
  setupAccordions();
  setupModal();
  updateYear();
}

// Render products to grid
function renderProducts(productList) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  grid.innerHTML = productList.map(product => `
    <div class="product-card" data-category="${product.category}">
      <div class="product-image">
        <div class="img-placeholder" style="min-height: 300px;">
          <span>${product.title} Image</span>
        </div>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-title">${product.title}</h3>
        <p class="product-desc">${product.description}</p>
        <span class="product-meta">${product.b2bTag}</span>
        <button class="btn btn-primary" onclick="openProductModal(${product.id})" style="margin-top: 1rem; width: 100%;">
          View Details
        </button>
      </div>
    </div>
  `).join('');
}

// Setup category filter buttons
function setupFilterButtons() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      filterProducts(filter);
    });
  });
}

// Filter products by category
function filterProducts(category) {
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Mobile navigation toggle
function setupMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.getElementById('mobile-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !expanded);
    nav.classList.toggle('active');
  });

  // Close mobile nav when clicking a link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Accordion functionality
function setupAccordions() {
  const headers = document.querySelectorAll('.accordion-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const expanded = header.getAttribute('aria-expanded') === 'true';
      const content = header.nextElementSibling;
      
      // Close all accordions
      headers.forEach(h => {
        h.setAttribute('aria-expanded', 'false');
        h.nextElementSibling.hidden = true;
      });

      // Toggle clicked accordion
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

  closeBtn.addEventListener('click', () => {
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
    }
  });
}

// Open product modal
function openProductModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('product-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDesc = document.getElementById('modal-desc');
  const modalTag = document.getElementById('modal-tag');

  if (modalTitle) modalTitle.textContent = product.title;
  if (modalCategory) modalCategory.textContent = product.category;
  if (modalDesc) modalDesc.textContent = product.description;
  if (modalTag) modalTag.textContent = product.b2bTag;

  if (modal) {
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
  }
}

// Update copyright year
function updateYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});
