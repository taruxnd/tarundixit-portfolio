"use client";

import { useEffect, useLayoutEffect, useRef, useState, type MutableRefObject } from "react";
import { createPortal } from "react-dom";
import { GlassBackground } from "./GlassBackground";
import { DropdownCard, DropdownLink, toFontStyle } from "./DropdownItems";
import type { DropdownLinkItem, FontConfig, NavbarBackground } from "../types";

interface MegaMenuDropdownProps {
  items: DropdownLinkItem[];
  isOpen: boolean;
  anchorRefHolder: MutableRefObject<(HTMLDivElement | null)[]>;
  anchorIdx: number;
  navGap: number;
  width: number;
  height: number;
  cornerRadius: number;
  linksWidth: number;
  glass: NavbarBackground;
  cardBgColor: string;
  dropdownFont: FontConfig;
  titleFont: FontConfig;
  descFont: FontConfig;
  cardTitleColor: string;
  cardDescColor: string;
  restColor: string;
  gradStart: string;
  gradEnd: string;
  dotColor: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  dockEnabled: boolean;
  dockItemBg: string;
  dockRadius: number;
  dockPaddingX: number;
  dockPaddingY: number;
}

export function MegaMenuDropdown({
  items,
  isOpen,
  anchorRefHolder,
  anchorIdx,
  navGap,
  width,
  height,
  cornerRadius,
  linksWidth,
  glass,
  cardBgColor,
  dropdownFont,
  titleFont,
  descFont,
  cardTitleColor,
  cardDescColor,
  restColor,
  gradStart,
  gradEnd,
  dotColor,
  onMouseEnter,
  onMouseLeave,
  dockEnabled,
  dockItemBg,
  dockRadius,
  dockPaddingX,
  dockPaddingY,
}: MegaMenuDropdownProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isEntering, setIsEntering] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const enterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const probeRef = useRef<HTMLDivElement>(null);
  const [probeWidth, setProbeWidth] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setActiveIdx(0);
      setIsEntering(true);
      if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
      enterTimeoutRef.current = setTimeout(() => setIsEntering(false), 650);
      return () => {
        if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const getAnchor = () => anchorRefHolder.current[anchorIdx] ?? null;
    const update = () => {
      const anchor = getAnchor();
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      setPosition({ top: rect.bottom + navGap, left: rect.left });
    };

    if (isOpen) {
      update();
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      return () => {
        window.removeEventListener("scroll", update);
        window.removeEventListener("resize", update);
      };
    }
  }, [isOpen, anchorRefHolder, anchorIdx, navGap]);

  useLayoutEffect(() => {
    if (probeRef.current) {
      setProbeWidth(probeRef.current.offsetWidth);
    }
  }, [items, dropdownFont, dockEnabled, dockPaddingX, dockPaddingY]);

  if (typeof document === "undefined") return null;

  const cardAreaWidth = Math.max(160, width - linksWidth - 28);
  const leftPanelWidth = Math.max(linksWidth, probeWidth + 28);
  const totalWidth = leftPanelWidth + cardAreaWidth + 28;
  const minHeight = items.length * 56 + 60;
  const totalHeight = Math.max(height, minHeight);
  const cardHeight = totalHeight - 28;
  const cardStride = cardHeight + 28;

  const dropdownFontStyle = toFontStyle(dropdownFont);
  const titleFontStyle = toFontStyle(titleFont);
  const descFontStyle = toFontStyle(descFont);

  return createPortal(
    <div
      data-nbg-dropdown=""
      style={{
        position: "fixed",
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        zIndex: 10000,
        visibility: isOpen && !position ? "hidden" : "visible",
        transformOrigin: "top left",
        transform: isOpen ? "none" : "scale(0.96) translateY(-8px)",
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "auto" : "none",
        transition: isOpen
          ? "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.18s ease"
          : "transform 0.22s cubic-bezier(0.4, 0, 0.5, 1), opacity 0.16s ease",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <GlassBackground
        {...glass}
        cornerRadius={Math.min(cornerRadius, 26)}
        style={{
          width: totalWidth,
          height: totalHeight,
          boxShadow: "0 18px 50px -12px rgba(0,0,0,.22)",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: leftPanelWidth,
              boxSizing: "border-box",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "safe center",
              gap: 28,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {items.map((item, idx) => (
              <DropdownLink
                key={`${item.label}-${idx}`}
                label={item.label}
                link={item.link}
                newTab={item.newTab}
                isActive={idx === activeIdx}
                onHover={() => setActiveIdx(idx)}
                linkFont={dropdownFontStyle}
                restColor={restColor}
                gradStart={gradStart}
                gradEnd={gradEnd}
                dotColor={dotColor}
                isEntering={isEntering}
                enterDelay={idx * 55}
                dockEnabled={dockEnabled}
                dockItemBg={dockItemBg}
                dockRadius={dockRadius}
                dockPaddingX={dockPaddingX}
                dockPaddingY={dockPaddingY}
              />
            ))}
          </div>

          <div
            ref={probeRef}
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: 0,
              overflow: "hidden",
              visibility: "hidden",
              pointerEvents: "none",
              width: "max-content",
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
          >
            {items.map((item, idx) => (
              <DropdownLink
                key={`probe-${item.label}-${idx}`}
                label={item.label}
                link={item.link}
                newTab={item.newTab}
                isActive={false}
                onHover={() => {}}
                linkFont={dropdownFontStyle}
                restColor={restColor}
                gradStart={gradStart}
                gradEnd={gradEnd}
                dotColor={dotColor}
                isEntering={false}
                enterDelay={0}
                dockEnabled={dockEnabled}
                dockItemBg={dockItemBg}
                dockRadius={dockRadius}
                dockPaddingX={dockPaddingX}
                dockPaddingY={dockPaddingY}
              />
            ))}
          </div>

          <div
            style={{
              position: "absolute",
              left: leftPanelWidth + 14,
              width: cardAreaWidth,
              top: 14,
              bottom: 14,
              overflow: "hidden",
              borderRadius: 12,
            }}
          >
            <div
              style={{
                transform: `translateY(${-activeIdx * cardStride}px)`,
                transition: "transform 0.55s cubic-bezier(0.34, 1.3, 0.5, 1)",
              }}
            >
              {items.map((item, idx) => (
                <div key={`card-${item.label}-${idx}`} style={{ height: cardHeight, marginBottom: 28 }}>
                  <DropdownCard
                    {...item}
                    cardBgColor={cardBgColor}
                    height={cardHeight}
                    titleFont={titleFontStyle}
                    descFont={descFontStyle}
                    titleColor={cardTitleColor}
                    descColor={cardDescColor}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassBackground>
    </div>,
    document.body,
  );
}
