"use client";

import { useMemo, type CSSProperties } from "react";
import "./light-sky.css";

/** Published Framer instance props (loyal-beautifully) — ocean omitted */
const DEFAULTS = {
  skyColor: "rgb(186, 230, 253)",
  horizonGlowColor: "#e0f2fe",
  horizonColor: "rgb(125, 211, 252)",
  sunColor: "rgb(255, 255, 255)",
  sunGlareOpacity: 0.5,
  sunPositionX: 50,
  sunPositionY: 40,
  cloudOpacity: 0.7,
  cloudAmount: 10,
  cloudSpeed: 1,
  cloudDirection: "right" as const,
};

interface LightSkyBackgroundProps {
  className?: string;
  skyColor?: string;
  horizonGlowColor?: string;
  horizonColor?: string;
  sunColor?: string;
  sunGlareOpacity?: number;
  sunPositionX?: number;
  sunPositionY?: number;
  cloudOpacity?: number;
  cloudAmount?: number;
  cloudSpeed?: number;
  cloudDirection?: "left" | "right";
  reducedMotion?: boolean;
}

function parseColor(input: string): { r: number; g: number; b: number } {
  const rgb = input.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i,
  );
  if (rgb) {
    return {
      r: Math.round(Number(rgb[1])),
      g: Math.round(Number(rgb[2])),
      b: Math.round(Number(rgb[3])),
    };
  }
  const hex = input.replace("#", "").trim();
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  return {
    r: parseInt(full.slice(0, 2), 16) || 255,
    g: parseInt(full.slice(2, 4), 16) || 255,
    b: parseInt(full.slice(4, 6), 16) || 255,
  };
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
  return Array.from({ length: amount }, (_, index) => {
    const seed = index * 123.45;
    const tier = Math.floor(seed % 3);
    const width =
      tier === 2
        ? 120 + (seed % 80)
        : tier === 1
          ? 80 + (seed % 50)
          : 40 + (seed % 30);
    const height =
      tier === 2
        ? 40 + (seed % 25)
        : tier === 1
          ? 30 + (seed % 15)
          : 15 + (seed % 10);
    const top = 2 + (seed % 35);
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

/**
 * Faithful extract of the Framer sky component (sun, glare, clouds, sky wash).
 * Ocean / waves / reflections / horizon line are intentionally omitted.
 */
export default function LightSkyBackground({
  className = "",
  skyColor = DEFAULTS.skyColor,
  horizonGlowColor = DEFAULTS.horizonGlowColor,
  horizonColor = DEFAULTS.horizonColor,
  sunColor = DEFAULTS.sunColor,
  sunGlareOpacity = DEFAULTS.sunGlareOpacity,
  sunPositionX = DEFAULTS.sunPositionX,
  sunPositionY = DEFAULTS.sunPositionY,
  cloudOpacity = DEFAULTS.cloudOpacity,
  cloudAmount = DEFAULTS.cloudAmount,
  cloudSpeed = DEFAULTS.cloudSpeed,
  cloudDirection = DEFAULTS.cloudDirection,
  reducedMotion = false,
}: LightSkyBackgroundProps) {
  const sunRgb = useMemo(() => {
    const { r, g, b } = parseColor(sunColor);
    return `${r}, ${g}, ${b}`;
  }, [sunColor]);

  const clouds = useMemo(
    () => buildClouds(cloudAmount, cloudOpacity, cloudSpeed),
    [cloudAmount, cloudOpacity, cloudSpeed],
  );

  // Original stops used ocean at 50–100%. Without ocean, extend the sky wash.
  const skyGradient = `linear-gradient(to bottom, ${skyColor} 0%, ${horizonGlowColor} 40%, ${horizonColor} 70%, ${horizonGlowColor} 100%)`;

  const moveName =
    cloudDirection === "right" ? "cloudMoveRight" : "cloudMoveLeft";

  return (
    <div
      className={`light-sky ${className}`.trim()}
      style={{ background: skyGradient }}
      aria-hidden
    >
      {/* Sun glare */}
      <div
        className="light-sky__glare"
        style={{
          background: `radial-gradient(circle at ${sunPositionX}% ${sunPositionY}%, rgba(${sunRgb}, ${sunGlareOpacity}) 0%, rgba(${sunRgb}, 0) 50%)`,
        }}
      />

      {/* Sun disc */}
      <div
        className="light-sky__sun"
        style={{
          left: `${sunPositionX}%`,
          top: `${sunPositionY}%`,
          background: sunColor,
          boxShadow: `0 0 40px 10px rgba(${sunRgb}, ${sunGlareOpacity})`,
        }}
      />

      {/* Clouds */}
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
    </div>
  );
}
