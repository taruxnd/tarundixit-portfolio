"use client";

import { useEffect, useState } from "react";
import { framerRuntime } from "../lib/framer-runtime";

declare global {
  interface Window {
    __framerToNextBooted?: boolean;
  }
}

/** Strip Framer page chrome that fights the portfolio shell. */
function prepareHydrateHtml(html: string) {
  return html
    .replace(
      /<style data-framer-html-style="">html body \{ background: rgb\(20, 20, 20\); \}<\/style>/g,
      "",
    )
    .replace(/html body \{ background: rgb\(20, 20, 20\); \}/g, "");
}

/**
 * Exact framer-to-next island from the zip.
 * Mounts into `#polaroid-timeline-host` when present (About embed),
 * otherwise `document.body` (standalone mini-app).
 */
export function FramerRuntimeIsland() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.__framerToNextBooted && document.getElementById("main")) {
      setReady(true);
      return;
    }

    const mountParent =
      document.getElementById("polaroid-timeline-host") ?? document.body;

    let main = document.getElementById("main");
    if (!main) {
      main = document.createElement("div");
      main.id = "main";
      for (const [key, value] of Object.entries(framerRuntime.mainAttrs)) {
        main.setAttribute(key, value);
      }
      main.innerHTML = prepareHydrateHtml(framerRuntime.mainInnerHtml);
      mountParent.appendChild(main);
    } else if (!mountParent.contains(main)) {
      mountParent.appendChild(main);
    }

    // Framer script always hydrateRoots `#__framer-badge-container` — must exist
    // (we hide it via CSS on the portfolio embed).
    if (
      framerRuntime.badgeInnerHtml &&
      !document.getElementById("__framer-badge-container")
    ) {
      const badge = document.createElement("div");
      badge.id = "__framer-badge-container";
      badge.innerHTML = framerRuntime.badgeInnerHtml;
      document.body.appendChild(badge);
    }

    if (
      framerRuntime.svgTemplatesHtml &&
      !document.getElementById("svg-templates")
    ) {
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
    setReady(true);
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
