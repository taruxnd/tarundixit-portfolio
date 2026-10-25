"use client";

import { Roboto_Flex } from "next/font/google";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { KUMBA_ICONS, type KumbaIconName } from "./liveBriefIcons";
import "./live-brief.css";

/**
 * Shared pieces for the live Copilot screens in the case study: the figure that
 * swaps a screenshot for a working screen on tablets and desktops, the browser
 * window it sits in, and Kumba's app shell (primary rail, secondary menu, top
 * bar). Rebuilt from the Kumba design system's tokens; no Kumba code is copied.
 * Screens are laid out at 1440 × 900, the size the screenshots were taken at,
 * and scaled to the frame.
 */

/** Kumba's product font. */
const robotoFlex = Roboto_Flex({ subsets: ["latin"], display: "swap" });

const DESIGN_W = 1440;
const CHROME_H = 48;
const APP_H = 900;

/** Kumba's Copilot primary rail (smpPrimaryRailNavItems). */
const RAIL: { label: string; icon: KumbaIconName; active?: boolean }[] = [
  { label: "Home", icon: "home-01" },
  { label: "Copilot", icon: "megaphone-02", active: true },
  { label: "Chat", icon: "chatting-01" },
  { label: "Image", icon: "image-01" },
  { label: "Video", icon: "video-01" },
  { label: "Assets", icon: "folder-01" },
];

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Scroll the case study to a step heading. */
export function scrollToStep(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

/** A Kumba sharp icon, inlined. Size it with the wrapper's width/height. */
export function KIcon({ name, className }: { name: KumbaIconName; className?: string }) {
  return <span className={`lb-icon ${className ?? ""}`} aria-hidden dangerouslySetInnerHTML={{ __html: KUMBA_ICONS[name] }} />;
}

/**
 * The case-study figure. Phones (and the first render) get the screenshot: a
 * scaled-down desktop app is too small to use there.
 */
export function LiveFigure({
  screenshot,
  caption,
  hint,
  url,
  children,
}: {
  screenshot?: string;
  caption: string;
  /** Appended to the caption when the live screen is showing. */
  hint: string;
  /** Shown in the browser's address bar. */
  url: string;
  children: ReactNode;
}) {
  const [live, setLive] = useState(false);

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
        <LiveWindow caption={caption} url={url}>
          {children}
        </LiveWindow>
      ) : screenshot ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={screenshot} alt={caption} loading="lazy" decoding="async" />
      ) : null}
      <figcaption>
        {caption}
        {live ? <span className="lb-hint"> · {hint}</span> : null}
      </figcaption>
    </figure>
  );
}

function LiveWindow({ caption, url, children }: { caption: string; url: string; children: ReactNode }) {
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
          <span className="lb-url">{url}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Kumba's Copilot app shell; `children` fill the area under the top bar. */
export function KumbaAppShell({ appRef, children }: { appRef?: RefObject<HTMLDivElement | null>; children: ReactNode }) {
  return (
    <div ref={appRef} className="lb-app">
      <nav className="lb-rail" aria-label="Kumba">
        <span className="lb-rail__logo" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/work/copilot/live/kumba-logo-mark.webp" alt="" width={29} height={17} />
        </span>
        <span className="lb-rail__items">
          {RAIL.map(({ label, icon, active }) => (
            <span key={label} className={`lb-rail__item${active ? " is-active" : ""}`}>
              <KIcon name={icon} className="lb-icon--24" />
              {label}
            </span>
          ))}
        </span>
        <span className="lb-rail__item lb-rail__item--settings">
          <KIcon name="setting-02" className="lb-icon--24" />
          Settings
        </span>
      </nav>

      <aside className="lb-nav">
        <p className="lb-nav__label">Navigation</p>
        <span className="lb-nav__item is-active">
          <KIcon name="megaphone-02" className="lb-icon--20" />
          Social Media Copilot
        </span>
        <span className="lb-nav__item">
          <KIcon name="folder-01" className="lb-icon--20" />
          My Campaigns
        </span>
      </aside>

      <div className="lb-main">
        <header className="lb-top">
          {/* Kumba's light switch for the preview theme (on = light). */}
          <span className="lb-switch" aria-hidden>
            <span className="lb-switch__rocker" />
          </span>
          <span className="lb-upgrade">
            <KIcon name="crown" className="lb-icon--16" />
            Upgrade
          </span>
        </header>
        {children}
      </div>
    </div>
  );
}
