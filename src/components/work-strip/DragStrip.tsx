"use client";

import {
  useEffect,
  useMemo,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { StripMedia } from "./workProjects";

type DragStripProps = {
  frames: StripMedia[];
  label: string;
};

const AUTO_PX_PER_SEC = 36;
const RESUME_AFTER_MS = 1800;

/**
 * Horizontal strip with transform-based auto-scroll + pointer drag.
 */
export default function DragStrip({ frames, label }: DragStripProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const halfRef = useRef(0);
  const inViewRef = useRef(false);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef(-1);
  const dragStartXRef = useRef(0);
  const dragOriginRef = useRef(0);
  const pausedUntilRef = useRef(0);
  const lastTsRef = useRef(0);
  const rafRef = useRef(0);

  const visibleFrames = useMemo(
    () => (frames.length > 1 ? [...frames, ...frames] : frames),
    [frames],
  );

  const measure = () => {
    const track = trackRef.current;
    if (!track) return;
    halfRef.current = track.scrollWidth / 2;
  };

  const paint = (value: number) => {
    const track = trackRef.current;
    if (!track) return;
    const half = halfRef.current;
    let next = value;
    if (half > 0) {
      next = ((next % half) + half) % half;
    }
    offsetRef.current = next;
    track.style.transform = `translate3d(${-next}px, 0, 0)`;
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    measure();
    paint(0);

    const updateInView = () => {
      const rect = viewport.getBoundingClientRect();
      inViewRef.current =
        rect.bottom > 80 && rect.top < window.innerHeight - 80;
    };
    updateInView();

    const onResize = () => {
      const ratio =
        halfRef.current > 0 ? offsetRef.current / halfRef.current : 0;
      measure();
      paint(ratio * halfRef.current);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = Boolean(entry?.isIntersecting);
        if (entry?.isIntersecting) measure();
        else lastTsRef.current = 0;
      },
      { threshold: 0, rootMargin: "0px" },
    );
    observer.observe(viewport);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", updateInView, { passive: true });

    const imgs = track.querySelectorAll("img");
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener("load", measure, { once: true });
    });
    const remasureTimer = window.setTimeout(measure, 400);

    const tick = (ts: number) => {
      rafRef.current = requestAnimationFrame(tick);
      if (reduceMotion || draggingRef.current || !inViewRef.current) {
        lastTsRef.current = 0;
        return;
      }
      if (ts < pausedUntilRef.current) {
        lastTsRef.current = 0;
        return;
      }
      if (!lastTsRef.current) {
        lastTsRef.current = ts;
        return;
      }
      if (halfRef.current <= 0) {
        measure();
        lastTsRef.current = ts;
        return;
      }
      const dt = Math.min(48, ts - lastTsRef.current);
      lastTsRef.current = ts;
      paint(offsetRef.current + (AUTO_PX_PER_SEC * dt) / 1000);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.clearTimeout(remasureTimer);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", updateInView);
    };
  }, [visibleFrames.length]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    draggingRef.current = true;
    pointerIdRef.current = event.pointerId;
    dragStartXRef.current = event.clientX;
    dragOriginRef.current = offsetRef.current;
    viewportRef.current?.classList.add("is-dragging");
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || event.pointerId !== pointerIdRef.current) {
      return;
    }
    const delta = event.clientX - dragStartXRef.current;
    paint(dragOriginRef.current - delta);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || event.pointerId !== pointerIdRef.current) {
      return;
    }
    draggingRef.current = false;
    pausedUntilRef.current = performance.now() + RESUME_AFTER_MS;
    viewportRef.current?.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

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
        {visibleFrames.map((frame, index) => (
          <figure
            key={`${frame.src}-${index}`}
            className="xhulia-strip__frame"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={frame.src}
              alt={frame.alt ?? ""}
              draggable={false}
              loading="lazy"
              decoding="async"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}
