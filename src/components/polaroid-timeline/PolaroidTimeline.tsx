"use client";

import dynamic from "next/dynamic";
const TimelineBee=dynamic(()=>import("@/components/hero-bee/HeroBee"),{ssr:false});

import { contentContainerClassName } from "@/lib/sectionLayout";
import { stripFontClassName } from "@/lib/heroFonts";
import { FramerRuntimeIsland } from "./src/components/FramerRuntimeIsland";
import "./src/app/framer.css";
import "./polaroid-embed.css";

/**
 * About section: our title/subtitle + the exact Framer zip island
 * (pins, string, flip polaroids via framerusercontent runtime).
 */
export default function PolaroidTimeline() {
  return (
    <section
      className={`polaroid-timeline-embed theme-transition ${stripFontClassName}`}
      aria-labelledby="polaroid-timeline-heading"
    >
      <TimelineBee placement="timeline" />
      <div className={`${contentContainerClassName} polaroid-timeline-embed__inner`}>
        <header className="polaroid-timeline-embed__header">
          <h2
            id="polaroid-timeline-heading"
            className="polaroid-timeline-embed__heading"
          >
            A few frames from the journey.
          </h2>
          <p className="polaroid-timeline-embed__subline">
            Hover a polaroid to flip it.
          </p>
        </header>

        {/* FramerRuntimeIsland mounts #main here — same hydrate as the zip preview */}
        <div id="polaroid-timeline-host" className="polaroid-timeline-embed__host" />
        <FramerRuntimeIsland />
      </div>
    </section>
  );
}
