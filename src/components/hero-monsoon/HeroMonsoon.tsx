"use client";

import { useTheme } from "@/components/ThemeController";
import { Phone, PhoneOff } from "lucide-react";
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
 * A "Call Indradev" button (the god of rain and thunder) in the top-left of
 * the hero. Tap it and the monsoon starts: rain, lightning, a darker sky.
 * Tap again ("Hang up") and it clears.
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
      alpha: 0.18 + Math.random() * 0.3,
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
      ctx.lineWidth = 1.15;
      for (let i = 0; i < visible; i++) {
        const drop = drops[i];
        drop.y += drop.speed * step;
        drop.x += drop.speed * SLANT * step;
        if (drop.y > height || drop.x < -40) {
          // Some drops burst on the flower bed on their way out.
          if (step > 0 && Math.random() < 0.35) {
            splashes.push({ x: drop.x, y: ground + Math.random() * (height - ground), age: 0 });
          }
          drops[i] = spawn({ y: -24 });
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
      intensity += ((rainingRef.current ? 1 : 0) - intensity) * (rainingRef.current ? 0.045 : 0.02) * step;
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

      <button
        type="button"
        className="hero-monsoon__cta"
        onClick={onToggle}
        aria-pressed={raining}
        aria-label={raining ? "Hang up (stop the rain)" : "Call Indradev (make it rain)"}
        data-cursor="interactive"
      >
        {/* Desktop: icon + words. Phones: just the weather emoji. */}
        <span className="hero-monsoon__cta-full" aria-hidden>
          {raining ? <PhoneOff size={14} strokeWidth={2.4} /> : <Phone size={14} strokeWidth={2.4} />}
          {raining ? "Hang up" : "Call Indradev"}
        </span>
        <span className="hero-monsoon__cta-emoji" aria-hidden>
          {raining ? "☀️" : "🌧️"}
        </span>
      </button>
    </>
  );
}
