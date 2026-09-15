"use client";

import ExhibitionRail from "@/components/exhibition-rail/ExhibitionRail";
import HeroBillboard from "@/components/hero-billboard/HeroBillboard";
import HeroGarden from "@/components/hero-garden/HeroGarden";
import { useHeroScrollBoundary } from "@/components/hero/useHeroScrollBoundary";
import LightSkyBackground from "@/components/LightSkyBackground";
import { useTheme } from "@/components/ThemeController";
import { heroFontClassName } from "@/lib/heroFonts";
import { contentContainerClassName } from "@/lib/sectionLayout";
import type { ReactNode } from "react";
import { useRef } from "react";
import "../hero.css";

interface HeroShellProps {
  children: ReactNode;
}

/** Shared hero chrome — sky, garden, billboard, rail. */
export default function HeroShell({ children }: HeroShellProps) {
  const boundaryRef = useRef<HTMLDivElement>(null);
  const { theme, reducedMotion } = useTheme();
  useHeroScrollBoundary(boundaryRef);

  return (
    <div ref={boundaryRef} className="hero-scroll-boundary">
      <section className={`hero-section relative ${heroFontClassName}`}>
        {theme === "light" ? (
          <LightSkyBackground cloudsOnly reducedMotion={reducedMotion} />
        ) : null}
        <HeroGarden />
        <HeroBillboard />
        <div
          className={`hero-section__inner relative flex ${contentContainerClassName}`}
        >
          <div className="hero-grid w-full min-w-0">{children}</div>
        </div>
        <ExhibitionRail />
      </section>
    </div>
  );
}
