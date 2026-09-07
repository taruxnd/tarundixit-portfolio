"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronIcon, HamburgerIcon } from "./icons";
import { toFontStyle } from "./DropdownItems";
import type {
  DropdownGroup,
  FontConfig,
  MobileButtonConfig,
  NavLinkItem,
} from "../types";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logo?: string;
  logoWidth?: number;
  logoAlt?: string;
  logoLink?: string;
  dropdowns: DropdownGroup[];
  navLinks: NavLinkItem[];
  primaryBtn: MobileButtonConfig;
  secondaryBtn: MobileButtonConfig;
  buttonFont: FontConfig;
  mobileFont: FontConfig;
  mobileDropdownFont: FontConfig;
  mobileDescFont: FontConfig;
  menuColor: string;
  dropdownColor: string;
  descColor: string;
  menuIconColor: string;
  mobileGlassMode: "simple" | "css" | "solid";
  mobileNavBgColor: string;
  mobileGlassBlur: number;
  mobileLinkSpacing: number;
  mobileDropdownSpacing: number;
  mobileLogoSpacing: number;
  paddingX: number;
  paddingY: number;
}

export function MobileDrawer({
  isOpen,
  onClose,
  logo,
  logoWidth = 120,
  logoAlt = "Logo",
  logoLink = "/",
  dropdowns,
  navLinks,
  primaryBtn,
  secondaryBtn,
  buttonFont,
  mobileFont,
  mobileDropdownFont,
  mobileDescFont,
  menuColor,
  dropdownColor,
  descColor,
  menuIconColor,
  mobileGlassMode,
  mobileNavBgColor,
  mobileGlassBlur,
  mobileLinkSpacing,
  mobileDropdownSpacing,
  mobileLogoSpacing,
  paddingX,
  paddingY,
}: MobileDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState<boolean[]>([]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setAccordionOpen((prev) => {
      const next = [...prev];
      while (next.length < dropdowns.length) next.push(false);
      return next.slice(0, dropdowns.length);
    });
  }, [dropdowns.length]);

  useEffect(() => {
    if (!isOpen) setAccordionOpen((prev) => prev.map(() => false));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const toggleAccordion = (idx: number) => {
    setAccordionOpen((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const mobileLinkStyle = { ...toFontStyle(mobileFont), color: menuColor, textDecoration: "none", display: "block" as const };
  const buttonFontStyle = toFontStyle(buttonFont);

  const blur = mobileGlassBlur > 0 ? mobileGlassBlur : 0;
  const backdropFilter =
    mobileGlassMode === "solid" || blur === 0
      ? undefined
      : mobileGlassMode === "css"
        ? `blur(${blur}px) saturate(160%)`
        : mobileGlassMode === "simple"
          ? `blur(${blur}px) saturate(120%)`
          : `blur(${blur}px)`;

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        pointerEvents: isOpen ? "auto" : "none",
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          background: "rgba(0,0,0,.28)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.35s ease",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(86vw, 360px)",
          maxWidth: "100vw",
          boxSizing: "border-box",
          backdropFilter,
          WebkitBackdropFilter: backdropFilter,
          background: mobileNavBgColor,
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
          transform: isOpen ? "translateX(0)" : "translateX(105%)",
          transition: "transform 0.42s cubic-bezier(0.22, 1, 0.36, 1)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-28px 0 70px rgba(0,0,0,.16)",
        }}
      >
        <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", minHeight: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: `${paddingY}px ${paddingX}px 0`,
            }}
          >
            {logo ? (
              <a
                href={logoLink}
                aria-label="Home"
                onClick={onClose}
                style={{ display: "inline-flex", maxWidth: "60%" }}
              >
                <img
                  src={logo}
                  alt={logoAlt}
                  style={{ width: logoWidth, maxWidth: "100%", height: "auto", objectFit: "contain" }}
                />
              </a>
            ) : (
              <span style={{ ...mobileLinkStyle, fontSize: 18 }}>Logo</span>
            )}
            <button
              onClick={onClose}
              aria-label="Close menu"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                display: "flex",
                flexShrink: 0,
              }}
            >
              <HamburgerIcon open color={menuIconColor} />
            </button>
          </div>

          <div style={{ padding: `${mobileLogoSpacing}px ${paddingX}px ${paddingY}px` }}>
            {dropdowns.map((group, groupIdx) => (
              <div key={group.label} style={{ marginBottom: mobileLinkSpacing }}>
                <button
                  onClick={() => toggleAccordion(groupIdx)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={mobileLinkStyle}>{group.label}</span>
                  <ChevronIcon open={!!accordionOpen[groupIdx]} color={menuColor} />
                </button>
                <div
                  style={{
                    overflow: "hidden",
                    maxHeight: accordionOpen[groupIdx]
                      ? `${group.links.length * 92 + 20}px`
                      : 0,
                    transition: "max-height 0.38s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <div style={{ paddingTop: mobileDropdownSpacing }}>
                    {group.links.map((link, linkIdx) => (
                      <a
                        key={linkIdx}
                        href={link.link || "#"}
                        target={link.newTab ? "_blank" : "_self"}
                        rel={link.newTab ? "noopener noreferrer" : undefined}
                        style={{
                          textDecoration: "none",
                          display: "block",
                          padding: `${Math.round(mobileDropdownSpacing * 0.35)}px 0 ${Math.round(mobileDropdownSpacing * 0.35)}px 16px`,
                        }}
                      >
                        <span style={{ ...toFontStyle(mobileDropdownFont), color: dropdownColor, display: "block" }}>
                          {link.label}
                        </span>
                        {link.description && (
                          <span
                            style={{
                              ...toFontStyle(mobileDescFont),
                              color: descColor,
                              display: "block",
                              marginTop: 2,
                            }}
                          >
                            {link.description}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {navLinks.map((link, idx) => (
              <div
                key={link.label}
                style={{ marginBottom: idx < navLinks.length - 1 ? mobileLinkSpacing : 0 }}
              >
                <a
                  href={link.link || "#"}
                  target={link.newTab ? "_blank" : "_self"}
                  rel={link.newTab ? "noopener noreferrer" : undefined}
                  data-tracking={link.trackingId || undefined}
                  style={mobileLinkStyle}
                >
                  {link.label}
                </a>
              </div>
            ))}
          </div>
        </div>

        {(primaryBtn.show || secondaryBtn.show) && (
          <div
            style={{
              flexShrink: 0,
              padding: `16px ${paddingX}px ${paddingY}px`,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {primaryBtn.show && (
              <a
                href={primaryBtn.link || "#"}
                target={primaryBtn.newTab ? "_blank" : "_self"}
                rel={primaryBtn.newTab ? "noopener noreferrer" : undefined}
                style={{
                  display: "block",
                  textAlign: "center",
                  textDecoration: "none",
                  boxSizing: "border-box",
                  background: primaryBtn.bgColor,
                  color: primaryBtn.textColor,
                  ...buttonFontStyle,
                  padding: `${primaryBtn.paddingY}px ${primaryBtn.paddingX}px`,
                  borderRadius: primaryBtn.borderRadius,
                  border: `2px solid ${primaryBtn.bgColor}`,
                  cursor: "pointer",
                }}
              >
                {primaryBtn.text}
              </a>
            )}
            {secondaryBtn.show && (
              <a
                href={secondaryBtn.link || "#"}
                target={secondaryBtn.newTab ? "_blank" : "_self"}
                rel={secondaryBtn.newTab ? "noopener noreferrer" : undefined}
                style={{
                  display: "block",
                  textAlign: "center",
                  textDecoration: "none",
                  boxSizing: "border-box",
                  background: "transparent",
                  color: secondaryBtn.textColor,
                  ...buttonFontStyle,
                  padding: `${secondaryBtn.paddingY}px ${secondaryBtn.paddingX}px`,
                  borderRadius: secondaryBtn.borderRadius,
                  border: `2px solid ${secondaryBtn.borderColor}`,
                  cursor: "pointer",
                }}
              >
                {secondaryBtn.text}
              </a>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
