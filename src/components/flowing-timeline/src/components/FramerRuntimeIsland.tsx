"use client";

import { useEffect, useState } from "react";
import { framerRuntime } from "@/lib/framer-runtime";

declare global {
  interface Window {
    __framerToNextBooted?: boolean;
  }
}

export function FramerRuntimeIsland() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.__framerToNextBooted && document.getElementById("main")) {
      setReady(true);
      return;
    }

    let main = document.getElementById("main");
    if (!main) {
      main = document.createElement("div");
      main.id = "main";
      for (const [key, value] of Object.entries(framerRuntime.mainAttrs)) {
        main.setAttribute(key, value);
      }
      main.innerHTML = framerRuntime.mainInnerHtml;
      document.body.appendChild(main);
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
    setReady(true);
  }, []);

  return (
    <div
      aria-busy={!ready}
      aria-label="Framer runtime"
      style={{
        minHeight: ready ? 0 : "100vh",
        width: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
