/* ═══════════════════════════════════════════════════════════════
   REVARCANA — merch.js
   Filtros de categoría · Feedback de "añadir al carrito"
   ═══════════════════════════════════════════════════════════════ */

// ── FILTROS DE CATEGORÍA ──────────────────────────────────────────
(function initFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".product-card");
  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      // Actualizar botón activo
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Filtrar tarjetas con animación suave
      cards.forEach((card) => {
        const cat = card.dataset.category;
        const show = filter === "all" || cat === filter;

        if (show) {
          card.style.display = "flex";
          // Forzar reflow para que la animación funcione
          void card.offsetWidth;
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(12px)";
          setTimeout(() => {
            if (card.style.opacity === "0") card.style.display = "none";
          }, 250);
        }
      });
    });
  });
})();

// ── BOTÓN "AÑADIR AL CARRITO" ─────────────────────────────────────
(function initAddToCart() {
  const lang = () => localStorage.getItem("revarcana-lang") || "es";
  const TEXTS = {
    es: { add: "Añadir", added: "Añadido ✦", cart: "En la bolsa" },
    en: { add: "Add", added: "Added ✦", cart: "In bag" },
  };

  // Carrito en memoria (en un proyecto real conectarías a un backend)
  const cart = [];

  document.querySelectorAll(".product-cta").forEach((cta) => {
    cta.addEventListener("click", () => {
      const card = cta.closest(".product-card");
      const name = card.querySelector(".product-name").textContent.trim();
      const price = card.querySelector(".product-price").textContent.trim();

      // Añadir al array de carrito
      const existing = cart.find((i) => i.name === name);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name, price, qty: 1 });
      }

      // Feedback visual en el botón
      const l = lang();
      cta.textContent = TEXTS[l].added;
      cta.style.color = "var(--gold)";
      cta.style.borderColor = "rgba(201,168,76,0.4)";

      setTimeout(() => {
        cta.textContent = TEXTS[l].cart;
        cta.style.color = "";
        cta.style.borderColor = "";
      }, 2000);

      // Actualizar badge del contador (si existe en el nav)
      updateCartBadge();
    });
  });

  function updateCartBadge() {
    const total = cart.reduce((sum, i) => sum + i.qty, 0);
    let badge = document.getElementById("cart-badge");

    if (!badge && total > 0) {
      // Crear badge dinámicamente en el nav
      badge = document.createElement("span");
      badge.id = "cart-badge";
      badge.style.cssText = `
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px; height: 18px;
          background: var(--gold);
          color: var(--ink);
          font-size: 0.6rem;
          font-weight: 500;
          border-radius: 50%;
          margin-left: 0.3rem;
          font-family: var(--font-body);
          letter-spacing: 0;
          vertical-align: middle;
        `;
      // Insertarlo junto al link de tienda en el nav
      const storeLink = document.querySelector(
        '.nav-links a[href="merch.html"]'
      );
      if (storeLink) storeLink.appendChild(badge);
    }

    if (badge) badge.textContent = total;
  }
})();

// ── HOVER 3D SUTIL EN LAS TARJETAS ───────────────────────────────
(function initCardTilt() {
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateY(${
        dx * 3
      }deg) rotateX(${-dy * 2}deg) translateY(-2px)`;
      card.style.transition = "transform 0.1s ease";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.transition =
        "transform 0.4s var(--ease-expo), background 0.3s";
    });
  });
})();
