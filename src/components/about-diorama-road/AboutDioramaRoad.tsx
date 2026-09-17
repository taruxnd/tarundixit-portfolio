"use client";

import type { CSSProperties } from "react";
import "./about-diorama-road.css";

const LAMPS = [18, 50, 82];

const CARS = [
  { id: "sedan", kind: "sedan", delay: "-2s", duration: "28s" },
  { id: "van", kind: "van", delay: "-11s", duration: "34s" },
  { id: "coupe", kind: "coupe", delay: "-19s", duration: "22s" },
] as const;

function StreetLamp({ left }: { left: number }) {
  return (
    <div className="diorama-road__lamp" style={{ left: `${left}%` }}>
      <span className="diorama-road__lamp-pole" />
      <span className="diorama-road__lamp-arm" />
      <span className="diorama-road__lamp-bulb" />
      <span className="diorama-road__lamp-flare" />
      <span className="diorama-road__lamp-pool" />
    </div>
  );
}

function ToyCar({
  kind,
  delay,
  duration,
}: {
  kind: (typeof CARS)[number]["kind"];
  delay: string;
  duration: string;
}) {
  return (
    <div
      className={`diorama-road__car diorama-road__car--${kind}`}
      style={
        {
          ["--car-delay"]: delay,
          ["--car-duration"]: duration,
        } as CSSProperties
      }
    >
      <span className="diorama-road__car-shadow" />
      <span className="diorama-road__car-body">
        <span className="diorama-road__car-cabin" />
        <span className="diorama-road__car-window" />
        <span className="diorama-road__car-window diorama-road__car-window--rear" />
        <span className="diorama-road__car-detail" />
        <span className="diorama-road__car-headlight" />
        <span className="diorama-road__car-taillight" />
        <span className="diorama-road__car-beam" />
        <span className="diorama-road__car-glow" />
      </span>
      <span className="diorama-road__car-wheel diorama-road__car-wheel--front" />
      <span className="diorama-road__car-wheel diorama-road__car-wheel--back" />
    </div>
  );
}

/**
 * Pure side-elevation diorama road — orthographic, no tilt.
 */
export default function AboutDioramaRoad() {
  return (
    <div className="diorama-road" aria-hidden data-about-diorama-road>
      <div className="diorama-road__shadow" />

      <div className="diorama-road__scene">
        {/* Landmarks — Kumba (start) · Google (further along) */}
        <div
          className="diorama-road__landmark diorama-road__landmark--kumba"
          role="presentation"
        />
        <div
          className="diorama-road__landmark diorama-road__landmark--google"
          role="presentation"
        />

        <div className="diorama-road__lights">
          {LAMPS.map((left) => (
            <StreetLamp key={left} left={left} />
          ))}
        </div>

        <div className="diorama-road__traffic">
          {CARS.map((car) => (
            <ToyCar
              key={car.id}
              kind={car.kind}
              delay={car.delay}
              duration={car.duration}
            />
          ))}
        </div>

        <div className="diorama-road__slab">
          <div className="diorama-road__curb diorama-road__curb--top" />
          <div className="diorama-road__asphalt">
            <div className="diorama-road__dashes" />
          </div>
          <div className="diorama-road__curb diorama-road__curb--bottom" />
          <div className="diorama-road__thickness" />
        </div>
      </div>
    </div>
  );
}
