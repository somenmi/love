const playButton = document.getElementById("play-button");
const previewAudio = document.getElementById("preview-audio");
const playIcon = document.getElementById("play-icon");
const pauseIcon = document.getElementById("pause-icon");
const albumCover = document.querySelector(".album-cover");

previewAudio.volume = 0.15;

function protectElement(element) {
  element.addEventListener("dragstart", (e) => e.preventDefault());
  element.addEventListener("contextmenu", (e) => e.preventDefault());
  element.setAttribute("draggable", "false");
  
  // Для мобильных устройств
  element.addEventListener("touchstart", (e) => {
    if (e.touches.length > 1) e.preventDefault();
  }, { passive: false });
}

protectElement(playButton);
protectElement(albumCover);
protectElement(playIcon);
protectElement(pauseIcon);

playButton.addEventListener("click", function (e) {
  e.stopPropagation();
  
  if (previewAudio.paused) {
    previewAudio.play();
    playIcon.style.display = "none";
    pauseIcon.style.display = "block";
  } else {
    previewAudio.pause();
    playIcon.style.display = "block";
    pauseIcon.style.display = "none";
  }
});

previewAudio.addEventListener("ended", function () {
  playIcon.style.display = "block";
  pauseIcon.style.display = "none";
});

albumCover.addEventListener("click", function() {
  window.open("https://ваша-ссылка-на-бэндлинк", "_blank"); // добавить ссылку
});

[playIcon, pauseIcon].forEach(icon => {
  if (icon) {
    icon.style.pointerEvents = "none";
    icon.style.userSelect = "none";
  }
});