import LiquidGlass from "@/components/navbar/LiquidGlass";
import type { ReactNode } from "react";
import "@/components/navbar/navbar.css";

interface GlassLabelProps {
  children: ReactNode;
  className?: string;
}

/** Portfolio liquid-glass chip used for case-study meta tags. */
export default function GlassLabel({
  children,
  className = "",
}: GlassLabelProps) {
  return (
    <LiquidGlass className={`case-glass-label ${className}`.trim()}>
      <span className="case-glass-label__text">{children}</span>
    </LiquidGlass>
  );
}
