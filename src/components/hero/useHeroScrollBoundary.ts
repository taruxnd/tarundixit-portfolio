"use client";

import { type RefObject, useEffect } from "react";

/** Reserve the sticky hero's animation space without intercepting native scroll. */
export function useHeroScrollBoundary(boundaryRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const boundary = boundaryRef.current;
    if (!boundary) return;
    const query = window.matchMedia("(pointer: fine) and (hover: hover)");
    const measure = () => {
      boundary.style.height = query.matches
        ? `${Math.round(window.innerHeight + Math.max(window.innerHeight * .85, 480))}px`
        : "";
    };
    measure();
    window.addEventListener("resize", measure);
    query.addEventListener("change", measure);
    return () => {
      window.removeEventListener("resize", measure);
      query.removeEventListener("change", measure);
      boundary.style.height = "";
    };
  }, [boundaryRef]);
}
