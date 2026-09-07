"use client";

import LightSkyBackground from "@/components/LightSkyBackground";
import ShootingStarsBackground from "@/components/ShootingStarsBackground";
import { useTheme } from "@/components/ThemeController";

export default function GridBackground() {
  const { theme, reducedMotion } = useTheme();
  const isDark = theme === "dark";

  if (isDark) {
    return (
      <div
        aria-hidden
        className="theme-transition pointer-events-none fixed inset-0 z-0"
      >
        <ShootingStarsBackground
          shootingStars
          shootingStarInterval={2}
          meteorsPerBurst={2}
          meteorStyle="streak"
          reducedMotion={reducedMotion}
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="theme-transition pointer-events-none fixed inset-0 z-0"
    >
      <LightSkyBackground
        reducedMotion={reducedMotion}
        className="h-full w-full"
      />
    </div>
  );
}
