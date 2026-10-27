import localFont from "next/font/local";

// Self-hosted (src/fonts) so builds never fetch from Google Fonts; Latin subset, variable weight.

export const instrumentSans = localFont({
  src: "../fonts/instrument-sans.woff2",
  weight: "400 700",
  variable: "--font-hero-instrument-sans",
  display: "swap",
});

/** Xhulia project-card voice — Geist only (strip experiment) */
export const geist = localFont({
  src: "../fonts/geist.woff2",
  weight: "100 900",
  variable: "--font-geist",
  display: "swap",
});

export const playfairDisplay = localFont({
  src: "../fonts/playfair-display.woff2",
  weight: "400 900",
  variable: "--font-playfair",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

/** Editorial display + Instrument Sans body */
export const heroFontClassName = [
  geist.variable,
  instrumentSans.variable,
  playfairDisplay.variable,
].join(" ");

export const stripFontClassName = [geist.variable, playfairDisplay.variable].join(
  " ",
);

const editorial =
  'var(--font-playfair), Georgia, "Times New Roman", serif';

const sans =
  "var(--font-hero-instrument-sans), var(--font-inter), ui-sans-serif, system-ui, sans-serif";

export const heroEditorialTypography = {
  headline: {
    fontFamily: editorial,
    fontWeight: 400,
    letterSpacing: "-0.02em",
    lineHeight: 1.08,
  },
  body: {
    fontFamily: sans,
    fontWeight: 400,
    letterSpacing: "-0.01em",
    lineHeight: 1.65,
  },
  badge: {
    fontFamily: sans,
    fontWeight: 500,
    letterSpacing: "0.12em",
  },
} as const;
