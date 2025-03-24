// fullscreen.js (упрощенная версия без сервера)
class FullScreenManager {
    constructor() {
      this.icon = document.getElementById("fullscreen-icon");
      this.init();
    }
  
    init() {
      // Проверяем состояние из localStorage
      if (this.getFullscreenState()) this.enterFullscreen();
      this.setupEventListeners();
    }
  
    toggleFullscreen() {
      this.getFullscreenState() ? this.exitFullscreen() : this.enterFullscreen();
    }
  
    enterFullscreen() {
      const element = document.documentElement;
      if (element.requestFullscreen) element.requestFullscreen();
      this.updateFullscreenState(true);
    }
  
    exitFullscreen() {
      if (document.exitFullscreen) document.exitFullscreen();
      this.updateFullscreenState(false);
    }
  
    updateFullscreenState(state) {
      localStorage.setItem("fullscreen", state.toString());
      this.icon.classList.toggle("active", state);
    }
  
    getFullscreenState() {
      return localStorage.getItem("fullscreen") === "true";
    }
  }
  
  // Инициализация
  document.addEventListener("DOMContentLoaded", () => {
    new FullScreenManager();
  });