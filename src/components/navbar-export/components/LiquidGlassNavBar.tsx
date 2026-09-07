"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GlassBackground } from "./GlassBackground";
import { MegaMenuDropdown } from "./MegaMenuDropdown";
import { MobileDrawer } from "./MobileDrawer";
import { toFontStyle } from "./DropdownItems";
import { ChevronIcon, HamburgerIcon } from "./icons";
import { gradientHoverStyle } from "./utils";
import { useInjectNavbarStyles } from "../hooks/useInjectNavbarStyles";
import { useIsMobile } from "../hooks/useIsMobile";
import type { NavbarProps } from "../types";
import { defaultNavbarConfig } from "../config/defaultConfig";

export function LiquidGlassNavBar({
  brand: brandProp,
  content: contentProp,
  layout: layoutProp,
  typography: typographyProp,
  background: backgroundProp,
  mobile: mobileProp,
  dock: dockProp,
  style,
}: Omit<NavbarProps, "className" | "top">) {
  useInjectNavbarStyles();

  const brand = { ...defaultNavbarConfig.brand, ...brandProp };
  const content = { ...defaultNavbarConfig.content, ...contentProp };
  const layout = { ...defaultNavbarConfig.layout, ...layoutProp };
  const typography = { ...defaultNavbarConfig.typography, ...typographyProp };
  const background = { ...defaultNavbarConfig.background, ...backgroundProp };
  const mobile = { ...defaultNavbarConfig.mobile, ...mobileProp };
  const dock = { ...defaultNavbarConfig.dock, ...dockProp };

  const dropdowns = useMemo(() => {
    if (content.dropdowns !== undefined) {
      return content.dropdowns.filter((group) => group.links.length > 0);
    }

    const links = content.dropdownLinks ?? [];
    if (links.length === 0) return [];

    return [
      {
        label: content.dropdownLabel ?? "Services",
        links,
      },
    ];
  }, [content.dropdowns, content.dropdownLinks, content.dropdownLabel]);

  const navLinks = content.navLinks ?? [];

  const isMobile = useIsMobile(mobile.breakpoint ?? 768, mobile.forceMobile);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [activeNavLink, setActiveNavLink] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleClose = useCallback(() => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 200);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.("[data-nbg-dropdown]")) return;
      if (containerRef.current && target && !containerRef.current.contains(target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isLight = typography.invertMode === "light";
  const linkColor = isLight ? "#ffffff" : (typography.linkColor ?? "#161616");
  const chevronColor = isLight ? "#ffffff" : (typography.chevronColor ?? "#161616");
  const gradStart = typography.gradColorStart ?? "#FF6B00";
  const gradEnd = typography.gradColorEnd ?? "#FF9A3C";
  const accentColor = typography.accentColor ?? "#FF6B00";

  const navFontStyle = useMemo(() => toFontStyle(typography.navFont), [typography.navFont]);

  const dockItemBg = dock.color ?? "rgba(0,0,0,0.08)";
  const paddingTop = layout.paddingTop ?? layout.paddingY ?? 12;
  const paddingBottom = layout.paddingBottom ?? layout.paddingY ?? 12;
  const paddingX = layout.paddingX ?? 12;

  return (
    <div ref={containerRef} style={{ position: "relative", display: "flex", width: "fit-content", ...style }}>
      <GlassBackground
        {...background}
        cornerRadius={layout.cornerRadius}
        style={{ width: "100%" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            boxSizing: "border-box",
            gap: isMobile ? 0 : (layout.linkGap ?? 4),
            padding: isMobile
              ? `${mobile.mobilePaddingY ?? 8}px ${mobile.mobilePaddingX ?? 16}px`
              : `${paddingTop}px ${paddingX}px ${paddingBottom}px ${paddingX}px`,
          }}
        >
          {isMobile ? (
            <>
              {brand.logo && mobile.mobileShowLogo !== false && (
                <a href={brand.logoLink ?? "/"} aria-label="Home" style={{ display: "inline-flex", flexShrink: 0 }}>
                  <img
                    src={brand.logo}
                    alt={brand.logoAlt ?? "Logo"}
                    style={{ width: brand.logoWidth ?? 120, height: "auto", objectFit: "contain" }}
                  />
                </a>
              )}
              <span style={{ flex: 1 }} />
              <button
                data-cursor="interactive"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  width: 42,
                  height: 42,
                }}
              >
                <HamburgerIcon open={mobileMenuOpen} color={mobile.menuIconColor ?? "#161616"} />
              </button>
            </>
          ) : (
            <>
              {dropdowns.map((group, idx) => (
                <div
                  key={group.label}
                  ref={(el) => {
                    dropdownRefs.current[idx] = el;
                  }}
                  style={{ position: "relative" }}
                >
                  <button
                    data-cursor="interactive"
                    onMouseEnter={() => {
                      cancelClose();
                      setActiveDropdown(idx);
                    }}
                    onMouseLeave={scheduleClose}
                    style={{
                      background:
                        dock.enabled && activeDropdown === idx ? dockItemBg : "none",
                      borderRadius: dock.enabled ? (dock.radius ?? 8) : 0,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: dock.enabled
                        ? `${dock.paddingY ?? 8}px ${dock.paddingX ?? 8}px`
                        : "6px 10px",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <span
                      style={{
                        ...navFontStyle,
                        ...gradientHoverStyle(activeDropdown === idx, linkColor, gradStart, gradEnd),
                      }}
                    >
                      {group.label}
                    </span>
                    <ChevronIcon
                      open={activeDropdown === idx}
                      color={activeDropdown === idx ? accentColor : chevronColor}
                    />
                  </button>

                  <MegaMenuDropdown
                    items={group.links}
                    isOpen={activeDropdown === idx}
                    anchorRefHolder={dropdownRefs}
                    anchorIdx={idx}
                    navGap={layout.dropdownGap ?? 16}
                    width={layout.dropdownWidth ?? 480}
                    height={layout.dropdownHeight ?? 320}
                    cornerRadius={layout.cornerRadius ?? 100}
                    linksWidth={layout.linksWidth ?? 124}
                    glass={background}
                    cardBgColor={background.cardBgColor ?? "rgb(240,241,243)"}
                    dropdownFont={typography.dropdownFont ?? {}}
                    titleFont={typography.cardTitleFont ?? {}}
                    descFont={typography.cardDescFont ?? {}}
                    cardTitleColor={typography.cardTitleColor ?? "#1d1d1f"}
                    cardDescColor={typography.cardDescColor ?? "#8f969e"}
                    restColor={typography.ddRestColor ?? "#9aa0a6"}
                    gradStart={gradStart}
                    gradEnd={gradEnd}
                    dotColor={typography.dotColor ?? "#FF6B00"}
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                    dockEnabled={dock.enabled ?? true}
                    dockItemBg={dockItemBg}
                    dockRadius={dock.radius ?? 8}
                    dockPaddingX={dock.paddingX ?? 8}
                    dockPaddingY={dock.paddingY ?? 8}
                  />
                </div>
              ))}

              {navLinks.map((link, idx) => (
                <a
                  key={`${link.label}-${idx}`}
                  href={link.link || "#"}
                  target={link.newTab ? "_blank" : "_self"}
                  rel={link.newTab ? "noopener noreferrer" : undefined}
                  data-tracking={link.trackingId || undefined}
                  data-cursor="interactive"
                  style={{
                    padding: dock.enabled
                      ? `${dock.paddingY ?? 8}px ${dock.paddingX ?? 8}px`
                      : "6px 10px",
                    display: "inline-flex",
                    alignItems: "center",
                    textDecoration: "none",
                    background:
                      dock.enabled && activeNavLink === idx ? dockItemBg : "transparent",
                    borderRadius: dock.enabled ? (dock.radius ?? 8) : 0,
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={() => setActiveNavLink(idx)}
                  onMouseLeave={() => setActiveNavLink(null)}
                >
                  <span
                    style={{
                      ...navFontStyle,
                      ...gradientHoverStyle(activeNavLink === idx, linkColor, gradStart, gradEnd),
                    }}
                  >
                    {link.label}
                  </span>
                </a>
              ))}
            </>
          )}
        </div>
      </GlassBackground>

      {isMobile && (
        <MobileDrawer
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          logo={brand.logo}
          logoWidth={brand.logoWidth}
          logoAlt={brand.logoAlt}
          logoLink={brand.logoLink}
          dropdowns={dropdowns}
          navLinks={navLinks}
          primaryBtn={{ ...defaultNavbarConfig.mobile.primaryBtn, ...mobile.primaryBtn }}
          secondaryBtn={{ ...defaultNavbarConfig.mobile.secondaryBtn, ...mobile.secondaryBtn }}
          buttonFont={mobile.buttonFont ?? {}}
          mobileFont={mobile.mobileFont ?? {}}
          mobileDropdownFont={mobile.mobileDropdownFont ?? {}}
          mobileDescFont={mobile.mobileDescFont ?? {}}
          menuColor={mobile.mobileMenuColor ?? "#161616"}
          dropdownColor={mobile.mobileDropdownColor ?? "#161616"}
          descColor={mobile.mobileDescColor ?? "#8f969e"}
          menuIconColor={mobile.menuIconColor ?? "#161616"}
          mobileGlassMode={mobile.mobileGlassMode ?? "simple"}
          mobileNavBgColor={mobile.mobileNavBgColor ?? "rgba(255,255,255,0.92)"}
          mobileGlassBlur={mobile.mobileGlassBlur ?? 24}
          mobileLinkSpacing={mobile.mobileLinkSpacing ?? 40}
          mobileDropdownSpacing={mobile.mobileDropdownSpacing ?? 40}
          mobileLogoSpacing={mobile.mobileLogoSpacing ?? 32}
          paddingX={mobile.mobilePaddingX ?? 16}
          paddingY={mobile.mobilePaddingY ?? 8}
        />
      )}
    </div>
  );
}
