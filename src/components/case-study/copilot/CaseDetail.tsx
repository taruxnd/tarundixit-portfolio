"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * "Show details" mode for the case study. The short read is the default;
 * the toggle reveals <Detail> blocks with the full story under each section.
 * The choice is remembered per viewer (best effort) and can be opened
 * directly with ?details=1.
 */

const STORAGE_KEY = "copilot-case-study:details";

type DetailState = { on: boolean; set: (next: boolean) => void };
const DetailContext = createContext<DetailState>({ on: false, set: () => {} });

export function DetailProvider({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    let initial = false;
    try {
      const fromUrl = new URLSearchParams(window.location.search).get("details");
      if (fromUrl === "1") initial = true;
      else if (fromUrl === "0") initial = false;
      else initial = window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* storage blocked: stay on the short read */
    }
    if (initial) setOn(true);
  }, []);

  const set = (next: boolean) => {
    setOn(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  return (
    <DetailContext.Provider value={{ on, set }}>
      <div className="cs-detail-root" data-details={on ? "on" : "off"}>
        {children}
      </div>
    </DetailContext.Provider>
  );
}

function Switch({ compact = false }: { compact?: boolean }) {
  const { on, set } = useContext(DetailContext);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      className={`cs-detail-switch${compact ? " cs-detail-switch--compact" : ""}`}
      onClick={() => set(!on)}
      data-cursor="interactive"
    >
      <span className="cs-detail-switch__track" aria-hidden>
        <span className="cs-detail-switch__thumb" />
      </span>
      <span className="cs-detail-switch__label">{compact ? "Full case study" : "Read the full case study"}</span>
      {!compact && (
        <span className="cs-detail-switch__hint">
          {on ? "Research, iterations and trade-offs added · 10 min" : "Adds the research, iterations and trade-offs · 10 min"}
        </span>
      )}
    </button>
  );
}

/** Header toggle, plus a floating copy once the header one scrolls away. */
export function DetailToggle() {
  const ref = useRef<HTMLDivElement>(null);
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setFloating(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={ref} className="cs-detail-toggle">
        <Switch />
      </div>
      <div className="cs-detail-float" data-visible={floating ? "true" : "false"} aria-hidden={!floating}>
        <Switch compact />
      </div>
    </>
  );
}

/** Reading time that follows the toggle. */
export function ReadTime() {
  const { on } = useContext(DetailContext);
  return <span>{on ? "10 min read" : "2 min read"}</span>;
}

/** A block that only appears in detail mode. */
export function Detail({
  children,
  label = "In detail",
}: {
  children: ReactNode;
  label?: string;
}) {
  const { on } = useContext(DetailContext);
  return (
    <div className="cs-detail" data-open={on ? "true" : "false"} inert={!on} aria-hidden={!on}>
      <div className="cs-detail__inner">
        <div className="cs-detail__body">
          <p className="cs-detail__label">{label}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

/** A whole section that only exists in detail mode (heading included). */
export function DetailSection({ children }: { children: ReactNode }) {
  const { on } = useContext(DetailContext);
  return (
    <div className="cs-detail cs-detail--section" data-open={on ? "true" : "false"} inert={!on} aria-hidden={!on}>
      <div className="cs-detail__inner">
        <div>{children}</div>
      </div>
    </div>
  );
}
