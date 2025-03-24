document.addEventListener("DOMContentLoaded", function() {
    // Проверяем, нужно ли показывать заставку (добавляем проверку на мобильные устройства)
    if (!localStorage.getItem("splashShown") && window.innerWidth > 768) {
        const splashScreen = document.getElementById("splash-screen");
        const lottiePlayer = document.querySelector("lottie-player");
        
        // Показываем заставку
        splashScreen.style.display = "flex";

        // Обработчики для Lottie
        const handleAnimationLoaded = () => {
            // Таймер для скрытия заставки
            setTimeout(() => {
                hideSplash(splashScreen);
            }, 4000);
        };

        const handleAnimationError = () => {
            // Если анимация не загрузилась, сразу скрываем
            hideSplash(splashScreen);
        };

        // Добавляем обработчики событий Lottie
        if (lottiePlayer) {
            lottiePlayer.addEventListener("load", handleAnimationLoaded);
            lottiePlayer.addEventListener("error", handleAnimationError);
            
            // Запасной таймер на случай проблем с Lottie
            setTimeout(() => {
                if (splashScreen.style.display !== "none") {
                    hideSplash(splashScreen);
                }
            }, 5000);
        } else {
            // Если нет Lottie-плеера
            setTimeout(() => {
                hideSplash(splashScreen);
            }, 2000);
        }
    } else {
        // Если заставка не нужна, сразу удаляем
        const splashScreen = document.getElementById("splash-screen");
        if (splashScreen) splashScreen.remove();
    }
});

function hideSplash(splashScreen) {
    splashScreen.classList.add("hide");
    
    // Удаляем после анимации
    splashScreen.addEventListener("transitionend", () => {
        splashScreen.remove();
        localStorage.setItem("splashShown", "true");
    }, { once: true });
    
    // Запасной вариант если transitionend не сработал
    setTimeout(() => {
        if (document.body.contains(splashScreen)) {
            splashScreen.remove();
            localStorage.setItem("splashShown", "true");
        }
    }, 1000);
}