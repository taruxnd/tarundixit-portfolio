"use client";

import { useTheme } from "@/components/ThemeController";
import { assetUrl } from "@/lib/cdnAssets";
import { motion } from "framer-motion";
import Image from "next/image";
import "./hero-billboard.css";

export default function HeroBillboard() {
  const { reducedMotion } = useTheme();

  return (
    <div className="hero-billboard" aria-hidden>
      {/* Poles extend into the flower bed and fade out as they plant */}
      <div className="hero-billboard__poles">
        <span className="hero-billboard__pole" />
        <span className="hero-billboard__pole" />
      </div>

      <motion.div
        className="hero-billboard__entrance"
        initial={reducedMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="hero-billboard__rig">
          <div className="hero-billboard__lights">
            <span className="hero-billboard__light">
              <span className="hero-billboard__light-arm" />
              <span className="hero-billboard__light-head" />
            </span>
            <span className="hero-billboard__light">
              <span className="hero-billboard__light-arm" />
              <span className="hero-billboard__light-head" />
            </span>
          </div>

          <div className="hero-billboard__board">
            <div className="hero-billboard__frame">
              <div className="hero-billboard__artwork">
                <Image
                  src={assetUrl("profile/life-lately-samvaad.jpg")}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1280px) 200px, 250px"
                  className="hero-billboard__photo"
                />
                <div className="hero-billboard__grade" />
                <div className="hero-billboard__caption">
                  <span className="hero-billboard__label">life lately</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
