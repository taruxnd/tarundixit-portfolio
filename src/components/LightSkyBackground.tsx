"use client";

import { useMemo, type CSSProperties } from "react";
import "./light-sky.css";

/** Soft pale day sky — desaturated powder blue (ocean omitted) */
const DEFAULTS = {
  skyColor: "#ffffff",
  horizonGlowColor: "#ffffff",
  horizonColor: "#ffffff",
  cloudOpacity: 0.85,
  cloudAmount: 10,
  cloudSpeed: 0.55,
  cloudDirection: "right" as const,
};

interface LightSkyBackgroundProps {
  className?: string;
  skyColor?: string;
  horizonGlowColor?: string;
  horizonColor?: string;
  cloudOpacity?: number;
  cloudAmount?: number;
  cloudSpeed?: number;
  cloudDirection?: "left" | "right";
  reducedMotion?: boolean;
  /** Page wash only — clouds live in the hero */
  showClouds?: boolean;
  /** Clouds-only layer (transparent) for the hero fold */
  cloudsOnly?: boolean;
}

type CloudSpec = {
  top: number;
  width: number;
  height: number;
  opacity: number;
  duration: number;
  delay: number;
  zIndex: number;
  puffs: { left: number; top: number; size: number; blur: number }[];
};

function buildClouds(
  amount: number,
  opacity: number,
  speed: number,
): CloudSpec[] {
  const scale = 0.68;
  return Array.from({ length: amount }, (_, index) => {
    const seed = index * 123.45;
    const tier = Math.floor(seed % 3);
    const width =
      (tier === 2
        ? 120 + (seed % 80)
        : tier === 1
          ? 80 + (seed % 50)
          : 40 + (seed % 30)) * scale;
    const height =
      (tier === 2
        ? 40 + (seed % 25)
        : tier === 1
          ? 30 + (seed % 15)
          : 15 + (seed % 10)) * scale;
    // Keep clouds in the upper band of the hero
    const top = 4 + (seed % 28);
    const cloudOpacity = opacity * (0.8 + (seed % 20) / 100);
    const cycle = 60 + (seed % 60);
    const duration = cycle / Math.max(0.1, speed);
    const delay = -((seed * 13.37) % cycle) / Math.max(0.1, speed);
    const puffCount = 4 + Math.floor(seed % 4);
    const puffs = Array.from({ length: puffCount }, (_, puffIndex) => {
      const puffSeed = seed + puffIndex * 13.7;
      const size = height * (0.8 + (puffSeed % 0.6));
      return {
        left: (puffIndex / puffCount) * width - size * 0.2,
        top: (puffSeed % (height * 0.4)) - height * 0.2,
        size,
        blur: 3 + (puffSeed % 5),
      };
    });

    return {
      top,
      width,
      height,
      opacity: cloudOpacity,
      duration,
      delay,
      zIndex: Math.floor(seed % 3),
      puffs,
    };
  });
}

function CloudLayer({
  clouds,
  cloudDirection,
  reducedMotion,
}: {
  clouds: CloudSpec[];
  cloudDirection: "left" | "right";
  reducedMotion: boolean;
}) {
  const moveName =
    cloudDirection === "right" ? "cloudMoveRight" : "cloudMoveLeft";

  return (
    <>
      {clouds.map((cloud, index) => {
        const style: CSSProperties = {
          top: `${cloud.top}%`,
          width: cloud.width,
          height: cloud.height,
          opacity: cloud.opacity,
          zIndex: cloud.zIndex,
        };

        if (reducedMotion) {
          style.left = `${8 + ((index * 17) % 84)}%`;
          style.transform = "translateX(-50%)";
        } else {
          style.left = cloudDirection === "right" ? "-40%" : "140%";
          style.animation = `${moveName} ${cloud.duration}s linear infinite`;
          style.animationDelay = `${cloud.delay}s`;
          style.willChange = "left";
        }

        return (
          <div key={index} className="light-sky__cloud" style={style}>
            <div className="light-sky__cloud-base" />
            {cloud.puffs.map((puff, puffIndex) => (
              <div
                key={puffIndex}
                className="light-sky__cloud-puff"
                style={{
                  left: puff.left,
                  top: puff.top,
                  width: puff.size,
                  height: puff.size,
                  filter: `blur(${puff.blur}px)`,
                }}
              />
            ))}
          </div>
        );
      })}
    </>
  );
}

/**
 * Day sky wash (page) and/or clouds (hero-only via cloudsOnly).
 */
export default function LightSkyBackground({
  className = "",
  skyColor = DEFAULTS.skyColor,
  horizonGlowColor = DEFAULTS.horizonGlowColor,
  horizonColor = DEFAULTS.horizonColor,
  cloudOpacity = DEFAULTS.cloudOpacity,
  cloudAmount = DEFAULTS.cloudAmount,
  cloudSpeed = DEFAULTS.cloudSpeed,
  cloudDirection = DEFAULTS.cloudDirection,
  reducedMotion = false,
  showClouds = false,
  cloudsOnly = false,
}: LightSkyBackgroundProps) {
  const clouds = useMemo(
    () =>
      showClouds || cloudsOnly
        ? buildClouds(cloudAmount, cloudOpacity, cloudSpeed)
        : [],
    [showClouds, cloudsOnly, cloudAmount, cloudOpacity, cloudSpeed],
  );

  const skyGradient = `linear-gradient(to bottom, ${skyColor} 0%, ${horizonGlowColor} 45%, ${horizonColor} 78%, ${horizonGlowColor} 100%)`;

  if (cloudsOnly) {
    return (
      <div
        className={`light-sky light-sky--clouds ${className}`.trim()}
        aria-hidden
      >
        <CloudLayer
          clouds={clouds}
          cloudDirection={cloudDirection}
          reducedMotion={reducedMotion}
        />
      </div>
    );
  }

  return (
    <div
      className={`light-sky ${className}`.trim()}
      style={{ background: skyGradient }}
      aria-hidden
    >
      {showClouds ? (
        <CloudLayer
          clouds={clouds}
          cloudDirection={cloudDirection}
          reducedMotion={reducedMotion}
        />
      ) : null}
    </div>
  );
}
