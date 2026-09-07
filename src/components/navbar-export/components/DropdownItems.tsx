"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import type { DropdownLinkItem, FontConfig } from "../types";

interface DropdownCardProps extends DropdownLinkItem {
  cardBgColor: string;
  height: number;
  titleFont: CSSProperties;
  descFont: CSSProperties;
  titleColor: string;
  descColor: string;
}

export function DropdownCard({
  label,
  description = "",
  image,
  link,
  newTab,
  cardBgColor,
  height,
  titleFont,
  descFont,
  titleColor,
  descColor,
}: DropdownCardProps) {
  const [hovered, setHovered] = useState(false);
  const imageHeight = Math.max(70, Math.round(height * 0.44));

  return (
    <a
      href={link || "#"}
      target={newTab ? "_blank" : "_self"}
      rel={newTab ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        width: "100%",
        height,
        boxSizing: "border-box",
        background: cardBgColor,
        borderRadius: 16,
        overflow: "hidden",
        textDecoration: "none",
        cursor: link ? "pointer" : "default",
      }}
    >
      <div style={{ padding: "14px 14px 10px" }}>
        <div
          style={{
            width: "100%",
            height: imageHeight,
            borderRadius: 11,
            overflow: "hidden",
            background: "linear-gradient(135deg,#d9e2f6 0%,#aebfe8 45%,#eef2fa 100%)",
          }}
        >
          {image ? (
            <img
              src={image}
              alt={label}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
                transform: hovered ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                transform: hovered ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          )}
        </div>
      </div>
      <div style={{ padding: "0 16px 6px" }}>
        <span style={{ ...titleFont, color: titleColor, display: "block" }}>{label}</span>
      </div>
      <div style={{ padding: "0 16px 14px" }}>
        <span style={{ ...descFont, color: descColor, display: "block" }}>{description}</span>
      </div>
    </a>
  );
}

interface DropdownLinkProps {
  label: string;
  link?: string;
  newTab?: boolean;
  isActive: boolean;
  onHover: () => void;
  linkFont: CSSProperties;
  restColor: string;
  gradStart: string;
  gradEnd: string;
  dotColor: string;
  isEntering: boolean;
  enterDelay: number;
  dockEnabled: boolean;
  dockItemBg: string;
  dockRadius: number;
  dockPaddingX: number;
  dockPaddingY: number;
}

export function DropdownLink({
  label,
  link,
  newTab,
  isActive,
  onHover,
  linkFont,
  restColor,
  gradStart,
  gradEnd,
  dotColor,
  isEntering,
  enterDelay,
  dockEnabled,
  dockItemBg,
  dockRadius,
  dockPaddingX,
  dockPaddingY,
}: DropdownLinkProps) {
  const [hovered, setHovered] = useState(false);
  const active = isActive || hovered;

  return (
    <a
      href={link || "#"}
      target={newTab ? "_blank" : "_self"}
      rel={newTab ? "noopener noreferrer" : undefined}
      className={isEntering ? "nbg-link-enter" : undefined}
      style={{
        animationDelay: isEntering ? `${enterDelay}ms` : "0ms",
        display: "flex",
        alignItems: "center",
        gap: 7,
        textDecoration: "none",
        cursor: "pointer",
        padding: dockEnabled
          ? active
            ? `${dockPaddingY}px ${dockPaddingX}px`
            : `3px ${dockPaddingX}px`
          : undefined,
        borderRadius: dockEnabled ? dockRadius : undefined,
        background: dockEnabled && active ? dockItemBg : "transparent",
        transition: "background 0.2s ease, padding 0.2s ease",
      }}
      onMouseEnter={() => {
        setHovered(true);
        onHover();
      }}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        style={{
          color: active ? dotColor : "rgba(0,0,0,.18)",
          fontSize: 8,
          lineHeight: 1,
          flexShrink: 0,
          transition: "color 0.2s ease",
          userSelect: "none",
        }}
      >
        ◆
      </span>
      <span
        style={{
          ...linkFont,
          backgroundImage: `linear-gradient(to right, ${gradStart} 0%, ${gradEnd} 50%, ${restColor} 50%)`,
          backgroundSize: "200% 100%",
          backgroundPosition: active ? "0% 0%" : "100% 0%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          transition: "background-position 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          display: "inline",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </a>
  );
}

export function toFontStyle(font: FontConfig = {}): CSSProperties {
  return {
    fontFamily: font.fontFamily,
    fontSize: font.fontSize,
    fontWeight: font.fontWeight,
    fontStyle: font.fontStyle,
    lineHeight: font.lineHeight,
    letterSpacing: font.letterSpacing,
  };
}
