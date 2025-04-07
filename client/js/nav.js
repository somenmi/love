document.addEventListener('DOMContentLoaded', function() {
  const navIcons = document.querySelectorAll('.nav-icon');
  const navImages = document.querySelectorAll('.nav-icon img');
  const navContainer = document.querySelector('.nav-icons-container');

  function protectElement(element) {
    if (!element) return;
    
    element.addEventListener('dragstart', (e) => e.preventDefault());
    element.addEventListener('contextmenu', (e) => e.preventDefault());
    element.setAttribute('draggable', 'false');
    
    element.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });
  }

  navIcons.forEach(icon => protectElement(icon));
  navImages.forEach(img => {
    protectElement(img);
    img.style.pointerEvents = 'none';
  });
  
  if (navContainer) protectElement(navContainer);

  window.delayNavigation = function(event) {
    if (!event || !event.currentTarget) return;
    
    event.preventDefault();
    const targetUrl = event.currentTarget.getAttribute('href');
    
    // Добавляем анимацию только если элемент существует
    const currentTarget = event.currentTarget;
    if (currentTarget && currentTarget.style) {
      currentTarget.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (currentTarget && currentTarget.style) {
          currentTarget.style.transform = 'scale(1)';
        }
      }, 150);
    }

    // Плавное исчезновение всей навигации перед переходом
    if (navContainer && navContainer.style) {
      navContainer.style.opacity = '1';
      navContainer.style.pointerEvents = 'none';
    }

    setTimeout(() => {
      if (targetUrl) {
        window.location.href = targetUrl;
      }
    }, 300);
  };
  
  // Назначаем обработчики на все иконки
  navIcons.forEach(icon => {
    icon.addEventListener('click', window.delayNavigation);
  });
});