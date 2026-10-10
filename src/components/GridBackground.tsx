"use client";

import ShootingStarsBackground from "@/components/ShootingStarsBackground";
import { useTheme } from "@/components/ThemeController";

export default function GridBackground() {
  const { reducedMotion } = useTheme();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ backgroundColor: "#0a0a0a" }}
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
