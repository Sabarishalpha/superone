// =============================================
// AARMAN AUTOMATION - ANIMATED COUNTERS
// =============================================

function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = el.getAttribute('data-target');
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const duration = parseInt(el.getAttribute('data-duration') || '1800');

  // Extract numeric value
  const isFloat = target.includes('.');
  const numericTarget = parseFloat(target);
  const start = 0;
  const startTime = performance.now();

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);
    const currentValue = start + (numericTarget - start) * easedProgress;

    if (isFloat) {
      el.textContent = prefix + currentValue.toFixed(1) + suffix;
    } else if (numericTarget >= 1000) {
      el.textContent = prefix + Math.round(currentValue).toLocaleString() + suffix;
    } else {
      el.textContent = prefix + Math.round(currentValue) + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = prefix + (numericTarget >= 1000 ? numericTarget.toLocaleString() : numericTarget) + suffix;
    }
  }

  requestAnimationFrame(update);
}
