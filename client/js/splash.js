document.addEventListener("DOMContentLoaded", function () {
    // Проверяем, была ли заставка уже показана
    if (!localStorage.getItem("splashShown")) {
        const splashScreen = document.getElementById("splash-screen");

        // Показываем заставку
        splashScreen.style.display = "flex";

        // Через 5 секунд скрываем заставку
        setTimeout(() => {
            splashScreen.classList.add("hide");

            // Удаляем заставку из DOM после анимации
            splashScreen.addEventListener("transitionend", () => {
                splashScreen.remove();
            });

            // Запоминаем, что заставка была показана
            localStorage.setItem("splashShown", true);
        }, 4000); // 5 секунд
    }
});