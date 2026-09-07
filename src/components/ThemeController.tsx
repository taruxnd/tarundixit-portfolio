"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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

function applyTheme(theme: SiteTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeController({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<SiteTheme>("light");
  const [hydrated, setHydrated] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const initial: SiteTheme = stored === "dark" ? "dark" : "light";
    setTheme(initial);
    applyTheme(initial);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    const onMotionChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    motionQuery.addEventListener("change", onMotionChange);
    setHydrated(true);

    return () => motionQuery.removeEventListener("change", onMotionChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: SiteTheme = prev === "light" ? "dark" : "light";
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      theme,
      isLampOn: theme === "light",
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
