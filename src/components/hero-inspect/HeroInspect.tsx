"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./hero-inspect.css";

/** Fired by the code keycap in the headline. */
export const HERO_INSPECT_EVENT = "hero-inspect-toggle";

type Box = {
  x: number;
  y: number;
  w: number;
  h: number;
  tag: string;
  meta: string;
  below?: boolean;
  inside?: boolean;
};
type Gap = { x: number; y: number; h: number; value: number };

/** What gets outlined, and how it is labelled. */
const TARGETS: {
  selector: string;
  tag: string;
  font?: boolean;
  below?: boolean;
  /** Label tucked inside the box on phones, where the stack is tight. */
  insideOnPhone?: boolean;
  desktopOnly?: boolean;
}[] = [
  { selector: ".hero-intro", tag: "<p.intro>", font: true },
  { selector: ".hero-intro__avatar", tag: "<Image />", below: true, desktopOnly: true },
  { selector: ".hero-headline", tag: "<h1>", font: true, insideOnPhone: true },
  { selector: ".hero-headline__key", tag: "<button>" },
  { selector: ".hero-cta__button:not(.hero-cta__resume)", tag: "<a.primary>" },
  { selector: ".hero-cta__resume", tag: "<LiquidGlass>" },
];

/** Vertical rhythm worth showing: intro → headline → buttons. */
const GAPS: [string, string][] = [
  [".hero-intro", ".hero-headline"],
  [".hero-headline", ".hero-cta"],
];

function shortFamily(family: string) {
  const first = family.split(",")[0]?.replace(/["']/g, "").trim() ?? "";
  // next/font names look like "__Playfair_Display_abc123"; clean them up.
  return first.replace(/^__/, "").replace(/_[a-f0-9]{5,}$/i, "").replace(/_/g, " ").replace(/ Fallback$/, "");
}

/**
 * Inspect mode for the hero: press the code keycap and the hero shows its own
 * scaffolding, element outlines, tags, sizes, fonts and the spacing between
 * blocks, like a browser inspector. Press again, or Escape, to put it away.
 */
export default function HeroInspect() {
  const layerRef = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [gaps, setGaps] = useState<Gap[]>([]);

  const measure = useCallback(() => {
    const layer = layerRef.current;
    const hero = layer?.parentElement;
    if (!layer || !hero) return;
    const origin = hero.getBoundingClientRect();
    const rel = (r: DOMRect) => ({
      x: r.left - origin.left,
      y: r.top - origin.top,
      w: r.width,
      h: r.height,
    });

    const phone = window.matchMedia("(max-width: 767px)").matches;
    const nextBoxes: Box[] = [];
    for (const t of TARGETS) {
      if (phone && t.desktopOnly) continue;
      const el = hero.querySelector<HTMLElement>(t.selector);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      let meta = `${Math.round(r.width)} × ${Math.round(r.height)}`;
      if (t.font) {
        const cs = getComputedStyle(el.matches(".hero-headline") ? el.querySelector(".hero-headline__line") ?? el : el);
        meta = `${shortFamily(cs.fontFamily)} · ${Math.round(parseFloat(cs.fontSize))}px`;
      }
      nextBoxes.push({ ...rel(r), tag: t.tag, meta, below: t.below, inside: phone && t.insideOnPhone });
    }

    const nextGaps: Gap[] = [];
    for (const [a, b] of GAPS) {
      const top = hero.querySelector<HTMLElement>(a)?.getBoundingClientRect();
      const bottom = hero.querySelector<HTMLElement>(b)?.getBoundingClientRect();
      if (!top || !bottom) continue;
      const value = Math.round(bottom.top - top.bottom);
      if (value <= 0) continue;
      nextGaps.push({
        // Just outside the left edge of whichever block starts further right,
        // with the value badge hanging to the left of the line.
        x: Math.max(top.left, bottom.left) - origin.left - 10,
        y: top.bottom - origin.top,
        h: value,
        value,
      });
    }

    setBoxes(nextBoxes);
    setGaps(nextGaps);
  }, []);

  useEffect(() => {
    const toggle = () => setOn((v) => !v);
    window.addEventListener(HERO_INSPECT_EVENT, toggle);
    return () => window.removeEventListener(HERO_INSPECT_EVENT, toggle);
  }, []);

  useLayoutEffect(() => {
    const hero = layerRef.current?.parentElement;
    if (hero) hero.toggleAttribute("data-inspecting", on);
    document
      .querySelector(".hero-headline__key")
      ?.setAttribute("aria-pressed", on ? "true" : "false");
    if (!on) return;
    measure();
    const onResize = () => measure();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOn(false);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    // Fonts and entrance animations can still be settling; measure again.
    const late = window.setTimeout(measure, 450);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(late);
    };
  }, [on, measure]);

  return (
    <div ref={layerRef} className={`hero-inspect${on ? " is-on" : ""}`} aria-hidden>
      {on
        ? boxes.map((b, i) => (
            <div
              key={b.tag + i}
              className={`hero-inspect__box${b.below ? " is-label-below" : ""}${b.inside ? " is-label-inside" : ""}`}
              style={{
                left: b.x,
                top: b.y,
                width: b.w,
                height: b.h,
                animationDelay: `${i * 45}ms`,
              }}
            >
              <span className="hero-inspect__label">
                <b>{b.tag}</b> {b.meta}
              </span>
            </div>
          ))
        : null}
      {on
        ? gaps.map((g, i) => (
            <div
              key={`gap-${i}`}
              className="hero-inspect__gap"
              style={{ left: g.x, top: g.y, height: g.h, animationDelay: `${180 + i * 60}ms` }}
            >
              <span className="hero-inspect__gap-value">{g.value}</span>
            </div>
          ))
        : null}
    </div>
  );
}
