"use client";

import type { ReactNode } from "react";
import { GlassBackground } from "@/components/navbar-export/components/GlassBackground";

interface GlassPillProps {
  children: ReactNode;
  className?: string;
}

/** Safari-safe liquid glass shell — same texture as navbar-export css mode. */
export default function GlassPill({ children, className = "" }: GlassPillProps) {
  return (
    <GlassBackground
      mode="css"
      blur={20}
      saturation={150}
      tintColor="rgb(255, 255, 255)"
      tintOpacity={0.5}
      edgeHighlight={0.85}
      cornerRadius={9999}
      style={{ width: "fit-content" }}
    >
      <div className={className}>{children}</div>
    </GlassBackground>
  );
}
