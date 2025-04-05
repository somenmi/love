/**
 * Инициализация слайдера
 * @param {HTMLElement} sliderContainer - Контейнер слайдера
 */
function initSlider(sliderContainer) {
  const sliderTrack = sliderContainer.querySelector(".slider-track");
  const leftButton = sliderContainer.querySelector(".left-button");
  const rightButton = sliderContainer.querySelector(".right-button");
  let currentIndex = 0;
  const totalSlides = sliderContainer.querySelectorAll(".slider-item").length;

  /**
   * Перемещает слайдер в указанном направлении
   * @param {string} direction - Направление ('left' или 'right')
   */
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

  leftButton.addEventListener("click", () => moveSlider("left"));
  rightButton.addEventListener("click", () => moveSlider("right"));

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

  function protectSliderElements() {
    sliderContainer.querySelectorAll('img').forEach(img => {
      img.addEventListener('dragstart', (e) => e.preventDefault());
      img.setAttribute('draggable', 'false');
    });

    sliderContainer.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    sliderContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });
  }

  animateSlide();
  protectSliderElements();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".slider-container").forEach((sliderContainer) => {
    initSlider(sliderContainer);
  });

  document.querySelectorAll('.slider').forEach(slider => {
    slider.addEventListener('contextmenu', (e) => e.preventDefault());
  });
});