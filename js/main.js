/* =====================================================================
   Portfolio interactions — vanilla JS, no dependencies
   ===================================================================== */
(function () {
  "use strict";
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none)").matches;

  /* ---------- Year stamps ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Nav scroll state + progress bar ---------- */
  const nav = document.querySelector(".nav");
  const progress = document.querySelector(".progress");
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 40);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector(".nav__toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open);
    });
    document.querySelectorAll(".nav__links a").forEach((a) =>
      a.addEventListener("click", () => document.body.classList.remove("menu-open"))
    );
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Hero title: rotate through roles ---------- */
  const roleLines = document.querySelectorAll("[data-roles] .split__title--ink");
  if (roleLines.length === 2 && !prefersReduced) {
    const roles = [
      ["Product", "Designer"],
      ["UI/UX", "Designer"],
      ["Design", "Engineer"],
    ];
    let role = 0;
    setInterval(() => {
      role = (role + 1) % roles.length;
      roleLines.forEach((el) => el.classList.add("swap"));
      setTimeout(() => {
        roleLines[0].textContent = roles[role][0];
        roleLines[1].textContent = roles[role][1];
        roleLines.forEach((el) => el.classList.remove("swap"));
      }, 360);
    }, 3400);
  }

  /* ---------- Work gallery: stacked cards with 3D tilt scroll-in ---------- */
  const tiles = Array.from(document.querySelectorAll(".gallery .tile"));
  if (tiles.length && !prefersReduced) {
    const desktop = window.matchMedia("(min-width: 821px)");
    // Layout position in document coords — offsetTop ignores transforms, so
    // reading it per-frame doesn't feed back into the animation
    const docTop = (el) => {
      let y = 0;
      for (let n = el; n; n = n.offsetParent) y += n.offsetTop;
      return y;
    };
    let tileRaf = 0;
    const updateTiles = () => {
      tileRaf = 0;
      if (!desktop.matches) {
        tiles.forEach((t) => (t.style.transform = ""));
        return;
      }
      const vh = window.innerHeight;
      tiles.forEach((tile) => {
        const pin = parseFloat(getComputedStyle(tile).top) || 0;
        const top = docTop(tile) - window.scrollY;
        const p = Math.min(1, Math.max(0, (vh - top) / (vh - pin)));
        if (p >= 1) {
          tile.style.transform = "none";
          return;
        }
        const rot = (1 - p) * 20;
        const scale = 1.05 - 0.05 * p;
        tile.style.transform = `perspective(1000px) rotateX(${rot}deg) scale(${scale})`;
      });
    };
    const queueTiles = () => {
      if (!tileRaf) tileRaf = requestAnimationFrame(updateTiles);
    };
    window.addEventListener("scroll", queueTiles, { passive: true });
    window.addEventListener("resize", queueTiles);
    updateTiles();
  }

  /* ---------- Interactive hero: parallax figure + spotlight ---------- */
  const hero = document.querySelector(".hero");
  if (hero && !isTouch && !prefersReduced) {
    const spot = document.createElement("div");
    spot.className = "hero__spotlight";
    hero.prepend(spot);

    const disc = hero.querySelector(".split__disc");
    const fig = hero.querySelector(".split__figure");
    let raf = 0;

    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const nx = px - 0.5, ny = py - 0.5;
      spot.style.setProperty("--mx", px * 100 + "%");
      spot.style.setProperty("--my", py * 100 + "%");
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // panel drifts gently, figure moves more → depth
        if (disc) disc.style.transform = `translate(${nx * 10}px, ${ny * 10}px)`;
        if (fig) fig.style.transform = `translate(${nx * 20}px, ${ny * 14}px)`;
      });
    });
    hero.addEventListener("pointerleave", () => {
      if (disc) disc.style.transform = "";
      if (fig) fig.style.transform = "";
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!isTouch && !prefersReduced) {
    document.querySelectorAll(".hero__ctas .text-btn, .nav__cta").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${mx * 0.28}px, ${my * 0.4}px)`;
      });
      btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
    });
  }


  /* ---------- Subtle parallax on project posters ---------- */
  if (!isTouch && !prefersReduced) {
    document.querySelectorAll(".project__media").forEach((media) => {
      media.addEventListener("mousemove", (e) => {
        const r = media.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width - 0.5;
        const cy = (e.clientY - r.top) / r.height - 0.5;
        const v = media.querySelector(".visual");
        if (v) v.style.transform = `scale(1.05) translate(${cx * -14}px, ${cy * -14}px)`;
      });
      media.addEventListener("mouseleave", () => {
        const v = media.querySelector(".visual");
        if (v) v.style.transform = "";
      });
    });
  }

  /* ---------- Active nav link synced to scroll position (every tab) ---------- */
  const navLinks = Array.from(document.querySelectorAll('.nav__links a[href^="#"]'));
  const spyTargets = navLinks
    .map((l) => { const el = document.querySelector(l.getAttribute("href")); return el ? { link: l, el } : null; })
    .filter(Boolean);
  if (spyTargets.length) {
    const syncActive = () => {
      const line = window.innerHeight * 0.3;                 // activation line ~30% down
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      let current = spyTargets[0];
      if (atBottom) {
        current = spyTargets[spyTargets.length - 1];         // pin last tab at page end
      } else {
        for (const t of spyTargets) {
          if (t.el.getBoundingClientRect().top - line <= 0) current = t;
        }
      }
      navLinks.forEach((l) => l.classList.toggle("active", l === current.link));
    };
    window.addEventListener("scroll", syncActive, { passive: true });
    window.addEventListener("resize", syncActive, { passive: true });
    syncActive();
  }

  /* ---------- Tech Stack: magnetic keycap field ---------- */
  const stack = document.querySelector("[data-stack]");
  if (stack && !isTouch && !prefersReduced) {
    const keys = Array.from(stack.querySelectorAll(".stack__key"));
    let raf = 0;
    stack.addEventListener("pointermove", (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        keys.forEach((k) => {
          const r = k.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          const dist = Math.hypot(dx, dy) || 1;
          // closer keys lean toward cursor more; capped
          const pull = Math.min(120 / dist, 1) * 16;
          k.style.setProperty("--px", (dx / dist) * pull + "px");
          k.style.setProperty("--py", (dy / dist) * pull + "px");
        });
      });
    });
    stack.addEventListener("pointerleave", () => {
      keys.forEach((k) => { k.style.setProperty("--px", "0px"); k.style.setProperty("--py", "0px"); });
    });
  }

  /* ---------- Hero code card: binary decode reveal (matches the flickering portrait) ---------- */
  const codeCard = document.querySelector(".split__side--r");
  if (codeCard) {
    const lines = [".split__code", ".split__heading", ".split__stack", ".split__desc"]
      .map((s) => codeCard.querySelector(s)).filter(Boolean);
    if (lines.length && !prefersReduced) {
      const texts = lines.map((el) => el.textContent);
      const BIN = "01";
      codeCard.style.minHeight = codeCard.offsetHeight + "px";   // reserve height, no reflow
      lines.forEach((el) => { el.textContent = ""; });
      let visible = false, running = false, loopTimer = 0;
      const HOLD = 2600;                            // pause with text settled before looping

      const decodeLine = (el, full, onDone) => {
        const chars = full.split("");
        const disp = chars.slice();
        // each glyph scrambles as 0/1, then locks in place — staggered left→right
        const settleAt = chars.map((c, idx) => 200 + idx * 30 + Math.random() * 130);
        el.classList.add("is-decoding");
        const start = performance.now();
        let lastFlip = 0;
        const frame = (now) => {
          const t = now - start;
          const flip = now - lastFlip > 45;         // throttle the 0/1 flicker
          if (flip) lastFlip = now;
          let done = true;
          for (let idx = 0; idx < chars.length; idx++) {
            const c = chars[idx];
            if (c === " ") { disp[idx] = " "; continue; }
            if (t >= settleAt[idx]) { disp[idx] = c; }
            else { if (flip) disp[idx] = BIN[(Math.random() * 2) | 0]; done = false; }
          }
          el.textContent = disp.join("");
          if (!done) requestAnimationFrame(frame);
          else { el.textContent = full; el.classList.remove("is-decoding"); onDone(); }
        };
        requestAnimationFrame(frame);
      };

      const runCycle = () => {
        if (running) return;
        running = true;
        let li = 0;
        const nextLine = () => {
          if (li >= lines.length) {                 // full pass done — hold, then loop
            running = false;
            clearTimeout(loopTimer);
            loopTimer = setTimeout(() => { if (visible) runCycle(); }, HOLD);
            return;
          }
          decodeLine(lines[li], texts[li], () => { li++; setTimeout(nextLine, 150); });
        };
        nextLine();
      };

      if ("IntersectionObserver" in window) {
        new IntersectionObserver((es) => {
          visible = es[0].isIntersecting;
          if (visible) runCycle();                  // start / resume the loop when on-screen
        }, { threshold: 0.35 }).observe(codeCard);
      } else { visible = true; runCycle(); }
    }
  }

  /* ---------- Hero: flickering binary portrait (right half) ---------- */
  const bcanvas = document.querySelector("canvas[data-binary]");
  if (bcanvas && bcanvas.getContext && window.BINARY_MAP) {
    const { cols: COLS, rows: ROWS, map: MAP } = window.BINARY_MAP;
    const ctx = bcanvas.getContext("2d");
    let cellW = 4, cellH = 4, dpr = 1;

    const cells = [];
    for (let i = 0; i < MAP.length; i++) if (MAP[i] !== " ") cells.push(i);

    const baseAlpha = (i) => Math.min(1, 0.42 + ((MAP.charCodeAt(i) - 48) / 9) * 0.72);

    function drawCell(i) {
      const x = i % COLS, y = (i / COLS) | 0;
      const px = x * cellW, py = y * cellH;
      ctx.clearRect(px, py, cellW + 1, cellH + 1);
      const a = baseAlpha(i) * (0.8 + Math.random() * 0.2);   // subtle intensity flicker
      ctx.fillStyle = "rgba(22,24,30," + a.toFixed(3) + ")";
      ctx.fillText(Math.random() < 0.5 ? "1" : "0", px + cellW / 2, py + cellH / 2);
    }

    function renderAll() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, COLS * cellW, ROWS * cellH);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = Math.round(Math.min(cellW, cellH) * 0.95) + 'px "SF Mono", ui-monospace, Menlo, monospace';
      for (const i of cells) drawCell(i);
    }

    function layout() {
      const cssW = bcanvas.clientWidth || 400;
      // fill the exact same box as the photo half so the two halves match in size
      const parent = bcanvas.parentElement;
      const cssH = (parent && parent.clientHeight) || (cssW * ROWS / COLS);
      cellW = cssW / COLS;
      cellH = cssH / ROWS;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      bcanvas.width = Math.round(cssW * dpr);
      bcanvas.height = Math.round(cssH * dpr);
      bcanvas.style.height = cssH + "px";
      renderAll();
    }
    layout();

    let rt = 0;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(layout, 150); });

    if (!prefersReduced) {
      let hovering = false, visible = true, last = 0;
      const split = bcanvas.closest(".split");
      if (split) {
        split.addEventListener("pointerenter", () => { hovering = true; });
        split.addEventListener("pointerleave", () => { hovering = false; });
      }
      if ("IntersectionObserver" in window) {
        new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { threshold: 0 })
          .observe(bcanvas);
      }
      const tick = (ts) => {
        requestAnimationFrame(tick);
        if (!visible) return;
        const interval = hovering ? 40 : 95;             // faster flicker on hover
        if (ts - last < interval) return;
        last = ts;
        const frac = hovering ? 0.16 : 0.035;            // more digits flip on hover
        const n = Math.max(1, (cells.length * frac) | 0);
        for (let k = 0; k < n; k++) drawCell(cells[(Math.random() * cells.length) | 0]);
      };
      requestAnimationFrame(tick);
    }
  }
})();

/* =====================================================================
   Case-study lightbox — click any figure to view it fullscreen
   ===================================================================== */
(function () {
  "use strict";
  const figures = Array.from(
    document.querySelectorAll(".cs-figure img.visual, .cs-cover img.visual, .csx-cover img")
  );
  if (!figures.length) return;

  const box = document.createElement("div");
  box.className = "lightbox" + (figures.length === 1 ? " single" : "");
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Image viewer");
  box.innerHTML =
    '<button class="lightbox__close" aria-label="Close">&#215;</button>' +
    '<button class="lightbox__nav lightbox__nav--prev" aria-label="Previous image">&#8249;</button>' +
    '<img class="lightbox__img" alt="" />' +
    '<button class="lightbox__nav lightbox__nav--next" aria-label="Next image">&#8250;</button>' +
    '<div class="lightbox__count"></div>';
  document.body.appendChild(box);

  const img = box.querySelector(".lightbox__img");
  const count = box.querySelector(".lightbox__count");
  let idx = -1;

  const show = (i) => {
    idx = (i + figures.length) % figures.length;
    const src = figures[idx];
    img.src = src.currentSrc || src.src;
    img.alt = src.alt || "";
    count.textContent = idx + 1 + " / " + figures.length;
    box.classList.add("open");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    box.classList.remove("open");
    document.body.style.overflow = "";
    idx = -1;
  };

  figures.forEach((f, i) => {
    f.style.cursor = "zoom-in";
    f.addEventListener("click", () => show(i));
  });

  box.addEventListener("click", (e) => {
    if (e.target === img) return;
    if (e.target.closest(".lightbox__nav--prev")) return show(idx - 1);
    if (e.target.closest(".lightbox__nav--next")) return show(idx + 1);
    close(); // backdrop or close button
  });

  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(idx - 1);
    else if (e.key === "ArrowRight") show(idx + 1);
  });
})();

/* =====================================================================
   Before/After comparison slider — drag or hover to reveal
   ===================================================================== */
(function () {
  "use strict";
  document.querySelectorAll("[data-ba]").forEach((frame) => {
    const set = (clientX) => {
      const r = frame.getBoundingClientRect();
      const pct = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
      frame.style.setProperty("--ba", pct + "%");
    };
    let dragging = false;
    frame.addEventListener("pointerdown", (e) => {
      dragging = true;
      frame.setPointerCapture(e.pointerId);
      set(e.clientX);
    });
    frame.addEventListener("pointermove", (e) => { if (dragging) set(e.clientX); });
    ["pointerup", "pointercancel"].forEach((ev) =>
      frame.addEventListener(ev, () => { dragging = false; })
    );
  });
})();
