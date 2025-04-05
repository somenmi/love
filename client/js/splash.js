document.addEventListener("DOMContentLoaded", function () {

    if (!localStorage.getItem("splashShown")) {
        const splashScreen = document.getElementById("splash-screen");

        splashScreen.style.display = "flex";

        setTimeout(() => {
            splashScreen.classList.add("hide");

            splashScreen.addEventListener("transitionend", () => {
                splashScreen.remove();
            });

            localStorage.setItem("splashShown", true);
        }, 4000);
    }
});