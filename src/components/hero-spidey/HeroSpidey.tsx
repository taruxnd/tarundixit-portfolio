"use client";

import { useTheme } from "@/components/ThemeController";
import { useEffect, useRef } from "react";
import "./hero-spidey.css";

/**
 * Spider-Man hanging upside down on a web line from the top-right of the
 * hero. He sways and bobs on the line, swings away when brushed with the
 * cursor, and swings harder in the monsoon.
 */
export default function HeroSpidey() {
  const { reducedMotion } = useTheme();
  const swingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const swingEl = swingRef.current;
    if (!swingEl || reducedMotion) return;
    const section = swingEl.closest(".hero-section");
    const line = swingEl.querySelector<HTMLElement>(".hero-spidey__line");

    let angle = 0;
    let velocity = 0;
    let time = 0;
    let storm = 0;
    let frame = 0;
    let inView = true;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;
      const raining = section?.getAttribute("data-monsoon") === "on";
      storm += ((raining ? 1 : 0) - storm) * Math.min(1, dt * 1.5);

      // The breeze sets where he wants to hang; a damped spring follows it.
      const breeze =
        Math.sin(time * 0.7) * (2.5 + storm * 7) +
        Math.sin(time * 1.7 + 1.1) * (0.6 + storm * 3) -
        storm * 6;
      velocity += (-18 * (angle - breeze) - 1.6 * velocity) * dt;
      angle += velocity * dt;
      swingEl.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      // The web line stretches a little, like he's bouncing on it.
      if (line) line.style.scale = `1 ${(1 + Math.sin(time * 1.3) * 0.035).toFixed(3)}`;

      frame = inView && !document.hidden ? requestAnimationFrame(tick) : 0;
    };

    const start = () => {
      if (frame || !inView || document.hidden) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    // Brush past him and he swings away from the cursor.
    const body = swingEl.querySelector<HTMLElement>(".hero-spidey__body");
    const onPointerMove = (event: PointerEvent) => {
      velocity += Math.max(-50, Math.min(50, event.movementX * 2.6));
    };
    body?.addEventListener("pointermove", onPointerMove);

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
    });
    observer.observe(swingEl);
    document.addEventListener("visibilitychange", start);
    start();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", start);
      body?.removeEventListener("pointermove", onPointerMove);
    };
  }, [reducedMotion]);

  return (
    <div className="hero-spidey" aria-hidden>
      <div ref={swingRef} className="hero-spidey__swing">
        <span className="hero-spidey__line" />
        <div className="hero-spidey__body">
          {/* Upside down: feet at the top on the web line, head at the bottom. */}
          <svg viewBox="0 0 80 150">
            <defs>
              <pattern id="spidey-web" width="9" height="9" patternUnits="userSpaceOnUse">
                <path d="M0 0h9M0 0v9" stroke="#1a0b0d" strokeWidth="0.5" opacity="0.32" />
              </pattern>
            </defs>

            {/* Web line wrapped around the ankles. */}
            <path d="M33 10c4-3 10-3 14 0M33 15c4-3 10-3 14 0" stroke="#e9eef5" strokeWidth="1.4" fill="none" />

            {/* Legs (blue) with red boots at the top. */}
            <path d="M31 6h8v46h-9Z" fill="#1d4fb8" />
            <path d="M41 6h8l1 46h-9Z" fill="#1d4fb8" />
            <path d="M30 2h10v16H30Z" fill="#d42a2a" />
            <path d="M40 2h10v16H40Z" fill="#d42a2a" />
            <path d="M30 2h10v16H30ZM40 2h10v16H40Z" fill="url(#spidey-web)" />

            {/* Torso: red chest, blue sides, black spider emblem. */}
            <path d="M28 50h24l3 40H25Z" fill="#d42a2a" />
            <path d="M25 58l-3 30h5ZM55 58l3 30h-5Z" fill="#1d4fb8" />
            <path d="M28 50h24l3 40H25Z" fill="url(#spidey-web)" />
            <g fill="#141414">
              <ellipse cx="40" cy="70" rx="2.6" ry="5" />
              <path d="M38 68l-7-6M42 68l7-6M38 72l-8 3M42 72l8 3M38 66l-6-9M42 66l6-9M38 74l-6 8M42 74l6 8" stroke="#141414" strokeWidth="1.1" strokeLinecap="round" />
            </g>
            <rect x="26" y="50" width="28" height="4" rx="1.5" fill="#a81f1f" />

            {/* Arms hanging down past the head; one gives a little wave. */}
            <path d="M25 86l-6 34" stroke="#d42a2a" strokeWidth="7" strokeLinecap="round" />
            <path className="hero-spidey__wave" d="M55 86l7 30" stroke="#d42a2a" strokeWidth="7" strokeLinecap="round" />
            <circle cx="18.5" cy="122" r="4.2" fill="#d42a2a" />
            <circle className="hero-spidey__wave" cx="62.5" cy="118" r="4.2" fill="#d42a2a" />

            {/* Head (upside down, chin up), mask with web lines and big white eyes. */}
            <ellipse cx="40" cy="112" rx="15" ry="18" fill="#d42a2a" />
            <ellipse cx="40" cy="112" rx="15" ry="18" fill="url(#spidey-web)" />
            <path d="M40 94v36M26 106c9 3 19 3 28 0M27 118c8-3 18-3 26 0" stroke="#1a0b0d" strokeWidth="0.7" opacity="0.6" fill="none" />
            <path d="M28 117c3 7 8 8 10 5l-1-6c-3-2-6-2-9 1Z" fill="#f7f9fc" stroke="#141414" strokeWidth="2" strokeLinejoin="round" />
            <path d="M52 117c-3 7-8 8-10 5l1-6c3-2 6-2 9 1Z" fill="#f7f9fc" stroke="#141414" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
