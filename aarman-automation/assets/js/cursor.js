// =============================================
// AARMAN AUTOMATION - CURSOR JS
// =============================================

function initCursor() {
  // Only on desktop
  if (window.matchMedia('(max-width: 768px)').matches) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.innerHTML = '<div class="cursor-outer"></div><div class="cursor-inner"></div>';
  document.body.appendChild(cursor);

  const outer = cursor.querySelector('.cursor-outer');
  const inner = cursor.querySelector('.cursor-inner');

  let mouseX = 0, mouseY = 0;
  let outerX = 0, outerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    inner.style.left = mouseX + 'px';
    inner.style.top = mouseY + 'px';
  });

  // Smooth outer cursor
  function animateOuter() {
    outerX += (mouseX - outerX) * 0.12;
    outerY += (mouseY - outerY) * 0.12;
    outer.style.left = outerX + 'px';
    outer.style.top = outerY + 'px';
    requestAnimationFrame(animateOuter);
  }
  animateOuter();

  // Hover effects on interactive elements
  const interactives = 'a, button, .btn, .service-card, .info-card, .nav-link';

  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
}
