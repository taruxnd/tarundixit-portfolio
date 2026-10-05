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
const SCRIPT_MAIN_URL = "/polaroid-timeline/main.mjs";

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

/** Guard against standalone Framer metadata changing the page viewport.
 * Keep the enclosing portfolio's viewport so phones retain their breakpoints.
 */
function preservePortfolioViewport() {
  const selector = 'meta[name="viewport"]';
  // Never capture an already-overridden desktop viewport as the desired value.
  const content = "width=device-width, initial-scale=1";

  const restore = () => {
    document.querySelectorAll(selector).forEach((meta) => {
      if (meta.getAttribute("content") !== content) {
        meta.setAttribute("content", content);
      }
    });
  };

  restore();
  const observer = new MutationObserver(restore);
  observer.observe(document.head, {
    attributes: true,
    attributeFilter: ["content", "name"],
    childList: true,
    subtree: true,
  });

  return () => {
    observer.disconnect();
    restore();
  };
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

function preloadModules() {
  for (const href of framerRuntime.modulePreloads) {
    if (document.querySelector(`link[rel="modulepreload"][href="${href}"]`)) {
      continue;
    }
    const link = document.createElement("link");
    link.rel = "modulepreload";
    link.href = href;
    link.setAttribute("fetchpriority", "low");
    document.head.appendChild(link);
  }
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
  removeFramerScript();
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "module";
    script.async = true;
    script.src = remount
      ? `${SCRIPT_MAIN_URL}?rm=${Date.now()}`
      : SCRIPT_MAIN_URL;
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
 * Framer island with locally configured milestone cards.
 * Fresh render on every mount so the string + pins stay alive after soft nav.
 *
 * Boot is deferred one macrotask so React Strict Mode's mount→cleanup→mount
 * does not tear out #main while Framer's React is mid-hydrate (NotFoundError).
 */
export function FramerRuntimeIsland() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const releaseViewport = preservePortfolioViewport();
    let cancelled = false;
    let didMount = false;
    let detachHover: (() => void) | undefined;
    let probeTimer: number | undefined;

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

      const started = performance.now();
      const probe = () => {
        if (cancelled) return;
        const root = document.getElementById(MAIN_ID);
        const cardsOk = countCards(root) >= 1;
        const lineOk = stringLooksAlive(root);

        if (cardsOk && lineOk) {
          detachHover?.();
          detachHover = attachHoverUnlock(host);
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
          });
        }
      };
      probeTimer = window.setTimeout(probe, 180);
    };

    // Skip Strict Mode's discarded first effect pass.
    const startId = window.setTimeout(() => {
      void boot();
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(startId);
      if (probeTimer) window.clearTimeout(probeTimer);
      detachHover?.();
      if (didMount) tearDownMain();
      releaseViewport();
      window.__framerToNextBooted = true;
    };
  }, []);

  return (
    <div
      aria-busy={!ready}
      aria-label="Framer runtime"
      style={{
        minHeight: ready ? 0 : "40vh",
        width: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
