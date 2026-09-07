"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

export interface DotGridBackgroundProps {
  dotColor?: string;
  dotSize?: number;
  dotSpacing?: number;
  orbitSpeed?: number;
  impactRadius?: number;
  scaleOnHover?: number;
  baseOpacity?: number;
  maxOpacity?: number;
  enableRevolve?: boolean;
  reducedMotion?: boolean;
  className?: string;
}

interface DotCell {
  bx: number;
  by: number;
  inclination: number;
  ascension: number;
  phase: number;
  speedMult: number;
}

interface Rgb {
  r: number;
  g: number;
  b: number;
}

interface DotGridConfig {
  dotColor: string;
  dotSize: number;
  dotSpacing: number;
  orbitSpeed: number;
  impactRadius: number;
  scaleOnHover: number;
  baseOpacity: number;
  maxOpacity: number;
  enableRevolve: boolean;
  reducedMotion: boolean;
}

function smoothstep(value: number) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

function parseRgb(color: string): Rgb {
  const trimmed = color.trim();
  if (trimmed.startsWith("rgb")) {
    const parts = trimmed.match(/[\d.]+/g) ?? [];
    return {
      r: Number(parts[0]) || 0,
      g: Number(parts[1]) || 0,
      b: Number(parts[2]) || 0,
    };
  }

  let hex = trimmed.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const value = parseInt(hex.slice(0, 6), 16);
  if (Number.isNaN(value)) {
    return { r: 136, g: 136, b: 136 };
  }

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function startDotGrid(
  canvasEl: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  configRef: MutableRefObject<DotGridConfig>,
  initialSpacing: number,
) {
  const dpr = window.devicePixelRatio || 1;
  let width = 0;
  let height = 0;
  let pointer = { x: -9999, y: -9999 };
  let pointerInside = false;
  let pointerLeftAt = 0;
  let orbitTime = 0;
  let lastFrame = 0;
  let frameId = 0;

  const dotsRef = { current: [] as DotCell[] };
  const spacingRef = { current: initialSpacing };

  function buildGrid() {
    const spacing = configRef.current.dotSpacing;
    spacingRef.current = spacing;
    dotsRef.current = [];

    const cols = Math.ceil(width / spacing) + 2;
    const rows = Math.ceil(height / spacing) + 2;

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        dotsRef.current.push({
          bx: col * spacing,
          by: row * spacing,
          inclination: Math.random() * Math.PI,
          ascension: Math.random() * Math.PI * 2,
          phase: Math.random() * Math.PI * 2,
          speedMult: 0.7 + Math.random() * 0.6,
        });
      }
    }
  }

  function resize() {
    const rect = canvasEl.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvasEl.width = width * dpr;
    canvasEl.height = height * dpr;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildGrid();
  }

  function onPointerMove(event: PointerEvent) {
    const rect = canvasEl.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointerInside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
  }

  function onPointerLeave() {
    pointer.x = -9999;
    pointer.y = -9999;
    pointerInside = false;
    pointerLeftAt = performance.now();
  }

  function drawFrame(now: number) {
    frameId = window.requestAnimationFrame(drawFrame);

    const delta = Math.min((now - (lastFrame || now)) / 1000, 0.05);
    lastFrame = now;

    const config = configRef.current;
    if (spacingRef.current !== config.dotSpacing) {
      buildGrid();
    }

    if (!config.reducedMotion) {
      orbitTime += config.orbitSpeed * delta;
    }

    context.clearRect(0, 0, width, height);

    const rgb = parseRgb(config.dotColor);
    const px = pointer.x;
    const py = pointer.y;
    const fadeSeconds = pointerInside
      ? 0
      : Math.max(0, now - pointerLeftAt) / 1000;
    const fade = pointerInside ? 1 : smoothstep(Math.max(0, 1 - fadeSeconds * 1.5));

    for (const dot of dotsRef.current) {
      const dx = dot.bx - px;
      const dy = dot.by - py;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const inRange = distance < config.impactRadius && distance > 0;

      let x = dot.bx;
      let y = dot.by;
      let scale = 1;
      let opacity = config.baseOpacity;

      if (inRange && !config.reducedMotion) {
        const influence = smoothstep(1 - distance / config.impactRadius) * fade;

        if (config.enableRevolve) {
          const orbitRadius = (1 - influence) * config.dotSpacing * 0.7 * influence;
          const angle = orbitTime * dot.speedMult + dot.phase;
          const cosAsc = Math.cos(dot.ascension);
          const sinAsc = Math.sin(dot.ascension);
          const cosInc = Math.cos(dot.inclination);
          const sinInc = Math.sin(dot.inclination);
          const cosAngle = Math.cos(angle);
          const sinAngle = Math.sin(angle) * cosInc;
          const depth = Math.sin(angle) * sinInc;
          const offsetX = (cosAngle * cosAsc - sinAngle * sinAsc) * orbitRadius;
          const offsetY = (cosAngle * sinAsc + sinAngle * cosAsc) * orbitRadius;
          x = dot.bx + offsetX;
          y = dot.by + offsetY;
          const depthScale = 0.75 + 0.25 * ((depth + 1) * 0.5);
          scale = (1 + (config.scaleOnHover - 1) * influence) * depthScale;
          opacity =
            (config.baseOpacity + (1 - config.baseOpacity) * influence) * depthScale;
        } else {
          scale = 1 + (config.scaleOnHover - 1) * influence;
          opacity = config.baseOpacity + (1 - config.baseOpacity) * influence;
        }
      }

      const radius = (config.dotSize / 2) * scale;
      const alpha = Math.min(opacity, config.maxOpacity);
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
      context.fill();
    }
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvasEl);
  resize();

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("blur", onPointerLeave);
  frameId = window.requestAnimationFrame(drawFrame);

  return () => {
    window.cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("blur", onPointerLeave);
  };
}

export default function DotGridBackground({
  dotColor = "#6366f1",
  dotSize = 3,
  dotSpacing = 28,
  orbitSpeed = 1.5,
  impactRadius = 100,
  scaleOnHover = 1.8,
  baseOpacity = 0.3,
  maxOpacity = 0.45,
  enableRevolve = true,
  reducedMotion = false,
  className,
}: DotGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const configRef = useRef<DotGridConfig>({
    dotColor,
    dotSize,
    dotSpacing,
    orbitSpeed,
    impactRadius,
    scaleOnHover,
    baseOpacity,
    maxOpacity,
    enableRevolve,
    reducedMotion,
  });

  configRef.current = {
    dotColor,
    dotSize,
    dotSpacing,
    orbitSpeed,
    impactRadius,
    scaleOnHover,
    baseOpacity,
    maxOpacity,
    enableRevolve,
    reducedMotion,
  };

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const context = canvasEl.getContext("2d");
    if (!context) return;

    return startDotGrid(canvasEl, context, configRef, configRef.current.dotSpacing);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
