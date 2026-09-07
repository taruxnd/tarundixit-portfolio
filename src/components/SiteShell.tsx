"use client";

import CustomCursor from "@/components/CustomCursor";
import HeroSun from "@/components/celestial/HeroSun";
import GridBackground from "@/components/GridBackground";
import Lamp from "@/components/Lamp";
import Navbar from "@/components/Navbar";
import { ThemeController } from "@/components/ThemeController";
import type { ReactNode } from "react";

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <ThemeController>
      <GridBackground />
      <CustomCursor />
      <HeroSun />
      <Lamp />
      <Navbar />
      <div className="relative z-10">{children}</div>
    </ThemeController>
  );
}
