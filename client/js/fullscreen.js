// Упрощенный Fullscreen Manager с визуальными стилями
function setupFullscreen() {
  const fullscreenIcon = document.getElementById('fullscreen-icon');
  
  if (!fullscreenIcon) return;

  // Проверка поддержки Fullscreen API
  function isFullscreenSupported() {
    return document.fullscreenEnabled || 
           document.webkitFullscreenEnabled || 
           document.mozFullScreenEnabled;
  }

  // Проверка текущего состояния
  function isFullscreen() {
    return document.fullscreenElement || 
           document.webkitFullscreenElement || 
           document.mozFullScreenElement;
  }

  // Обновление визуального состояния
  function updateIconState() {
    if (isFullscreen()) {
      fullscreenIcon.classList.add('active');
    } else {
      fullscreenIcon.classList.remove('active');
    }
  }

  // Вход в полноэкранный режим
  async function enterFullscreen() {
    const element = document.documentElement;
    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      }
      updateIconState();
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }

  // Выход из полноэкранного режима
  async function exitFullscreen() {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      }
      updateIconState();
    } catch (err) {
      console.error('Exit fullscreen error:', err);
    }
  }

  // Переключение режима
  async function toggleFullscreen() {
    if (!isFullscreenSupported()) {
      alert('Fullscreen is not supported in your browser');
      return;
    }

    if (isFullscreen()) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }

  // Обработчик клика
  fullscreenIcon.addEventListener('click', toggleFullscreen);

  // Выход по Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isFullscreen()) {
      exitFullscreen();
    }
  });

  // Следим за изменениями состояния
  document.addEventListener('fullscreenchange', updateIconState);
  document.addEventListener('webkitfullscreenchange', updateIconState);
  document.addEventListener('mozfullscreenchange', updateIconState);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', setupFullscreen);

// При выходе/входе в fullscreen
localStorage.setItem("fullscreen", isFullscreen ? "true" : "false");