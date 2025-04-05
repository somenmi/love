function initSlider(sliderContainer) {
  const sliderTrack = sliderContainer.querySelector(".slider-track");
  const leftButton = sliderContainer.querySelector(".left-button");
  const rightButton = sliderContainer.querySelector(".right-button");
  let currentIndex = 0;
  const totalSlides = sliderContainer.querySelectorAll(".slider-item").length;

  function moveSlider(direction) {
    const sliderWidth = sliderContainer.querySelector(".slider-item").clientWidth;

    if (direction === "left") {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    } else if (direction === "right") {
      currentIndex = (currentIndex + 1) % totalSlides;
    }

    sliderTrack.style.transform = `translateX(-${currentIndex * sliderWidth}px)`;
    animateSlide();
  }

  function animateSlide() {
    const slides = sliderContainer.querySelectorAll(".slider-item");
    
    slides.forEach((slide, index) => {
      slide.classList.remove("active");
      
      if (index === currentIndex) {
        slide.classList.add("active");
      }
    });
  }

  // Обработчики событий
  leftButton.addEventListener("click", () => moveSlider("left"));
  rightButton.addEventListener("click", () => moveSlider("right"));

  // Свайп для мобильных устройств
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
      moveSlider("right");
    } else if (endX - startX > 50) {
      moveSlider("left");
    }
  }

  // Инициализация
  animateSlide();
}

// Инициализация всех слайдеров
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".slider-container").forEach((sliderContainer) => {
    initSlider(sliderContainer);
  });
});

// Запрет перетаскивания
document.querySelectorAll('.slider-item img').forEach(img => {
  img.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });
});

// Запрет контекстного меню (ПКМ)
document.querySelector('.slider').addEventListener('contextmenu', (e) => {
  e.preventDefault();
});