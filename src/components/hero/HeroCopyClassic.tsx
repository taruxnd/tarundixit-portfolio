"use client";

import HeroRotatingWord from "@/components/hero/HeroRotatingWord";
import LiquidGlass from "@/components/navbar/LiquidGlass";
import { heroEditorialTypography } from "@/lib/heroFonts";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay: 0.12 + i * 0.09,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const typography = heroEditorialTypography;

/** Original centered headline + CTA hero copy. */
export default function HeroCopyClassic() {
  return (
    <motion.div
      className="hero-grid__copy flex min-w-0 flex-col"
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        variants={fadeUp}
        custom={0}
        className="hero-headline theme-transition text-[clamp(1.95rem,4vw+0.5rem,3.55rem)] leading-[1.08] text-[var(--text-primary)]"
        style={typography.headline}
      >
        <span className="block">I&apos;m Tarun Dixit,</span>

        <span className="hero-headline__desktop-only block">
          a <span data-hero-role>product designer</span> who
        </span>
        <span className="hero-headline__desktop-only block">
          <HeroRotatingWord />
        </span>

        <span className="hero-headline__mobile-only block">
          a <span data-hero-role>product designer</span> who{" "}
          <HeroRotatingWord />
        </span>
      </motion.h1>

      <motion.div
        variants={fadeUp}
        custom={1}
        className="hero-cta flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <motion.a
          href="#work"
          data-cursor="interactive"
          className="hero-cta__button theme-transition group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--btn-primary-bg)] px-6 py-3 text-sm font-medium text-[var(--btn-primary-text)]"
          style={{ fontFamily: typography.body.fontFamily }}
          whileHover={{
            y: -2,
            boxShadow: "0 10px 32px rgba(0,0,0,0.16)",
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          View my work
          <ArrowUpRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </motion.a>

        <motion.div
          className="hero-cta__button hero-cta__resume"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <LiquidGlass className="hero-cta__resume-glass">
            <a
              href="#resume"
              data-cursor="interactive"
              className="hero-cta__resume-link theme-transition"
              style={{ fontFamily: typography.body.fontFamily }}
            >
              Resume
            </a>
          </LiquidGlass>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
