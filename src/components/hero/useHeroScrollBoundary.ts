"use client";

import { type RefObject, useEffect } from "react";

const REQUIRED_GESTURES = 1;
const SCROLL_BUDGET_RATIO = 0.85;
const GESTURE_MIN_DELTA = 55;
/** Idle gap used only to bundle wheel events into one interaction — does not affect garden timing. */
const GESTURE_IDLE_MS = 160;

function isBoundarySupported() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine) and (hover: hover)").matches;
}

function normalizeWheelDelta(event: WheelEvent) {
  let delta = event.deltaY;
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    delta *= 16;
  } else if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    delta *= window.innerHeight;
  }
  return delta;
}

export function useHeroScrollBoundary(
  boundaryRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!isBoundarySupported()) return;

    const boundary = boundaryRef.current;
    if (!boundary) return;

    let completedGestures = 0;
    let released = false;
    let scrollBudget = 0;
    let accumDownDelta = 0;
    let gestureTimer: number | null = null;

    const measure = () => {
      scrollBudget = Math.max(Math.round(window.innerHeight * SCROLL_BUDGET_RATIO), 480);
      const boundaryHeight = Math.round(window.innerHeight + scrollBudget * REQUIRED_GESTURES);
      boundary.style.height = `${boundaryHeight}px`;
    };

    const maxAllowedScroll = () => {
      if (released) return Number.POSITIVE_INFINITY;
      if (completedGestures >= REQUIRED_GESTURES) return Number.POSITIVE_INFINITY;
      return (completedGestures + 1) * scrollBudget;
    };

    const clampIfNeeded = () => {
      if (released) return;
      const max = maxAllowedScroll();
      if (window.scrollY > max) {
        window.scrollTo(0, max);
      }
    };

    const finalizeDownGesture = (totalDelta: number) => {
      if (released || totalDelta < GESTURE_MIN_DELTA) return;
      completedGestures = Math.min(REQUIRED_GESTURES, completedGestures + 1);
      if (completedGestures >= REQUIRED_GESTURES) {
        released = true;
      }
    };

    const onScroll = () => {
      clampIfNeeded();
    };

    const onWheel = (event: WheelEvent) => {
      if (released) return;

      const delta = normalizeWheelDelta(event);
      const max = maxAllowedScroll();

      if (delta > 0 && window.scrollY >= max - 2) {
        event.preventDefault();
      }

      if (delta <= 0) {
        accumDownDelta = 0;
        if (gestureTimer) {
          window.clearTimeout(gestureTimer);
          gestureTimer = null;
        }
        return;
      }

      accumDownDelta += delta;

      if (gestureTimer) window.clearTimeout(gestureTimer);
      gestureTimer = window.setTimeout(() => {
        finalizeDownGesture(accumDownDelta);
        accumDownDelta = 0;
        gestureTimer = null;
      }, GESTURE_IDLE_MS);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", measure);
      if (gestureTimer) window.clearTimeout(gestureTimer);
      boundary.style.height = "";
    };
  }, [boundaryRef]);
}
