// Функция для инициализации слайдера
function initSlider(sliderContainer) {
  const sliderTrack = sliderContainer.querySelector(".slider-track");
  const leftButton = sliderContainer.querySelector(".left-button");
  const rightButton = sliderContainer.querySelector(".right-button");

  let currentIndex = 0; // Текущий индекс слайда
  const totalSlides = sliderContainer.querySelectorAll(".slider-item").length; // Общее количество слайдов

  // Функция для переключения слайдов
  function moveSlider(direction) {
    const sliderWidth = sliderContainer.querySelector(".slider-item").clientWidth; // Ширина одного слайда

    if (direction === "left") {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; // Бесконечный цикл влево
    } else if (direction === "right") {
      currentIndex = (currentIndex + 1) % totalSlides; // Бесконечный цикл вправо
    }

    // Перемещаем слайдер
    sliderTrack.style.transform = `translateX(-${currentIndex * sliderWidth}px)`;

    // Анимация появления следующего слайда
    animateSlide();
  }

  // Функция для анимации слайда
  function animateSlide() {
    const slides = sliderContainer.querySelectorAll(".slider-item");

    slides.forEach((slide, index) => {
      if (index === currentIndex) {
        // Текущий слайд: плавно появляется и увеличивается
        slide.style.opacity = "1";
        slide.style.transform = "scale(1)";
      } else {
        // Остальные слайды: прозрачные и уменьшенные
        slide.style.opacity = "0";
        slide.style.transform = "scale(0.5)";
      }
    });
  }

  // Обработчики для кнопок
  leftButton.addEventListener("click", () => moveSlider("left"));
  rightButton.addEventListener("click", () => moveSlider("right"));

  // Обработчик для свайпа (на мобильных устройствах)
  let startX = 0;
  let endX = 0;

  sliderTrack.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  sliderTrack.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  });

  function handleSwipe() {
    if (startX - endX > 50) {
      moveSlider("right"); // Свайп вправо
    } else if (endX - startX > 50) {
      moveSlider("left"); // Свайп влево
    }
  }

  // Инициализация: показываем первый слайд
  animateSlide();
}

// Инициализация всех слайдеров на странице
document.querySelectorAll(".slider-container").forEach((sliderContainer) => {
  initSlider(sliderContainer);
});