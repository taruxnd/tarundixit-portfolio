"use client";

import CustomCursor from "@/components/CustomCursor";
import GridBackground from "@/components/GridBackground";
import Navbar from "@/components/Navbar";
import { ThemeController } from "@/components/ThemeController";
import type { ReactNode } from "react";

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <ThemeController>
      <GridBackground />
      <CustomCursor />
      <Navbar />
      <div className="relative z-10">{children}</div>
    </ThemeController>
  );
}
