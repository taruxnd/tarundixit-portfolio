"use client";

import { AnimatePresence, motion } from "framer-motion";

interface LampHintProps {
  isLampOn: boolean;
  reducedMotion: boolean;
}

export default function LampHint({ reducedMotion }: LampHintProps) {
  const label = "pull the chord";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={label}
        className="lamp-hint"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: reducedMotion ? 0.2 : 0.75,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <svg
          className="lamp-hint__arrow"
          viewBox="0 0 72 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M4 38 C 17 31, 26 19, 40 13 S 56 8, 60.5 6.8"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M60.5 6.8 L55.4 10.2 L56.6 5.4 Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0.35"
            strokeLinejoin="round"
          />
        </svg>
        <p className="lamp-hint__text">{label}</p>
      </motion.div>
    </AnimatePresence>
  );
}
