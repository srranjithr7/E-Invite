(function () {
  "use strict";

  const weddingDate = new Date("2026-09-13T10:00:00+05:30").getTime();

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = String(value);
  }

  function updateCountdown() {
    const diff = weddingDate - Date.now();

    if (diff <= 0) {
      setText("days", 0);
      setText("hours", 0);
      setText("minutes", 0);
      setText("seconds", 0);
      return;
    }

    setText("days", Math.floor(diff / 86400000));
    setText("hours", Math.floor((diff % 86400000) / 3600000));
    setText("minutes", Math.floor((diff % 3600000) / 60000));
    setText("seconds", Math.floor((diff % 60000) / 1000));
  }

  function init() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
