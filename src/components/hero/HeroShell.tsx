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
  const { theme, hydrated, reducedMotion } = useTheme();
  useHeroScrollBoundary(boundaryRef);

  // Wait until hydrated so light-sky isn't in SSR HTML for dark users
  // (theme is always "light" on the first paint to match the server).
  const showLightSky = hydrated && theme === "light";

  return (
    <div ref={boundaryRef} className="hero-scroll-boundary">
      <section className={`hero-section relative ${heroFontClassName}`}>
        {showLightSky ? (
          <LightSkyBackground
            skyColor="rgb(186, 230, 253)"
            horizonGlowColor="#e0f2fe"
            horizonColor="rgb(125, 211, 252)"
            showClouds
            reducedMotion={reducedMotion}
            className="light-sky--hero"
          />
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
