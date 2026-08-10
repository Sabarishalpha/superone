// =============================================
// AARMAN AUTOMATION - MAIN JS ENTRY POINT
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules safely so one missing script does not block gallery filters
  const initializers = [
    () => typeof window.initNavbar === 'function' && window.initNavbar(),
    () => typeof window.initAnimations === 'function' && window.initAnimations(),
    () => typeof window.initCounters === 'function' && window.initCounters(),
    () => typeof window.initBackToTop === 'function' && window.initBackToTop(),
    () => typeof window.initMobileMenu === 'function' && window.initMobileMenu(),
    () => typeof window.initActiveNav === 'function' && window.initActiveNav(),
    () => typeof window.initCursor === 'function' && window.initCursor(),
    () => typeof window.initEquipmentCarousel === 'function' && window.initEquipmentCarousel(),
    () => typeof window.initGallery === 'function' && window.initGallery()
  ];

  initializers.forEach((init) => init());
});

// ---- Machinery Carousel ---- //
function initEquipmentCarousel() {
  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const prevButton = carousel.querySelector('.carousel-prev');
  const nextButton = carousel.querySelector('.carousel-next');
  const dotsContainer = carousel.querySelector('.carousel-dots');
  let currentIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
  if (currentIndex === -1) currentIndex = 0;
  let autoplayTimer = null;
  let isPaused = false;
  let dragStartX = null;

  const activateSlide = (index) => {
    const nextIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === nextIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', !isActive);
    });
    currentIndex = nextIndex;
    updateDots();
  };

  const updateDots = () => {
    const dots = Array.from(dotsContainer.children);
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === currentIndex);
      dot.setAttribute('aria-selected', dotIndex === currentIndex ? 'true' : 'false');
      dot.setAttribute('tabindex', dotIndex === currentIndex ? '0' : '-1');
    });
  };

  const goToNext = () => activateSlide(currentIndex + 1);
  const goToPrev = () => activateSlide(currentIndex - 1);

  const startAutoplay = () => {
    if (autoplayTimer) return;
    autoplayTimer = window.setInterval(() => {
      if (!isPaused) {
        goToNext();
      }
    }, 4000);
  };

  const stopAutoplay = () => {
    if (!autoplayTimer) return;
    window.clearInterval(autoplayTimer);
    autoplayTimer = null;
  };

  const resetAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  const createDots = () => {
    slides.forEach((slide, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Show machine ${index + 1}`);
      dot.setAttribute('role', 'tab');
      dot.addEventListener('click', () => {
        activateSlide(index);
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    });
  };

  const handleDragStart = (event) => {
    dragStartX = event.clientX;
  };

  const handleDragEnd = (event) => {
    if (dragStartX === null) return;
    const dragEndX = event.clientX;
    const dragDistance = dragEndX - dragStartX;
    if (Math.abs(dragDistance) > 60) {
      if (dragDistance > 0) {
        goToPrev();
      } else {
        goToNext();
      }
      resetAutoplay();
    }
    dragStartX = null;
  };

  carousel.addEventListener('mouseenter', () => {
    isPaused = true;
  });

  carousel.addEventListener('mouseleave', () => {
    isPaused = false;
  });

  carousel.addEventListener('pointerdown', handleDragStart);
  carousel.addEventListener('pointerup', handleDragEnd);
  carousel.addEventListener('pointercancel', () => {
    dragStartX = null;
  });

  prevButton?.addEventListener('click', () => {
    goToPrev();
    resetAutoplay();
  });

  nextButton?.addEventListener('click', () => {
    goToNext();
    resetAutoplay();
  });

  createDots();
  activateSlide(currentIndex);
  carousel.classList.add('is-ready');
  startAutoplay();
}

// ---- Back to Top ---- //
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---- Active Nav Highlighting ---- //
function initActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage ||
       (currentPage === '' && href === 'index.html') ||
       (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ---- Smooth Scroll for internal anchors ---- //
document.addEventListener('click', (e) => {
  const target = e.target.closest('a[href^="#"]');
  if (!target) return;
  const id = target.getAttribute('href').slice(1);
  const el = document.getElementById(id);
  if (el) {
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// ---- Gallery Filter ---- //
function initGallery() {
  const tabs = document.querySelectorAll('.gallery-tab');
  const cards = document.querySelectorAll('.gallery-card');

  if (tabs.length === 0 || cards.length === 0) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // Filter cards with smooth fade
      const filter = tab.getAttribute('data-filter');
      cards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}
