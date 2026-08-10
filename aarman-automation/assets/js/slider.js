// =============================================
// AARMAN AUTOMATION - SLIDER JS
// =============================================

function initSlider(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const track = container.querySelector('.slider-track');
  const slides = container.querySelectorAll('.slide');
  const dotsContainer = container.querySelector('.slider-dots');
  const prevBtn = container.querySelector('.slider-prev');
  const nextBtn = container.querySelector('.slider-next');

  if (!track || !slides.length) return;

  let currentIndex = 0;
  let autoplayInterval = null;

  // Create dots
  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  function goTo(index) {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  // Auto-play
  function startAutoplay(delay = 4000) {
    autoplayInterval = setInterval(next, delay);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  container.addEventListener('mouseenter', stopAutoplay);
  container.addEventListener('mouseleave', () => startAutoplay());

  // Touch support
  let touchStartX = 0;
  container.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  container.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  }, { passive: true });

  startAutoplay();
}
