"use client";

import {
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { StripMedia } from "./xhuliaProjects";

type DragStripProps = {
  frames: StripMedia[];
  label: string;
};

/**
 * Lightweight horizontal drag strip.
 * - Transform written directly to the DOM (no React state during drag)
 * - rAF-batched move + inertia
 * - Single set of frames (no 3× media clones like the Framer export)
 * - touch-action: pan-y so vertical page scroll stays free
 */
export default function DragStrip({ frames, label }: DragStripProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTRef = useRef(0);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef(-1);
  const startXRef = useRef(0);
  const originRef = useRef(0);
  const rafMoveRef = useRef(0);
  const rafInertiaRef = useRef(0);
  const pendingXRef = useRef<number | null>(null);

  const clamp = (value: number) => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return value;
    const max = Math.min(0, viewport.clientWidth - track.scrollWidth);
    return Math.max(max, Math.min(0, value));
  };

  const paint = (value: number) => {
    const track = trackRef.current;
    if (!track) return;
    offsetRef.current = value;
    track.style.transform = `translate3d(${value}px, 0, 0)`;
  };

  const stopInertia = () => {
    if (rafInertiaRef.current) {
      cancelAnimationFrame(rafInertiaRef.current);
      rafInertiaRef.current = 0;
    }
  };

  const runInertia = () => {
    stopInertia();
    const tick = () => {
      velocityRef.current *= 0.92;
      if (Math.abs(velocityRef.current) < 0.15) {
        velocityRef.current = 0;
        rafInertiaRef.current = 0;
        return;
      }
      paint(clamp(offsetRef.current + velocityRef.current));
      rafInertiaRef.current = requestAnimationFrame(tick);
    };
    rafInertiaRef.current = requestAnimationFrame(tick);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    stopInertia();
    draggingRef.current = true;
    pointerIdRef.current = event.pointerId;
    startXRef.current = event.clientX;
    originRef.current = offsetRef.current;
    lastXRef.current = event.clientX;
    lastTRef.current = performance.now();
    velocityRef.current = 0;
    viewportRef.current?.classList.add("is-dragging");
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const flushMove = () => {
    rafMoveRef.current = 0;
    const x = pendingXRef.current;
    if (x == null || !draggingRef.current) return;
    pendingXRef.current = null;

    const now = performance.now();
    const dt = Math.max(1, now - lastTRef.current);
    const dx = x - lastXRef.current;
    velocityRef.current = dx * (16 / dt);
    lastXRef.current = x;
    lastTRef.current = now;

    paint(clamp(originRef.current + (x - startXRef.current)));
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || event.pointerId !== pointerIdRef.current) {
      return;
    }
    pendingXRef.current = event.clientX;
    if (!rafMoveRef.current) {
      rafMoveRef.current = requestAnimationFrame(flushMove);
    }
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || event.pointerId !== pointerIdRef.current) {
      return;
    }
    draggingRef.current = false;
    viewportRef.current?.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (Math.abs(velocityRef.current) > 0.4) {
      runInertia();
    }
  };

  useEffect(() => {
    const onResize = () => paint(clamp(offsetRef.current));
    window.addEventListener("resize", onResize);

    const viewport = viewportRef.current;
    const videos = viewport?.querySelectorAll("video") ?? [];
    let observer: IntersectionObserver | null = null;

    if (viewport && videos.length > 0 && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const list = entry.target.querySelectorAll("video");
            list.forEach((video) => {
              if (entry.isIntersecting) {
                void video.play().catch(() => {});
              } else {
                video.pause();
              }
            });
          }
        },
        { rootMargin: "120px 0px", threshold: 0.05 },
      );
      observer.observe(viewport);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      observer?.disconnect();
      stopInertia();
      if (rafMoveRef.current) cancelAnimationFrame(rafMoveRef.current);
    };
  }, []);

  return (
    <div
      ref={viewportRef}
      className="xhulia-strip__viewport"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role="region"
      aria-label={`${label} screens, drag horizontally`}
    >
      <div ref={trackRef} className="xhulia-strip__track">
        {frames.map((frame, index) => (
          <figure
            key={`${frame.src}-${index}`}
            className="xhulia-strip__frame"
          >
            {frame.type === "video" ? (
              <video
                src={frame.src}
                muted
                loop
                playsInline
                preload="none"
                draggable={false}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={frame.src}
                alt={frame.alt ?? ""}
                draggable={false}
                loading={index < 2 ? "eager" : "lazy"}
                decoding="async"
              />
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}
