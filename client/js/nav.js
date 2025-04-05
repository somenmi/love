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
    
    protectElement(navContainer);
  
    window.delayNavigation = function(event) {
      event.preventDefault();
      const targetUrl = event.currentTarget.getAttribute('href');
      
      event.currentTarget.style.transform = 'scale(0.95)';
      setTimeout(() => {
        event.currentTarget.style.transform = 'scale(1)';
      }, 150);

      setTimeout(() => {
        window.location.href = targetUrl;
      }, 300);
    };
  });