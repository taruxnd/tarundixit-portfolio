"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
} from "react";
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
  const rootRef = useRef<HTMLDivElement>(null);
  const [loadProps, setLoadProps] = useState(false);
  const [Building, setBuilding] = useState<ComponentType | null>(null);
  const [Office, setOffice] = useState<ComponentType | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setLoadProps(true);
        io.disconnect();
      },
      { rootMargin: "200px 0px", threshold: 0.01 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!loadProps) return;
    let cancelled = false;
    const run = () => {
      void Promise.all([
        import("./DioramaBuilding"),
        import("./DioramaOffice"),
      ]).then(([b, o]) => {
        if (cancelled) return;
        setBuilding(() => b.default);
        setOffice(() => o.default);
      });
    };

    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(run, { timeout: 900 });
    } else {
      timeoutId = setTimeout(run, 120);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [loadProps]);

  return (
    <div
      ref={rootRef}
      className="diorama-road"
      data-about-diorama-road
    >
      <div className="diorama-road__shadow" aria-hidden />

      <div className="diorama-road__scene">
        <div className="diorama-road__building diorama-road__building--start" aria-hidden>
          {Building ? <Building /> : null}
        </div>

        <div className="diorama-road__building diorama-road__building--end">
          <p className="diorama-road__tip">
            This is where I wanna be one day
            <span className="diorama-road__tip-arrow" aria-hidden />
          </p>
          <div className="diorama-road__building-canvas-wrap" aria-hidden>
            {Office ? <Office /> : null}
          </div>
        </div>

        <div className="diorama-road__lights" aria-hidden>
          {LAMPS.map((left) => (
            <StreetLamp key={left} left={left} />
          ))}
        </div>

        <div className="diorama-road__traffic" aria-hidden>
          {CARS.map((car) => (
            <ToyCar
              key={car.id}
              kind={car.kind}
              delay={car.delay}
              duration={car.duration}
            />
          ))}
        </div>

        <div className="diorama-road__slab" aria-hidden>
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
