/**
 * JS traffic for the about-road checkpost. Cars are dispatched in waves,
 * drive up to the barrier, stop, and wait for a verdict: `release` lifts
 * the barrier for the front car, `uturn` sends it back the way it came.
 *
 * Positions are written straight to `style.transform`; React never
 * re-renders per frame. Speeds are in px/s, x is the car's left edge in
 * lane px (negative = still off-screen on the left).
 */

/** Reference pace: the old CSS loop crossed -8rem → 100vw + 8rem in 24s. */
const LAP_SECONDS = 24;
const MARGIN_REM = 8;
const BOOST_FACTOR = 1.9;
const BOOST_MS = 2800;
const JAM_MS = 4200;
/** Honks inside this window chain into a jam. */
const CHAIN_WINDOW_MS = 3000;
const CHAIN_COUNT = 3;
const JAM_COOLDOWN_MS = 7000;
/** Personality: cruise multiplier re-rolled every dispatch. */
const CRUISE_JITTER: [number, number] = [0.85, 1.15];
/** Longest braking zone before the stop line (scales down with speed). */
const BRAKING_PX = 170;
/** Waiting behind the barrier for this long and the queue gets impatient. */
const IMPATIENT_AFTER_MS = 3000;
/** How long the flip takes before a U-turned car pulls away. */
const UTURN_PAUSE_MS = 520;

export type CarEvent =
  | { type: "honk"; id: string; chained: number }
  | { type: "impatient"; id: string }
  | { type: "jam-start" }
  | { type: "jam-end" }
  /** Front car has come to a halt at the barrier. */
  | { type: "arrived"; id: string }
  /** Car has left the road (passed through, or turned back). */
  | { type: "done"; id: string; passed: boolean };

export interface CarOptions {
  /** Cruise speed as a multiple of the shared lap speed. */
  cruise?: number;
  /** Written each frame: current speed / shared lap speed (wheel spin). */
  speedRef?: { current: number };
}

interface Car {
  id: string;
  el: HTMLElement;
  x: number;
  width: number;
  speed: number;
  baseCruise: number;
  cruise: number;
  /** 1 = driving right (normal), -1 = turned around, heading off left. */
  dir: 1 | -1;
  /** Part of the current wave. Dormant cars sit hidden off-screen. */
  active: boolean;
  /** Barrier lifted for this car: it ignores the stop line. */
  cleared: boolean;
  /** "arrived" already emitted for this visit. */
  arrived: boolean;
  arrivedAt: number;
  boostUntil: number;
  /** Stand still until this time (the U-turn flip). */
  holdUntil: number;
  speedRef?: { current: number };
  braking: boolean;
  stopped: boolean;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export class TrafficController {
  private cars: Car[] = [];
  private lane: HTMLElement;
  private laneWidth = 0;
  private margin = 128;
  private raf = 0;
  private running = false;
  private lastTime: number | null = null;
  private jamUntil = 0;
  private jamCooldownUntil = 0;
  private honkTimes: number[] = [];
  /** Lane-relative x of the stop line; 0 = no barrier on this road. */
  private stopX = 0;
  private ro: ResizeObserver;
  private onEvent: (event: CarEvent) => void;
  private reducedMotion: boolean;
  private motionQuery: MediaQueryList;

  constructor(lane: HTMLElement, onEvent: (event: CarEvent) => void) {
    this.lane = lane;
    this.onEvent = onEvent;
    this.motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.reducedMotion = this.motionQuery.matches;
    this.motionQuery.addEventListener("change", this.handleMotion);
    this.ro = new ResizeObserver(() => this.measure());
    this.ro.observe(lane);
    this.measure();
  }

  private handleMotion = (event: MediaQueryListEvent) => {
    this.reducedMotion = event.matches;
    if (this.reducedMotion) {
      for (const car of this.cars) {
        car.el.style.transform = "";
        car.el.classList.remove("is-dormant");
        car.speedRef && (car.speedRef.current = 0);
      }
      this.stopLoop();
    } else if (this.running) {
      this.startLoop();
    }
  };

  private measure() {
    this.laneWidth = this.lane.clientWidth;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    this.margin = MARGIN_REM * rem;
    for (const car of this.cars) car.width = car.el.offsetWidth || car.width;
  }

  /** px/s that would cross the road in LAP_SECONDS. */
  private lapSpeed() {
    return (this.laneWidth + this.margin * 2) / LAP_SECONDS;
  }

  get isJammed() {
    return performance.now() < this.jamUntil;
  }

  get motionReduced() {
    return this.reducedMotion;
  }

  get activeIds(): string[] {
    return this.cars.filter((c) => c.active).map((c) => c.id);
  }

  has(id: string) {
    return this.cars.some((car) => car.id === id);
  }

  /** Ids of cars standing still behind the stop line, front of queue first. */
  get queue(): string[] {
    return this.cars
      .filter((c) => c.active && c.dir === 1 && c.stopped && c.x + c.width <= this.stopX + 4)
      .sort((a, b) => b.x - a.x)
      .map((c) => c.id);
  }

  add(id: string, el: HTMLElement, options: CarOptions = {}) {
    const existing = this.cars.find((car) => car.id === id);
    if (existing && existing.el === el) {
      existing.speedRef = options.speedRef ?? existing.speedRef;
      return;
    }
    this.remove(id);
    const baseCruise = options.cruise ?? 1;
    const car: Car = {
      id,
      el,
      x: -this.margin * 4,
      width: el.offsetWidth || 80,
      speed: 0,
      baseCruise,
      cruise: baseCruise,
      dir: 1,
      active: false,
      cleared: false,
      arrived: false,
      arrivedAt: 0,
      boostUntil: 0,
      holdUntil: 0,
      speedRef: options.speedRef,
      braking: false,
      stopped: false,
    };
    el.dataset.car = id;
    this.cars.push(car);
    if (!this.reducedMotion) this.park(car);
  }

  remove(id: string) {
    const index = this.cars.findIndex((car) => car.id === id);
    if (index === -1) return;
    const [car] = this.cars.splice(index, 1);
    car.el.style.transform = "";
    car.el.classList.remove("is-braking", "is-stopped", "is-reversed", "is-dormant");
    delete car.el.dataset.car;
  }

  /** Hide a car off-screen until its next wave. */
  private park(car: Car) {
    car.active = false;
    car.dir = 1;
    car.speed = 0;
    car.cleared = false;
    car.arrived = false;
    car.x = -this.margin * 4;
    car.el.classList.add("is-dormant");
    car.el.classList.remove("is-reversed", "is-braking", "is-stopped");
    car.el.style.transform = `translate3d(${car.x}px,0,0)`;
    if (car.speedRef) car.speedRef.current = 0;
  }

  /**
   * Send a wave in from the left, in order, `gapPx` apart. Cars already on
   * the road are left alone. `startFraction` places the wave already on the
   * road instead of off-screen (used for the first pair).
   */
  dispatch(ids: string[], gapPx: number, startFraction?: number) {
    if (this.reducedMotion) return;
    if (this.laneWidth === 0) this.measure();
    // Default: just off-screen left. With startFraction, the lead car's nose
    // starts that far along the stretch before the stop line.
    let cursor =
      startFraction === undefined
        ? -this.margin
        : Math.max(
            0,
            Math.min(this.stopX > 0 ? this.stopX - 40 : this.laneWidth * 0.6, (this.stopX || this.laneWidth) * startFraction),
          );
    for (const id of ids) {
      const car = this.cars.find((c) => c.id === id);
      if (!car || car.active) continue;
      car.active = true;
      car.dir = 1;
      car.cleared = false;
      car.arrived = false;
      car.cruise = car.baseCruise * rand(...CRUISE_JITTER);
      cursor -= car.width;
      car.x = cursor;
      cursor -= gapPx;
      car.speed = this.lapSpeed() * car.cruise;
      car.el.classList.remove("is-dormant", "is-reversed");
      car.el.style.transform = `translate3d(${car.x}px,0,0)`;
    }
  }

  setRunning(running: boolean) {
    this.running = running;
    if (running && !this.reducedMotion) this.startLoop();
    else this.stopLoop();
  }

  /** Lane-relative x of the stop line (0 disables the barrier). */
  setStopLine(x: number) {
    this.stopX = x;
  }

  /** Barrier up: the car may drive on through. */
  release(id: string) {
    const car = this.cars.find((c) => c.id === id);
    if (car) car.cleared = true;
  }

  /** Turned back: the car flips and leaves the way it came (far lane). */
  uturn(id: string) {
    const car = this.cars.find((c) => c.id === id);
    if (!car || !car.active || car.dir === -1) return;
    car.dir = -1;
    car.speed = 0;
    car.boostUntil = 0;
    car.holdUntil = performance.now() + UTURN_PAUSE_MS;
    car.el.classList.add("is-reversed");
  }

  /**
   * A car honks: the car directly ahead gets a fright and speeds up.
   * Three honks within a few seconds and everybody stands on the brakes.
   */
  honk(id: string) {
    const now = performance.now();
    const car = this.cars.find((c) => c.id === id);
    this.honkTimes = this.honkTimes.filter((t) => now - t < CHAIN_WINDOW_MS);
    this.honkTimes.push(now);
    const chained = this.honkTimes.length;
    this.onEvent({ type: "honk", id, chained });

    if (!car || !car.active || this.reducedMotion) return;

    if (chained >= CHAIN_COUNT && !this.isJammed && now >= this.jamCooldownUntil) {
      this.honkTimes = [];
      this.jamUntil = now + JAM_MS;
      this.jamCooldownUntil = now + JAM_MS + JAM_COOLDOWN_MS;
      this.onEvent({ type: "jam-start" });
      window.setTimeout(() => this.onEvent({ type: "jam-end" }), JAM_MS);
      return;
    }

    if (this.isJammed) return;
    const ahead = this.carAhead(car);
    if (ahead && ahead.car !== car && !ahead.car.stopped) ahead.car.boostUntil = now + BOOST_MS;
  }

  /** Next active car in this car's direction and the free gap in px. */
  private carAhead(car: Car): { car: Car; gap: number } | null {
    let best: Car | null = null;
    let bestGap = Infinity;
    for (const other of this.cars) {
      if (other === car || !other.active || other.dir !== car.dir) continue;
      const gap =
        car.dir === 1
          ? other.x - (car.x + car.width)
          : car.x - (other.x + other.width);
      if (gap < 0) continue;
      if (gap < bestGap) {
        bestGap = gap;
        best = other;
      }
    }
    return best ? { car: best, gap: bestGap } : null;
  }

  private startLoop() {
    if (this.raf) return;
    this.lastTime = null;
    this.raf = requestAnimationFrame(this.tick);
  }

  private stopLoop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.lastTime = null;
  }

  private tick = (now: number) => {
    this.raf = requestAnimationFrame(this.tick);
    if (this.laneWidth === 0) this.measure();
    if (this.lastTime === null) {
      this.lastTime = now;
      return;
    }
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    const lapSpeed = this.lapSpeed();
    const jammed = now < this.jamUntil;
    const queue = this.queue;
    const front = this.cars.find((c) => c.id === queue[0]);
    const waitedLong = !!front && now - front.arrivedAt > IMPATIENT_AFTER_MS;

    for (const car of this.cars) {
      if (!car.active) continue;

      let desired = lapSpeed * car.cruise;
      if (now < car.boostUntil) desired *= BOOST_FACTOR;
      if (jammed || now < car.holdUntil) desired = 0;

      // Car-following: queue "a bit apart" behind the car ahead.
      const ahead = this.carAhead(car);
      if (ahead) {
        const safeGap = Math.max(18, car.width * 0.55);
        if (ahead.gap < safeGap) {
          const ratio = Math.max(0, ahead.gap / safeGap);
          desired = Math.min(desired, ahead.car.speed * ratio + lapSpeed * 0.05 * ratio);
        }
      }

      // The barrier: every right-bound car stops at the line until released.
      // The braking zone scales with speed, with a creep floor so cars reach
      // the line briskly instead of crawling toward it.
      if (this.stopX > 0 && car.dir === 1 && !car.cleared) {
        const gap = this.stopX - (car.x + car.width);
        const zone = Math.min(BRAKING_PX, Math.max(50, lapSpeed * 2.2));
        if (gap > -2) {
          if (gap < 10) {
            desired = 0;
          } else {
            const ratio = Math.max(0.4, Math.min(1, gap / zone));
            desired = Math.min(desired, lapSpeed * car.cruise * ratio);
          }
        }
      }

      const accel = lapSpeed * (jammed ? 4 : 1.4) * dt;
      const decel = lapSpeed * 3.2 * dt;
      const delta = desired - car.speed;
      car.speed += delta > 0 ? Math.min(delta, accel) : Math.max(delta, -decel);
      if (car.speed < 0.5 && desired === 0) car.speed = 0;

      const braking = delta < -lapSpeed * 0.15 || (jammed && car.speed > 0);
      if (braking !== car.braking) {
        car.braking = braking;
        car.el.classList.toggle("is-braking", braking);
      }
      const stopped = car.speed === 0;
      if (stopped !== car.stopped) {
        car.stopped = stopped;
        car.el.classList.toggle("is-stopped", stopped);
      }

      // Front of the queue, halted at the line: ask the question.
      if (
        stopped &&
        car.dir === 1 &&
        !car.cleared &&
        !car.arrived &&
        this.stopX - (car.x + car.width) < 14 &&
        (queue[0] === car.id || queue.length === 0)
      ) {
        car.arrived = true;
        car.arrivedAt = now;
        this.onEvent({ type: "arrived", id: car.id });
      }

      // Back of the queue leans on the horn now and then.
      if (stopped && waitedLong && queue.indexOf(car.id) > 0 && Math.random() < dt * 0.25) {
        this.onEvent({ type: "impatient", id: car.id });
      }

      car.x += car.dir * car.speed * dt;
      if (car.dir === 1 && car.x > this.laneWidth + this.margin) {
        this.park(car);
        this.onEvent({ type: "done", id: car.id, passed: true });
        continue;
      }
      if (car.dir === -1 && car.x + car.width < -this.margin) {
        this.park(car);
        this.onEvent({ type: "done", id: car.id, passed: false });
        continue;
      }

      car.el.style.transform = `translate3d(${car.x}px,0,0)`;
      if (car.speedRef) car.speedRef.current = car.speed / lapSpeed;
    }
  };

  destroy() {
    this.stopLoop();
    this.ro.disconnect();
    this.motionQuery.removeEventListener("change", this.handleMotion);
    for (const car of [...this.cars]) this.remove(car.id);
  }
}
