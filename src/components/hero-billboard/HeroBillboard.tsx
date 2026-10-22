"use client";

import { useTheme } from "@/components/ThemeController";
import { motion } from "framer-motion";
import { assetUrl } from "@/lib/cdnAssets";
import "./hero-billboard.css";

/** Juspay logo recoloured all-white so the blue mark shows on the blue board. Set to null to fall back to type. */
const JUSPAY_LOGO: string | null = assetUrl("about/brands/juspay-logo-white.svg");

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
              <div className="hero-billboard__artwork hero-billboard__artwork--juspay">
                <span className="hero-billboard__hello">Hi Team</span>
                {JUSPAY_LOGO ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="hero-billboard__juspay-logo" src={JUSPAY_LOGO} alt="Juspay" draggable={false} />
                ) : (
                  <span className="hero-billboard__juspay-wordmark">juspay</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
