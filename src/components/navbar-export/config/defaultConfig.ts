import type { NavbarProps } from "../types";

/** Default configuration matching the original Framer navbar. */
export const defaultNavbarConfig: Required<
  Pick<NavbarProps, "brand" | "content" | "layout" | "typography" | "background" | "mobile" | "dock">
> = {
  brand: {
    logo: "/navbar-export/assets/logo.svg",
    logoAlt: "Logo image",
    logoWidth: 120,
    logoLink: "/",
  },
  content: {
    dropdowns: [
      {
        label: "Glass",
        links: [
          {
            label: "Realstic aberration ",
            description:
              "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod.",
            image:
              "https://framerusercontent.com/images/CwQLVnjQKBeni0S2QiObV8M4vuU.jpg?width=2499&height=1406",
            link: "#",
            newTab: false,
          },
          {
            label: "Glass like contour",
            description:
              "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod.",
            image:
              "https://framerusercontent.com/images/CuXRsggcEnLAxcXYr4FWuJpJc.webp?width=1200&height=628",
            link: "#",
            newTab: false,
          },
          {
            label: "Background blend",
            description:
              "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod.",
            image:
              "https://framerusercontent.com/images/J3FK4jMOgkYGHEvjhBjCp8Xpto.jpg?width=700&height=875",
            link: "#",
            newTab: false,
          },
        ],
      },
    ],
    navLinks: [
      { label: "Perfect", link: "#", newTab: false },
      { label: "For", link: "#", newTab: false },
      { label: "Site", link: "#", newTab: false },
      { label: "& Respnsive friendly", link: "#", newTab: false },
    ],
  },
  layout: {
    cornerRadius: 200,
    dropdownGap: 26,
    dropdownHeight: 320,
    dropdownWidth: 480,
    linkGap: 11,
    linksWidth: 124,
    paddingBottom: 12,
    paddingTop: 12,
    paddingX: 12,
  },
  typography: {
    accentColor: "rgb(255, 107, 0)",
    cardDescColor: "rgb(143, 150, 158)",
    cardDescFont: {
      fontFamily: '"Geist", "Geist Placeholder", sans-serif',
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "1em",
    },
    cardTitleColor: "rgb(29, 29, 31)",
    cardTitleFont: {
      fontFamily: '"Departure Mono Regular", "Departure Mono Regular Placeholder", monospace',
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "1em",
    },
    chevronColor: "rgb(22, 22, 22)",
    ddRestColor: "rgb(64, 66, 66)",
    dotColor: "rgb(255, 107, 0)",
    dropdownFont: {
      fontFamily: '"Geist", "Geist Placeholder", sans-serif',
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "1em",
    },
    gradColorEnd: "rgb(255, 154, 60)",
    gradColorStart: "rgb(255, 107, 0)",
    invertMode: "dark",
    linkColor: "rgb(22, 22, 22)",
    navFont: {
      fontFamily: '"Geist", "Geist Placeholder", sans-serif',
      fontSize: "18px",
      fontWeight: 400,
      lineHeight: "1em",
    },
  },
  background: {
    bevelDepth: 0.5,
    bevelWidth: 0.5,
    blur: 0,
    cardBgColor: "rgb(240, 241, 243)",
    edgeHighlight: 0.85,
    glassTint: "rgba(255, 255, 255, 0.15)",
    magnify: 0,
    mode: "overlay",
    rainbowIntensity: 1.25,
    refraction: 8,
    saturation: 160,
    shadowOffset: 10,
    solidColor: "rgba(255, 255, 255, 0.9)",
    specularIntensity: 1,
    tintColor: "rgb(255, 255, 255)",
    tintOpacity: 0.08,
  },
  mobile: {
    breakpoint: 768,
    buttonFont: {
      fontFamily: '"Departure Mono Regular", "Departure Mono Regular Placeholder", monospace',
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "7px",
    },
    forceMobile: false,
    menuIconColor: "rgb(22, 22, 22)",
    mobileDescColor: "rgb(143, 150, 158)",
    mobileDescFont: {
      fontFamily: '"Geist", "Geist Placeholder", sans-serif',
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "1em",
    },
    mobileDropdownColor: "rgb(22, 22, 22)",
    mobileDropdownFont: {
      fontFamily: '"Geist", "Geist Placeholder", sans-serif',
      fontSize: "18px",
      fontWeight: 400,
      lineHeight: "1em",
    },
    mobileDropdownSpacing: 40,
    mobileFont: {
      fontFamily: '"Geist", "Geist Placeholder", sans-serif',
      fontSize: "18px",
      fontWeight: 400,
      lineHeight: "1em",
    },
    mobileGlassBlur: 24,
    mobileGlassMode: "simple",
    mobileLinkSpacing: 40,
    mobileLogoSpacing: 32,
    mobileMenuColor: "rgb(22, 22, 22)",
    mobileNavBgColor: "rgba(255, 255, 255, 0.92)",
    mobilePaddingX: 16,
    mobilePaddingY: 8,
    mobileShowLogo: true,
    primaryBtn: {
      show: true,
      text: "Get Started",
      link: "#",
      bgColor: "rgb(255, 107, 0)",
      textColor: "rgb(255, 255, 255)",
      borderRadius: 100,
      paddingX: 24,
      paddingY: 14,
    },
    secondaryBtn: {
      show: true,
      text: "Learn More",
      link: "#",
      textColor: "rgb(22, 22, 22)",
      borderColor: "rgb(110, 110, 110)",
      borderRadius: 100,
      paddingX: 24,
      paddingY: 14,
    },
  },
  dock: {
    color: "rgba(0, 0, 0, 0.08)",
    enabled: true,
    paddingX: 12,
    paddingY: 8,
    radius: 100,
  },
};
