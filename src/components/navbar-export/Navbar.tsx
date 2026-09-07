"use client";

import type { CSSProperties } from "react";
import { LiquidGlassNavBar } from "./components/LiquidGlassNavBar";
import type { NavbarProps } from "./types";
import { defaultNavbarConfig } from "./config/defaultConfig";
import "./styles/fonts.css";
import "./styles/navbar.css";

export type { NavbarProps } from "./types";
export { defaultNavbarConfig };

/**
 * Liquid glass navigation bar — drop into any Next.js layout.
 */
export default function Navbar({
  className,
  style,
  top = 24,
  brand,
  content,
  layout,
  typography,
  background,
  mobile,
  dock,
}: NavbarProps) {
  const rootStyle: CSSProperties & { "--navbar-top"?: string } = {
    "--navbar-top": typeof top === "number" ? `${top}px` : top,
    ...style,
  };

  return (
    <div className={`liquid-glass-navbar-root${className ? ` ${className}` : ""}`} style={rootStyle}>
      <LiquidGlassNavBar
        brand={brand}
        content={content}
        layout={layout}
        typography={typography}
        background={background}
        mobile={mobile}
        dock={dock}
      />
    </div>
  );
}
