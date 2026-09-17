"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./about-page-road.css";

const LAMPS = [18, 50, 82] as const;

const CARS = [
  { id: "sedan", kind: "sedan", delay: "-2s", duration: "28s" },
  { id: "van", kind: "van", delay: "-11s", duration: "34s" },
  { id: "coupe", kind: "coupe", delay: "-19s", duration: "22s" },
] as const;

function Landmark({
  src,
  className,
}: {
  src: string;
  className: string;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setReady(true);
  }, []);

  return (
    <div className={className} role="presentation">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        className="about-road__landmark-img"
        src={src}
        alt=""
        width={640}
        height={426}
        decoding="async"
        draggable={false}
        style={{ opacity: ready ? 1 : 0 }}
        onLoad={() => setReady(true)}
      />
    </div>
  );
}

function StreetLamp({ left }: { left: number }) {
  return (
    <div className="about-road__lamp" style={{ left: `${left}%` }}>
      <span className="about-road__lamp-pole" />
      <span className="about-road__lamp-arm" />
      <span className="about-road__lamp-bulb" />
      <span className="about-road__lamp-flare" />
      <span className="about-road__lamp-pool" />
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
      className={`about-road__car about-road__car--${kind}`}
      style={
        {
          ["--car-delay"]: delay,
          ["--car-duration"]: duration,
        } as CSSProperties
      }
    >
      <span className="about-road__car-shadow" />
      <span className="about-road__car-body">
        <span className="about-road__car-cabin" />
        <span className="about-road__car-window" />
        <span className="about-road__car-window about-road__car-window--rear" />
        <span className="about-road__car-detail" />
        <span className="about-road__car-headlight" />
        <span className="about-road__car-taillight" />
        <span className="about-road__car-beam" />
      </span>
      <span className="about-road__car-wheel about-road__car-wheel--front" />
      <span className="about-road__car-wheel about-road__car-wheel--back" />
    </div>
  );
}

/** Side-elevation road for the /about hero — built fresh, no shared diorama CSS. */
export default function AboutPageRoad() {
  return (
    <div className="about-road" aria-hidden>
      <div className="about-road__scene">
        <Landmark
          className="about-road__landmark about-road__landmark--kumba"
          src="/about/kumba-office-sm.png"
        />
        <Landmark
          className="about-road__landmark about-road__landmark--google"
          src="/about/google-office-sm.png"
        />

        <div className="about-road__lights">
          {LAMPS.map((left) => (
            <StreetLamp key={left} left={left} />
          ))}
        </div>

        <div className="about-road__traffic">
          {CARS.map((car) => (
            <ToyCar
              key={car.id}
              kind={car.kind}
              delay={car.delay}
              duration={car.duration}
            />
          ))}
        </div>

        <div className="about-road__slab">
          <div className="about-road__curb about-road__curb--top" />
          <div className="about-road__asphalt">
            <div className="about-road__dashes" />
          </div>
          <div className="about-road__curb about-road__curb--bottom" />
          <div className="about-road__thickness" />
        </div>
      </div>
    </div>
  );
}
