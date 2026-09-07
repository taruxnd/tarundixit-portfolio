import type { CSSProperties } from "react";

/** Orange gradient text hover effect used on nav links. */
export function gradientHoverStyle(
  active: boolean,
  restColor: string,
  gradStart: string,
  gradEnd: string,
): CSSProperties {
  if (!active) {
    return {
      color: restColor,
      display: "inline",
      whiteSpace: "nowrap",
      transition: "color 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
    };
  }

  return {
    backgroundImage: `linear-gradient(to right, ${gradStart} 0%, ${gradEnd} 100%)`,
    backgroundSize: "100% 100%",
    backgroundPosition: "0% 0%",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent",
    transition: "background-position 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
    display: "inline",
    whiteSpace: "nowrap",
  };
}

export const LIQUID_GLASS_SHADOW = [
  "1px -1px 2px hsl(0 0% 100% / 0.5) inset",
  "0px -1px 2px hsl(0 0% 100% / 0.5) inset",
  "-1px -1px 2px hsl(0 0% 100% / 0.5) inset",
  "1px 1px 2px hsl(0 0% 30% / 0.5) inset",
  "-8px 4px 10px -6px hsl(0 0% 30% / 0.25) inset",
  "-1px 1px 6px hsl(0 0% 30% / 0.25) inset",
  "-1px -1px 8px hsl(0 0% 60% / 0.15)",
  "1px 1px 2px hsl(0 0% 30% / 0.15)",
  "2px 2px 6px hsl(0 0% 30% / 0.15)",
  "-2px -1px 2px hsl(0 0% 100% / 0.25) inset",
  "3px 6px 16px -6px hsl(0 0% 30% / 0.5)",
].join(", ");

export const DIAMOND_MARKER = "◆";
