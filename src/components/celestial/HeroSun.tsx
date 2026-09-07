"use client";

import { useTheme } from "@/components/ThemeController";
import "./hero-sun.css";

const SUN_COLOR = "#ffe08a";
const SUN_RGB = "255, 224, 138";
const GLARE = 0.45;

/** Day sun — clipped to the hero section (scrolls away with it). */
export default function HeroSun() {
  const { theme, hydrated } = useTheme();

  if (!hydrated || theme !== "light") return null;

  return (
    <div className="hero-sun" aria-hidden>
      <div
        className="hero-sun__rays"
        style={{
          background: `repeating-conic-gradient(
            from 8deg,
            rgba(${SUN_RGB}, 0.18) 0deg 5deg,
            rgba(${SUN_RGB}, 0) 5deg 30deg
          )`,
        }}
      />
      <div
        className="hero-sun__glare"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(${SUN_RGB}, ${GLARE}) 0%, rgba(${SUN_RGB}, ${GLARE * 0.3}) 22%, rgba(${SUN_RGB}, 0) 64%)`,
        }}
      />
      <div
        className="hero-sun__disc"
        style={{
          background: SUN_COLOR,
          boxShadow: `0 0 32px 10px rgba(${SUN_RGB}, ${GLARE * 0.9})`,
        }}
      />
    </div>
  );
}
