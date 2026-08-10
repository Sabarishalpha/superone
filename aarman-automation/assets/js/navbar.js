// =============================================
// AARMAN AUTOMATION - NAVBAR JS
// =============================================

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const topBar = document.querySelector('.top-bar');
  if (!navbar) return;

  // Sticky / scroll effect
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 80) {
      navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.12)';
      navbar.style.background = '#fff';
    } else {
      navbar.style.boxShadow = '';
      navbar.style.background = '';
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

// ---- Mobile Menu ---- //
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const mobileActions = document.querySelector('.nav-actions');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);

    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on link click
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Clone CTA button into mobile menu
  const ctaBtn = document.querySelector('.nav-actions .btn');
  if (ctaBtn) {
    const mobileCTA = document.createElement('div');
    mobileCTA.className = 'nav-actions mobile-show';
    mobileCTA.innerHTML = ctaBtn.outerHTML;
    navMenu.appendChild(mobileCTA);
  }
}
