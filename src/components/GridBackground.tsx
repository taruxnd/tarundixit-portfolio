"use client";

import DotGridBackground from "@/components/dotgridbg-framer-website-optimized/src/DotGridBackground";
import { useTheme } from "@/components/ThemeController";

const dotGridThemes = {
  light: {
    dotColor: "rgb(0, 0, 0)",
    baseOpacity: 0.095,
    maxOpacity: 0.26,
    dotSize: 2.25,
    dotSpacing: 36,
    orbitSpeed: 2.2,
    impactRadius: 80,
    scaleOnHover: 1.3,
  },
  dark: {
    dotColor: "rgb(255, 255, 255)",
    baseOpacity: 0.145,
    maxOpacity: 0.36,
    dotSize: 2.75,
    dotSpacing: 36,
    orbitSpeed: 2.8,
    impactRadius: 75,
    scaleOnHover: 1.35,
  },
} as const;

export default function GridBackground() {
  const { theme, reducedMotion } = useTheme();
  const palette = dotGridThemes[theme];

  return (
    <div
      aria-hidden
      className="theme-transition pointer-events-none fixed inset-0 z-0"
      style={{
        maskImage:
          "radial-gradient(ellipse 88% 78% at 50% 40%, black 22%, transparent 74%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 88% 78% at 50% 40%, black 22%, transparent 74%)",
      }}
    >
      <DotGridBackground
        {...palette}
        enableRevolve={!reducedMotion}
        reducedMotion={reducedMotion}
        className="h-full w-full"
      />
    </div>
  );
}
