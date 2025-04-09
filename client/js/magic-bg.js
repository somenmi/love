document.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  container.className = 'magic-bubbles';
  document.body.prepend(container);

  const CONFIG = {
    DESKTOP: {
      COUNT: 60,
      SIZE_MIN: 6,
      SIZE_MAX: 26,
      ROTATION_MIN: -15, // Минимальный угол поворота (градусы)
      ROTATION_MAX: 15   // Максимальный угол поворота
    },
    MOBILE: {
      COUNT: 20,
      SIZE_MIN: 4,
      SIZE_MAX: 20,
      ROTATION_MIN: -15,
      ROTATION_MAX: 15
    },
    ANIMATION_DURATION_MIN: 6,
    ANIMATION_DURATION_MAX: 9
  };

  const isMobile = window.innerWidth < 768;
  const { COUNT, SIZE_MIN, SIZE_MAX, ROTATION_MIN, ROTATION_MAX } = isMobile ? CONFIG.MOBILE : CONFIG.DESKTOP;

  for (let i = 0; i < COUNT; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    const size = SIZE_MIN + Math.random() * (SIZE_MAX - SIZE_MIN);
    const duration = CONFIG.ANIMATION_DURATION_MIN + 
                     Math.random() * (CONFIG.ANIMATION_DURATION_MAX - CONFIG.ANIMATION_DURATION_MIN);
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    const xDrift = -5 + Math.random() * 10;
    const rotation = ROTATION_MIN + Math.random() * (ROTATION_MAX - ROTATION_MIN);

    bubble.style.cssText = `
      --size: ${size}px;
      --start-x: ${startX}vw;
      --start-y: ${startY}vh;
      --x-drift: ${xDrift}vw;
      --rotation: ${rotation}deg;
      animation-duration: ${duration}s;
      animation-delay: 0s;
      opacity: ${0.4 + Math.random() * 0.6};
    `;

    container.appendChild(bubble);
  }
});