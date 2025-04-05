function setupFullscreen() {
  const fullscreenIcon = document.getElementById('fullscreen-icon');
  
  if (!fullscreenIcon) return;

  function isFullscreenSupported() {
    return document.fullscreenEnabled || 
           document.webkitFullscreenEnabled || 
           document.mozFullScreenEnabled;
  }

  function isFullscreen() {
    return document.fullscreenElement || 
           document.webkitFullscreenElement || 
           document.mozFullScreenElement;
  }

  function updateIconState() {
    if (isFullscreen()) {
      fullscreenIcon.classList.add('active');
    } else {
      fullscreenIcon.classList.remove('active');
    }
  }

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

  fullscreenIcon.addEventListener('click', toggleFullscreen);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isFullscreen()) {
      exitFullscreen();
    }
  });

  document.addEventListener('fullscreenchange', updateIconState);
  document.addEventListener('webkitfullscreenchange', updateIconState);
  document.addEventListener('mozfullscreenchange', updateIconState);
}

document.addEventListener('DOMContentLoaded', setupFullscreen);

localStorage.setItem("fullscreen", isFullscreen ? "true" : "false");