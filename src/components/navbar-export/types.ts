import type { CSSProperties } from "react";

export interface FontConfig {
  fontFamily?: string;
  fontSize?: string | number;
  fontWeight?: number | string;
  fontStyle?: string;
  lineHeight?: string | number;
  letterSpacing?: string;
}

export interface DropdownLinkItem {
  label: string;
  description?: string;
  image?: string;
  link?: string;
  newTab?: boolean;
}

export interface NavLinkItem {
  label: string;
  link?: string;
  newTab?: boolean;
  scrollBehavior?: "smooth" | "instant";
  trackingId?: string;
}

export interface DropdownGroup {
  label: string;
  links: DropdownLinkItem[];
}

export interface MobileButtonConfig {
  show?: boolean;
  text?: string;
  link?: string;
  newTab?: boolean;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  paddingX?: number;
  paddingY?: number;
  borderRadius?: number;
}

export interface NavbarBrand {
  logo?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoLink?: string;
}

export interface NavbarContent {
  dropdowns?: DropdownGroup[];
  dropdownLabel?: string;
  dropdownLinks?: DropdownLinkItem[];
  navLinks?: NavLinkItem[];
}

export interface NavbarLayout {
  paddingX?: number;
  paddingY?: number;
  paddingTop?: number;
  paddingBottom?: number;
  cornerRadius?: number;
  dropdownWidth?: number;
  dropdownHeight?: number;
  dropdownGap?: number;
  linksWidth?: number;
  linkGap?: number;
}

export interface NavbarTypography {
  navFont?: FontConfig;
  dropdownFont?: FontConfig;
  cardTitleFont?: FontConfig;
  cardDescFont?: FontConfig;
  invertMode?: "dark" | "light";
  linkColor?: string;
  ddRestColor?: string;
  cardTitleColor?: string;
  cardDescColor?: string;
  dotColor?: string;
  gradColorStart?: string;
  gradColorEnd?: string;
  chevronColor?: string;
  accentColor?: string;
}

export interface NavbarBackground {
  mode?: "liquid" | "overlay" | "css" | "lowres" | "solid";
  bevelDepth?: number;
  bevelWidth?: number;
  magnify?: number;
  shadowOffset?: number;
  specularIntensity?: number;
  rainbowIntensity?: number;
  refraction?: number;
  blur?: number;
  saturation?: number;
  tintColor?: string;
  tintOpacity?: number;
  glassTint?: string;
  solidColor?: string;
  edgeHighlight?: number;
  cardBgColor?: string;
}

export interface NavbarMobile {
  forceMobile?: boolean;
  breakpoint?: number;
  menuIconColor?: string;
  mobileFont?: FontConfig;
  mobileDropdownFont?: FontConfig;
  mobileDescFont?: FontConfig;
  buttonFont?: FontConfig;
  mobileMenuColor?: string;
  mobileDropdownColor?: string;
  mobileDescColor?: string;
  mobileGlassMode?: "simple" | "css" | "solid";
  mobileNavBgColor?: string;
  mobileGlassBlur?: number;
  mobileLinkSpacing?: number;
  mobileDropdownSpacing?: number;
  mobileLogoSpacing?: number;
  mobilePaddingX?: number;
  mobilePaddingY?: number;
  mobileShowLogo?: boolean;
  primaryBtn?: MobileButtonConfig;
  secondaryBtn?: MobileButtonConfig;
}

export interface NavbarDock {
  enabled?: boolean;
  color?: string;
  radius?: number;
  paddingX?: number;
  paddingY?: number;
}

export interface NavbarProps {
  brand?: NavbarBrand;
  content?: NavbarContent;
  layout?: NavbarLayout;
  typography?: NavbarTypography;
  background?: NavbarBackground;
  mobile?: NavbarMobile;
  dock?: NavbarDock;
  className?: string;
  style?: CSSProperties;
  /** Fixed position offset from top (default: 24px) */
  top?: number | string;
}
