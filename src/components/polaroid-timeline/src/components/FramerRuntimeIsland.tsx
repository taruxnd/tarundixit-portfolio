"use client";

import { useEffect, useState } from "react";
import { framerRuntime } from "../lib/framer-runtime";

declare global {
  interface Window {
    __framerToNextBooted?: boolean;
  }
}

const HOST_ID = "polaroid-timeline-host";
const MAIN_ID = "main";
const BADGE_ID = "__framer-badge-container";
const CARD_SELECTOR = 'div[style*="perspective"]';
const SCRIPT_ATTR = "data-framer-bundle";

/** Strip Framer page chrome that fights the portfolio shell. */
function prepareHydrateHtml(html: string) {
  return html
    .replace(
      /<style data-framer-html-style="">html body \{ background: rgb\(20, 20, 20\); \}<\/style>/g,
      "",
    )
    .replace(/html body \{ background: rgb\(20, 20, 20\); \}/g, "");
}

function createMainElement(): HTMLDivElement {
  const main = document.createElement("div");
  main.id = MAIN_ID;
  for (const [key, value] of Object.entries(framerRuntime.mainAttrs)) {
    main.setAttribute(key, value);
  }
  main.innerHTML = prepareHydrateHtml(framerRuntime.mainInnerHtml);
  return main;
}

function safeRemove(el: Element | null) {
  if (!el) return;
  try {
    el.remove();
  } catch {
    /* Framer may have already detached the node */
  }
}

function ensureBadge() {
  if (!framerRuntime.badgeInnerHtml || document.getElementById(BADGE_ID)) {
    return;
  }
  const badge = document.createElement("div");
  badge.id = BADGE_ID;
  badge.innerHTML = framerRuntime.badgeInnerHtml;
  document.body.appendChild(badge);
}

function ensureSvgTemplates() {
  if (
    !framerRuntime.svgTemplatesHtml ||
    document.getElementById("svg-templates")
  ) {
    return;
  }
  const wrap = document.createElement("div");
  wrap.innerHTML = framerRuntime.svgTemplatesHtml;
  const el = wrap.firstElementChild;
  if (el) document.body.appendChild(el);
}

function ensureProcessEnv() {
  const w = window as Window & {
    process?: { env?: Record<string, string | undefined> };
  };
  w.process = {
    ...w.process,
    env: { ...w.process?.env, NODE_ENV: "production" },
  };
}

/** CDN shared-lib → local patch with extra polaroid milestones. */
const SHARED_LIB_CDN =
  "https://framerusercontent.com/sites/71UJYhEgwM3TSL7NydVUEj/shared-lib.EBskc7qO.mjs";
/** Bump when patching shared-lib so ESM does not reuse a stale module. */
const SHARED_LIB_VERSION = "fs3";
const SHARED_LIB_LOCAL = `/polaroid-framer/shared-lib.EBskc7qO.mjs?v=${SHARED_LIB_VERSION}`;

/** First polaroid photo — applied after hydrate in case Framer keeps a stale image. */
const FIRST_POLAROID_SRC =
  "https://cdn.jsdelivr.net/gh/taruxnd/tarundixit-portfolio@main/public/polaroid/first-shoot.jpg";
const FIRST_POLAROID_ALT = "First Shoot";

function ensurePolaroidImportMap() {
  if (document.getElementById("polaroid-framer-importmap")) return;
  const map = document.createElement("script");
  map.id = "polaroid-framer-importmap";
  map.type = "importmap";
  map.textContent = JSON.stringify({
    imports: {
      [SHARED_LIB_CDN]: SHARED_LIB_LOCAL,
    },
  });
  // Import maps must be registered before any module that resolves them.
  document.head.prepend(map);
}

function preloadModules() {
  for (const href of framerRuntime.modulePreloads) {
    const resolved = href === SHARED_LIB_CDN ? SHARED_LIB_LOCAL : href;
    if (
      document.querySelector(`link[rel="modulepreload"][href="${resolved}"]`)
    ) {
      continue;
    }
    const link = document.createElement("link");
    link.rel = "modulepreload";
    link.href = resolved;
    link.setAttribute("fetchpriority", "low");
    document.head.appendChild(link);
  }
}

function applyFirstPolaroidPhoto(root: ParentNode | null) {
  if (!root) return;
  root.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
    if (img.alt !== FIRST_POLAROID_ALT) return;
    if (img.getAttribute("src") === FIRST_POLAROID_SRC) return;
    img.src = FIRST_POLAROID_SRC;
  });
}

/** Framer may re-render Unsplash into the first card — keep our photo pinned. */
function watchFirstPolaroidPhoto(root: HTMLElement) {
  applyFirstPolaroidPhoto(root);
  const mo = new MutationObserver(() => applyFirstPolaroidPhoto(root));
  mo.observe(root, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["src"],
  });
  return () => mo.disconnect();
}

function removeFramerScript() {
  document
    .querySelectorAll(`script[${SCRIPT_ATTR}="main"]`)
    .forEach((el) => safeRemove(el));
}

/**
 * Inject script_main. Cache-bust when remounting so top-level hydrate runs again
 * (ESM caches the bare URL after the first visit). Sibling imports still hit CDN cache.
 */
function loadFramerScript(remount: boolean) {
  ensurePolaroidImportMap();
  removeFramerScript();
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "module";
    script.async = true;
    script.src = remount
      ? `${framerRuntime.scriptMainUrl}?rm=${Date.now()}`
      : framerRuntime.scriptMainUrl;
    script.setAttribute(SCRIPT_ATTR, "main");
    script.setAttribute("fetchpriority", "low");
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Framer script failed to load"));
    document.body.appendChild(script);
  });
}

function countCards(root: ParentNode | null) {
  return root?.querySelectorAll(CARD_SELECTOR).length ?? 0;
}

/** True when Framer has expanded the string past the flat SSR stub. */
function stringLooksAlive(root: ParentNode | null) {
  const path = root?.querySelector("svg path");
  const d = path?.getAttribute("d") ?? "";
  // SSR stub is flat at y≈40; live path has deep curves (e.g. 427, 815…)
  return /,[1-9]\d{2,}/.test(d);
}

function wakeFramerLayout() {
  window.dispatchEvent(new Event("resize"));
  window.dispatchEvent(new Event("scroll"));
}

/**
 * Unreached cards stay dim until the pin; unlock full opacity + flip on hover.
 * Re-applies opacity while hovered so Framer scroll ticks don't win.
 */
function attachHoverUnlock(root: HTMLElement) {
  const cleanups: Array<() => void> = [];
  let raf = 0;
  const hovered = new Set<HTMLElement>();

  const stopRafIfIdle = () => {
    if (hovered.size === 0 && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const tick = () => {
    hovered.forEach((card) => {
      if (!card.isConnected) {
        hovered.delete(card);
        return;
      }
      card.style.setProperty("opacity", "1", "important");
      card.style.setProperty("pointer-events", "auto", "important");
    });
    if (hovered.size > 0) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = 0;
    }
  };

  const bindCard = (card: HTMLElement) => {
    if (card.dataset.polaroidBound === "1") return;
    card.dataset.polaroidBound = "1";

    const onEnter = () => {
      hovered.add(card);
      card.dataset.polaroidHover = "1";
      card.style.setProperty("opacity", "1", "important");
      card.style.setProperty("pointer-events", "auto", "important");
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      hovered.delete(card);
      delete card.dataset.polaroidHover;
      card.style.removeProperty("opacity");
      stopRafIfIdle();
    };

    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointerleave", onLeave);
    cleanups.push(() => {
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointerleave", onLeave);
      delete card.dataset.polaroidBound;
      delete card.dataset.polaroidHover;
      card.style.removeProperty("opacity");
    });
  };

  const scan = () => {
    root.querySelectorAll<HTMLElement>(CARD_SELECTOR).forEach(bindCard);
  };

  scan();
  const mo = new MutationObserver(() => scan());
  mo.observe(root, { childList: true, subtree: true });

  return () => {
    mo.disconnect();
    if (raf) cancelAnimationFrame(raf);
    hovered.clear();
    cleanups.forEach((fn) => fn());
  };
}

/**
 * Exact framer-to-next island from the zip.
 * Fresh hydrate on every About mount so the string + pins stay alive after soft nav.
 *
 * Boot is deferred one macrotask so React Strict Mode's mount→cleanup→mount
 * does not tear out #main while Framer's React is mid-hydrate (NotFoundError).
 */
export function FramerRuntimeIsland() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let didMount = false;
    let detachHover: (() => void) | undefined;
    let detachFirstPhoto: (() => void) | undefined;
    let probeTimer: number | undefined;
    let startId: number | undefined;
    let io: IntersectionObserver | null = null;

    const mountParent = () =>
      document.getElementById(HOST_ID) ?? document.body;

    const tearDownMain = () => {
      removeFramerScript();
      safeRemove(document.getElementById(MAIN_ID));
      safeRemove(document.getElementById("polaroid-timeline-stash"));
    };

    const boot = async () => {
      if (cancelled) return;

      tearDownMain();

      const remount = Boolean(window.__framerToNextBooted);
      ensureBadge();
      ensureSvgTemplates();
      ensureProcessEnv();
      ensurePolaroidImportMap();
      preloadModules();

      const parent = mountParent();
      const main = createMainElement();
      parent.appendChild(main);
      didMount = true;

      try {
        await loadFramerScript(remount);
      } catch {
        // probe/retry below
      }

      if (cancelled) {
        tearDownMain();
        return;
      }

      window.__framerToNextBooted = true;
      setReady(true);
      wakeFramerLayout();

      const host = (document.getElementById(HOST_ID) ?? parent) as HTMLElement;
      detachHover?.();
      detachHover = attachHoverUnlock(host);
      detachFirstPhoto?.();
      const mainRoot = document.getElementById(MAIN_ID);
      if (mainRoot) detachFirstPhoto = watchFirstPolaroidPhoto(mainRoot);

      const started = performance.now();
      const probe = () => {
        if (cancelled) return;
        const root = document.getElementById(MAIN_ID);
        const cardsOk = countCards(root) >= 1;
        const lineOk = stringLooksAlive(root);
        applyFirstPolaroidPhoto(root);

        if (cardsOk && lineOk) {
          detachHover?.();
          detachHover = attachHoverUnlock(host);
          applyFirstPolaroidPhoto(root);
          wakeFramerLayout();
          return;
        }

        if (performance.now() - started < 3200) {
          if (cardsOk && !lineOk) wakeFramerLayout();
          probeTimer = window.setTimeout(probe, 140);
          return;
        }

        // Line still flat — one forced re-hydrate (script out first so Framer
        // isn't mid-commit when we replace #main).
        if (!cancelled && !lineOk) {
          tearDownMain();
          const fresh = createMainElement();
          mountParent().appendChild(fresh);
          void loadFramerScript(true).then(() => {
            if (cancelled) return;
            wakeFramerLayout();
            detachHover?.();
            detachHover = attachHoverUnlock(host);
            detachFirstPhoto?.();
            const root = document.getElementById(MAIN_ID);
            if (root) detachFirstPhoto = watchFirstPolaroidPhoto(root);
          });
        }
      };
      probeTimer = window.setTimeout(probe, 180);
    };

    const scheduleBoot = () => {
      // Skip Strict Mode's discarded first effect pass.
      startId = window.setTimeout(() => {
        void boot();
      }, 0);
    };

    // Don't hydrate the 900px Framer timeline until it's near view — otherwise
    // it expands Safari's layout viewport on first paint (flash to desktop).
    const host = document.getElementById(HOST_ID);
    if (host && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          if (cancelled) return;
          if (!entries.some((e) => e.isIntersecting)) return;
          io?.disconnect();
          io = null;
          scheduleBoot();
        },
        { root: null, rootMargin: "200% 0px", threshold: 0 },
      );
      io.observe(host);
    } else {
      scheduleBoot();
    }

    return () => {
      cancelled = true;
      io?.disconnect();
      if (startId !== undefined) window.clearTimeout(startId);
      if (probeTimer) window.clearTimeout(probeTimer);
      detachHover?.();
      detachFirstPhoto?.();
      if (didMount) tearDownMain();
      window.__framerToNextBooted = true;
    };
  }, []);

  return (
    <div
      aria-busy={!ready}
      aria-label="Framer runtime"
      className="polaroid-framer-runtime-spacer"
      style={{
        minHeight: ready ? 0 : "40vh",
        width: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
