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
    // Жёсткая привязка методов к экземпляру класса
    this.isFullscreen = this.isFullscreen.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.enterFullscreen = this.enterFullscreen.bind(this);
    this.exitFullscreen = this.exitFullscreen.bind(this);
    this.saveState = this.saveState.bind(this);
    this.handleFullscreenChange = this.handleFullscreenChange.bind(this);

    this.icon = document.getElementById("fullscreen-icon");
    if (!this.icon) return;

    this.init();
  }

  init() {
    // Восстановление состояния при загрузке
    this.restoreState();

    // Обработчики событий
    this.icon.addEventListener("click", this.toggleFullscreen);

    // Слушатели изменения состояния FullScreen
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', this.handleFullscreenChange);
  }

  // Проверка текущего состояния FullScreen
  isFullscreen() {
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  }

  async getFullscreenState() {
    try {
      const response = await fetch(`${SERVER_URL}/api/fullscreen?t=${Date.now()}`, {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      return data.fullscreen;
    } catch (error) {
      console.error("Ошибка при получении состояния:", error);
      return localStorage.getItem('fullscreen') === 'true'; // Fallback
    }
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
      console.error("Fullscreen toggle error:", error);
    }
  }

  // Вход в FullScreen
  async enterFullscreen() {
    if (this.isFullscreen()) return;

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
    }
  }

  // Выход из FullScreen
  async exitFullscreen() {
    if (!this.isFullscreen()) return;

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
    }
  }

  // Сохранение состояния
  saveState(isActive) {
    try {
      localStorage.setItem('fullscreen', String(isActive));
      this.icon?.classList.toggle('active', isActive);
    } catch (e) {
      console.warn("LocalStorage access error:", e);
    }
  }

  // Восстановление состояния
  restoreState() {
    try {
      const savedState = localStorage.getItem('fullscreen') === 'true';
      this.icon?.classList.toggle('active', savedState);
    } catch (e) {
      console.warn("LocalStorage read error:", e);
    }
  }

  // Обработчик изменения состояния
  handleFullscreenChange() {
    this.saveState(this.isFullscreen());
  }
}



// Защищённая инициализация
document.addEventListener("DOMContentLoaded", () => {
  try {
    new FullScreenManager();
  } catch (e) {
    console.error("FullScreenManager initialization failed:", e);
  }
});