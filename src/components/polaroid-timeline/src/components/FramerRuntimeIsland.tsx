"use client";

import { useEffect, useState } from "react";
import { framerRuntime } from "../lib/framer-runtime";

declare global {
  interface Window {
    __framerToNextBooted?: boolean;
  }
}

const HOST_ID = "polaroid-timeline-host";
const STASH_ID = "polaroid-timeline-stash";
const MAIN_ID = "main";
const BADGE_ID = "__framer-badge-container";
const CARD_SELECTOR = 'div[style*="perspective"]';

/** Strip Framer page chrome that fights the portfolio shell. */
function prepareHydrateHtml(html: string) {
  return html
    .replace(
      /<style data-framer-html-style="">html body \{ background: rgb\(20, 20, 20\); \}<\/style>/g,
      "",
    )
    .replace(/html body \{ background: rgb\(20, 20, 20\); \}/g, "");
}

function ensureStash(): HTMLElement {
  let stash = document.getElementById(STASH_ID);
  if (!stash) {
    stash = document.createElement("div");
    stash.id = STASH_ID;
    stash.setAttribute("hidden", "");
    stash.style.cssText =
      "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;";
    document.body.appendChild(stash);
  }
  return stash;
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

function ensureFramerScript() {
  if (
    document.querySelector(
      `script[data-framer-bundle="main"][src="${framerRuntime.scriptMainUrl}"]`,
    )
  ) {
    return;
  }
  const script = document.createElement("script");
  script.type = "module";
  script.async = true;
  script.src = framerRuntime.scriptMainUrl;
  script.dataset.framerBundle = "main";
  script.setAttribute("fetchpriority", "low");
  document.body.appendChild(script);
}

function countCards(root: ParentNode | null) {
  return root?.querySelectorAll(CARD_SELECTOR).length ?? 0;
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
 * Mounts into `#polaroid-timeline-host` when present (About embed),
 * otherwise `document.body` (standalone mini-app).
 */
export function FramerRuntimeIsland() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let detachHover: (() => void) | undefined;
    let retryTimer: number | undefined;

    const mountParent =
      document.getElementById(HOST_ID) ?? document.body;

    const placeMain = (forceRecreate: boolean) => {
      let main = document.getElementById(MAIN_ID);
      const stash = document.getElementById(STASH_ID);

      if (!forceRecreate && main && stash?.contains(main)) {
        mountParent.appendChild(main);
        return main;
      }

      if (!forceRecreate && main && mountParent.contains(main)) {
        return main;
      }

      if (!forceRecreate && main && !mountParent.contains(main)) {
        mountParent.appendChild(main);
        return main;
      }

      if (main) main.remove();
      main = createMainElement();
      mountParent.appendChild(main);
      return main;
    };

    const boot = (forceRecreate: boolean) => {
      ensureBadge();
      ensureSvgTemplates();
      ensureProcessEnv();
      preloadModules();
      placeMain(forceRecreate);
      ensureFramerScript();

      if (cancelled) return;

      window.__framerToNextBooted = true;
      setReady(true);

      const host = (document.getElementById(HOST_ID) ??
        mountParent) as HTMLElement;
      detachHover?.();
      detachHover = attachHoverUnlock(host);

      // If Framer wipes/rebuilds late, keep bindings fresh; if still empty, recreate once
      const started = performance.now();
      const probe = () => {
        if (cancelled) return;
        const main = document.getElementById(MAIN_ID);
        const n = countCards(main);
        if (n >= 1) {
          detachHover?.();
          detachHover = attachHoverUnlock(host);
          return;
        }
        if (performance.now() - started < 2800) {
          retryTimer = window.setTimeout(probe, 120);
          return;
        }
        if (!forceRecreate) {
          // Static hydrate HTML should still have cards — recreate shell once
          boot(true);
        }
      };
      retryTimer = window.setTimeout(probe, 200);
    };

    boot(false);

    return () => {
      cancelled = true;
      if (retryTimer) window.clearTimeout(retryTimer);
      detachHover?.();

      const main = document.getElementById(MAIN_ID);
      if (main) {
        // Keep Framer tree alive across soft navigations
        ensureStash().appendChild(main);
      } else {
        window.__framerToNextBooted = false;
      }
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
