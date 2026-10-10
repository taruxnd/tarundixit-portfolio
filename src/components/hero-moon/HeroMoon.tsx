"use client";

import { useTheme } from "@/components/ThemeController";
import { useEffect, useRef } from "react";
import "./hero-moon.css";

/**
 * A cut-paper moon hanging on a string from the top-right of the hero, like a
 * stage prop. It sways in a light breeze, swings harder in the monsoon, slowly
 * turns on its string, and can be nudged with the cursor.
 */
export default function HeroMoon() {
  const { reducedMotion } = useTheme();
  const swingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const swingEl = swingRef.current;
    if (!swingEl || reducedMotion) return;
    const section = swingEl.closest(".hero-section");

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

      // The breeze sets where the moon wants to hang; a damped spring follows.
      const breeze =
        Math.sin(time * 0.8) * (2 + storm * 6) +
        Math.sin(time * 1.9 + 1.3) * (0.5 + storm * 2.5) -
        storm * 5;
      velocity += (-22 * (angle - breeze) - 2 * velocity) * dt;
      angle += velocity * dt;
      swingEl.style.transform = `rotate(${angle.toFixed(2)}deg)`;

      frame = inView && !document.hidden ? requestAnimationFrame(tick) : 0;
    };

    const start = () => {
      if (frame || !inView || document.hidden) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    // Brush past it and it swings away from the cursor.
    const onPointerMove = (event: PointerEvent) => {
      velocity += Math.max(-45, Math.min(45, event.movementX * 2.4));
    };
    const moon = swingEl.querySelector<HTMLElement>(".hero-moon__paper");
    moon?.addEventListener("pointermove", onPointerMove);

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
      moon?.removeEventListener("pointermove", onPointerMove);
    };
  }, [reducedMotion]);

  return (
    <div className="hero-moon" aria-hidden>
      <div ref={swingRef} className="hero-moon__swing">
        <span className="hero-moon__string" />
        <div className="hero-moon__paper">
          <svg viewBox="0 0 100 100">
            <defs>
              <radialGradient id="hero-moon-paper" cx="35%" cy="30%" r="80%">
                <stop offset="0" stopColor="#fbf3df" />
                <stop offset="0.6" stopColor="#efe2c3" />
                <stop offset="1" stopColor="#d9c79f" />
              </radialGradient>
            </defs>
            {/* Crescent: a full disc with a second disc cut out of it. */}
            <path
              d="M58 6a44 44 0 1 0 36 70A36 36 0 1 1 58 6Z"
              fill="url(#hero-moon-paper)"
            />
            {/* A few pressed-in craters on the paper. */}
            <circle cx="30" cy="40" r="5" fill="#d9c79f" opacity="0.55" />
            <circle cx="40" cy="70" r="3.5" fill="#d9c79f" opacity="0.5" />
            <circle cx="22" cy="60" r="2.4" fill="#d9c79f" opacity="0.45" />
            {/* Hole the string is tied through. */}
            <circle cx="58" cy="11" r="2" fill="#0a0a0a" />
          </svg>
        </div>
      </div>
    </div>
  );
}
