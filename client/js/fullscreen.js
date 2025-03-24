const SERVER_URL = "http://localhost:3000";

// Функция для отправки состояния FullScreen на сервер
async function updateFullscreenState(fullscreen) {
    try {
        await fetch(`${SERVER_URL}/api/fullscreen`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fullscreen }),
        });
    } catch (error) {
        console.error("Ошибка при обновлении состояния FullScreen:", error);
    }
}

// Функция для получения состояния FullScreen с сервера
async function getFullscreenState() {
    try {
        const response = await fetch(`${SERVER_URL}/api/fullscreen`);
        const data = await response.json();
        return data.fullscreen;
    } catch (error) {
        console.error("Ошибка при получении состояния FullScreen:", error);
        return false;
    }
}

// Функция для перехода в полноэкранный режим
async function enterFullscreen() {
    const element = document.documentElement;

    if (element.requestFullscreen) {
        await element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
    }

    // Обновляем состояние на сервере
    await updateFullscreenState(true);
}

// Функция для выхода из полноэкранного режима
async function exitFullscreen() {
    if (document.exitFullscreen) {
        await document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
    }

    // Обновляем состояние на сервере
    await updateFullscreenState(false);
}

// Сохранение состояния в localStorage
function enterFullscreen() {
    const element = document.documentElement;

    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }

    // Сохраняем состояние в localStorage
    localStorage.setItem("fullscreen", "true");
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }

    // Удаляем состояние из localStorage
    localStorage.setItem("fullscreen", "false");
}

// Переключение FullScreen при клике на иконку
document.getElementById("fullscreen-icon").addEventListener("click", async () => {
    const fullscreen = await getFullscreenState();
    if (fullscreen) {
        await exitFullscreen();
    } else {
        await enterFullscreen();
    }
});

// Восстановление FullScreen при загрузке страницы
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const fullscreen = await getFullscreenState();
        if (fullscreen) {
            setTimeout(async () => {
                await enterFullscreen();
            }, 100);
        }
    } catch (error) {
        console.error("Ошибка при восстановлении FullScreen:", error);
    }
});

// Выход из FullScreen при нажатии на Esc
document.addEventListener("keydown", async (e) => {
    if (e.key === "Escape") {
        await exitFullscreen();
    }
});