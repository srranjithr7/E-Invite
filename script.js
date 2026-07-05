(function () {
  "use strict";

  const weddingDate = new Date("2026-09-13T10:00:00+05:30").getTime();

  let cover;
  let canvas;
  let box;
  let ctx;
  let drawing = false;
  let revealed = false;
  let scratchCount = 0;
  let inviteOpened = false;

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
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

  function transitionSparks() {
    for (let i = 0; i < 46; i++) {
      const s = document.createElement("div");
      s.className = "transitionSpark";
      s.style.left = "50vw";
      s.style.top = "50vh";
      const angle = Math.random() * Math.PI * 2;
      const dist = 120 + Math.random() * 360;
      s.style.setProperty("--tx", Math.cos(angle) * dist + "px");
      s.style.setProperty("--ty", Math.sin(angle) * dist + "px");
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1300);
    }
  }

  function openInvite() {
    if (inviteOpened) return;
    inviteOpened = true;

    cover = document.getElementById("cover");
    if (!cover) return;

    cover.classList.add("opening");
    transitionSparks();

    setTimeout(() => {
      cover.classList.add("hide");
      window.scrollTo({ top: 0, behavior: "smooth" });
      const hero = document.getElementById("home");
      if (hero) hero.classList.add("revealHero");
    }, 850);
  }

  function revealOnScroll() {
    document.querySelectorAll(".reveal").forEach(item => {
      if (item.getBoundingClientRect().top < window.innerHeight - 110) {
        item.classList.add("show");
      }
    });
  }

  function setupScratch() {
    if (!canvas || !box || !ctx || revealed) return;

    const rect = box.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const scale = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * scale);
    canvas.height = Math.round(rect.height * scale);
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.globalCompositeOperation = "source-over";

    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#9b7330");
    gradient.addColorStop(0.25, "#f1d28a");
    gradient.addColorStop(0.5, "#b9832e");
    gradient.addColorStop(0.75, "#f8e0a0");
    gradient.addColorStop(1, "#8b6427");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = "rgba(255,255,255,0.24)";
    ctx.font = "600 13px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SCRATCH TO REVEAL", rect.width / 2, rect.height / 2);
  }

  function point(e) {
    const rect = canvas.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x: p.clientX - rect.left, y: p.clientY - rect.top };
  }

  function addSpark(x, y) {
    if (!box) return;
    const s = document.createElement("div");
    s.className = "spark";
    s.style.left = x + "px";
    s.style.top = y + "px";
    box.appendChild(s);
    setTimeout(() => s.remove(), 800);
  }

  function scratch(e) {
    if (!drawing || revealed || !ctx || !canvas) return;
    e.preventDefault();

    const p = point(e);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 34, 0, Math.PI * 2);
    ctx.fill();

    if (scratchCount % 3 === 0) addSpark(p.x, p.y);
    scratchCount++;

    if (scratchCount > 32) finishReveal();
  }

  function launchLuxurySparkles() {
    const types = ["flake", "flake", "circle", "petal", "star"];

    for (let i = 0; i < 160; i++) {
      setTimeout(() => {
        const p = document.createElement("div");
        const type = types[Math.floor(Math.random() * types.length)];
        p.className = "luxPiece " + type;

        if (type === "star") p.textContent = Math.random() > 0.5 ? "✦" : "✧";

        p.style.left = Math.random() * 100 + "vw";
        p.style.animationDuration = 5.5 + Math.random() * 4.5 + "s";
        p.style.setProperty("--drift", -140 + Math.random() * 280 + "px");
        p.style.setProperty("--rot", 360 + Math.random() * 720 + "deg");
        p.style.opacity = 0.82 + Math.random() * 0.18;

        document.body.appendChild(p);
        setTimeout(() => p.remove(), 11500);
      }, i * 18);
    }
  }

  function finishReveal() {
    if (revealed) return;
    revealed = true;

    if (box) box.classList.add("revealed");
    if (canvas) {
      canvas.style.transition = "opacity 1s ease";
      canvas.style.opacity = 0;
      setTimeout(() => { canvas.style.pointerEvents = "none"; }, 1000);
    }

    launchLuxurySparkles();
  }

  function initScratch() {
    canvas = document.getElementById("scratchCanvas");
    box = document.getElementById("designerDate");

    if (!canvas || !box) return;

    ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.addEventListener("mousedown", e => { drawing = true; scratch(e); });
    canvas.addEventListener("mousemove", scratch);
    window.addEventListener("mouseup", () => { drawing = false; });

    canvas.addEventListener("touchstart", e => { drawing = true; scratch(e); }, { passive: false });
    canvas.addEventListener("touchmove", scratch, { passive: false });
    window.addEventListener("touchend", () => { drawing = false; });

    window.addEventListener("resize", () => setupScratch());
    setupScratch();
  }

  document.addEventListener("DOMContentLoaded", () => {
    cover = document.getElementById("cover");
    if (cover) cover.addEventListener("click", openInvite);

    updateCountdown();
    setInterval(updateCountdown, 1000);

    window.addEventListener("scroll", revealOnScroll, { passive: true });
    revealOnScroll();

    initScratch();
  });

  window.openInvite = openInvite;
  window.finishReveal = finishReveal;
})();
