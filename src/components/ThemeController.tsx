"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface ThemeContextValue {
  reducedMotion: boolean;
  hydrated: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** The site is dark-only; this now just tracks hydration and reduced motion. */
export function ThemeController({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useLayoutEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    const onMotionChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    motionQuery.addEventListener("change", onMotionChange);
    setHydrated(true);

    return () => motionQuery.removeEventListener("change", onMotionChange);
  }, []);

  const value = useMemo(() => ({ reducedMotion, hydrated }), [reducedMotion, hydrated]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeController");
  }
  return context;
}
