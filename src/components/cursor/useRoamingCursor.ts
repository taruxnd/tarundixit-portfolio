"use client";

import { useCallback, useEffect, useRef } from "react";

export interface Point {
  x: number;
  y: number;
}

function randomTarget(padding: number): Point {
  const w = window.innerWidth;
  const h = window.innerHeight;

  return {
    x: padding + Math.random() * Math.max(w - padding * 2, 1),
    y: padding + Math.random() * Math.max(h - padding * 2, 1),
  };
}

export interface RoamingCursorApi {
  nodeRef: React.RefObject<HTMLDivElement | null>;
  posRef: React.MutableRefObject<Point>;
  pauseRoam: () => void;
  resumeRoam: () => void;
  setPosition: (point: Point) => void;
}

/** Autonomous viewport roaming — Figma collaborator style. */
export function useRoamingCursor(enabled: boolean): RoamingCursorApi {
  const nodeRef = useRef<HTMLDivElement>(null);
  const pos = useRef<Point>({ x: 0, y: 0 });
  const target = useRef<Point>({ x: 0, y: 0 });
  const pauseUntil = useRef(0);
  const paused = useRef(false);
  const raf = useRef<number | null>(null);

  const apply = (point: Point) => {
    pos.current = point;
    const node = nodeRef.current;
    if (node) {
      node.style.transform = `translate3d(${Math.round(point.x)}px, ${Math.round(point.y)}px, 0)`;
    }
  };
  const applyRef = useRef(apply);
  applyRef.current = apply;

  const pauseRoam = useCallback(() => {
    paused.current = true;
  }, []);

  const resumeRoam = useCallback(() => {
    paused.current = false;
    pauseUntil.current = performance.now() + 280 + Math.random() * 420;
    target.current = { ...pos.current };
  }, []);

  const setPosition = useCallback((point: Point) => {
    applyRef.current(point);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const padding = 72;
    apply(randomTarget(padding));
    target.current = randomTarget(padding);

    const pickNext = () => {
      target.current = randomTarget(padding);
      if (Math.random() > 0.55) {
        pauseUntil.current = performance.now() + 400 + Math.random() * 900;
      }
    };

    const tick = () => {
      const now = performance.now();

      if (!paused.current && now >= pauseUntil.current) {
        const dx = target.current.x - pos.current.x;
        const dy = target.current.y - pos.current.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 28) pickNext();

        const speed = 0.018 + Math.random() * 0.008;
        apply({
          x: pos.current.x + dx * speed,
          y: pos.current.y + dy * speed,
        });
      }

      raf.current = requestAnimationFrame(tick);
    };

    const onResize = () => {
      if (!paused.current) pickNext();
    };
    raf.current = requestAnimationFrame(tick);
    window.addEventListener("resize", onResize);

    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", onResize);
    };
  }, [enabled]);

  return { nodeRef, posRef: pos, pauseRoam, resumeRoam, setPosition };
}
