"use client";

import { useEffect, useRef, useState } from "react";
import type { Point, RoamingCursorApi } from "./useRoamingCursor";

export interface MarqueeRect {
  left: number;
  top: number;
  width: number;
  height: number;
  opacity: number;
}

const FIGMA_CYAN = "#18A0FB";
const HOLD_MS = 800;
const IDLE_AFTER_MS = 1600;
const MOVE_ABORT_PX = 5;
const MARQUEE_PADDING_X = 6;
const MARQUEE_PADDING_Y = 2;
const HERO_ACTIVE_RATIO = 0.45;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function nextDelay() {
  return 7000 + Math.random() * 3000;
}

function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function quadPoint(p0: Point, p1: Point, p2: Point, t: number): Point {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  };
}

function isInViewport(rect: DOMRect) {
  return (
    rect.bottom > 0 &&
    rect.top < window.innerHeight &&
    rect.right > 0 &&
    rect.left < window.innerWidth
  );
}

function measureRoleFrame(role: HTMLElement) {
  const rect = role.getBoundingClientRect();
  return {
    left: rect.left - MARQUEE_PADDING_X,
    top: rect.top - MARQUEE_PADDING_Y,
    width: rect.width + MARQUEE_PADDING_X * 2,
    height: rect.height + MARQUEE_PADDING_Y * 2,
  };
}

function visibleRoleEl(): HTMLElement | null {
  const hero = document.querySelector(".hero-section");
  const nodes = document.querySelectorAll<HTMLElement>("[data-hero-role]");
  for (const node of nodes) {
    const rect = node.getBoundingClientRect();
    const style = window.getComputedStyle(node);
    if (
      rect.width > 8 &&
      rect.height > 8 &&
      style.visibility !== "hidden" &&
      style.display !== "none" &&
      isInViewport(rect) &&
      (!hero || hero.contains(node))
    ) {
      return node;
    }
  }
  return null;
}

function pointInHero(x: number, y: number) {
  const hero = document.querySelector(".hero-section");
  if (!(hero instanceof Element)) return false;
  const stack = document.elementsFromPoint(x, y);
  return stack.some((node) => hero.contains(node) || node === hero);
}

function siteBusy() {
  return Boolean(
    document.querySelector(
      ".hanging-lamp__pull-hit:active, .hanging-lamp__pull-btn:active, .card-mockup-wrapper.is-hovering, .card-3d-container:active",
    ),
  );
}

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const id = window.setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(id);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

function animateTo(
  from: Point,
  to: Point,
  duration: number,
  setPosition: (point: Point) => void,
  signal: AbortSignal,
) {
  return new Promise<void>((resolve, reject) => {
    const start = performance.now();
    const mid: Point = {
      x: (from.x + to.x) / 2 + (Math.random() * 28 - 14),
      y: (from.y + to.y) / 2 + (Math.random() * 22 - 11),
    };

    const tick = (now: number) => {
      if (signal.aborted) {
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }
      const t = Math.min(1, (now - start) / duration);
      setPosition(quadPoint(from, mid, to, easeInOutSine(t)));
      if (t < 1) requestAnimationFrame(tick);
      else resolve();
    };

    requestAnimationFrame(tick);
  });
}

export function useAmbientHeroSelect(
  enabled: boolean,
  roaming: Pick<
    RoamingCursorApi,
    "posRef" | "pauseRoam" | "resumeRoam" | "setPosition"
  >,
) {
  const [marquee, setMarquee] = useState<MarqueeRect | null>(null);
  const lastMoveRef = useRef(0);
  const lastPointRef = useRef<Point>({ x: -9999, y: -9999 });
  const runningRef = useRef(false);
  const heroActiveRef = useRef(false);
  const roamingRef = useRef(roaming);
  roamingRef.current = roaming;

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let abort = new AbortController();
    let timer: number | null = null;
    let heroObserver: IntersectionObserver | null = null;

    const heroActive = () => heroActiveRef.current;

    const isIdle = () => {
      if (prefersReducedMotion()) return false;
      if (siteBusy()) return false;
      if (!heroActive()) return false;
      if (!visibleRoleEl()) return false;
      return performance.now() - lastMoveRef.current >= IDLE_AFTER_MS;
    };

    const runSequence = async (signal: AbortSignal) => {
      if (!heroActive()) return;

      const role = visibleRoleEl();
      if (!role) return;

      const frame = measureRoleFrame(role);
      const { posRef, pauseRoam, resumeRoam, setPosition } = roamingRef.current;
      const start: Point = { x: frame.left - 2, y: frame.top - 2 };
      const end: Point = {
        x: frame.left + frame.width + 2,
        y: frame.top + frame.height + 2,
      };
      const idle = { ...posRef.current };

      runningRef.current = true;
      pauseRoam();

      try {
        await animateTo(idle, start, 980, setPosition, signal);
        await wait(200, signal);

        const dragStart = performance.now();
        const dragDuration = 820;
        const mid: Point = {
          x: lerp(start.x, end.x, 0.52) + (Math.random() * 10 - 4),
          y: lerp(start.y, end.y, 0.46) + (Math.random() * 8 - 3),
        };

        await new Promise<void>((resolve, reject) => {
          const tick = (now: number) => {
            if (signal.aborted) {
              reject(new DOMException("Aborted", "AbortError"));
              return;
            }
            if (!heroActive()) {
              reject(new DOMException("Aborted", "AbortError"));
              return;
            }

            const t = Math.min(1, (now - dragStart) / dragDuration);
            const cursor = quadPoint(start, mid, end, easeInOutSine(t));
            setPosition(cursor);

            const liveRole = visibleRoleEl() ?? role;
            const liveFrame = measureRoleFrame(liveRole);
            setMarquee({
              left: liveFrame.left,
              top: liveFrame.top,
              width: liveFrame.width * t,
              height: liveFrame.height * t,
              opacity: 1,
            });

            if (t < 1) requestAnimationFrame(tick);
            else resolve();
          };
          requestAnimationFrame(tick);
        });

        const settledRole = visibleRoleEl() ?? role;
        const settledFrame = measureRoleFrame(settledRole);
        setMarquee({ ...settledFrame, opacity: 1 });

        await wait(HOLD_MS, signal);
        await wait(160, signal);
        setMarquee((prev) => (prev ? { ...prev, opacity: 0 } : null));
        await wait(320, signal);
        setMarquee(null);
        await animateTo(end, idle, 780, setPosition, signal);
      } catch {
        setMarquee(null);
        roamingRef.current.setPosition(idle);
      } finally {
        runningRef.current = false;
        roamingRef.current.resumeRoam();
      }
    };

    const schedule = (delay = nextDelay()) => {
      if (cancelled) return;
      timer = window.setTimeout(() => {
        void (async () => {
          if (cancelled) return;
          if (!isIdle() || runningRef.current) {
            schedule(900);
            return;
          }
          abort = new AbortController();
          await runSequence(abort.signal);
          schedule();
        })();
      }, delay);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const dx = event.clientX - lastPointRef.current.x;
      const dy = event.clientY - lastPointRef.current.y;
      const moved = Math.hypot(dx, dy) >= MOVE_ABORT_PX;
      lastPointRef.current = { x: event.clientX, y: event.clientY };

      if (!moved) return;
      if (!pointInHero(event.clientX, event.clientY)) return;

      lastMoveRef.current = performance.now();
      if (runningRef.current) abort.abort();
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      const lampOrCard =
        target instanceof Element &&
        Boolean(
          target.closest(
            ".hanging-lamp, .card-3d-container, .card-mockup-wrapper",
          ),
        );
      const inHero = pointInHero(event.clientX, event.clientY);

      if (inHero || lampOrCard) {
        lastMoveRef.current = performance.now();
        if (runningRef.current) abort.abort();
      }
    };

    schedule();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);

    const hero = document.querySelector(".hero-section");
    if (hero) {
      const syncHeroActive = (ratio: number, intersecting: boolean) => {
        const active = Boolean(intersecting && ratio >= HERO_ACTIVE_RATIO);
        heroActiveRef.current = active;
        if (!active) {
          abort.abort();
          setMarquee(null);
        }
      };

      const rect = hero.getBoundingClientRect();
      const visibleHeight =
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      const initialRatio =
        rect.height > 0 ? Math.max(0, visibleHeight / rect.height) : 0;
      syncHeroActive(initialRatio, rect.bottom > 0 && rect.top < window.innerHeight);

      heroObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          syncHeroActive(entry?.intersectionRatio ?? 0, Boolean(entry?.isIntersecting));
        },
        { threshold: [0, HERO_ACTIVE_RATIO, 0.55] },
      );
      heroObserver.observe(hero);
    }

    return () => {
      cancelled = true;
      abort.abort();
      heroObserver?.disconnect();
      heroActiveRef.current = false;
      if (timer !== null) window.clearTimeout(timer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      setMarquee(null);
    };
  }, [enabled]);

  return { marquee, color: FIGMA_CYAN };
}
