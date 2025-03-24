// Для серверного варианта:
const SERVER_URL = "https://love-three-sandy.vercel.app";

// Для клиентского варианта (без сервера):
/**
 * Функция для задержки перехода между страницами
 * Сохраняет состояние FullScreen перед переходом
 */
function delayNavigation(event) {
  try {
    // 1. Отменяем стандартное поведение ссылки
    event.preventDefault();
    const targetUrl = event.currentTarget.href;

    // 2. Сохраняем текущее состояние FullScreen
    const isFullscreen = document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement;

    // 3. Если используется сервер (Vercel)
    if (typeof SERVER_URL !== 'undefined') {
      fetch(`${SERVER_URL}/api/fullscreen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullscreen: isFullscreen }),
        credentials: 'include'
      }).then(() => {
        window.location.href = targetUrl;
      }).catch(() => {
        window.location.href = targetUrl; // Fallback если сервер недоступен
      });
    }
    // 4. Клиентский вариант (localStorage)
    else {
      localStorage.setItem('fullscreen', isFullscreen ? 'true' : 'false');
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 50); // Минимальная задержка
    }
  } catch (e) {
    console.error('Navigation error:', e);
    window.location.href = event.currentTarget.href; // Аварийный переход
  }
}

class FullScreenManager {
  constructor() {
    this.icon = document.getElementById("fullscreen-icon");
    if (!this.icon) return;

    // Привязка контекста
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    
    // Инициализация
    this.init();
  }

  init() {
    // Восстановление состояния
    this.restoreState();
    
    // Обработчик клика
    this.icon.addEventListener("click", this.toggleFullscreen);
    
    // Глобальный обработчик клавиш (Esc)
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isFullscreen()) {
        this.saveState(false);
      }
    });
  }

  // Проверка состояния
  isFullscreen() {
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  }

  // Переключение режима
  async toggleFullscreen() {
    try {
      if (this.isFullscreen()) {
        await this.exitFullscreen();
      } else {
        await this.enterFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
      // Fallback для iOS
      this.toggleFullscreenFallback();
    }
  }

  // Вход в Fullscreen
  async enterFullscreen() {
    const element = document.documentElement;
    try {
      const requestFn = element.requestFullscreen || 
                      element.webkitRequestFullscreen || 
                      element.mozRequestFullScreen || 
                      element.msRequestFullscreen;
      
      if (requestFn) {
        await requestFn.call(element);
        this.saveState(true);
      }
    } catch (err) {
      console.error("Enter fullscreen failed:", err);
      throw err;
    }
  }

  // Выход из Fullscreen
  async exitFullscreen() {
    try {
      const exitFn = document.exitFullscreen || 
                    document.webkitExitFullscreen || 
                    document.mozCancelFullScreen || 
                    document.msExitFullscreen;
      
      if (exitFn) {
        await exitFn.call(document);
        this.saveState(false);
      }
    } catch (err) {
      console.error("Exit fullscreen failed:", err);
      throw err;
    }
  }

  // Сохранение состояния
  saveState(isActive) {
    // 1. LocalStorage для быстрого доступа
    localStorage.setItem("fullscreen", isActive ? "true" : "false");
    
    // 2. Если есть сервер - синхронизируем
    if (typeof SERVER_URL !== "undefined") {
      fetch(`${SERVER_URL}/api/fullscreen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullscreen: isActive }),
        credentials: "include"
      }).catch(e => console.log("Server sync error:", e));
    }
    
    // 3. Визуальное обновление
    this.icon.classList.toggle("active", isActive);
  }

  // Восстановление состояния
  restoreState() {
    const savedState = localStorage.getItem("fullscreen") === "true";
    this.icon.classList.toggle("active", savedState);
    
    // Автоматический вход только по действию пользователя
    document.addEventListener("click", () => {
      if (savedState && !this.isFullscreen()) {
        this.enterFullscreen().catch(e => console.log(e));
      }
    }, { once: true });
  }

  // Fallback для мобильных устройств
  toggleFullscreenFallback() {
    if (!document.fullscreenEnabled) {
      alert("Fullscreen mode requires user gesture. Please tap again.");
    }
  }
}

// Инициализация
new FullScreenManager();

// Защищённая инициализация
document.addEventListener("DOMContentLoaded", () => {
  try {
    new FullScreenManager();
  } catch (e) {
    console.error("FullScreenManager initialization failed:", e);
  }
});