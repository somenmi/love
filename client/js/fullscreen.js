// Конфигурация
const SERVER_URL = 'https://love-three-sandy.vercel.app'; // Замените на ваш хостинг

class FullScreenManager {
    constructor() {
        this.icon = document.getElementById("fullscreen-icon");
        this.init();
    }

    async init() {
        // Проверяем состояние при загрузке
        const isFullscreen = await this.getFullscreenState();
        if (isFullscreen) this.enterFullscreen();

        // Настройка обработчиков
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Клик по иконке
        this.icon.addEventListener("click", () => this.toggleFullscreen());

        // События изменения FullScreen
        document.addEventListener("fullscreenchange", this.handleFullscreenChange.bind(this));
        document.addEventListener("webkitfullscreenchange", this.handleFullscreenChange.bind(this));
        document.addEventListener("mozfullscreenchange", this.handleFullscreenChange.bind(this));
        document.addEventListener("MSFullscreenChange", this.handleFullscreenChange.bind(this));
    }

    async toggleFullscreen() {
        const isFullscreen = await this.getFullscreenState();
        isFullscreen ? this.exitFullscreen() : this.enterFullscreen();
    }

    async enterFullscreen() {
        const element = document.documentElement;

        try {
            if (element.requestFullscreen) await element.requestFullscreen();
            else if (element.webkitRequestFullscreen) await element.webkitRequestFullscreen();
            else if (element.mozRequestFullScreen) await element.mozRequestFullScreen();
            else if (element.msRequestFullscreen) await element.msRequestFullscreen();

            await this.updateFullscreenState(true);
            this.icon.classList.add("active");
        } catch (err) {
            console.error("FullScreen error:", err);
        }
    }

    async exitFullscreen() {
        try {
            if (document.exitFullscreen) await document.exitFullscreen();
            else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
            else if (document.mozCancelFullScreen) await document.mozCancelFullScreen();
            else if (document.msExitFullscreen) await document.msExitFullscreen();

            await this.updateFullscreenState(false);
            this.icon.classList.remove("active");
        } catch (err) {
            console.error("Exit FullScreen error:", err);
        }
    }

    handleFullscreenChange() {
        const isFullscreen = !!document.fullscreenElement ||
            !!document.webkitFullscreenElement ||
            !!document.mozFullScreenElement ||
            !!document.msFullscreenElement;

        if (!isFullscreen) {
            this.updateFullscreenState(false);
            this.icon.classList.remove("active");
        }
    }

    async updateFullscreenState(state) {
        try {
            await fetch(`${SERVER_URL}/api/fullscreen`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullscreen: state }),
                credentials: "include"
            });
        } catch (err) {
            console.error("Update state error:", err);
            // Fallback на localStorage
            localStorage.setItem("fullscreen", state.toString());
        }
    }

    async getFullscreenState() {
        try {
            const response = await fetch(`${SERVER_URL}/api/fullscreen`, {
                credentials: "include"
            });
            const data = await response.json();
            return data.fullscreen;
        } catch (err) {
            console.error("Get state error:", err);
            // Fallback на localStorage
            return localStorage.getItem("fullscreen") === "true";
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("fullscreen-icon")) {
        new FullScreenManager();
    }
});