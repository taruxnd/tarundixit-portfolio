"use client";

import { useTheme } from "@/components/ThemeController";
import { motion } from "framer-motion";
import Image from "next/image";
import "./hero-billboard.css";

export default function HeroBillboard() {
  const { reducedMotion } = useTheme();

  return (
    <div className="hero-billboard" aria-hidden>
      <motion.div
        className="hero-billboard__entrance"
        initial={reducedMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="hero-billboard__rig">
          <div className="hero-billboard__posts">
            <span className="hero-billboard__post hero-billboard__post--left" />
            <span className="hero-billboard__post hero-billboard__post--right" />
          </div>

          <div className="hero-billboard__board">
            <div className="hero-billboard__frame">
              <div className="hero-billboard__artwork">
                <Image
                  src="/profile/life-lately-samvaad.jpg"
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1280px) 180px, 220px"
                  className="hero-billboard__photo"
                />
                <div className="hero-billboard__grade" />
                <div className="hero-billboard__caption">
                  <span className="hero-billboard__label">life lately</span>
                </div>
              </div>
            </div>
            <div className="hero-billboard__ledge" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
