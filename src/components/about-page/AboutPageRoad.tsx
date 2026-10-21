"use client";

import dynamic from "next/dynamic";
import { assetUrl } from "@/lib/cdnAssets";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import "./about-page-road.css";
import "./road/road-game.css";
import {
  playHorn,
  playWhistle,
  unlockRoadAudio,
  type HornVoice,
} from "./road/roadAudio";
import {
  TrafficController,
  type CarEvent,
  type CarOptions,
} from "./road/trafficController";

const AboutPageWagonR = dynamic(() => import("./AboutPageWagonR"), {
  ssr: false,
});
const AboutPageCarry = dynamic(() => import("./AboutPageCarry"), {
  ssr: false,
});
const AboutPageGlbCar = dynamic(() => import("./AboutPageGlbCar"), {
  ssr: false,
});

/** Start loading GLBs ~1 viewport before the road enters view. */
const LOAD_ROOT_MARGIN = "100% 0px";

const CARS: Record<string, { name: string; voice: HornVoice; honk: string }> = {
  "kia-carens": { name: "Kia Carens", voice: "mpv", honk: "पों पों" },
  "wagonr-a": { name: "WagonR", voice: "hatch", honk: "पों पों" },
  "maruti-800": { name: "Maruti 800", voice: "hatch", honk: "पों पों" },
  carry: { name: "Suzuki Carry", voice: "van", honk: "पोंऽऽ" },
  "wagonr-b": { name: "WagonR", voice: "hatch", honk: "पों पों" },
};

/** Cars come two at a time, in this order; the Carens leads the first wave. */
const WAVE_ORDER = ["kia-carens", "wagonr-a", "maruti-800", "carry", "wagonr-b"];
/** What the constable decides when nobody answers: the Carens passes, the WagonR doesn't. */
const VERDICT: Record<string, boolean> = {
  "kia-carens": true,
  "wagonr-a": false,
  "maruti-800": true,
  carry: false,
  "wagonr-b": true,
};
/**
 * One question per car, in rotation. "Yes" is always the answer that gets
 * the barrier up. They say what Tarun believes: let AI carry the heavy
 * lifting, then get your hands back on the canvas; and taste without UX, or
 * UX without taste, is only half a design.
 */
const QUESTIONS: { q: string; pass: string; fail: string }[] = [
  {
    q: "Designer, once the flow is locked, do you still get back on the canvas and push the pixels yourself?",
    pass: "A designer with hands. Prompts don't have taste.",
    fail: "Padding by prompt isn't design. U-turn.",
  },
  {
    q: "Designer, do you explore three directions before you fall for one?",
    pass: "A designer who explores. Barrier up.",
    fail: "One idea is a guess, not a design. U-turn.",
  },
  {
    q: "Designer, does your most beautiful screen also work for the person using it?",
    pass: "Taste and UX. A whole designer. Go.",
    fail: "Pretty isn't finished, designer. U-turn.",
  },
];

/** Seconds the visitor gets before the constable decides. */
const ANSWER_SECONDS = 5;
/** Pause between one pair leaving and the next arriving. */
const WAVE_GAP_MS = 1800;

/** Phones get three cars, not five: the road is only ~400px long there. */
const COMPACT_QUERY = "(max-width: 767px)";
const COMPACT_SKIP = new Set(["wagonr-b", "carry"]);

type Post = { carId: string; phase: "ask" | "pass" | "fail"; key: number; q: number };

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

/** Booth, constable and boom barrier. Purely visual; the card is in the UI layer. */
function Checkpost({ open }: { open: boolean }) {
  return (
    <div className={`about-road__post${open ? " is-open" : ""}`}>
      <div className="about-road__booth">
        <span className="about-road__booth-roof" />
        <span className="about-road__booth-lamp" data-state={open ? "green" : "red"} />
        <span className="about-road__booth-sign">Check post</span>
        <span className="about-road__booth-window" />
        <span className="about-road__booth-door" />
      </div>
      <div className="about-road__cop">
        <span className="about-road__cop-cap" />
        <span className="about-road__cop-head" />
        <span className="about-road__cop-body" />
        <span className="about-road__cop-belt" />
        <span className="about-road__cop-legs" />
        <span className="about-road__cop-boots" />
        <span className="about-road__cop-gun" />
        <span className="about-road__cop-arm" />
      </div>
      <div className="about-road__barrier">
        <span className="about-road__barrier-post" />
        <span className="about-road__barrier-arm" />
      </div>
    </div>
  );
}

/** Horn puff above a car; removes itself. */
function puff(el: HTMLElement, text: string, angry = false) {
  const span = document.createElement("span");
  span.className = `about-road__honk${angry ? " about-road__honk--angry" : ""}`;
  span.style.setProperty("--tilt", `${(Math.random() * 16 - 8).toFixed(1)}deg`);
  span.textContent = text;
  el.appendChild(span);
  window.setTimeout(() => span.remove(), 1000);
}

/**
 * Side-elevation road for the /about hero, now a checkpost. Cars arrive in
 * pairs, stop at the barrier, and get asked the question. Answer, or let
 * the constable decide after five seconds. Pass: barrier up. Fail: U-turn.
 */
export default function AboutPageRoad() {
  const roadRef = useRef<HTMLDivElement>(null);
  const laneRef = useRef<HTMLDivElement>(null);
  const stopLineRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<TrafficController | null>(null);
  const carsRef = useRef(new Map<string, { el: HTMLElement; options: CarOptions }>());
  const speedRefs = useRef<Record<string, { current: number }>>(
    Object.fromEntries(Object.keys(CARS).map((id) => [id, { current: 1 }])),
  );
  const timersRef = useRef<number[]>([]);
  const answerTimerRef = useRef(0);
  const waveRef = useRef<{
    index: number;
    pending: Set<string>;
    queued: boolean;
    started: boolean;
  }>({
    index: 0,
    pending: new Set(),
    queued: false,
    started: false,
  });
  const compactRef = useRef(false);
  const animateRef = useRef(false);
  const postRef = useRef<Post | null>(null);
  const questionRef = useRef(0);

  /** Sticky: once near, keep GLB modules mounted (avoid re-downloading models). */
  const [loadCars, setLoadCars] = useState(false);
  /** Live visibility: pause WebGL + traffic when the road is off-screen. */
  const [animateCars, setAnimateCars] = useState(false);
  const [compact, setCompact] = useState(false);
  const [post, setPost] = useState<Post | null>(null);
  const [barrierOpen, setBarrierOpen] = useState(false);
  postRef.current = post;
  compactRef.current = compact;
  animateRef.current = animateCars;

  useEffect(() => {
    const query = window.matchMedia(COMPACT_QUERY);
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    timersRef.current.push(window.setTimeout(fn, ms));
  }, []);

  /** Send the next pair in, if the road is live, idle, and the cars exist. */
  const dispatchNext = useCallback(() => {
    const controller = controllerRef.current;
    const wave = waveRef.current;
    if (!controller || !animateRef.current || wave.pending.size > 0 || wave.queued) return;
    const expected = WAVE_ORDER.filter((id) => !(compactRef.current && COMPACT_SKIP.has(id)));
    if (expected.length === 0) return;
    const a = expected[(wave.index * 2) % expected.length];
    const b = expected[(wave.index * 2 + 1) % expected.length];
    const pair = a === b ? [a] : [a, b];
    // Only this pair has to be mounted, not the whole fleet, so the first
    // cars don't wait on the slowest model to arrive.
    if (!pair.every((id) => carsRef.current.has(id))) return;
    const lead = carsRef.current.get(a)?.el.offsetWidth ?? 80;
    const gap = lead * 1.6 + 40;
    // The first pair starts already on the road, so the section is never
    // empty when you scroll to it. Later pairs drive in from the left.
    if (wave.index === 0 && !wave.started) {
      wave.started = true;
      controller.dispatch(pair, gap, 0.42);
    } else {
      controller.dispatch(pair, gap);
    }
    // The index only advances once the pair has cleared the road, so a
    // dev-mode strict remount re-sends the same pair instead of skipping it.
    wave.pending = new Set(pair);
  }, []);

  const decide = useCallback(
    (pass: boolean) => {
      const current = postRef.current;
      if (!current || current.phase !== "ask") return;
      window.clearTimeout(answerTimerRef.current);
      const car = carsRef.current.get(current.carId);
      const { voice, honk } = CARS[current.carId] ?? CARS.carry;
      setPost({ ...current, phase: pass ? "pass" : "fail" });
      if (pass) {
        setBarrierOpen(true);
        controllerRef.current?.release(current.carId);
        later(() => setBarrierOpen(false), 3200);
      } else {
        playWhistle();
        controllerRef.current?.uturn(current.carId);
        later(() => {
          playHorn(voice, 0.12);
          if (car) puff(car.el, honk, true);
        }, 350);
      }
      later(() => {
        setPost((p) => (p?.key === current.key ? null : p));
      }, 1900);
    },
    [later],
  );

  const handleEvent = useCallback(
    (event: CarEvent) => {
      const cars = carsRef.current;
      switch (event.type) {
        case "honk": {
          const car = cars.get(event.id);
          const { voice, honk } = CARS[event.id] ?? CARS.carry;
          playHorn(voice);
          if (car) puff(car.el, honk, event.chained >= 2);
          break;
        }
        case "impatient": {
          const car = cars.get(event.id);
          const { voice, honk } = CARS[event.id] ?? CARS.carry;
          playHorn(voice, 0.1);
          if (car) puff(car.el, honk, true);
          break;
        }
        case "jam-start": {
          roadRef.current?.classList.add("is-jammed");
          for (const [id, car] of cars) {
            if (!controllerRef.current?.activeIds.includes(id)) continue;
            const { voice, honk } = CARS[id] ?? CARS.carry;
            later(() => {
              playHorn(voice, 0.13, 0);
              puff(car.el, honk, true);
            }, 150 + Math.random() * 2600);
          }
          break;
        }
        case "jam-end":
          roadRef.current?.classList.remove("is-jammed");
          break;
        case "arrived": {
          playWhistle();
          const key = Date.now();
          const q = questionRef.current % QUESTIONS.length;
          questionRef.current += 1;
          setPost({ carId: event.id, phase: "ask", key, q });
          window.clearTimeout(answerTimerRef.current);
          answerTimerRef.current = window.setTimeout(
            () => decide(VERDICT[event.id] ?? true),
            ANSWER_SECONDS * 1000,
          );
          break;
        }
        case "done": {
          const wave = waveRef.current;
          wave.pending.delete(event.id);
          if (wave.pending.size === 0 && !wave.queued) {
            wave.index += 1;
            wave.queued = true;
            later(() => {
              wave.queued = false;
              dispatchNext();
            }, WAVE_GAP_MS);
          }
          break;
        }
      }
    },
    [decide, dispatchNext, later],
  );
  const eventRef = useRef(handleEvent);
  eventRef.current = handleEvent;

  // Traffic controller lives for the life of the road.
  useEffect(() => {
    const lane = laneRef.current;
    if (!lane) return;
    const controller = new TrafficController(lane, (event) => eventRef.current(event));
    controllerRef.current = controller;
    // A fresh controller starts a fresh show (dev remounts included), so the
    // first pair is placed on the road again.
    waveRef.current = { index: 0, pending: new Set(), queued: false, started: false };
    // Dev hook: `__roadTraffic` from the console.
    const w = window as unknown as { __roadTraffic?: TrafficController };
    if (process.env.NODE_ENV !== "production") w.__roadTraffic = controller;
    for (const [id, car] of carsRef.current) controller.add(id, car.el, car.options);

    // The stop line lives in the slab, which is 1% wider than the lane.
    const measureStopLine = () => {
      const line = stopLineRef.current;
      if (!line) return;
      const x = line.getBoundingClientRect().left - lane.getBoundingClientRect().left;
      controller.setStopLine(x);
    };
    measureStopLine();
    // Cars that mounted before this controller existed get their first pair now.
    dispatchNext();
    const ro = new ResizeObserver(measureStopLine);
    ro.observe(lane);

    const timers = timersRef.current;
    return () => {
      ro.disconnect();
      controller.destroy();
      controllerRef.current = null;
      if (w.__roadTraffic === controller) delete w.__roadTraffic;
      timers.forEach((t) => window.clearTimeout(t));
      timers.length = 0;
      window.clearTimeout(answerTimerRef.current);
    };
  }, []);

  /** Stable callback refs so React never re-registers a car on re-render. */
  const registerCar = useMemo(() => {
    const cache = new Map<string, (el: HTMLElement | null) => void>();
    return (id: string, options: CarOptions) => {
      let fn = cache.get(id);
      if (!fn) {
        fn = (el) => {
          if (el) {
            carsRef.current.set(id, { el, options });
            controllerRef.current?.add(id, el, options);
            dispatchNext();
          } else {
            carsRef.current.delete(id);
            controllerRef.current?.remove(id);
            const wave = waveRef.current;
            wave.pending.delete(id);
            // A car remounting during the opening pair (model reload, dev
            // remount) should land back on the road, not restart off-screen.
            if (wave.index === 0) {
              wave.started = false;
              const others = [...wave.pending];
              for (const other of others) controllerRef.current?.remove(other);
              for (const other of others) {
                const car = carsRef.current.get(other);
                if (car) controllerRef.current?.add(other, car.el, car.options);
              }
              wave.pending.clear();
            }
          }
        };
        cache.set(id, fn);
      }
      return fn;
    };
  }, [dispatchNext]);

  const carProps = (id: string) => ({
    animate: animateCars,
    speedRef: speedRefs.current[id],
    innerRef: registerCar(id, { speedRef: speedRefs.current[id] }),
  });
  const show = (id: string) => loadCars && !(compact && COMPACT_SKIP.has(id));

  useEffect(() => {
    const road = roadRef.current;
    if (!road) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const near = entry?.isIntersecting ?? false;
        if (near) setLoadCars(true);
      },
      { root: null, rootMargin: LOAD_ROOT_MARGIN, threshold: 0 },
    );

    const visible = new IntersectionObserver(([entry]) => setAnimateCars(entry.isIntersecting));
    io.observe(road);
    visible.observe(road);
    return () => { io.disconnect(); visible.disconnect(); };
  }, []);

  useEffect(() => {
    controllerRef.current?.setRunning(animateCars);
    if (animateCars) dispatchNext();
  }, [animateCars, dispatchNext]);

  const onLaneClick = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-car]");
    const id = target?.dataset.car;
    if (!id) return;
    unlockRoadAudio();
    controllerRef.current?.honk(id);
  }, []);

  const carName = post ? (CARS[post.carId]?.name ?? "Car") : "";
  const question = post ? QUESTIONS[post.q] : null;

  return (
    <div ref={roadRef} className="about-road" data-barrier={barrierOpen ? "open" : "closed"}>
      <div className="about-road__scene" aria-hidden>
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
            <div ref={stopLineRef} className="about-road__stopline" />
          </div>
          <div className="about-road__curb about-road__curb--bottom" />
          <div className="about-road__thickness" />
        </div>

        <div
          ref={laneRef}
          className="about-road__glb-lane"
          onClick={onLaneClick}
          onPointerDown={unlockRoadAudio}
        >
          {show("wagonr-b") ? <AboutPageWagonR lane="b" {...carProps("wagonr-b")} /> : null}
          {show("maruti-800") ? <AboutPageGlbCar id="maruti-800" {...carProps("maruti-800")} /> : null}
          {show("wagonr-a") ? <AboutPageWagonR lane="a" {...carProps("wagonr-a")} /> : null}
          {show("carry") ? <AboutPageCarry {...carProps("carry")} /> : null}
          {show("kia-carens") ? <AboutPageGlbCar id="kia-carens" {...carProps("kia-carens")} /> : null}
        </div>

        <Checkpost open={barrierOpen} />
      </div>

      <div className="about-road__ui">
        {post ? (
          <div
            key={post.key}
            className={`about-road__gate about-road__gate--${post.phase}`}
            role="dialog"
            aria-live="polite"
            aria-label={`Checkpost: ${carName}`}
          >
            {post.phase === "ask" ? (
              <>
                <p className="about-road__gate-q">
                  <span className="about-road__gate-kicker">Checkpost · {carName}</span>
                  {question?.q}
                </p>
                <div className="about-road__gate-actions">
                  <button
                    type="button"
                    data-cursor="interactive"
                    onPointerDown={unlockRoadAudio}
                    onClick={() => decide(true)}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    data-cursor="interactive"
                    onPointerDown={unlockRoadAudio}
                    onClick={() => decide(false)}
                  >
                    No
                  </button>
                </div>
                <span
                  className="about-road__gate-timer"
                  style={{ animationDuration: `${ANSWER_SECONDS}s` }}
                  aria-hidden
                >
                  <i />
                </span>
                <span className="about-road__gate-hint">
                  Constable decides in {ANSWER_SECONDS}s
                </span>
              </>
            ) : post.phase === "pass" ? (
              <p className="about-road__gate-q">
                <span className="about-road__gate-kicker">{carName} · passed</span>
                {question?.pass}
              </p>
            ) : (
              <p className="about-road__gate-q">
                <span className="about-road__gate-kicker">{carName} · turned back</span>
                {question?.fail}
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
