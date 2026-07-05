(function () {
  'use strict';

  const weddingDate = new Date('2026-09-13T10:00:00+05:30').getTime();
  const cover = document.getElementById('cover');
  const openBtn = document.getElementById('openInviteBtn');
  const dateCard = document.getElementById('dateCard');
  const revealBtn = document.getElementById('revealDateBtn');
  const canvas = document.getElementById('scratchCanvas');
  let ctx = null;
  let drawing = false;
  let revealed = false;
  let scratchMoves = 0;

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = String(value);
  }

  function updateCountdown() {
    const diff = weddingDate - Date.now();
    if (diff <= 0) {
      setText('days', 0);
      setText('hours', 0);
      setText('minutes', 0);
      setText('seconds', 0);
      return;
    }
    setText('days', Math.floor(diff / 86400000));
    setText('hours', Math.floor((diff % 86400000) / 3600000));
    setText('minutes', Math.floor((diff % 3600000) / 60000));
    setText('seconds', Math.floor((diff % 60000) / 1000));
  }

  function openInvite() {
    if (!cover || cover.classList.contains('hide')) return;
    cover.classList.add('hide');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 120);
    launchSparkles(36);
  }

  function revealOnScroll() {
    const items = document.querySelectorAll('.reveal');
    items.forEach((item) => {
      const top = item.getBoundingClientRect().top;
      if (top < window.innerHeight - 70) item.classList.add('show');
    });
  }

  function setupScratch() {
    if (!canvas || !dateCard || revealed) return;
    ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = dateCard.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#8c6425');
    gradient.addColorStop(0.22, '#f1d28b');
    gradient.addColorStop(0.48, '#b9842d');
    gradient.addColorStop(0.74, '#f7df9d');
    gradient.addColorStop(1, '#8c6425');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = 'rgba(255,255,255,.78)';
    ctx.font = '700 13px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH TO REVEAL', rect.width / 2, rect.height / 2);
  }

  function pointerPosition(event) {
    const rect = canvas.getBoundingClientRect();
    const point = event.touches ? event.touches[0] : event;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  }

  function scratch(event) {
    if (!drawing || !ctx || !canvas || revealed) return;
    event.preventDefault();
    const point = pointerPosition(event);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 30, 0, Math.PI * 2);
    ctx.fill();
    scratchMoves += 1;
    if (scratchMoves > 22) finishReveal();
  }

  function finishReveal() {
    if (revealed) return;
    revealed = true;
    if (dateCard) dateCard.classList.add('revealed');
    if (canvas) {
      canvas.style.transition = 'opacity .7s ease';
      canvas.style.opacity = '0';
      setTimeout(() => { canvas.style.pointerEvents = 'none'; }, 720);
    }
    launchSparkles(70);
  }

  function launchSparkles(count) {
    const symbols = ['✦', '✧', '•'];
    for (let i = 0; i < count; i += 1) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'sparkle';
        el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        el.style.left = Math.random() * 100 + 'vw';
        el.style.fontSize = (11 + Math.random() * 12) + 'px';
        el.style.animationDuration = (4 + Math.random() * 4) + 's';
        el.style.setProperty('--drift', (-80 + Math.random() * 160) + 'px');
        el.style.setProperty('--rot', (180 + Math.random() * 720) + 'deg');
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 9000);
      }, i * 25);
    }
  }

  function bindScratch() {
    if (!canvas) return;
    canvas.addEventListener('mousedown', (e) => { drawing = true; scratch(e); });
    canvas.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', () => { drawing = false; });
    canvas.addEventListener('touchstart', (e) => { drawing = true; scratch(e); }, { passive: false });
    canvas.addEventListener('touchmove', scratch, { passive: false });
    window.addEventListener('touchend', () => { drawing = false; });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (cover) cover.addEventListener('click', (e) => {
      if (e.target && e.target.tagName === 'A') return;
      openInvite();
    });
    if (openBtn) openBtn.addEventListener('click', (e) => { e.stopPropagation(); openInvite(); });
    if (revealBtn) revealBtn.addEventListener('click', finishReveal);

    updateCountdown();
    setInterval(updateCountdown, 1000);

    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll, { passive: true });
    window.addEventListener('resize', () => { setupScratch(); revealOnScroll(); });

    setupScratch();
    bindScratch();
  });

  window.openInvite = openInvite;
  window.finishReveal = finishReveal;
})();
