"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const WORDS = [
  "engineers.",
  "builds.",
  "prototypes.",
  "ships.",
  "experiments.",
] as const;

const INTERVAL_MS = 1900;
const EASE = [0.22, 1, 0.36, 1] as const;

/** Longest word reserves width so the headline never jumps. */
const SIZER_WORD = WORDS.reduce((a, b) => (a.length >= b.length ? a : b));

export default function HeroRotatingWord() {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % WORDS.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  const word = WORDS[index];

  return (
    <em className="hero-rotating-word theme-transition italic text-[var(--text-secondary)]">
      <span className="hero-rotating-word__sizer" aria-hidden>
        {SIZER_WORD}
      </span>
      <span className="hero-rotating-word__viewport" aria-live="polite">
        {reducedMotion ? (
          <span className="hero-rotating-word__item">{WORDS[0]}</span>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={word}
              className="hero-rotating-word__item"
              initial={{ y: "0.35em", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-0.3em", opacity: 0 }}
              transition={{ duration: 0.48, ease: EASE }}
            >
              {word}
            </motion.span>
          </AnimatePresence>
        )}
      </span>
    </em>
  );
}
