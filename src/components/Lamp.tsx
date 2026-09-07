"use client";

import PendantLampSvg from "@/components/PendantLampSvg";
import PullCordBridge from "@/components/PullCordBridge";
import { useLampInteraction } from "@/components/useLampInteraction";
import { motion } from "framer-motion";
import "./lamp.css";

export default function Lamp() {
  const {
    isLampOn,
    theme,
    hydrated,
    reducedMotion,
    pendulum,
    ambientSuspended,
    pulling,
    cordPull,
    bulbOpacity,
    lampRootRef,
    handlePullPointerDown,
    handlePullPointerMove,
    handlePullPointerUp,
    handlePullKeyToggle,
  } = useLampInteraction();

  const idlePaused = ambientSuspended || pulling;

  if (!hydrated) return null;

  return (
    <>
      <div
        ref={lampRootRef}
        className="hanging-lamp hanging-lamp--primary"
        data-lamp-on={isLampOn ? "true" : "false"}
      >
      <motion.div
        className="hanging-lamp__ambient"
        aria-hidden
        animate={{
          opacity: isLampOn ? 1 : 0,
          scale: isLampOn ? 1 : 0.88,
        }}
        transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
        style={{
          animationPlayState: idlePaused ? "paused" : "running",
        }}
      />

      <motion.div
        className="hanging-lamp__idle-sway"
        aria-hidden
        animate={
          reducedMotion || idlePaused
            ? { rotate: 0 }
            : { rotate: [0, 2.4, 0.35, -2, 0] }
        }
        transition={
          reducedMotion || idlePaused
            ? { duration: 0.35, ease: "easeOut" }
            : {
                duration: 8.5,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
        style={{ transformOrigin: "50% 0%" }}
      >
        <motion.div
          className="hanging-lamp__pendulum"
          animate={pendulum}
          initial={{ rotate: 0 }}
          style={{ transformOrigin: "50% 0%" }}
        >
        <PullCordBridge
          cordPull={cordPull}
          render={(pull) => (
            <PendantLampSvg
              on={isLampOn}
              dark={theme === "dark"}
              cordPull={pull}
              bulbOpacity={bulbOpacity}
              onPullPointerDown={handlePullPointerDown}
              onPullPointerMove={handlePullPointerMove}
              onPullPointerUp={handlePullPointerUp}
              onPullKeyToggle={handlePullKeyToggle}
            />
          )}
        />
      </motion.div>
      </motion.div>

        <span className="sr-only">
          {isLampOn
            ? "Lamp is on. Light mode active. Pull the cord to turn off."
            : "Lamp is off. Dark mode active. Pull the cord to turn on."}
        </span>
      </div>
    </>
  );
}
