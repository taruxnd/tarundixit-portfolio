"use client";

import LiquidGlass from "@/components/navbar/LiquidGlass";
import { heroEditorialTypography } from "@/lib/heroFonts";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

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

/** Greeting + editorial statement hero, inspired by a simple portrait intro. */
export default function HeroCopyClassic() {
  return (
    <motion.div
      className="hero-grid__copy flex min-w-0 flex-col"
      initial="hidden"
      animate="visible"
    >
      <motion.p
        variants={fadeUp}
        custom={0}
        className="hero-intro theme-transition"
        style={{ fontFamily: typography.body.fontFamily }}
      >
        <span className="hero-intro__text" lang="hi">
          नमस्ते
        </span>
        <span className="hero-intro__avatar">
          <Image
            src="/profile/tarun-avatar.jpg"
            alt=""
            width={256}
            height={256}
            sizes="(max-width: 380px) 32px, (min-width: 1600px) 40px, 36px"
            quality={95}
            className="hero-intro__avatar-img"
            priority
          />
        </span>
        <span className="hero-intro__text">
          I&apos;m <span className="hero-intro__name">Tarun Dixit</span>
        </span>
      </motion.p>

      <motion.h1
        variants={fadeUp}
        custom={1}
        className="hero-headline theme-transition text-[var(--text-primary)]"
      >
        I design products that make
        <br />
        <span className="hero-headline__sense">sense</span> and feel
        <span className="hero-headline__feel-icon" aria-hidden>
          ✨
        </span>{" "}
        right.
      </motion.h1>

      <motion.div
        variants={fadeUp}
        custom={2}
        className="hero-cta flex flex-col sm:flex-row sm:items-center"
      >
        <motion.a
          href="#work"
          data-cursor="interactive"
          className="hero-cta__button theme-transition group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]"
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
            aria-hidden
            className="hero-cta__icon transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
