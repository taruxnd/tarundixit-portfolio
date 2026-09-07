"use client";

import type { ReactNode } from "react";

interface FloatingLabelProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  rotation?: number;
}

export default function FloatingLabel({
  children,
  className = "",
  delay = 0,
  rotation = 0,
}: FloatingLabelProps) {
  return (
    <div
      className={`floating-label absolute hidden select-none md:block ${className}`}
      style={
        {
          "--float-delay": `${delay + 0.5}s`,
          "--float-rotation": `${rotation}deg`,
        } as React.CSSProperties
      }
      data-cursor="label"
    >
      <span className="inline-flex items-center rounded-full border border-neutral-200/70 bg-white/85 px-3 py-1.5 text-[11px] font-medium tracking-[0.04em] text-neutral-500 shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-sm sm:text-xs">
        {children}
      </span>
    </div>
  );
}
