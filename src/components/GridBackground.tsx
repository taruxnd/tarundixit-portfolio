"use client";

import DotGridBackground from "@/components/dotgridbg-framer-website-optimized/src/DotGridBackground";
import LightSkyBackground from "@/components/LightSkyBackground";
import ShootingStarsBackground from "@/components/ShootingStarsBackground";
import { useTheme } from "@/components/ThemeController";
import { useEffect, useState } from "react";

const lightDotGrid = {
  dotColor: "rgb(0, 0, 0)",
  baseOpacity: 0.095,
  maxOpacity: 0.26,
  dotSize: 2.25,
  dotSpacing: 36,
  orbitSpeed: 2.2,
  impactRadius: 80,
  scaleOnHover: 1.3,
} as const;

export default function GridBackground() {
  const { theme, reducedMotion, hydrated } = useTheme();
  const isDark = theme === "dark";
  const [showDots, setShowDots] = useState(false);

  useEffect(() => {
    if (isDark) return;
    const update = () => {
      setShowDots(window.scrollY > window.innerHeight * 0.7);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isDark]);

  // Until theme is confirmed client-side, paint only a solid page color —
  // never mount the white LightSky (that was the reload flash).
  if (!hydrated) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{ backgroundColor: "var(--bg-page, #0a0a0a)" }}
      />
    );
  }

  if (isDark) {
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

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{ backgroundColor: "#ffffff" }}
      >
        <LightSkyBackground
          skyColor="#ffffff"
          horizonGlowColor="#ffffff"
          horizonColor="#ffffff"
          className="h-full w-full"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          opacity: showDots ? 1 : 0,
          transition: "opacity 0.45s ease",
          maskImage:
            "radial-gradient(ellipse 88% 78% at 50% 40%, black 22%, transparent 74%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 88% 78% at 50% 40%, black 22%, transparent 74%)",
        }}
      >
        <DotGridBackground
          {...lightDotGrid}
          enableRevolve={!reducedMotion && showDots}
          reducedMotion={reducedMotion}
          className="h-full w-full"
        />
      </div>
    </>
  );
}
