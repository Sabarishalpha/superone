// =============================================
// AARMAN AUTOMATION - SCROLL ANIMATIONS
// =============================================

function initAnimations() {
  // IntersectionObserver for scroll-triggered animations
  const animatedEls = document.querySelectorAll('.animate-on-scroll');

  if (!animatedEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedEls.forEach(el => observer.observe(el));
}
