// Получаем элементы
const playButton = document.getElementById("play-button");
const previewAudio = document.getElementById("preview-audio");
const playIcon = document.getElementById("play-icon");
const pauseIcon = document.getElementById("pause-icon");

// Устанавливаем громкость на 15%
previewAudio.volume = 0.15;

// Обработчик клика на кнопку
playButton.addEventListener("click", function () {
  if (previewAudio.paused) {
    // Если аудио на паузе, воспроизводим
    previewAudio.play();
    playIcon.style.display = "none"; // Скрываем PLAY
    pauseIcon.style.display = "block"; // Показываем PAUSE
  } else {
    // Если аудио играет, ставим на паузу
    previewAudio.pause();
    playIcon.style.display = "block"; // Показываем PLAY
    pauseIcon.style.display = "none"; // Скрываем PAUSE
  }
});

// Обработчик завершения воспроизведения
previewAudio.addEventListener("ended", function () {
  playIcon.style.display = "block"; // Показываем PLAY
  pauseIcon.style.display = "none"; // Скрываем PAUSE
});