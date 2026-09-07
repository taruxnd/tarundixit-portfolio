"use client";

import { useEffect, useRef } from "react";

/** Midnight / minimal palette from Shooting Stars Pro */
const THEME = {
  starColor: "#ffffff",
  shootingStarColor: "#7c6ff7",
  nebulaEnabled: false,
  nebulaColor: "#000000",
} as const;

type MeteorStyle = "minimal" | "classic" | "comet" | "streak" | "neon";

interface ShootingStarsBackgroundProps {
  className?: string;
  starCount?: number;
  twinkle?: boolean;
  twinkleSpeed?: number;
  glowIntensity?: number;
  shootingStars?: boolean;
  shootingStarInterval?: number;
  /** How many meteors to spawn each interval */
  meteorsPerBurst?: number;
  shootingStarDirection?: "left" | "right" | "both";
  /** Meteor draw style — default streak per site settings */
  meteorStyle?: MeteorStyle;
  meteorFragments?: boolean;
  parallax?: boolean;
  parallaxStrength?: number;
  reducedMotion?: boolean;
}

type Star = {
  baseX: number;
  baseY: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  layer: number;
  sparkle: boolean;
  colorShift: number;
};

type ShootingStar = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tailLength: number;
  elapsed: number;
  duration: number;
  color: string;
};

type Fragment = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  radius: number;
  color: string;
};

function hexToRgb(hex: string): [number, number, number] {
  const raw = (hex || "#ffffff").replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  return [
    parseInt(full.slice(0, 2), 16) || 255,
    parseInt(full.slice(2, 4), 16) || 255,
    parseInt(full.slice(4, 6), 16) || 255,
  ];
}

export default function ShootingStarsBackground({
  className = "",
  starCount = 400,
  twinkle = true,
  twinkleSpeed = 1,
  glowIntensity = 0,
  shootingStars = true,
  shootingStarInterval = 2,
  meteorsPerBurst = 2,
  shootingStarDirection = "left",
  meteorStyle = "streak",
  meteorFragments = true,
  parallax = true,
  parallaxStrength = 25,
  reducedMotion = false,
}: ShootingStarsBackgroundProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settingsRef = useRef({
    starColor: THEME.starColor,
    nebulaEnabled: THEME.nebulaEnabled,
    nebulaColor: THEME.nebulaColor,
    shootingStarColor: THEME.shootingStarColor,
    starCount,
    twinkle: twinkle && !reducedMotion,
    twinkleSpeed,
    glowIntensity,
    shootingStars: shootingStars && !reducedMotion,
    shootingStarInterval,
    meteorsPerBurst,
    shootingStarDirection,
    meteorStyle,
    meteorFragments: meteorFragments && !reducedMotion,
    parallax: parallax && !reducedMotion,
    parallaxStrength,
  });

  settingsRef.current = {
    starColor: THEME.starColor,
    nebulaEnabled: THEME.nebulaEnabled,
    nebulaColor: THEME.nebulaColor,
    shootingStarColor: THEME.shootingStarColor,
    starCount,
    twinkle: twinkle && !reducedMotion,
    twinkleSpeed,
    glowIntensity,
    shootingStars: shootingStars && !reducedMotion,
    shootingStarInterval,
    meteorsPerBurst,
    shootingStarDirection,
    meteorStyle,
    meteorFragments: meteorFragments && !reducedMotion,
    parallax: parallax && !reducedMotion,
    parallaxStrength,
  };

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = {
      stars: [] as Star[],
      shootingStarList: [] as ShootingStar[],
      fragments: [] as Fragment[],
      mouse: { x: 0.5, y: 0.5 },
      targetMouse: { x: 0.5, y: 0.5 },
      time: 0,
      rafId: 0,
      lastShootingStarTime: -999999,
      width: 0,
      height: 0,
    };

    const spawnStars = () => {
      const { width, height } = state;
      if (!width || !height) return;
      const count = settingsRef.current.starCount;
      const next: Star[] = [];
      for (let i = 0; i < count; i++) {
        const roll = Math.random();
        const layer = roll < 0.55 ? 1 : roll < 0.82 ? 2 : 3;
        const radius =
          layer === 1
            ? 0.15 + Math.random() * 0.25
            : layer === 2
              ? 0.35 + Math.random() * 0.4
              : 0.6 + Math.random() * 0.7;
        next.push({
          baseX: Math.random() * width,
          baseY: Math.random() * height,
          radius,
          opacity: 0.35 + Math.random() * 0.65,
          twinkleSpeed: 0.4 + Math.random() * 2.5,
          twinkleOffset: Math.random() * Math.PI * 2,
          layer,
          sparkle: layer === 3 && Math.random() < 0.3,
          colorShift: Math.random(),
        });
      }
      state.stars = next;
    };

    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      state.width = w;
      state.height = h;
      spawnStars();
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      state.targetMouse.x = (event.clientX - rect.left) / rect.width;
      state.targetMouse.y = (event.clientY - rect.top) / rect.height;
    };

    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    resize();
    window.addEventListener("pointermove", onPointerMove);

    let lastTs = 0;

    const frame = (ts: number) => {
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;
      const cfg = settingsRef.current;
      const { width: w, height: h } = state;
      if (!w || !h) {
        state.rafId = requestAnimationFrame(frame);
        return;
      }

      state.mouse.x += (state.targetMouse.x - state.mouse.x) * 0.05;
      state.mouse.y += (state.targetMouse.y - state.mouse.y) * 0.05;
      state.time += dt;

      ctx.clearRect(0, 0, w, h);

      if (cfg.nebulaEnabled) {
        const [nr, ng, nb] = hexToRgb(cfg.nebulaColor);
        const drift = state.time * 0.04;
        const blobs = [
          {
            x: w * (0.22 + Math.sin(drift) * 0.04),
            y: h * (0.32 + Math.cos(drift * 0.7) * 0.04),
            r: w * 0.48,
          },
          {
            x: w * (0.73 + Math.cos(drift * 0.85) * 0.04),
            y: h * (0.62 + Math.sin(drift * 0.6) * 0.04),
            r: w * 0.42,
          },
        ];
        for (const blob of blobs) {
          const g = ctx.createRadialGradient(
            blob.x,
            blob.y,
            0,
            blob.x,
            blob.y,
            blob.r,
          );
          g.addColorStop(0, `rgba(${nr},${ng},${nb},0.14)`);
          g.addColorStop(0.5, `rgba(${nr},${ng},${nb},0.06)`);
          g.addColorStop(1, `rgba(${nr},${ng},${nb},0)`);
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
        }
      }

      const px = (state.mouse.x - 0.5) * cfg.parallaxStrength;
      const py = (state.mouse.y - 0.5) * cfg.parallaxStrength;
      const [sr, sg, sb] = hexToRgb(cfg.starColor);

      for (const star of state.stars) {
        const depth = cfg.parallax ? star.layer * 0.33 : 0;
        const x = star.baseX + px * depth;
        const y = star.baseY + py * depth;
        const alpha = cfg.twinkle
          ? star.opacity *
            (0.45 +
              0.55 *
                Math.sin(
                  state.time * star.twinkleSpeed * cfg.twinkleSpeed +
                    star.twinkleOffset,
                ))
          : star.opacity;
        const shift = star.colorShift;
        const r = Math.max(0, Math.round(sr - shift * 18));
        const g = Math.max(0, Math.round(sg - shift * 8));
        const b = Math.min(255, Math.round(sb + shift * 15));

        if (star.layer >= 2 && cfg.glowIntensity > 0) {
          const outerR = star.radius * (star.layer === 3 ? 11 : 6);
          const outer = ctx.createRadialGradient(x, y, 0, x, y, outerR);
          outer.addColorStop(
            0,
            `rgba(${r},${g},${b},${alpha * 0.08 * cfg.glowIntensity})`,
          );
          outer.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.beginPath();
          ctx.arc(x, y, outerR, 0, Math.PI * 2);
          ctx.fillStyle = outer;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(x, y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      }

      const ssIntervalMs = cfg.shootingStarInterval * 1000;
      if (cfg.shootingStars && ts - state.lastShootingStarTime > ssIntervalMs) {
        const dir = cfg.shootingStarDirection;
        const count = Math.max(1, cfg.meteorsPerBurst);
        for (let i = 0; i < count; i++) {
          const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.45;
          const speed = 380 + Math.random() * 280;
          const goLeft =
            dir === "left" || (dir !== "right" && Math.random() > 0.5);
          const fromTop = Math.random() > 0.25;
          state.shootingStarList.push({
            x: fromTop ? Math.random() * w : goLeft ? w + 20 : -20,
            y: fromTop ? -20 - Math.random() * 40 : Math.random() * h * 0.4,
            vx: goLeft ? -Math.cos(angle) * speed : Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            tailLength: 90 + Math.random() * 130,
            // Stagger slightly so they don't all share one frame
            elapsed: -Math.random() * 0.35,
            duration: 1 + Math.random() * 0.9,
            color: cfg.shootingStarColor,
          });
        }
        state.lastShootingStarTime = ts;
      }

      state.fragments = state.fragments.filter((frag) => {
        frag.life -= dt;
        if (frag.life <= 0) return false;
        frag.x += frag.vx * dt;
        frag.y += frag.vy * dt;
        const life = frag.life / frag.maxLife;
        const [fr, fg, fb] = hexToRgb(frag.color);
        ctx.beginPath();
        ctx.arc(frag.x, frag.y, Math.max(0.2, frag.radius * life), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${fr},${fg},${fb},${life * 0.85})`;
        ctx.fill();
        return true;
      });

      state.shootingStarList = state.shootingStarList.filter((meteor) => {
        meteor.elapsed += dt;
        if (meteor.elapsed < 0) return true;
        meteor.x += meteor.vx * dt;
        meteor.y += meteor.vy * dt;
        if (meteor.elapsed >= meteor.duration) return false;

        const progress = meteor.elapsed / meteor.duration;
        if (cfg.meteorFragments && progress > 0.08 && Math.random() < 0.35) {
          const speed = Math.sqrt(
            meteor.vx * meteor.vx + meteor.vy * meteor.vy,
          );
          const nx = meteor.vx / speed;
          const ny = meteor.vy / speed;
          const count = Math.random() < 0.25 ? 2 : 1;
          for (let i = 0; i < count; i++) {
            const burst = 12 + Math.random() * 20;
            const life = 0.18 + Math.random() * 0.38;
            state.fragments.push({
              x: meteor.x + (Math.random() - 0.5) * 3,
              y: meteor.y + (Math.random() - 0.5) * 3,
              vx: -nx * burst * 0.4 + -ny * (Math.random() - 0.5) * burst,
              vy: -ny * burst * 0.4 + nx * (Math.random() - 0.5) * burst,
              life,
              maxLife: life,
              radius: 0.3 + Math.random() * 1,
              color: meteor.color,
            });
          }
        }

        const fade =
          progress < 0.15
            ? progress / 0.15
            : progress > 0.65
              ? 1 - (progress - 0.65) / 0.35
              : 1;
        if (fade <= 0.01) return true;

        const speed = Math.sqrt(meteor.vx * meteor.vx + meteor.vy * meteor.vy);
        const nx = meteor.vx / speed;
        const ny = meteor.vy / speed;
        const [mr, mg, mb] = hexToRgb(meteor.color);
        const tx = meteor.x - nx * meteor.tailLength;
        const ty = meteor.y - ny * meteor.tailLength;

        ctx.lineCap = "round";

        if (cfg.meteorStyle === "streak") {
          const offsets = [-2.2, 0, 2.2];
          const alphas = [0.35, 0.85, 0.35];
          const widths = [0.4, 0.65, 0.4];
          for (let i = 0; i < 3; i++) {
            const ox = -ny * offsets[i];
            const oy = nx * offsets[i];
            const g = ctx.createLinearGradient(
              tx + ox,
              ty + oy,
              meteor.x + ox,
              meteor.y + oy,
            );
            g.addColorStop(0, `rgba(${mr},${mg},${mb},0)`);
            g.addColorStop(
              0.55,
              `rgba(${mr},${mg},${mb},${fade * alphas[i] * 0.5})`,
            );
            g.addColorStop(1, `rgba(255,255,255,${fade * alphas[i]})`);
            ctx.strokeStyle = g;
            ctx.lineWidth = widths[i];
            ctx.beginPath();
            ctx.moveTo(tx + ox, ty + oy);
            ctx.lineTo(meteor.x + ox, meteor.y + oy);
            ctx.stroke();
          }
        } else if (cfg.meteorStyle === "minimal") {
          const g = ctx.createLinearGradient(tx, ty, meteor.x, meteor.y);
          g.addColorStop(0, `rgba(${mr},${mg},${mb},0)`);
          g.addColorStop(0.7, `rgba(${mr},${mg},${mb},${fade * 0.5})`);
          g.addColorStop(1, `rgba(255,255,255,${fade * 0.9})`);
          ctx.strokeStyle = g;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(meteor.x, meteor.y);
          ctx.stroke();
        } else {
          const g = ctx.createLinearGradient(tx, ty, meteor.x, meteor.y);
          g.addColorStop(0, `rgba(${mr},${mg},${mb},0)`);
          g.addColorStop(0.35, `rgba(${mr},${mg},${mb},${fade * 0.35})`);
          g.addColorStop(0.75, `rgba(${mr},${mg},${mb},${fade * 0.7})`);
          g.addColorStop(1, `rgba(255,255,255,${fade})`);
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(meteor.x, meteor.y);
          ctx.stroke();
        }

        ctx.globalAlpha = 1;
        return true;
      });

      state.rafId = requestAnimationFrame(frame);
    };

    state.rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(state.rafId);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [starCount, reducedMotion]);

  return (
    <div ref={wrapRef} className={`relative h-full w-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      />
    </div>
  );
}
