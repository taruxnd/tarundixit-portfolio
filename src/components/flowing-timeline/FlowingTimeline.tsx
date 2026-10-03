"use client";

/**
 * Native rebuild of https://flowingtimeline.framer.website/
 * Camera centers the active node; card sits under it. Dots + arrows only.
 */
import { geist, stripFontClassName } from "@/lib/heroFonts";
import { contentContainerClassName } from "@/lib/sectionLayout";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { timelineMilestones } from "./data";
import "./flowing-timeline.css";

/** Measured from the Framer demo */
const SPACING = 190;
const PAD_X = 48;
const LINE_Y = 72;
const DROP_PX = 90;
const CARD_W = 420;

type Point = { x: number; y: number };

function buildPoints(count: number): Point[] {
  return Array.from({ length: count }, (_, i) => ({
    x: PAD_X + i * SPACING,
    y: LINE_Y,
  }));
}

function buildWavePath(points: Point[]) {
  if (points.length === 0) return "";
  if (points.length === 1) {
    return `M ${points[0]!.x.toFixed(1)} ${points[0]!.y.toFixed(1)}`;
  }
  const first = points[0]!;
  const last = points[points.length - 1]!;
  return `M ${first.x.toFixed(1)} ${first.y.toFixed(1)} L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
}

/** Sample the SVG path up to the active node for the progress stroke. */
function pathUpTo(
  fullPath: SVGPathElement | null,
  points: Point[],
  index: number,
): string {
  if (!fullPath || points.length === 0) return "";
  if (index <= 0) {
    return `M ${points[0]!.x.toFixed(1)} ${points[0]!.y.toFixed(1)}`;
  }
  const total = fullPath.getTotalLength();
  if (!total) return "";
  const t = index / (points.length - 1);
  const endLen = t * total;
  const steps = Math.max(12, Math.round(endLen / 3));
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const p = fullPath.getPointAtLength((i / steps) * endLen);
    d += i === 0 ? `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}` : ` L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }
  return d;
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M15 5l-7 7 7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M9 5l7 7-7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FlowingTimeline() {
  const [active, setActive] = useState(0);
  const [stageW, setStageW] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const fullPathRef = useRef<SVGPathElement | null>(null);
  const [progressD, setProgressD] = useState("");

  const points = useMemo(
    () => buildPoints(timelineMilestones.length),
    [],
  );
  const waveD = useMemo(() => buildWavePath(points), [points]);
  const worldW = PAD_X * 2 + (timelineMilestones.length - 1) * SPACING;
  const worldH = Math.max(...points.map((p) => p.y)) + 28;

  const milestone = timelineMilestones[active] ?? timelineMilestones[0]!;
  const activePoint = points[active] ?? points[0]!;
  const total = timelineMilestones.length;

  // Center active node in the stage (Framer camera)
  const cameraX = stageW > 0 ? stageW / 2 - activePoint.x : 0;

  const goTo = useCallback((index: number) => {
    const next = Math.max(0, Math.min(timelineMilestones.length - 1, index));
    setActive(next);
  }, []);

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const apply = (width: number) => {
      setStageW(width);
      setCameraReady(true);
    };
    const ro = new ResizeObserver(([entry]) => {
      apply(entry.contentRect.width);
    });
    ro.observe(el);
    apply(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    setProgressD(pathUpTo(fullPathRef.current, points, active));
  }, [active, points, waveD, stageW]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") goTo(active + 1);
      if (event.key === "ArrowLeft") goTo(active - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goTo]);

  const cardTop = activePoint.y + DROP_PX;

  return (
    <section
      className={`flowing-timeline theme-transition ${stripFontClassName}`}
      aria-labelledby="flowing-timeline-heading"
    >
      <div className={`${contentContainerClassName} flowing-timeline__inner`}>
        <header className="flowing-timeline__header">
          <h2
            id="flowing-timeline-heading"
            className="flowing-timeline__heading"
          >
            How I got here.
          </h2>
          <p className="flowing-timeline__subline">
            A few stops from first sketches to where I am now.
          </p>
        </header>

        <div ref={stageRef} className="flowing-timeline__stage">
          {/* Moving world: path + dots */}
          <div
            className={`flowing-timeline__world${
              cameraReady ? " is-ready" : ""
            }`}
            style={
              {
                width: worldW,
                height: worldH,
                "--ft-camera-x": `${cameraX}px`,
              } as CSSProperties
            }
          >
            <svg
              className="flowing-timeline__wave"
              width={worldW}
              height={Math.ceil(worldH)}
              overflow="visible"
            >
              <path
                ref={fullPathRef}
                d={waveD}
                className="flowing-timeline__wave-base"
                fill="none"
              />
              <path
                d={progressD || `M ${points[0]!.x} ${points[0]!.y}`}
                className="flowing-timeline__wave-progress"
                fill="none"
              />
            </svg>

            {timelineMilestones.map((item, index) => {
              const p = points[index];
              if (!p) return null;
              const isActive = index === active;
              return (
                <div
                  key={item.id}
                  className="flowing-timeline__marker-wrap"
                  style={{
                    transform: `translate3d(${p.x}px, ${p.y}px, 0)`,
                  }}
                >
                  <span
                    className={`flowing-timeline__marker-year${
                      isActive ? " is-active" : ""
                    }`}
                  >
                    {item.year}
                  </span>
                  <button
                    type="button"
                    className={`flowing-timeline__marker${
                      isActive ? " is-active" : ""
                    }`}
                    aria-label={`${item.year} — ${item.title}`}
                    aria-current={isActive ? "step" : undefined}
                    onClick={() => goTo(index)}
                  >
                    <span className="flowing-timeline__marker-pin" aria-hidden>
                      <span className="flowing-timeline__marker-halo" />
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Fixed center: drop + card under the active node */}
          <div
            className="flowing-timeline__drop"
            aria-hidden
            style={{
              top: activePoint.y + 12,
              height: Math.max(0, cardTop - (activePoint.y + 12)),
            }}
          />

          <article
            className={`flowing-timeline__card ${geist.className}`}
            key={milestone.id}
            style={{
              width: CARD_W,
              top: cardTop,
            }}
          >
            <div className="flowing-timeline__media">
              <div className="flowing-timeline__media-scale">
                <Image
                  src={milestone.imageSrc}
                  alt={milestone.imageAlt}
                  fill
                  className="flowing-timeline__image"
                  sizes="402px"
                  priority={active === 0}
                />
              </div>
              <span className="flowing-timeline__badge">{milestone.tag}</span>
              <span className="flowing-timeline__media-year" aria-hidden>
                {milestone.year}
              </span>
            </div>

              <div className="flowing-timeline__copy">
              <span className="flowing-timeline__accent" aria-hidden />
              <h3 className="flowing-timeline__title">{milestone.title}</h3>
              <p className="flowing-timeline__desc">{milestone.description}</p>
            </div>
          </article>

          <div className="flowing-timeline__controls">
            <button
              type="button"
              className="flowing-timeline__nav"
              aria-label="Previous milestone"
              disabled={active === 0}
              onClick={() => goTo(active - 1)}
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              className="flowing-timeline__nav"
              aria-label="Next milestone"
              disabled={active === total - 1}
              onClick={() => goTo(active + 1)}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
