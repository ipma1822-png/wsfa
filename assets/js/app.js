/* =========================================================
   WSFA Official Premium JS (No dependency)
   - Year auto
   - Sticky header state
   - Mobile menu toggle / outside click
   - IntersectionObserver reveal
   - Back-to-top button
   - Copy / Share helpers
   - Hub tools: "QR Link copy/share"
   - Emergency script: auto copy
   - Verification UI support
   ========================================================= */

(function () {
  "use strict";

  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

  // ---------- Utilities ----------
  const toast = (msg = "완료!", ms = 2200) => {
    let el = $("#wsfaToast");
    if (!el) {
      el = document.createElement("div");
      el.id = "wsfaToast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(() => el.classList.remove("show"), ms);
  };

  const safeText = (v) => String(v ?? "").trim();

  const copyToClipboard = async (text) => {
    const t = safeText(text);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(t);
        return true;
      }
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = t;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  };

  const canShare = () => !!navigator.share;

  const shareLink = async ({ title, text, url }) => {
    if (!canShare()) return false;
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch {
      return false;
    }
  };

  const absoluteUrl = (pathOrUrl) => {
    try {
      return new URL(pathOrUrl, window.location.href).toString();
    } catch {
      return window.location.href;
    }
  };

  // ---------- Year ----------
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------- Header shadow ----------
  const header = $("#header");
  const setHeaderState = () => {
    const scrolled = window.scrollY > 8;
    if (!header) return;
    header.style.borderBottomColor = scrolled ? "rgba(255,255,255,.14)" : "rgba(255,255,255,.07)";
  };
  window.addEventListener("scroll", setHeaderState, { passive: true });
  setHeaderState();

  // ---------- Mobile menu ----------
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

    $$(".m-link", mobileMenu).forEach((a) => a.addEventListener("click", closeMenu));

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    mobileMenu.addEventListener("click", (e) => {
      const inner = $(".mobile-menu-inner", mobileMenu);
      if (inner && !inner.contains(e.target)) closeMenu();
    });
  }

  // ---------- Reveal animations ----------
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
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  // ---------- Back to top ----------
  const toTop = $(".to-top");
  const toggleTop = () => {
    if (!toTop) return;
    toTop.hidden = !(window.scrollY > 500);
  };
  window.addEventListener("scroll", toggleTop, { passive: true });
  toggleTop();
  if (toTop) {
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // =========================================================
  // Hub Tools (Copy/Share "QR Link")
  // Use:
  // <button class="btn ghost" data-qr-btn data-qr-url="./emergency/">QR 링크</button>
  // <button class="btn ghost" data-share-btn data-share-url="./emergency/">공유</button>
  // =========================================================
  $$("[data-qr-btn]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const url = absoluteUrl(btn.getAttribute("data-qr-url") || window.location.href);
      const ok = await copyToClipboard(url);
      toast(ok ? "링크가 복사되었습니다. QR에 연결해 사용하세요!" : "복사에 실패했습니다. 주소를 길게 눌러 복사하세요.");
    });
  });

  $$("[data-share-btn]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const url = absoluteUrl(btn.getAttribute("data-share-url") || window.location.href);
      const title = btn.getAttribute("data-share-title") || document.title;
      const text = btn.getAttribute("data-share-text") || "WSFA 안전허브 링크";
      const ok = await shareLink({ title, text, url });
      if (!ok) {
        const copied = await copyToClipboard(url);
        toast(copied ? "공유 기능이 없어 링크를 복사했습니다." : "공유/복사가 지원되지 않습니다.");
      }
    });
  });

  // =========================================================
  // Emergency script auto-copy
  // Use:
  // <button class="btn primary" data-copy-script data-script-target="#scriptBox">신고 스크립트 복사</button>
  // <pre id="scriptBox">...</pre>
  // =========================================================
  $$("[data-copy-script]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const sel = btn.getAttribute("data-script-target");
      const box = sel ? $(sel) : null;
      const text = box ? box.textContent : btn.getAttribute("data-script-text");
      const ok = await copyToClipboard(text || "");
      toast(ok ? "신고 스크립트를 복사했습니다. 112/119 통화 시 그대로 읽으세요!" : "복사 실패. 스크립트를 길게 눌러 복사하세요.");
    });
  });

  // =========================================================
  // Verification UI
  // - Expects global WSFA_VERIFY_DATA (from /verification/data/data.js)
  // - Search by code (normalized)
  // =========================================================
  const normalizeCode = (code) =>
    safeText(code).toUpperCase().replace(/[^A-Z0-9]/g, "");

  const verifyData = window.WSFA_VERIFY_DATA;

  const findRecord = (code) => {
    if (!verifyData || !Array.isArray(verifyData.records)) return null;
    const c = normalizeCode(code);
    return verifyData.records.find((r) => normalizeCode(r.code) === c) || null;
  };

  const renderResult = (container, record) => {
    if (!container) return;

    if (!record) {
      container.innerHTML = `
        <div class="result-card bad reveal is-in">
          <div class="result-top">
            <strong>조회 결과: 일치 없음</strong>
            <span class="pill bad">NOT FOUND</span>
          </div>
          <p class="muted">입력한 코드와 일치하는 기록이 없습니다. 오타/띄어쓰기/대시(-)를 확인해 주세요.</p>
          <div class="result-actions">
            <button class="btn ghost" type="button" data-qr-btn data-qr-url="../verification/">조회 링크 복사</button>
            <button class="btn ghost" type="button" data-share-btn data-share-url="../verification/" data-share-text="WSFA 조회 서비스 링크">공유</button>
          </div>
        </div>
      `;
      // Rebind new buttons inside result
      $$("[data-qr-btn]", container).forEach((b) => b.addEventListener("click", async () => {
        const url = absoluteUrl(b.getAttribute("data-qr-url") || window.location.href);
        const ok = await copyToClipboard(url);
        toast(ok ? "조회 링크가 복사되었습니다." : "복사 실패");
      }));
      $$("[data-share-btn]", container).forEach((b) => b.addEventListener("click", async () => {
        const url = absoluteUrl(b.getAttribute("data-share-url") || window.location.href);
        const title = b.getAttribute("data-share-title") || document.title;
        const text = b.getAttribute("data-share-text") || "WSFA 조회 서비스 링크";
        const ok = await shareLink({ title, text, url });
        if (!ok) {
          const copied = await copyToClipboard(url);
          toast(copied ? "공유 기능이 없어 링크를 복사했습니다." : "공유/복사가 지원되지 않습니다.");
        }
      }));
      return;
    }

    const status = safeText(record.status || "VALID");
    const pillClass = status === "VALID" ? "good" : (status === "EXPIRED" ? "warn" : "bad");

    const items = [
      ["코드", record.code],
      ["대상", record.holder],
      ["유형", record.type],
      ["발급기관", record.issuer],
      ["발급일", record.issued_at],
      ["유효기간", record.valid_until || "—"],
      ["메모", record.note || "—"]
    ].filter(([k, v]) => safeText(v).length);

    container.innerHTML = `
      <div class="result-card ${pillClass} reveal is-in">
        <div class="result-top">
          <strong>조회 결과: 확인됨</strong>
          <span class="pill ${pillClass}">${status}</span>
        </div>

        <div class="kv">
          ${items.map(([k, v]) => `
            <div class="kv-row">
              <span class="k">${k}</span>
              <span class="v">${String(v)}</span>
            </div>
          `).join("")}
        </div>

        <div class="result-actions">
          <button class="btn primary" type="button" data-copy-script data-script-text="${String(record.code)}">코드 복사</button>
          <button class="btn ghost" type="button" data-qr-btn data-qr-url="../verification/">조회 링크 복사</button>
          <button class="btn ghost" type="button" data-share-btn data-share-url="../verification/" data-share-text="WSFA 조회 서비스 링크">공유</button>
        </div>

        <p class="muted small" style="margin-top:10px;">
          ※ 본 결과는 WSFA 내부 기록 기준입니다. 위·변조 방지를 위해 코드 일치 여부를 우선 확인하세요.
        </p>
      </div>
    `;

    // Bind buttons inside result
    $$("[data-copy-script]", container).forEach((b) => b.addEventListener("click", async () => {
      const t = b.getAttribute("data-script-text") || "";
      const ok = await copyToClipboard(t);
      toast(ok ? "복사되었습니다." : "복사 실패");
    }));
    $$("[data-qr-btn]", container).forEach((b) => b.addEventListener("click", async () => {
      const url = absoluteUrl(b.getAttribute("data-qr-url") || window.location.href);
      const ok = await copyToClipboard(url);
      toast(ok ? "조회 링크가 복사되었습니다." : "복사 실패");
    }));
    $$("[data-share-btn]", container).forEach((b) => b.addEventListener("click", async () => {
      const url = absoluteUrl(b.getAttribute("data-share-url") || window.location.href);
      const title = b.getAttribute("data-share-title") || document.title;
      const text = b.getAttribute("data-share-text") || "WSFA 조회 서비스 링크";
      const ok = await shareLink({ title, text, url });
      if (!ok) {
        const copied = await copyToClipboard(url);
        toast(copied ? "공유 기능이 없어 링크를 복사했습니다." : "공유/복사가 지원되지 않습니다.");
      }
    }));
  };

  const verifyForm = $("#verifyForm");
  if (verifyForm) {
    const input = $("#verifyCode");
    const resultBox = $("#verifyResult");

    // Prefill from query (?code=XXXX)
    const params = new URLSearchParams(window.location.search);
    const q = params.get("code");
    if (q && input) {
      input.value = q;
      const rec = findRecord(q);
      renderResult(resultBox, rec);
    }

    verifyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!input) return;
      const code = input.value;
      if (!safeText(code)) {
        toast("코드를 입력해 주세요.");
        input.focus();
        return;
      }
      const rec = findRecord(code);
      renderResult(resultBox, rec);
      // update URL
      try {
        const u = new URL(window.location.href);
        u.searchParams.set("code", normalizeCode(code));
        window.history.replaceState({}, "", u.toString());
      } catch {}
    });
  }

})();
