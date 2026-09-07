import type { NavbarProps } from "../types";

/** Portfolio nav — Work, About, Resume, Contact. No mega-menu. */
export const portfolioNavbarConfig: Pick<
  NavbarProps,
  "brand" | "content" | "layout" | "typography" | "background" | "mobile" | "dock"
> = {
  brand: {
    logo: "/navbar-export/assets/logo.svg",
    logoAlt: "Home",
    logoWidth: 28,
    logoLink: "/",
  },
  content: {
    dropdowns: [],
    navLinks: [
      { label: "Work", link: "#work" },
      { label: "About", link: "#about" },
      { label: "Resume", link: "#resume" },
      { label: "Contact", link: "#contact" },
    ],
  },
  layout: {
    cornerRadius: 200,
    linkGap: 4,
    paddingTop: 10,
    paddingBottom: 10,
    paddingX: 10,
  },
  typography: {
    invertMode: "dark",
    linkColor: "rgb(64, 64, 64)",
    chevronColor: "rgb(64, 64, 64)",
    accentColor: "rgb(10, 10, 10)",
    dotColor: "rgb(10, 10, 10)",
    gradColorStart: "rgb(10, 10, 10)",
    gradColorEnd: "rgb(120, 120, 120)",
    navFont: {
      fontFamily: 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: "1em",
      letterSpacing: "-0.01em",
    },
    dropdownFont: {
      fontFamily: 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
      fontSize: "14px",
      fontWeight: 400,
    },
    cardTitleFont: {
      fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
      fontSize: "14px",
      fontWeight: 400,
    },
    cardDescFont: {
      fontFamily: 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
      fontSize: "14px",
      fontWeight: 400,
    },
  },
  background: {
    mode: "css",
    blur: 20,
    saturation: 140,
    tintColor: "rgb(255, 255, 255)",
    tintOpacity: 0.55,
    edgeHighlight: 0.85,
    glassTint: "rgba(255, 255, 255, 0.72)",
    solidColor: "rgba(255, 255, 255, 0.72)",
    cardBgColor: "rgb(245, 245, 245)",
  },
  mobile: {
    breakpoint: 768,
    mobileShowLogo: false,
    menuIconColor: "rgb(22, 22, 22)",
    mobileFont: {
      fontFamily: 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
      fontSize: "16px",
      fontWeight: 500,
    },
    mobileDropdownFont: {
      fontFamily: 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
      fontSize: "16px",
      fontWeight: 500,
    },
    mobileDescFont: {
      fontFamily: 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
      fontSize: "14px",
      fontWeight: 400,
    },
    buttonFont: {
      fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
      fontSize: "13px",
      fontWeight: 400,
      letterSpacing: "0.04em",
    },
    mobileNavBgColor: "rgba(255, 255, 255, 0.92)",
    mobileGlassBlur: 24,
    mobileGlassMode: "simple",
    mobileLinkSpacing: 32,
    primaryBtn: {
      show: true,
      text: "Contact",
      link: "#contact",
      bgColor: "rgb(10, 10, 10)",
      textColor: "rgb(255, 255, 255)",
      borderRadius: 100,
      paddingX: 24,
      paddingY: 14,
    },
    secondaryBtn: {
      show: true,
      text: "Resume",
      link: "#resume",
      textColor: "rgb(22, 22, 22)",
      borderColor: "rgb(210, 210, 210)",
      borderRadius: 100,
      paddingX: 24,
      paddingY: 14,
    },
  },
  dock: {
    enabled: true,
    color: "rgba(0, 0, 0, 0.05)",
    radius: 100,
    paddingX: 10,
    paddingY: 6,
  },
};
