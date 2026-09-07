"use client";

import { useEffect, useState } from "react";

export function useIsMobile(breakpoint: number, forceMobile = false): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(forceMobile || window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint, forceMobile]);

  return isMobile;
}
