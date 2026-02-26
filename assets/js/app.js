/* =========================================================
   WSFA Official Premium JS (No dependency)
   - Year auto
   - Sticky header state
   - Mobile menu toggle / outside click
   - Smooth close on link
   - IntersectionObserver reveal
   - Back-to-top button
   ========================================================= */

(function () {
  "use strict";

  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

  // Year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Header shadow on scroll
  const header = $("#header");
  const setHeaderState = () => {
    const scrolled = window.scrollY > 8;
    if (!header) return;
    header.style.borderBottomColor = scrolled ? "rgba(255,255,255,.14)" : "rgba(255,255,255,.07)";
  };
  window.addEventListener("scroll", setHeaderState, { passive: true });
  setHeaderState();

  // Mobile menu
  const menuBtn = $(".menu-btn");
  const mobileMenu = $("#mobileMenu");

  const openMenu = () => {
    if (!menuBtn || !mobileMenu) return;
    mobileMenu.hidden = false;
    menuBtn.setAttribute("aria-expanded", "true");
    document.documentElement.style.overflow = "hidden";
  };

  const closeMenu = () => {
    if (!menuBtn || !mobileMenu) return;
    mobileMenu.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
    document.documentElement.style.overflow = "";
  };

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      const expanded = menuBtn.getAttribute("aria-expanded") === "true";
      expanded ? closeMenu() : openMenu();
    });

    // Close when clicking a link
    $$(".m-link", mobileMenu).forEach((a) => {
      a.addEventListener("click", () => closeMenu());
    });

    // Close on Escape
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // Close on outside click
    mobileMenu.addEventListener("click", (e) => {
      const inner = $(".mobile-menu-inner", mobileMenu);
      if (!inner) return;
      if (!inner.contains(e.target)) closeMenu();
    });
  }

  // Reveal animations
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    // Fallback
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  // Back to top button
  const toTop = $(".to-top");
  const toggleTop = () => {
    if (!toTop) return;
    const show = window.scrollY > 500;
    toTop.hidden = !show;
  };
  window.addEventListener("scroll", toggleTop, { passive: true });
  toggleTop();

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

})();
