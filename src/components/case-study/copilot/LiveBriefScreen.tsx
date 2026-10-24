"use client";

import { Roboto_Flex } from "next/font/google";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Briefcase,
  CalendarDays,
  ChevronDown,
  Clapperboard,
  Crown,
  Folder,
  FolderOpen,
  House,
  Image as ImageIcon,
  Link2,
  LayoutList,
  Megaphone,
  MessageCircle,
  Settings,
  ShoppingBag,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import "./live-brief.css";

/** Kumba's product font. */
const robotoFlex = Roboto_Flex({ subsets: ["latin"], display: "swap" });

/**
 * Step 1 of the Copilot flow, rebuilt so readers can use it: the Mamaearth brief
 * types itself, the objective menu opens, event cards fill the brief, and
 * Generate moves the page on to step 2. Matches the real screen (tokens from the
 * Kumba design system) but has no backend. Laid out at 1440 × 900, the size the
 * screenshot was taken at, and scaled to the frame. Phones keep the screenshot.
 */

const DESIGN_W = 1440;
const CHROME_H = 48;
const APP_H = 900;

const MAMAEARTH_BRIEF =
  "Launch Mamaearth Onion Hair Fall Control Shampoo: five days, warm wash-day moments, Instagram, Facebook and X.";

const OBJECTIVES: { title: string; supporting: string; icon: LucideIcon }[] = [
  { title: "Promote a Product", supporting: "Launch or market a physical or digital product.", icon: ShoppingBag },
  { title: "Promote a Service", supporting: "Generate awareness and leads for your service.", icon: Briefcase },
  { title: "Build Brand Awareness", supporting: "Increase visibility and recognition for your brand.", icon: Megaphone },
  { title: "Announce an Event", supporting: "Promote launches, webinars, festivals or campaigns.", icon: CalendarDays },
  { title: "Other", supporting: "Something else? Start with a custom campaign objective.", icon: LayoutList },
];

const EVENTS = [
  {
    day: "06",
    image: "/work/copilot/live/event-aug-06.webp",
    title: "Hiroshima Day",
    subtitle: ["Thoughtful remembrance.", "Respectful, purpose-led posts."],
    brief: "Hiroshima Day for Mamaearth: five days of thoughtful, purpose-led posts on Instagram and Facebook.",
  },
  {
    day: "09",
    image: "/work/copilot/live/event-aug-09.webp",
    title: "International Cat Day",
    subtitle: ["Playful pet content & engagement.", "Polls, UGC, and community fun."],
    brief: "International Cat Day for Mamaearth: five days of playful pet posts, polls and UGC on Instagram and X.",
  },
  {
    day: "12",
    image: "/work/copilot/live/event-aug-12.webp",
    title: "World Automobile Day",
    subtitle: ["Launches & test-drive campaigns.", "Models, offers, and the open road."],
    brief: "World Automobile Day: five days of road-trip hair care moments for Mamaearth on Instagram, Facebook and X.",
  },
];

const RAIL: { label: string; icon: LucideIcon; active?: boolean }[] = [
  { label: "Home", icon: House },
  { label: "Copilot", icon: Megaphone, active: true },
  { label: "Chat", icon: MessageCircle },
  { label: "Image", icon: ImageIcon },
  { label: "Video", icon: Clapperboard },
  { label: "Assets", icon: Folder },
];

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function LiveBriefScreen({
  screenshot,
  caption,
  nextStepId,
}: {
  /** Shown on phones, and before the live screen hydrates. */
  screenshot?: string;
  caption: string;
  /** Element Generate scrolls to. */
  nextStepId: string;
}) {
  const [live, setLive] = useState(false);

  // Phones get the screenshot: a scaled-down desktop app is too small to type into.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const sync = () => setLive(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <figure className="cs-shot lb-figure">
      {live ? (
        <LiveFrame caption={caption} nextStepId={nextStepId} />
      ) : screenshot ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={screenshot} alt={caption} loading="lazy" decoding="async" />
      ) : null}
      <figcaption>
        {caption}
        {live ? <span className="lb-hint"> · Try it: edit the brief or press Generate</span> : null}
      </figcaption>
    </figure>
  );
}

function LiveFrame({ caption, nextStepId }: { caption: string; nextStepId: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const update = () => setScale(box.clientWidth / DESIGN_W);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={boxRef} className="lb-box" role="group" aria-label={`${caption} (interactive)`}>
      <div
        className={`lb-window ${robotoFlex.className}`}
        style={{ width: DESIGN_W, height: CHROME_H + APP_H, transform: `scale(${scale})`, visibility: scale ? "visible" : "hidden" }}
      >
        <div className="lb-chrome" aria-hidden>
          <span className="lb-dots">
            <i /> <i /> <i />
          </span>
          <span className="lb-url">kumba.ai/copilot</span>
        </div>
        <BriefApp nextStepId={nextStepId} />
      </div>
    </div>
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
        typingRef.current = null;
        setTyping(false);
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
    window.setTimeout(() => {
      document.getElementById(nextStepId)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
      window.setTimeout(() => setGenerating(false), 900);
    }, 1400);
  };

  const ObjectiveIcon = OBJECTIVES[objective].icon;

  return (
    <div ref={appRef} className="lb-app">
      <nav className="lb-rail" aria-label="Kumba">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="lb-rail__logo" src="/about/kumba-logo-icon.png" alt="" width={40} height={40} />
        {RAIL.map(({ label, icon: Icon, active }) => (
          <span key={label} className={`lb-rail__item${active ? " is-active" : ""}`}>
            <Icon size={22} strokeWidth={1.5} />
            {label}
          </span>
        ))}
        <span className="lb-rail__item lb-rail__item--settings">
          <Settings size={22} strokeWidth={1.5} />
          Settings
        </span>
      </nav>

      <aside className="lb-nav">
        <p className="lb-nav__label">Navigation</p>
        <span className="lb-nav__item is-active">
          <Megaphone size={18} strokeWidth={1.5} />
          Social Media Copilot
        </span>
        <span className="lb-nav__item">
          <FolderOpen size={18} strokeWidth={1.5} />
          My Campaigns
        </span>
      </aside>

      <div className="lb-main">
        <header className="lb-top">
          <span className="lb-top__device" aria-hidden>
            <Smartphone size={16} strokeWidth={1.5} />
          </span>
          <span className="lb-upgrade">
            <Crown size={16} strokeWidth={1.6} />
            Upgrade
          </span>
        </header>

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
              <div className="lb-composer__row">
                <span className="lb-composer__attach" aria-hidden>
                  <Link2 size={20} strokeWidth={1.5} />
                </span>
                <span className="lb-composer__divider" aria-hidden />
                <textarea
                  ref={inputRef}
                  className="lb-composer__input"
                  value={brief}
                  placeholder="Describe your campaign…"
                  aria-label="Campaign brief"
                  rows={3}
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
                    onClick={() => setMenuOpen((open) => !open)}
                  >
                    <ObjectiveIcon size={16} strokeWidth={1.5} />
                    {OBJECTIVES[objective].title}
                    <ChevronDown size={16} strokeWidth={1.5} />
                  </button>
                  {menuOpen ? (
                    <ul className="lb-menu" role="listbox" aria-label="Campaign objective">
                      {OBJECTIVES.map(({ title, supporting, icon: Icon }, i) => (
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
                            <Icon size={18} strokeWidth={1.5} />
                            <span>
                              <b>{title}</b>
                              {supporting}
                            </span>
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
                      Planning…
                    </>
                  ) : (
                    <>
                      Generate
                      <ArrowUpRight size={16} strokeWidth={1.6} />
                    </>
                  )}
                </button>
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
                      <small>AUG</small>
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
                      → Build
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
