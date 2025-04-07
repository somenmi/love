document.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  container.className = 'magic-bubbles';
  document.body.prepend(container);

  const CONFIG = {
    DESKTOP: {
      COUNT: 120,       // Количество пузырей на ПК
      SIZE_MIN: 2,      // Минимальный размер (px)
      SIZE_MAX: 4       // Максимальный размер
    },
    MOBILE: {
      COUNT: 50,        // Количество на мобильных
      SIZE_MIN: 1,
      SIZE_MAX: 4
    },
    ANIMATION_DURATION_MIN: 15,  // Минимальная длительность (сек)
    ANIMATION_DURATION_MAX: 40    // Максимальная длительность
  };

  const isMobile = window.innerWidth < 768;
  const { COUNT, SIZE_MIN, SIZE_MAX } = isMobile ? CONFIG.MOBILE : CONFIG.DESKTOP;

  const bubblesFragment = document.createDocumentFragment();
  
  for (let i = 0; i < COUNT; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    const size = SIZE_MIN + Math.random() * (SIZE_MAX - SIZE_MIN);
    const duration = CONFIG.ANIMATION_DURATION_MIN + 
                     Math.random() * (CONFIG.ANIMATION_DURATION_MAX - CONFIG.ANIMATION_DURATION_MIN);
    const startX = Math.random() * 100;
    const xDrift = -5 + Math.random() * 10;

    bubble.style.cssText = `
      --size: ${size}px;
      --start-x: ${startX}vw;
      --x-drift: ${xDrift}vw;
      animation-duration: ${duration}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${0.3 + Math.random() * 0.5};
    `;

    bubblesFragment.appendChild(bubble);
  }

  container.appendChild(bubblesFragment);

  if (isMobile) {
    container.style.perspective = '1000px';
  }
});