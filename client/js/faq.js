document.addEventListener("DOMContentLoaded", function () {
  function protectElement(element) {
    if (!element) return;

    element.style.userSelect = 'none';
    element.style.webkitUserSelect = 'none';
    element.style.msUserSelect = 'none';
    element.style.mozUserSelect = 'none';

    element.setAttribute('draggable', 'false');
    element.addEventListener('dragstart', (e) => e.preventDefault());

    element.addEventListener('contextmenu', (e) => e.preventDefault());

    element.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });
  }

  const allowTextButton = document.getElementById("toggle-text");
  allowTextButton.style.userSelect = 'auto';
  allowTextButton.style.pointerEvents = 'auto';
  allowTextButton.removeAttribute('draggable');

  document.querySelectorAll('body > *:not(#toggle-text)').forEach(el => {
    protectElement(el);
  });

  protectElement(document.body);
  protectElement(document.documentElement);

  const textContainer = document.querySelector(".faq-text ul");
  textContainer.addEventListener('click', function (e) {
    e.stopPropagation();
  });
});