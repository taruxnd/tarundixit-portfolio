"use client";

import { launchResumePlane } from "@/components/resume/launchResumePlane";
import LiquidGlass from "@/components/navbar/LiquidGlass";
import { assetUrl } from "@/lib/cdnAssets";
import { heroEditorialTypography } from "@/lib/heroFonts";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import FigmaStickers from "@/components/figma-stickers/FigmaStickers";

const AVATAR_IMAGE = assetUrl("profile/tarun-avatar.jpg");

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
      className="hero-grid__copy hero-grid__copy--stickers flex min-w-0 flex-col"
      initial="hidden"
      animate="visible"
    >
      <motion.p
        variants={fadeUp}
        custom={0}
        className="hero-intro theme-transition"
        style={{
          fontFamily:
            "var(--font-geist), ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <span className="hero-intro__text" lang="hi">
          नमस्ते
        </span>
        <span className="hero-intro__avatar">
          <Image
            src={AVATAR_IMAGE}
            alt=""
            width={256}
            height={256}
            sizes="72px"
            quality={75}
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
        <span className="hero-headline__line">I untangle problems into products.</span>{" "}
        <span className="hero-headline__line">
          The{" "}
          {/* The code keycap stands in for the word. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hero-headline__sticker" src="/stickers/code-keycap.svg" alt="code" draggable={false} />{" "}
          is just fun.
        </span>
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
              href="/resume-sample.pdf"
              download="Tarun-Dixit-Sample-Resume.pdf"
              onClick={launchResumePlane}
              data-cursor="interactive"
              className="hero-cta__resume-link theme-transition"
              style={{ fontFamily: typography.body.fontFamily }}
            >
              Resume
            </a>
          </LiquidGlass>
        </motion.div>
      </motion.div>
      <FigmaStickers />
    </motion.div>
  );
}
