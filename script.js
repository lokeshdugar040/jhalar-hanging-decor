// JHALAR Hanging Decor - Product & Interaction Script

// Product data will be loaded from content/products.json
let products = [];

// Initialize website
async function init() {
  try {
    await loadProducts();
    renderProducts(products);
    setupFilterButtons();
    setupMobileNav();
    setupAccordions();
    setupModal();
    updateYear();
    setupReveal();
    setupFormValidation();
  } catch (error) {
    console.error('Error initializing website:', error);
    showFallbackProducts();
  }
}

// Load products from JSON file
async function loadProducts() {
  try {
    const response = await fetch('/content/products.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    products = data.products || [];
    console.log(`Loaded ${products.length} products`);
  } catch (error) {
    console.error('Failed to load products:', error);
    showFallbackProducts();
  }
}

// Show fallback products if JSON fails
function showFallbackProducts() {
  products = [
    {
      id: 1,
      title: "Premium Pom Pom Hanging",
      category: "Pom Pom Hangings",
      description: "Handcrafted decorative pom pom hangings perfect for events.",
      image: "/assets/images/products/pom-pom-hanging.jpg",
      b2bTag: "Bulk-ready"
    },
    {
      id: 2,
      title: "Elegant Bead Hanging",
      category: "Bead Hangings",
      description: "Beautiful bead hangings with intricate patterns.",
      image: "/assets/images/products/bead-hanging.jpg",
      b2bTag: "Bestseller"
    },
    {
      id: 3,
      title: "Traditional Bell Hanging",
      category: "Bell Hangings",
      description: "Traditional bell hangings with authentic craftsmanship.",
      image: "/assets/images/products/bell-hanging.jpg",
      b2bTag: "Traditional"
    },
    {
      id: 4,
      title: "Floral Jhalar Decor",
      category: "Floral Jhalars",
      description: "Stunning floral jhalars handcrafted with premium materials.",
      image: "/assets/images/products/floral-jhalar.jpg",
      b2bTag: "Premium"
    },
    {
      id: 5,
      title: "Designer Toran",
      category: "Torans",
      description: "Decorative torans with modern designs.",
      image: "/assets/images/products/toran.jpg",
      b2bTag: "New Arrival"
    },
    {
      id: 6,
      title: "Luxury Tassel Hanging",
      category: "Tassel Hangings",
      description: "Premium tassel hangings with rich colors.",
      image: "/assets/images/products/tassel-hanging.jpg",
      b2bTag: "Luxury"
    }
  ];
  renderProducts(products);
}

// Render products to grid
function renderProducts(productList) {
  const grid = document.getElementById('product-grid');
  if (!grid) {
    console.error('Product grid not found');
    return;
  }

  if (productList.length === 0) {
    grid.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No products available. Please check back soon!</p>';
    return;
  }

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
  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      
      const filter = btn.dataset.filter;
      filterProducts(filter);
    });
  });
}

// Filter products by category
function filterProducts(category) {
  const cards = document.querySelectorAll('.product-card');
  if (cards.length === 0) return;

  cards.forEach(card => {
    const productCategory = card.dataset.category;
    const shouldShow = category === 'all' || productCategory === category;
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
  if (headers.length === 0) return;

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const expanded = header.getAttribute('aria-expanded') === 'true';
      const contentId = header.getAttribute('aria-controls');
      const content = document.getElementById(contentId);
      
      if (!content) {
        console.error('Accordion content not found:', contentId);
        return;
      }
      
      // Close all accordions
      headers.forEach(h => {
        h.setAttribute('aria-expanded', 'false');
        const contentEl = document.getElementById(h.getAttribute('aria-controls'));
        if (contentEl) contentEl.hidden = true;
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
    closeModal(modal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal(modal);
    }
  });
}

// Close modal helper
function closeModal(modal) {
  modal.setAttribute('aria-hidden', 'true');
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

// Open product modal
function openProductModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) {
    console.error('Product not found:', productId);
    return;
  }

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
    document.body.style.overflow = 'hidden';
  }
}

// Update copyright year
function updateYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// Reveal animations on scroll
function setupReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length === 0) return;

  const revealOnScroll = () => {
    revealElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        el.classList.add('active');
      }
    });
  };

  // Check on load and scroll
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
}

// Form validation
function setupFormValidation() {
  const form = document.getElementById('enquiry-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }
  });

  // Real-time validation feedback
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (input.validity.valid) {
        input.style.borderColor = '#4caf50';
      } else {
        input.style.borderColor = '#f44336';
      }
    });
  });
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

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
