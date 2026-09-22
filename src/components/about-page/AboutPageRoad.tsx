"use client";

import dynamic from "next/dynamic";
import { assetUrl } from "@/lib/cdnAssets";
import { useEffect, useRef, useState } from "react";
import "./about-page-road.css";

const AboutPageWagonR = dynamic(() => import("./AboutPageWagonR"), {
  ssr: false,
});
const AboutPageCarry = dynamic(() => import("./AboutPageCarry"), {
  ssr: false,
});

/** Start loading GLBs ~1 viewport before the road enters view. */
const LOAD_ROOT_MARGIN = "100% 0px";

const LAMPS = [
  { id: "kumba-left", side: "right" },
  { id: "kumba-right", side: "left" },
  { id: "google-left", side: "right" },
  { id: "google-right", side: "left" },
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

function StreetLamp({
  id,
  side,
}: {
  id: (typeof LAMPS)[number]["id"];
  side: (typeof LAMPS)[number]["side"];
}) {
  return (
    <div
      className={`about-road__lamp about-road__lamp--${id} about-road__lamp--${side}`}
    >
      <span className="about-road__lamp-haze" />
      <span className="about-road__lamp-pool" />
      <span className="about-road__lamp-base" />
      <span className="about-road__lamp-pole" />
      <span className="about-road__lamp-arm">
        <span className="about-road__lamp-fixture">
          <span className="about-road__lamp-bulb" />
        </span>
      </span>
    </div>
  );
}

/** Side-elevation road for the /about hero — built fresh, no shared diorama CSS. */
export default function AboutPageRoad() {
  const roadRef = useRef<HTMLDivElement>(null);
  /** Sticky: once near, keep GLB modules mounted (avoid re-downloading models). */
  const [loadCars, setLoadCars] = useState(false);
  /** Live visibility: pause WebGL + CSS drive when the road is off-screen. */
  const [animateCars, setAnimateCars] = useState(false);

  useEffect(() => {
    const road = roadRef.current;
    if (!road) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const near = entry?.isIntersecting ?? false;
        if (near) setLoadCars(true);
        setAnimateCars(near);
      },
      { root: null, rootMargin: LOAD_ROOT_MARGIN, threshold: 0 },
    );

    io.observe(road);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={roadRef} className="about-road" aria-hidden>
      <div className="about-road__scene">
        <Landmark
          className="about-road__landmark about-road__landmark--kumba"
          src={assetUrl("about/kumba-office-sm.png")}
        />
        <Landmark
          className="about-road__landmark about-road__landmark--google"
          src={assetUrl("about/google-office-sm.png")}
        />

        <div className="about-road__lights">
          {LAMPS.map((lamp) => (
            <StreetLamp key={lamp.id} id={lamp.id} side={lamp.side} />
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

        <div className="about-road__glb-lane">
          {loadCars ? (
            <>
              <AboutPageWagonR lane="a" animate={animateCars} />
              <AboutPageWagonR lane="b" animate={animateCars} />
              <AboutPageCarry animate={animateCars} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
