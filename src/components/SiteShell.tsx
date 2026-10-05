"use client";

import CustomCursor from "@/components/CustomCursor";
import GridBackground from "@/components/GridBackground";
import MobileViewportLock from "@/components/MobileViewportLock";
import Navbar from "@/components/Navbar";
import { ThemeController } from "@/components/ThemeController";
import type { ReactNode } from "react";

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <ThemeController>
      <MobileViewportLock />
      <GridBackground />
      <CustomCursor />
      <Navbar />
      <div className="relative z-10 w-full max-w-full overflow-x-hidden">
        {children}
      </div>
    </ThemeController>
  );
}
