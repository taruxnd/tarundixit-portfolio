"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SiteTheme = "light" | "dark";

interface ThemeContextValue {
  theme: SiteTheme;
  isLampOn: boolean;
  toggleTheme: () => void;
  reducedMotion: boolean;
  hydrated: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "portfolio-lamp-theme";

/** Site is dark-only for now — keep SSR + client in sync. */
const SSR_THEME: SiteTheme = "dark";

function applyTheme(theme: SiteTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeController({ children }: { children: ReactNode }) {
  const [theme] = useState<SiteTheme>(SSR_THEME);
  const [hydrated, setHydrated] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useLayoutEffect(() => {
    applyTheme("dark");
    try {
      localStorage.setItem(STORAGE_KEY, "dark");
    } catch {
      /* ignore quota / private mode */
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    const onMotionChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    motionQuery.addEventListener("change", onMotionChange);
    setHydrated(true);

    return () => motionQuery.removeEventListener("change", onMotionChange);
  }, []);

  // Dark-only: keep API so callers don't break; no-op for now.
  const toggleTheme = useCallback(() => {}, []);

  const value = useMemo(
    () => ({
      theme,
      isLampOn: false,
      toggleTheme,
      reducedMotion,
      hydrated,
    }),
    [theme, toggleTheme, reducedMotion, hydrated],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeController");
  }
  return context;
}
