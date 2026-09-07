"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

function applyTransform(el: HTMLElement, x: number, y: number) {
  const value = `translate3d(${x}px, ${y}px, 0)`;
  el.style.transform = value;
  el.style.webkitTransform = value;
}

/** Smooth RAF lerp toward pointer — pointermove + mousemove for Safari. */
export function usePointerFollow(
  enabled: boolean,
  onMove?: () => void,
  ease = 0.26,
) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const pos = useRef<Point>({ x: -100, y: -100 });
  const target = useRef<Point>({ x: -100, y: -100 });
  const raf = useRef<number | null>(null);
  const onMoveRef = useRef(onMove);

  onMoveRef.current = onMove;

  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * ease;
      pos.current.y += (target.current.y - pos.current.y) * ease;

      if (nodeRef.current) {
        applyTransform(
          nodeRef.current,
          Math.round(pos.current.x),
          Math.round(pos.current.y),
        );
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);

    const updateTarget = (clientX: number, clientY: number) => {
      target.current.x = clientX;
      target.current.y = clientY;
      onMoveRef.current?.();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      updateTarget(event.clientX, event.clientY);
    };

    const onMouseMove = (event: MouseEvent) => {
      updateTarget(event.clientX, event.clientY);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [enabled, ease]);

  return nodeRef;
}
