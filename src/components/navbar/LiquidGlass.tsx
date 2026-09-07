import type { ReactNode } from "react";

interface LiquidGlassProps {
  children: ReactNode;
  className?: string;
}

/**
 * Layered liquid glass — backdrop samples page content behind the fixed nav.
 * All decorative layers are pointer-events:none; content stays interactive.
 */
export default function LiquidGlass({ children, className = "" }: LiquidGlassProps) {
  return (
    <div className={`liquid-glass ${className}`.trim()}>
      <div className="liquid-glass__backdrop" aria-hidden />
      <div className="liquid-glass__tint" aria-hidden />
      <div className="liquid-glass__specular" aria-hidden />
      <div className="liquid-glass__rim" aria-hidden />
      <div className="liquid-glass__shimmer" aria-hidden />
      <div className="liquid-glass__noise" aria-hidden />
      <div className="liquid-glass__content">{children}</div>
    </div>
  );
}
