"use client";

import { useEffect } from "react";

/**
 * Soft UI click for every button, link and control on the site: a short,
 * rounded "tick" on press and a quieter "tock" on release, like a good
 * trackpad. Synthesized with Web Audio (nothing to download) and only ever
 * started by a user gesture.
 *
 * Opt an area out with data-click-sound="off". Areas that already make their
 * own sounds (the hero keycap, the road horns, the basketball game, the music
 * covers) are skipped below.
 */

const INTERACTIVE =
  'a[href], button, [role="button"], [role="switch"], [role="tab"], [role="menuitem"], [role="option"], summary, label, select, input[type="checkbox"], input[type="radio"], input[type="button"], input[type="submit"], [data-cursor="interactive"]';

const OWN_SOUNDS = [
  '[data-click-sound="off"]',
  ".hero-headline__key",
  ".about-road",
  ".basketball-stage",
  ".about-music__grid",
].join(", ");

const VOLUME = 0.5;
const MIN_GAP_MS = 45;

let ctx: AudioContext | undefined;
let out: GainNode | undefined;
let last = 0;

function audio() {
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume().catch(() => {});
  if (!out) {
    out = ctx.createGain();
    out.gain.value = VOLUME;
    // Gentle high-cut so nothing ever sounds harsh on laptop speakers.
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 6000;
    out.connect(tone);
    tone.connect(ctx.destination);
  }
  return { c: ctx, o: out };
}

function blip(c: AudioContext, o: GainNode, at: number, from: number, to: number, peak: number, length: number) {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(from, at);
  osc.frequency.exponentialRampToValueAtTime(to, at + length);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(peak, at + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, at + length);
  osc.connect(g);
  g.connect(o);
  osc.start(at);
  osc.stop(at + length + 0.01);
}

function grain(c: AudioContext, o: GainNode, at: number, freq: number, peak: number) {
  const len = Math.ceil(c.sampleRate * 0.012);
  const buffer = c.createBuffer(1, len, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 4;
  const src = c.createBufferSource();
  src.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = freq;
  filter.Q.value = 2.2;
  const g = c.createGain();
  g.gain.value = peak;
  src.connect(filter);
  filter.connect(g);
  g.connect(o);
  src.start(at);
}

/** Press: a crisp tick with a little body. Release: a softer, higher tock. */
export function playUiClick(phase: "down" | "up") {
  if (typeof window === "undefined") return;
  try {
    const { c, o } = audio();
    const now = c.currentTime;
    if (phase === "down") {
      grain(c, o, now, 3200, 0.22);
      blip(c, o, now, 1650, 900, 0.16, 0.045);
    } else {
      grain(c, o, now, 4600, 0.08);
      blip(c, o, now, 2300, 1700, 0.06, 0.03);
    }
  } catch {
    /* no audio, no problem */
  }
}

function target(event: Event) {
  const el = event.target instanceof Element ? event.target : null;
  if (!el) return null;
  const hit = el.closest(INTERACTIVE);
  if (!hit || hit.closest(OWN_SOUNDS)) return null;
  if ((hit as HTMLButtonElement).disabled || hit.getAttribute("aria-disabled") === "true") return null;
  return hit;
}

export default function ClickSounds() {
  useEffect(() => {
    let pressed: Element | null = null;

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const hit = target(event);
      if (!hit) return;
      const t = performance.now();
      if (t - last < MIN_GAP_MS) return;
      last = t;
      pressed = hit;
      playUiClick("down");
    };

    const onUp = (event: PointerEvent) => {
      if (!pressed) return;
      const hit = target(event);
      if (hit === pressed) playUiClick("up");
      pressed = null;
    };

    // Keyboard presses get the same feel.
    const onKey = (event: KeyboardEvent) => {
      if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
      const hit = target(event);
      if (!hit || hit.matches("input, select, textarea")) return;
      playUiClick("down");
    };

    window.addEventListener("pointerdown", onDown, { capture: true, passive: true });
    window.addEventListener("pointerup", onUp, { capture: true, passive: true });
    window.addEventListener("keydown", onKey, { capture: true });
    return () => {
      window.removeEventListener("pointerdown", onDown, { capture: true });
      window.removeEventListener("pointerup", onUp, { capture: true });
      window.removeEventListener("keydown", onKey, { capture: true });
    };
  }, []);

  return null;
}
