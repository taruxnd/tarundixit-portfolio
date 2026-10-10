"use client";

import dynamic from "next/dynamic";
import ExhibitionRail from "@/components/exhibition-rail/ExhibitionRail";
import HeroBillboard from "@/components/hero-billboard/HeroBillboard";
import HeroGarden from "@/components/hero-garden/HeroGarden";
import HeroMonsoon, { isMonsoonSeason } from "@/components/hero-monsoon/HeroMonsoon";
import { useHeroScrollBoundary } from "@/components/hero/useHeroScrollBoundary";
import { heroFontClassName } from "@/lib/heroFonts";
import { contentContainerClassName } from "@/lib/sectionLayout";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import "../hero.css";

const HeroBee = dynamic(() => import("@/components/hero-bee/HeroBee"), { ssr: false });

interface HeroShellProps {
  children: ReactNode;
}

/** Shared hero chrome — sky, monsoon, garden, billboard, rail. */
export default function HeroShell({ children }: HeroShellProps) {
  const boundaryRef = useRef<HTMLDivElement>(null);
  const [raining, setRaining] = useState(false);
  useHeroScrollBoundary(boundaryRef);

  // During the real monsoon the storm rolls in by itself, a moment after load.
  useEffect(() => {
    if (!isMonsoonSeason()) return;
    const timer = setTimeout(() => setRaining(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={boundaryRef} className="hero-scroll-boundary">
      <section
        className={`hero-section relative ${heroFontClassName}`}
        data-monsoon={raining ? "on" : undefined}
      >
        <HeroMonsoon raining={raining} onToggle={() => setRaining((value) => !value)} />
        <HeroGarden storm={raining} />
        <HeroBillboard />
        <HeroBee />
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
