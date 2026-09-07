import { Instrument_Sans, Instrument_Serif } from "next/font/google";

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-hero-instrument-serif",
});

export const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hero-instrument-sans",
});

/** Editorial hero typography — Instrument Serif + Instrument Sans */
export const heroFontClassName = [
  instrumentSerif.variable,
  instrumentSans.variable,
].join(" ");

const sans =
  "var(--font-hero-instrument-sans), var(--font-inter), ui-sans-serif, system-ui, sans-serif";

export const heroEditorialTypography = {
  headline: {
    fontFamily: "var(--font-hero-instrument-serif), Georgia, serif",
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
