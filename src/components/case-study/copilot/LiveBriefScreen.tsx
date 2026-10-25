"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { KIcon, KumbaAppShell, LiveFigure, prefersReducedMotion, scrollToStep } from "./LiveKumbaFrame";
import type { KumbaIconName } from "./liveBriefIcons";

/**
 * Step 1 of the Copilot flow, working: the Mamaearth brief types itself, the
 * objective menu opens, event cards fill the brief, and Generate moves the page
 * on to step 2. No backend.
 */

const MAMAEARTH_BRIEF =
  "Launch Mamaearth Onion Hair Fall Control Shampoo: five days, warm wash-day moments, Instagram, Facebook and X.";

const OBJECTIVES: { title: string; supporting: string; icon: KumbaIconName }[] = [
  { title: "Promote a Product", supporting: "Launch or market a physical or digital product.", icon: "shopping-bag-01" },
  { title: "Promote a Service", supporting: "Generate awareness and leads for your service.", icon: "briefcase-01" },
  { title: "Build Brand Awareness", supporting: "Increase visibility and recognition for your brand.", icon: "megaphone-02" },
  { title: "Announce an Event", supporting: "Promote launches, webinars, festivals or campaigns.", icon: "calendar-03" },
  { title: "Other", supporting: "Something else? Start with a custom campaign objective.", icon: "menu-square" },
];

/* Event cards. Photos from Wikimedia Commons: Friendship Day, "Three friends laugh and toast…"
   (CC BY-SA 4.0); Independence Day, "Flag of India, Kodaikanal" (CC BY 2.0); Raksha Bandhan,
   "A sister tying rakhi thread…" (CC BY 2.0). */
const EVENTS = [
  {
    month: "AUG",
    day: "02",
    image: "/work/copilot/live/event-friendship.webp",
    title: "Friendship Day",
    subtitle: ["Celebrate the people who show up.", "Tag-a-friend posts and giveaways."],
    brief: "Friendship Day for Mamaearth: five days of tag-a-friend posts and shared wash-day moments on Instagram, Facebook and X.",
  },
  {
    month: "AUG",
    day: "15",
    image: "/work/copilot/live/event-independence.webp",
    title: "Independence Day",
    subtitle: ["Patriotic retail & celebration.", "Tricolour promos and pride moments."],
    brief: "Independence Day for Mamaearth: five days of tricolour-themed posts and freedom-week offers on Instagram, Facebook and X.",
  },
  {
    month: "AUG",
    day: "28",
    image: "/work/copilot/live/event-rakhi.webp",
    title: "Raksha Bandhan",
    subtitle: ["Gifting for brothers and sisters.", "Rakhi bundles and family moments."],
    brief: "Raksha Bandhan for Mamaearth: five days of gift-ready hair care and sibling moments on Instagram, Facebook and X.",
  },
];

export default function LiveBriefScreen({
  screenshot,
  caption,
  nextStepId,
}: {
  /** Shown on phones, and before the live screen hydrates. */
  screenshot?: string;
  caption: string;
  /** Step heading Generate scrolls to. */
  nextStepId: string;
}) {
  return (
    <LiveFigure screenshot={screenshot} caption={caption} hint="Try it: edit the brief or press Generate" url="kumba.ai/copilot">
      <BriefApp nextStepId={nextStepId} />
    </LiveFigure>
  );
}

function BriefApp({ nextStepId }: { nextStepId: string }) {
  const appRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingRef = useRef<number | null>(null);
  const [brief, setBrief] = useState("");
  const [typing, setTyping] = useState(false);
  const [objective, setObjective] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  const stopTyping = () => {
    if (typingRef.current !== null) window.clearTimeout(typingRef.current);
    typingRef.current = null;
    setTyping(false);
  };

  const typeOut = (text: string) => {
    stopTyping();
    if (prefersReducedMotion()) {
      setBrief(text);
      return;
    }
    setTyping(true);
    let i = 0;
    const step = () => {
      i += 1;
      setBrief(text.slice(0, i));
      if (i < text.length) {
        // A little uneven, like a person typing.
        typingRef.current = window.setTimeout(step, 22 + Math.random() * 38);
      } else {
        // Hold the finished brief, then type it again from the start.
        typingRef.current = window.setTimeout(() => {
          i = 0;
          setBrief("");
          typingRef.current = window.setTimeout(step, 400);
        }, 2600);
      }
    };
    typingRef.current = window.setTimeout(step, 250);
  };

  // Type the Mamaearth brief the first time the screen is properly in view.
  useEffect(() => {
    const app = appRef.current;
    if (!app) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        typeOut(MAMAEARTH_BRIEF);
      },
      { threshold: 0.45 },
    );
    observer.observe(app);
    return () => {
      observer.disconnect();
      stopTyping();
    };
    // typeOut only touches refs and setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close the objective menu on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (event: PointerEvent) => {
      if (!(event.target as Element).closest(".lb-objective")) setMenuOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const generate = () => {
    if (generating) return;
    stopTyping();
    if (!brief.trim()) {
      setBrief(MAMAEARTH_BRIEF);
    }
    setGenerating(true);
    window.setTimeout(() => scrollToStep(nextStepId), 1400);
  };

  return (
    <KumbaAppShell appRef={appRef}>
        <div className="lb-scroll">
          <div className="lb-column">
            <div className="lb-hero">
              <p className="lb-eyebrow">✦ From brief to publish-ready in minutes</p>
              <p className="lb-title">
                <span className="lb-title__brand">Social</span> Media Copilot
              </p>
              <p className="lb-lead">
                Plan, create and schedule your next <b>5 days</b> of content in minutes.
              </p>
            </div>

            <div className={`lb-composer${generating ? " is-thinking" : ""}`}>
              <NeonSnakeBorder />
              <div className="lb-composer__shell">
              <div className="lb-composer__row">
                <span className="lb-composer__attach" aria-hidden>
                  <KIcon name="attachment-01" className="lb-icon--20" />
                </span>
                <span className="lb-composer__divider" aria-hidden />
                <textarea
                  ref={inputRef}
                  className="lb-composer__input"
                  value={brief}
                  placeholder="Describe your campaign…"
                  aria-label="Campaign brief"
                  rows={3}
                  disabled={generating}
                  onFocus={() => {
                    if (typing) {
                      stopTyping();
                      setBrief(MAMAEARTH_BRIEF);
                    }
                  }}
                  onChange={(event) => setBrief(event.target.value)}
                />
              </div>
              <div className="lb-composer__bar">
                <div className="lb-objective">
                  <button
                    type="button"
                    className="lb-chip"
                    aria-haspopup="listbox"
                    aria-expanded={menuOpen}
                    data-cursor="interactive"
                    disabled={generating}
                    onClick={() => setMenuOpen((open) => !open)}
                  >
                    <KIcon name={OBJECTIVES[objective].icon} className="lb-icon--16" />
                    {OBJECTIVES[objective].title}
                    <KIcon name="arrow-down-01-round" className="lb-icon--16" />
                  </button>
                  {menuOpen ? (
                    <ul className="lb-menu" role="listbox" aria-label="Campaign objective">
                      {OBJECTIVES.map(({ title, supporting, icon }, i) => (
                        <li key={title} role="option" aria-selected={i === objective}>
                          <button
                            type="button"
                            className={`lb-menu__item${i === objective ? " is-selected" : ""}`}
                            data-cursor="interactive"
                            onClick={() => {
                              setObjective(i);
                              setMenuOpen(false);
                            }}
                          >
                            <KIcon name={icon} className="lb-icon--20" />
                            <span>
                              <b>{title}</b>
                              {supporting}
                            </span>
                            {i === objective ? <KIcon name="tick-01" className="lb-icon--16 lb-menu__tick" /> : null}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="lb-generate"
                  data-cursor="interactive"
                  disabled={generating}
                  onClick={generate}
                >
                  {generating ? (
                    <>
                      <span className="lb-spinner" aria-hidden />
                      <span className="lb-pulse">Generating...</span>
                    </>
                  ) : (
                    <>
                      Generate
                      <KIcon name="arrow-up-right-01-round" className="lb-icon--16" />
                    </>
                  )}
                </button>
              </div>
              </div>
            </div>

            <div className="lb-inspire">
              <p>Need inspiration? Build campaigns around upcoming events with one click.</p>
            </div>

            <div className="lb-events">
              {EVENTS.map((event) => (
                <article key={event.day} className="lb-event">
                  <div className="lb-event__media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={event.image} alt="" loading="lazy" />
                    <span className="lb-event__date">
                      <small>{event.month}</small>
                      {event.day}
                    </span>
                  </div>
                  <div className="lb-event__body">
                    <p className="lb-event__title">{event.title}</p>
                    <p className="lb-event__sub">
                      {event.subtitle[0]}
                      <br />
                      {event.subtitle[1]}
                    </p>
                  </div>
                  <div className="lb-event__foot">
                    <span>▣ 5-day campaign</span>
                    <button
                      type="button"
                      className="lb-build"
                      data-cursor="interactive"
                      onClick={() => {
                        appRef.current?.querySelector(".lb-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
                        typeOut(event.brief);
                      }}
                    >
                      <KIcon name="arrow-right-02-round" className="lb-icon--16" />
                      Build
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
    </KumbaAppShell>
  );
}

/** Kumba's neon snake border (neon-snake-border.tsx): brand gradient trail around the composer, always running. */
function NeonSnakeBorder() {
  const svgRef = useRef<SVGSVGElement>(null);
  const uid = useId().replace(/:/g, "");
  const [size, setSize] = useState({ width: 778, height: 180 });
  useLayoutEffect(() => {
    const host = svgRef.current?.parentElement;
    if (!host) return;
    const update = () => setSize({ width: host.clientWidth, height: host.clientHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);
  const inset = 2.5;
  const w = Math.max(size.width - inset * 2, 0);
  const h = Math.max(size.height - inset * 2, 0);
  const grad = `lb-snake-grad-${uid}`;
  const glow = `lb-snake-glow-${uid}`;
  const rect = { x: inset, y: inset, width: w, height: h, rx: 2, ry: 2, fill: "none", stroke: `url(#${grad})`, strokeLinecap: "round" as const, pathLength: 1 };
  return (
    <svg ref={svgRef} className="lb-snake" aria-hidden width={size.width} height={size.height} viewBox={`0 0 ${size.width} ${size.height}`}>
      <defs>
        <linearGradient id={grad} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={size.width} y2={size.height}>
          <stop offset="0%" stopColor="#e2a4dd" />
          <stop offset="45%" stopColor="#e2a4dd" />
          <stop offset="55%" stopColor="#f9c383" />
          <stop offset="100%" stopColor="#f9c383" />
        </linearGradient>
        <filter id={glow} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect {...rect} strokeWidth={1.5} strokeDasharray="0.22 0.78" opacity={0.35}>
        <animate attributeName="stroke-dashoffset" from="0" to="1" dur="6s" repeatCount="indefinite" />
      </rect>
      <rect {...rect} strokeWidth={2} strokeDasharray="0.09 0.91" filter={`url(#${glow})`} opacity={0.95}>
        <animate attributeName="stroke-dashoffset" from="0" to="-1" dur="2.8s" repeatCount="indefinite" />
      </rect>
      <rect {...rect} strokeWidth={2.5} strokeDasharray="0.04 0.96" opacity={0.75}>
        <animate attributeName="stroke-dashoffset" from="-0.5" to="0.5" dur="2.8s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
}
