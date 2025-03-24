// Конфигурация
const SERVER_URL = "https://love-three-sandy.vercel.app";

class FullScreenManager {
    constructor() {
      this.icon = document.getElementById("fullscreen-icon");
      if (!this.icon) return;
  
      // Восстановление состояния при загрузке
      this.restoreFullscreenState();
      
      // Обработчик клика
      this.icon.addEventListener("click", () => this.toggleFullscreen());
      
      // Следим за изменениями FullScreen (на случай выхода по Esc)
      document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
      document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
    }
  
    async toggleFullscreen() {
      try {
        if (this.isFullscreen()) {
          await this.exitFullscreen();
        } else {
          await this.enterFullscreen();
        }
      } catch (error) {
        console.error("Fullscreen error:", error);
      }
    }
  
    async enterFullscreen() {
      if (this.isFullscreen()) return;
  
      const element = document.documentElement;
      try {
        const requestMethod = 
          element.requestFullscreen || 
          element.webkitRequestFullscreen || 
          element.mozRequestFullScreen || 
          element.msRequestFullscreen;
        
        if (requestMethod) {
          await requestMethod.call(element);
          this.saveState(true);
        }
      } catch (err) {
        console.error("Enter fullscreen failed:", err);
      }
    }
  
    async exitFullscreen() {
      if (!this.isFullscreen()) return;
  
      try {
        const exitMethod = 
          document.exitFullscreen || 
          document.webkitExitFullscreen || 
          document.mozCancelFullScreen || 
          document.msExitFullscreen;
        
        if (exitMethod) {
          await exitMethod.call(document);
          this.saveState(false);
        }
      } catch (err) {
        console.error("Exit fullscreen failed:", err);
      }
    }
  
    isFullscreen() {
      return !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
    }
  
    saveState(isActive) {
      // Сохраняем в localStorage
      localStorage.setItem('fullscreen', isActive ? 'true' : 'false');
      
      // Обновляем иконку
      this.icon.classList.toggle('active', isActive);
    }
  
    restoreFullscreenState() {
      // Восстанавливаем состояние из localStorage
      const savedState = localStorage.getItem('fullscreen') === 'true';
      this.icon.classList.toggle('active', savedState);
    }
  
    handleFullscreenChange() {
      // Обновляем состояние при ручном изменении (например, по Esc)
      const isCurrentlyFullscreen = this.isFullscreen();
      this.saveState(isCurrentlyFullscreen);
    }
  }
  
  // Инициализация
  document.addEventListener("DOMContentLoaded", () => {
    new FullScreenManager();
  });

// При изменении состояния
localStorage.setItem('fullscreen', this.isFullscreen());

// При загрузке страницы
if (localStorage.getItem('fullscreen') === 'true') {
  this.icon.classList.add('active');
}