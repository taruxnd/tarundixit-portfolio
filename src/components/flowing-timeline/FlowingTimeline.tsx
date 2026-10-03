"use client";

/**
 * Portfolio mount of the Framer export — same hydrate island as
 * src/components/FramerRuntimeIsland.tsx, with relative imports so it
 * runs inside this Next app. Mounts #main into the section host (not body)
 * so it sits in the About page flow.
 */
import { useEffect, useRef, useState } from "react";
import { stripFontClassName } from "@/lib/heroFonts";
import { contentContainerClassName } from "@/lib/sectionLayout";
import { framerRuntime } from "./src/lib/framer-runtime";
import "@/components/navbar/navbar.css";
import "./src/app/framer.css";
import "./flowing-timeline-embed.css";

declare global {
  interface Window {
    __framerToNextBooted?: boolean;
  }
}

const FRAMER_ORANGE = "rgb(238, 106, 46)";
const FRAMER_PATH_LIGHT = "rgba(20, 20, 24, 0.14)";

function isDarkTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark";
}

function themeColors() {
  const dark = isDarkTheme();
  return {
    accent: dark ? "rgb(214, 220, 230)" : "rgb(71, 85, 105)",
    path: dark ? "rgba(255, 255, 255, 0.48)" : FRAMER_PATH_LIGHT,
    pathStrong: dark ? "rgba(255, 255, 255, 0.58)" : "rgba(20, 20, 24, 0.22)",
  };
}

function clearShellBg(host: HTMLElement) {
  const shellSelectors = [
    "[data-framer-root]",
    ".framer-iqlwZ",
    ".framer-1o7h11g-container",
    ".framer-1o7h11g-container > div",
    ".oxr4-root",
  ];
  for (const sel of shellSelectors) {
    host.querySelectorAll(sel).forEach((el) => {
      const node = el as HTMLElement;
      const bg = `${node.style.background} ${node.style.backgroundColor}`;
      if (bg.includes("255")) {
        node.style.background = "transparent";
        node.style.backgroundColor = "transparent";
      }
    });
  }
}

function glassifyOriginBadges(host: HTMLElement) {
  // Style in place — do NOT reparent Framer nodes (causes removeChild NotFoundError).
  const labels = [...host.querySelectorAll("span")].filter(
    (el) => /^ORIGIN$/i.test((el.textContent || "").trim()) && el.children.length === 0,
  );

  for (const span of labels) {
    if (span.classList.contains("flowing-timeline-origin-glass")) continue;
    span.classList.add("flowing-timeline-origin-glass");
    span.style.background = "rgba(255, 255, 255, 0.22)";
    span.style.backdropFilter = "blur(16px) saturate(180%)";
    span.style.setProperty("-webkit-backdrop-filter", "blur(16px) saturate(180%)");
    span.style.border = "1px solid rgba(255, 255, 255, 0.45)";
    span.style.boxShadow =
      "inset 0 1px 0 rgba(255,255,255,0.55), 0 6px 18px rgba(0,0,0,0.12)";
    span.style.color = "var(--text-primary)";
  }

  if (isDarkTheme()) {
    for (const span of labels) {
      span.style.background = "rgba(24, 24, 24, 0.55)";
      span.style.border = "1px solid rgba(255, 255, 255, 0.14)";
      span.style.boxShadow =
        "inset 0 1px 0 rgba(255,255,255,0.18), 0 6px 18px rgba(0,0,0,0.35)";
    }
  }
}

function isTimelineControl(target: EventTarget | null) {
  const el = target instanceof Element ? target : null;
  if (!el) return false;
  return Boolean(el.closest("button, a, input, textarea, select, [role='button']"));
}

/**
 * Disable Framer wheel/drag scrubbing. Navigation only via dots + prev/next.
 * Listen on the root in the capture phase so Framer’s viewport handlers never see the event.
 */
function lockTimelineGestures(root: HTMLElement) {
  if (root.dataset.gesturesLocked === "1") {
    // Keep affordances fresh after Framer re-renders
    root.querySelectorAll<HTMLElement>(".oxr4-btn").forEach((btn) => {
      btn.classList.add("flowing-timeline-slider-btn");
    });
    return;
  }
  root.dataset.gesturesLocked = "1";
  root.classList.add("flowing-timeline-gestures-locked");

  const blockWheel = (event: WheelEvent) => {
    // Capture on root runs before Framer’s viewport listeners.
    // stopPropagation keeps page scroll (no preventDefault).
    event.stopPropagation();
  };

  const blockDragStart = (event: Event) => {
    if (isTimelineControl(event.target)) return;
    event.stopPropagation();
    if ("cancelable" in event && event.cancelable) event.preventDefault();
  };

  root.addEventListener("wheel", blockWheel, { capture: true, passive: true });
  root.addEventListener("pointerdown", blockDragStart, { capture: true });
  root.addEventListener("mousedown", blockDragStart, { capture: true });
  root.addEventListener("touchstart", blockDragStart, {
    capture: true,
    passive: false,
  });

  const viewport = [...root.querySelectorAll<HTMLElement>(":scope > div")].find(
    (el) => {
      const style = el.getAttribute("style") || "";
      return style.includes("cursor: grab") || style.includes("touch-action");
    },
  );
  if (viewport) {
    viewport.style.cursor = "default";
    viewport.style.touchAction = "none";
    viewport.classList.add("flowing-timeline-viewport");
  }

  root.querySelectorAll<HTMLElement>(".oxr4-btn").forEach((btn) => {
    btn.classList.add("flowing-timeline-slider-btn");
  });
}

/**
 * Fit the full milestone path across the stage:
 * first node near the left edge, last node near the right edge.
 * (Framer otherwise keeps the active node centered, so only ~half the path shows.)
 */
function fitTimelineWidth(host: HTMLElement, root: HTMLElement) {
  const viewport = [...root.querySelectorAll<HTMLElement>(":scope > div")].find(
    (el) => {
      const style = el.getAttribute("style") || "";
      return (
        style.includes("cursor: grab") ||
        style.includes("cursor: default") ||
        style.includes("touch-action")
      );
    },
  );
  if (!viewport) return;

  // Unwrap any leftover world wrapper from earlier builds
  const staleWorld = viewport.querySelector<HTMLElement>(
    ":scope > .flowing-timeline-world",
  );
  if (staleWorld) {
    while (staleWorld.firstChild) {
      viewport.insertBefore(staleWorld.firstChild, staleWorld);
    }
    staleWorld.remove();
  }

  viewport.classList.add("flowing-timeline-viewport");
  viewport.style.cursor = "default";
  viewport.style.touchAction = "none";

  const markerWraps = [
    ...root.querySelectorAll<HTMLButtonElement>("button[aria-label]"),
  ]
    .filter((btn) => /\d{4}/.test(btn.getAttribute("aria-label") || ""))
    .map((btn) => btn.parentElement)
    .filter((el): el is HTMLElement => !!el);

  const xs = markerWraps
    .map((el) => {
      const t = el.style.transform || getComputedStyle(el).transform;
      if (!t || t === "none") return null;
      // translate3d(x,y,z) or matrix(a,b,c,d,tx,ty) or matrix3d(...)
      const t3 = t.match(/translate3d\(\s*([-0-9.]+)px/);
      if (t3) return parseFloat(t3[1]);
      const t2 = t.match(/translate\(\s*([-0-9.]+)px/);
      if (t2) return parseFloat(t2[1]);
      if (t.startsWith("matrix3d")) {
        const parts = t.slice(9, -1).split(",").map((n) => parseFloat(n.trim()));
        return parts[12] ?? null;
      }
      if (t.startsWith("matrix")) {
        const parts = t.slice(7, -1).split(",").map((n) => parseFloat(n.trim()));
        return parts[4] ?? null;
      }
      return null;
    })
    .filter((n): n is number => n != null && Number.isFinite(n));

  if (xs.length < 2) {
    viewport.style.transform = "none";
    return;
  }

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const span = maxX - minX;
  if (span < 1) {
    viewport.style.transform = "none";
    return;
  }

  const stageW = viewport.clientWidth || root.clientWidth || host.clientWidth;
  const padL = Math.max(16, Math.min(32, stageW * 0.03));
  const padR = Math.max(16, Math.min(32, stageW * 0.03));
  const available = Math.max(120, stageW - padL - padR);

  // Uniform scale so first→last spans the stage; never upscale past 1.
  const scale = Math.min(1, available / span);
  const tx = padL - minX * scale;

  host.dataset.timelineScale = String(scale);
  viewport.style.transformOrigin = "0 0";
  viewport.style.transform = `translate(${tx}px, 0px) scale(${scale})`;

  // Framer’s path SVG only covers part of the marker world — stretch it
  // so the visible curve runs from the first node to the last.
  stretchPathAcrossMarkers(viewport, markerWraps);
}

function stretchPathAcrossMarkers(
  viewport: HTMLElement,
  markerWraps: HTMLElement[],
) {
  if (markerWraps.length < 2) return;

  const svg = [...viewport.querySelectorAll("svg")].find((node) =>
    node.querySelector("path[stroke]"),
  );
  if (!svg) return;

  const basePath = svg.querySelector("path");
  if (!basePath) return;

  // Marker wraps use translate — read world X again from their buttons’ parents
  const buttons = markerWraps
    .map((wrap) => wrap.querySelector("button"))
    .filter((b): b is HTMLButtonElement => !!b);

  if (buttons.length < 2) return;

  // Need layout after viewport transform
  const first = buttons[0].getBoundingClientRect();
  const last = buttons[buttons.length - 1].getBoundingClientRect();
  const pathBox = basePath.getBoundingClientRect();
  if (pathBox.width < 8) return;

  const targetLeft = first.left + first.width / 2;
  const targetRight = last.left + last.width / 2;
  const targetSpan = targetRight - targetLeft;
  if (targetSpan < 8) return;

  const pathScaleX = targetSpan / pathBox.width;
  // Origin at the current path start, in SVG local space
  const svgBox = svg.getBoundingClientRect();
  const parentScale = Number.parseFloat(
    (viewport.style.transform.match(/scale\(([-0-9.]+)\)/) || [])[1] || "1",
  );
  const safeScale = parentScale || 1;
  const originX = (pathBox.left - svgBox.left) / safeScale;
  const localShift = (targetLeft - pathBox.left) / safeScale;

  svg.style.transformOrigin = `${originX}px 0px`;
  svg.style.transform = `translateX(${localShift}px) scaleX(${pathScaleX})`;
  svg.style.overflow = "visible";

  // Keep the drop-line svg (second) matched if present
  const lineSvg = [...viewport.querySelectorAll("svg")].find((node) =>
    node.querySelector("line"),
  );
  if (lineSvg && lineSvg !== svg) {
    lineSvg.style.transformOrigin = `${originX}px 0px`;
    lineSvg.style.transform = `translateX(${localShift}px) scaleX(${pathScaleX})`;
    lineSvg.style.overflow = "visible";
  }
}

function polishTimeline(host: HTMLElement) {
  clearShellBg(host);
  const { accent, path } = themeColors();
  const root = host.querySelector(".oxr4-root") as HTMLElement | null;
  if (!root) return;

  // Path + drop-line strokes (Framer: base path sw=2, accent path sw=3)
  root.querySelectorAll("path, line").forEach((el) => {
    const node = el as SVGElement;
    if (node.tagName.toLowerCase() === "line") {
      node.setAttribute("stroke", accent);
      return;
    }
    const sw = parseFloat(node.getAttribute("stroke-width") || "0");
    if (sw >= 2.5) {
      node.setAttribute("stroke", accent);
    } else if (sw > 0 || node.getAttribute("stroke")) {
      node.setAttribute("stroke", path);
    }
  });

  // Active dot, pulse ring, and card accent bar
  root.querySelectorAll("span, div, button").forEach((el) => {
    const node = el as HTMLElement;
    const style = node.getAttribute("style") || "";
    const bg = `${node.style.background} ${node.style.backgroundColor}`;
    const hasOrange =
      style.includes("238, 106, 46") ||
      bg.includes("238, 106, 46");
    const hasPriorAccent =
      bg.includes("214, 220, 230") ||
      bg.includes("71, 85, 105") ||
      style.includes("214, 220, 230") ||
      style.includes("71, 85, 105");
    if (!hasOrange && !hasPriorAccent) return;

    // Pulse halo around active node
    if (style.includes("oxr4-pulse") || (style.includes("inset: -1px") && style.includes("border-radius: 50%"))) {
      node.style.borderColor = accent;
      return;
    }

    const w = node.offsetWidth;
    const h = node.offsetHeight;
    const isDot =
      w > 0 &&
      w <= 16 &&
      h > 0 &&
      h <= 16 &&
      (node.style.borderRadius.includes("50%") || style.includes("border-radius: 50%"));
    const isBar = w > 16 && h > 0 && h <= 4;
    if (!isDot && !isBar) return;

    node.style.background = accent;
    node.style.backgroundColor = accent;
    if (node.style.border || style.includes("border")) {
      node.style.borderColor = accent;
    }
    if (isDot) {
      node.style.boxShadow = isDarkTheme()
        ? "0 0 0 4px rgba(255,255,255,0.12), 0 0 18px rgba(214,220,230,0.35)"
        : "0 0 0 4px rgba(71,85,105,0.12), 0 0 14px rgba(71,85,105,0.2)";
    }
  });

  // Injected Framer hover / focus orange → accent
  root.querySelectorAll("style").forEach((styleEl) => {
    const text = styleEl.textContent || "";
    if (!text.includes("238, 106, 46") && !text.includes(FRAMER_ORANGE)) return;
    styleEl.textContent = text
      .replaceAll(FRAMER_ORANGE, accent)
      .replaceAll("rgb(238, 106, 46)", accent);
  });

  glassifyOriginBadges(host);
  lockTimelineGestures(root);
  fitTimelineWidth(host, root);
}

export default function FlowingTimeline() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let polishing = false;
    const runPolish = () => {
      if (polishing) return;
      polishing = true;
      try {
        polishTimeline(host);
      } finally {
        // Defer unlock so our own DOM writes don't re-enter immediately
        queueMicrotask(() => {
          polishing = false;
        });
      }
    };

    const observer = new MutationObserver(runPolish);
    observer.observe(host, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "stroke", "fill", "aria-current"],
    });

    const themeObserver = new MutationObserver(runPolish);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    if (window.__framerToNextBooted && document.getElementById("main")) {
      const existing = document.getElementById("main");
      if (existing && !host.contains(existing)) host.appendChild(existing);
      runPolish();
      setReady(true);
      return () => {
        observer.disconnect();
        themeObserver.disconnect();
      };
    }

    let main = document.getElementById("main");
    if (!main) {
      main = document.createElement("div");
      main.id = "main";
      for (const [key, value] of Object.entries(framerRuntime.mainAttrs)) {
        main.setAttribute(key, value);
      }
      main.innerHTML = framerRuntime.mainInnerHtml.replace(
        /<style data-framer-html-style="">html body \{ background: rgb\(255, 255, 255\); \}<\/style>/,
        "",
      );
      host.appendChild(main);
    } else if (!host.contains(main)) {
      host.appendChild(main);
    }

    if (
      framerRuntime.badgeInnerHtml &&
      !document.getElementById("__framer-badge-container")
    ) {
      const badge = document.createElement("div");
      badge.id = "__framer-badge-container";
      badge.innerHTML = framerRuntime.badgeInnerHtml;
      document.body.appendChild(badge);
    }

    if (framerRuntime.svgTemplatesHtml && !document.getElementById("svg-templates")) {
      const wrap = document.createElement("div");
      wrap.innerHTML = framerRuntime.svgTemplatesHtml;
      const el = wrap.firstElementChild;
      if (el) document.body.appendChild(el);
    }

    const w = window as Window & {
      process?: { env?: Record<string, string | undefined> };
    };
    w.process = {
      ...w.process,
      env: { ...w.process?.env, NODE_ENV: "production" },
    };

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

    if (
      !document.querySelector(
        `script[data-framer-bundle="main"][src="${framerRuntime.scriptMainUrl}"]`,
      )
    ) {
      const script = document.createElement("script");
      script.type = "module";
      script.async = true;
      script.src = framerRuntime.scriptMainUrl;
      script.dataset.framerBundle = "main";
      script.setAttribute("fetchpriority", "low");
      document.body.appendChild(script);
    }

    window.__framerToNextBooted = true;
    runPolish();
    setReady(true);

    const restoreTitle = () => {
      if (document.title !== "About — Tarun Dixit") {
        document.title = "About — Tarun Dixit";
      }
    };
    restoreTitle();
    const titleTimer = window.setInterval(restoreTitle, 500);
    window.setTimeout(() => window.clearInterval(titleTimer), 8000);

    // Framer hydrates async — keep polishing briefly after boot
    const polishTimer = window.setInterval(runPolish, 400);
    window.setTimeout(() => window.clearInterval(polishTimer), 6000);

    return () => {
      observer.disconnect();
      themeObserver.disconnect();
      window.clearInterval(titleTimer);
      window.clearInterval(polishTimer);
    };
  }, []);

  return (
    <section
      className={`flowing-timeline-framer theme-transition ${stripFontClassName}`}
      aria-labelledby="flowing-timeline-heading"
      aria-busy={!ready}
    >
      <div className={`${contentContainerClassName} flowing-timeline-framer__inner`}>
        <header className="flowing-timeline-framer__header">
          <h2
            id="flowing-timeline-heading"
            className="flowing-timeline-framer__heading"
          >
            How I got here.
          </h2>
          <p className="flowing-timeline-framer__subline">
            A few stops from first sketches to where I am now.
          </p>
        </header>
        <div
          ref={hostRef}
          className="flowing-timeline-framer__stage"
          aria-label="Timeline"
        />
      </div>
    </section>
  );
}
