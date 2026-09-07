"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yRange?: number;
  xRange?: number;
}

export default function FloatingCard({
  children,
  className = "",
  delay = 0,
  duration = 6,
  yRange = 10,
  xRange = 4,
}: FloatingCardProps) {
  return (
    <motion.div
      className={`absolute z-20 ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{
        opacity: 1,
        y: [0, -yRange, 0],
        x: [0, xRange, 0],
      }}
      transition={{
        opacity: { duration: 0.6, delay: delay + 0.4, ease: [0.22, 1, 0.36, 1] },
        y: {
          duration,
          delay,
          repeat: Infinity,
          ease: "easeInOut",
        },
        x: {
          duration: duration * 1.15,
          delay: delay + 0.3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      data-cursor="label"
    >
      <div className="theme-transition rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] px-4 py-3 shadow-[0_8px_32px_var(--shadow-soft)] backdrop-blur-md">
        {children}
      </div>
    </motion.div>
  );
}
