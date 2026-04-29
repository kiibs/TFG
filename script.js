/* ═══════════════════════════════════════════════════════════════
   REVARCANA — main.js
   Cursor · Partículas · Símbolos tarot · Marquee · Idioma · Reveal
   ═══════════════════════════════════════════════════════════════ */

// ── CURSOR ────────────────────────────────────────────────────────
(function initCursor() {
  const cursor = document.getElementById("cursor");
  const ring = document.getElementById("cursor-ring");
  if (!cursor || !ring) return;

  let mouseX = 0,
    mouseY = 0;
  let ringX = 0,
    ringY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
  });

  function animRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";
    requestAnimationFrame(animRing);
  }
  animRing();
})();

// ── PARTÍCULAS DORADAS ────────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W,
    H,
    particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const COLORS = ["rgba(201,168,76,", "rgba(232,204,122,", "rgba(138,107,42,"];

  class Particle {
    constructor() {
      this.reset(true);
    }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.size = Math.random() * 1.8 + 0.3;
      this.speed = Math.random() * 0.35 + 0.1;
      this.opacity = 0;
      this.maxOpacity = Math.random() * 0.55 + 0.1;
      this.fadeSpeed = Math.random() * 0.004 + 0.002;
      this.drift = (Math.random() - 0.5) * 0.25;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.state = "fadein";
    }
    update() {
      this.y -= this.speed;
      this.x += this.drift;
      if (this.state === "fadein") {
        this.opacity += this.fadeSpeed;
        if (this.opacity >= this.maxOpacity) this.state = "hold";
      } else if (this.state === "hold") {
        if (this.y < H * 0.3) this.state = "fadeout";
      } else {
        this.opacity -= this.fadeSpeed * 0.5;
      }
      if (this.y < -10 || this.opacity <= 0) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.opacity.toFixed(3) + ")";
      ctx.fill();
    }
  }

  for (let i = 0; i < 90; i++) particles.push(new Particle());

  function animParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animParticles);
  }
  animParticles();
})();

// ── SÍMBOLOS DEL TAROT FLOTANTES ─────────────────────────────────
(function initFloatingSymbols() {
  const symbols = ["★", "☽", "☉", "⊕", "✦", "⋄", "✶", "⊗", "◈", "✧", "⬡", "⌖"];

  function spawnSymbol() {
    const el = document.createElement("div");
    el.className = "tarot-symbol-float";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 90 + 5 + "vw";
    el.style.top = Math.random() * 70 + 10 + "vh";
    el.style.fontSize = Math.random() * 1.5 + 0.8 + "rem";
    document.body.appendChild(el);

    setTimeout(() => {
      el.style.opacity = "1";
    }, 50);

    const duration = Math.random() * 6000 + 5000;
    setTimeout(() => {
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 1200);
    }, duration);
  }

  setInterval(spawnSymbol, 1800);
})();

// ── MARQUEE ARCANA ────────────────────────────────────────────────
(function initMarquee() {
  const strip = document.getElementById("arcanaScroll");
  if (!strip) return;

  const arcana = [
    "El Loco",
    "El Mago",
    "La Sacerdotisa",
    "La Emperatriz",
    "El Emperador",
    "El Hierofante",
    "Los Enamorados",
    "El Carro",
    "La Fuerza",
    "El Ermitaño",
    "La Rueda de la Fortuna",
    "La Justicia",
    "El Colgado",
    "La Muerte",
    "La Templanza",
    "El Diablo",
    "La Torre",
    "La Estrella",
    "La Luna",
    "El Sol",
    "El Juicio",
    "El Mundo",
  ];

  [...arcana, ...arcana].forEach((name) => {
    const item = document.createElement("div");
    item.className = "arcana-item";
    item.innerHTML = `<span class="dot"></span><span>${name}</span>`;
    strip.appendChild(item);
  });
})();

// ── CAMBIO DE IDIOMA ──────────────────────────────────────────────
(function initLang() {
  const langBtns = document.querySelectorAll(".lang-btn");
  if (!langBtns.length) return;

  // Persiste el idioma entre páginas
  let currentLang = localStorage.getItem("revarcana-lang") || "es";
  applyLang(currentLang);

  langBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      applyLang(btn.dataset.lang);
      localStorage.setItem("revarcana-lang", btn.dataset.lang);
    })
  );

  function applyLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-es]").forEach((el) => {
      const txt = el.getAttribute("data-" + lang);
      if (!txt) return;
      if (txt.includes("<em>") || txt.includes("<strong>")) {
        el.innerHTML = txt;
      } else {
        el.textContent = txt;
      }
    });

    langBtns.forEach((b) =>
      b.classList.toggle("active", b.dataset.lang === lang)
    );
  }
})();

// ── SCROLL REVEAL ─────────────────────────────────────────────────
(function initScrollReveal() {
  const selectors = [
    "#lore .lore-text > *",
    ".feature-item",
    "#download > *",
    ".product-card",
    ".merch-banner-inner",
    ".page-hero > *",
  ];

  const els = document.querySelectorAll(selectors.join(", "));
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.animation =
            "fadeSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) forwards";
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  els.forEach((el) => {
    el.style.opacity = "0";
    io.observe(el);
  });
})();

// ── HIGHLIGHT NAV LINK ACTIVO ─────────────────────────────────────
(function initActiveNav() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (href === page || (page === "index.html" && href === "#")) {
      a.classList.add("active");
    }
    // Para merch.html
    if (href.includes("merch") && page.includes("merch")) {
      a.classList.add("active");
    }
  });
})();
