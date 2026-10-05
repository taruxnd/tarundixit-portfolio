"use client";

import { useEffect } from "react";

/**
 * Safari iOS expands the layout viewport when scrollWidth > innerWidth
 * mid-scroll (e.g. Framer/road mounting). Force the document back to
 * device-width without changing desktop layout.
 */
export default function MobileViewportLock() {
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");

    const lock = () => {
      if (!mq.matches) return;
      const root = document.documentElement;
      const body = document.body;
      root.style.overflowX = "hidden";
      body.style.overflowX = "hidden";
      root.style.maxWidth = "100%";
      body.style.maxWidth = "100%";

      // If something still widened the document, nudge visual viewport back.
      if (root.scrollWidth > window.innerWidth + 2) {
        const meta = document.querySelector('meta[name="viewport"]');
        if (meta) {
          meta.setAttribute(
            "content",
            "width=device-width, initial-scale=1, viewport-fit=cover",
          );
        }
      }
    };

    lock();
    window.addEventListener("scroll", lock, { passive: true });
    window.addEventListener("resize", lock);
    const mo = new MutationObserver(lock);
    mo.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    return () => {
      window.removeEventListener("scroll", lock);
      window.removeEventListener("resize", lock);
      mo.disconnect();
    };
  }, []);

  return null;
}
