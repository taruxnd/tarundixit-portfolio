import { Geist, Instrument_Sans } from "next/font/google";

export const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hero-instrument-sans",
});

/** Xhulia project-card voice — Geist only (strip experiment) */
export const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist",
});

/** Editorial display + Instrument Sans body */
export const heroFontClassName = [geist.variable, instrumentSans.variable].join(
  " ",
);

export const stripFontClassName = geist.variable;

const editorial =
  'var(--font-hero-instrument-serif), Georgia, "Times New Roman", serif';

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
