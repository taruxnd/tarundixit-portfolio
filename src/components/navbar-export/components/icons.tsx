import type { CSSProperties } from "react";

interface ChevronIconProps {
  open: boolean;
  color: string;
  size?: number;
}

export function ChevronIcon({ open, color, size = 11 }: ChevronIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      style={{
        flexShrink: 0,
        transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
      }}
    >
      <path
        d="M2 4L6 8L10 4"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface HamburgerIconProps {
  open: boolean;
  color: string;
}

export function HamburgerIcon({ open, color }: HamburgerIconProps) {
  const bar: CSSProperties = {
    display: "block",
    width: 20,
    height: 2,
    background: color,
    borderRadius: 2,
    transition: "transform 0.28s ease, opacity 0.18s ease",
    transformOrigin: "center",
  };

  return (
    <div
      style={{
        width: 28,
        height: 28,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
      }}
    >
      <span style={{ ...bar, transform: open ? "translateY(7px) rotate(45deg)" : "none" }} />
      <span
        style={{
          ...bar,
          opacity: open ? 0 : 1,
          transform: open ? "scaleX(0)" : "scaleX(1)",
        }}
      />
      <span style={{ ...bar, transform: open ? "translateY(-7px) rotate(-45deg)" : "none" }} />
    </div>
  );
}
