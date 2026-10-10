"use client";

import { useTheme } from "@/components/ThemeController";
import { useEffect, useRef } from "react";
import "./hero-monsoon.css";

/** Indian monsoon months (June–September): the storm rolls in on its own. */
export function isMonsoonSeason(date = new Date()) {
  const month = date.getMonth();
  return month >= 5 && month <= 8;
}

type Drop = { x: number; y: number; length: number; speed: number; alpha: number };
type Splash = { x: number; y: number; age: number };

/** Rain leans left, matching the way the garden bows. */
const SLANT = -0.22;
const SPLASH_LIFE = 14;

/**
 * A storm cloud drifting across the night sky. Tap it to start (or stop) the
 * monsoon: rain over the hero, lightning flashes, and a darker sky.
 */
export default function HeroMonsoon({
  raining,
  onToggle,
}: {
  raining: boolean;
  onToggle: () => void;
}) {
  const { reducedMotion } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const rainingRef = useRef(raining);
  const wakeRainRef = useRef<() => void>(() => {});

  // Rain: drops fade in and out with the storm, and sleep off-screen.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let drops: Drop[] = [];
    const splashes: Splash[] = [];
    let intensity = 0;
    let frame = 0;
    let inView = true;

    const spawn = (drop: Partial<Drop> = {}): Drop => ({
      x: Math.random() * (width + height * -SLANT),
      y: Math.random() * -height,
      length: 12 + Math.random() * 16,
      speed: 13 + Math.random() * 9,
      alpha: 0.12 + Math.random() * 0.26,
      ...drop,
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(420, (width * height) / 4200));
      drops = Array.from({ length: count }, () => spawn({ y: Math.random() * height }));
    };

    const paint = (step: number) => {
      ctx.clearRect(0, 0, width, height);
      if (intensity < 0.01) return;
      const visible = Math.round(drops.length * intensity);
      const ground = height * 0.8;

      ctx.lineCap = "round";
      ctx.lineWidth = 1;
      for (let i = 0; i < visible; i++) {
        const drop = drops[i];
        drop.y += drop.speed * step;
        drop.x += drop.speed * SLANT * step;
        if (drop.y > height || drop.x < -40) {
          // Some drops burst on the flower bed on their way out.
          if (step > 0 && Math.random() < 0.35) {
            splashes.push({ x: drop.x, y: ground + Math.random() * (height - ground), age: 0 });
          }
          drops[i] = spawn();
          continue;
        }
        ctx.strokeStyle = `rgba(190, 208, 235, ${drop.alpha * intensity})`;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - drop.length * SLANT, drop.y - drop.length);
        ctx.stroke();
      }

      for (let i = splashes.length - 1; i >= 0; i--) {
        const splash = splashes[i];
        splash.age += step;
        if (splash.age > SPLASH_LIFE) {
          splashes.splice(i, 1);
          continue;
        }
        const t = splash.age / SPLASH_LIFE;
        ctx.strokeStyle = `rgba(200, 216, 240, ${0.35 * (1 - t) * intensity})`;
        ctx.beginPath();
        ctx.ellipse(splash.x, splash.y, 2 + t * 7, 0.8 + t * 2, 0, Math.PI, 0);
        ctx.stroke();
      }
    };

    let last = performance.now();
    const tick = (now: number) => {
      const step = Math.min(3, (now - last) / 16.67);
      last = now;
      intensity += ((rainingRef.current ? 1 : 0) - intensity) * 0.02 * step;
      paint(step);
      // Keep going while it's raining or the last drops are still fading out.
      if (inView && !document.hidden && (rainingRef.current || intensity > 0.01)) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
        if (intensity <= 0.01) ctx.clearRect(0, 0, width, height);
      }
    };

    const start = () => {
      if (frame || !inView || document.hidden) return;
      if (reducedMotion) {
        // No falling rain: just a still layer of streaks while it's raining.
        intensity = rainingRef.current ? 0.6 : 0;
        paint(0);
        return;
      }
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    resize();
    start();
    wakeRainRef.current = start;

    const observer = new ResizeObserver(() => {
      resize();
      if (reducedMotion) paint(0);
    });
    observer.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
    });
    visibility.observe(canvas);
    const onVisibility = () => start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reducedMotion]);

  // Wake the rain loop whenever the storm starts or stops.
  useEffect(() => {
    rainingRef.current = raining;
    wakeRainRef.current();
  }, [raining]);

  // Lightning: an irregular double flash every 6–14s while it rains.
  useEffect(() => {
    if (!raining || reducedMotion) return;
    let timer: ReturnType<typeof setTimeout>;
    const strike = () => {
      flashRef.current?.animate(
        [
          { opacity: 0 },
          { opacity: 0.55, offset: 0.08 },
          { opacity: 0.08, offset: 0.22 },
          { opacity: 0.4, offset: 0.34 },
          { opacity: 0 },
        ],
        { duration: 650, easing: "ease-out" },
      );
      timer = setTimeout(strike, 6000 + Math.random() * 8000);
    };
    timer = setTimeout(strike, 1800);
    return () => clearTimeout(timer);
  }, [raining, reducedMotion]);

  return (
    <>
      <div className="hero-monsoon__sky" aria-hidden />
      <canvas ref={canvasRef} className="hero-monsoon__rain" aria-hidden />
      <div ref={flashRef} className="hero-monsoon__flash" aria-hidden />

      <div className="hero-monsoon__drift">
        <button
          type="button"
          className="hero-monsoon__cloud"
          onClick={onToggle}
          aria-pressed={raining}
          data-cursor="interactive"
        >
          <svg viewBox="0 0 220 120" aria-hidden>
            <defs>
              {/* Moonlight from the top-left; belly falls into shadow. */}
              <radialGradient id="monsoon-lobe" cx="38%" cy="22%" r="80%">
                <stop offset="0" stopColor="#6b7486" />
                <stop offset="0.45" stopColor="#3b414d" />
                <stop offset="1" stopColor="#1b1f27" />
              </radialGradient>
              <radialGradient id="monsoon-belly" cx="50%" cy="100%" r="70%">
                <stop offset="0" stopColor="#0d1015" stopOpacity="0.9" />
                <stop offset="1" stopColor="#0d1015" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="monsoon-rim" x1="0" y1="0" x2="0.4" y2="1">
                <stop offset="0" stopColor="#dfe7f7" stopOpacity="0.75" />
                <stop offset="0.5" stopColor="#dfe7f7" stopOpacity="0.08" />
                <stop offset="1" stopColor="#dfe7f7" stopOpacity="0" />
              </linearGradient>
              {/* Soft, vapoury outer edge behind the crisp lobes. */}
              <filter id="monsoon-haze" x="-20%" y="-30%" width="140%" height="160%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
              <filter id="monsoon-soft" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="0.9" />
              </filter>
            </defs>

            <g className="hero-monsoon__cloud-haze" filter="url(#monsoon-haze)" fill="#2a303b">
              <ellipse cx="110" cy="84" rx="98" ry="26" />
              <circle cx="74" cy="58" r="34" />
              <circle cx="118" cy="44" r="42" />
              <circle cx="160" cy="62" r="32" />
            </g>

            <g className="hero-monsoon__cloud-lobes" filter="url(#monsoon-soft)" fill="url(#monsoon-lobe)">
              <ellipse cx="112" cy="86" rx="92" ry="22" />
              <circle cx="48" cy="72" r="24" />
              <circle cx="76" cy="58" r="33" />
              <circle cx="118" cy="46" r="41" />
              <circle cx="158" cy="60" r="31" />
              <circle cx="186" cy="78" r="20" />
            </g>

            {/* Shadowed underside, pooling toward the belly. */}
            <ellipse className="hero-monsoon__cloud-belly" cx="112" cy="92" rx="94" ry="20" fill="url(#monsoon-belly)" />

            {/* Thin moonlit edge along the top of each billow. */}
            <g className="hero-monsoon__cloud-rim" fill="none" stroke="url(#monsoon-rim)" strokeWidth="2" strokeLinecap="round">
              <path d="M55 52a33 33 0 0 1 44-20" />
              <path d="M84 24a41 41 0 0 1 64 4" />
              <path d="M140 36a31 31 0 0 1 43 12" />
            </g>
          </svg>
          <span className="hero-monsoon__hint">{raining ? "Stop the rain" : "Make it rain"}</span>
        </button>
      </div>
    </>
  );
}
