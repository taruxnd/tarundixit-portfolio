"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { KIcon, KumbaAppShell, LiveFigure, scrollToStep } from "./LiveKumbaFrame";
import type { KumbaIconName } from "./liveBriefIcons";
import "./live-plan.css";

/**
 * Step 2 of the Copilot flow, working: Kumba's Campaign Overview, rebuilt from the
 * design system's components (campaign-overview-*.tsx). Sections open one at a
 * time. The brief has a view panel (header click) and an inline-sentence edit
 * panel ("View"/"Edit"); moments, watermark and channels change their summaries.
 * Back returns to step 1, Continue moves on to step 3.
 */

const PRODUCT = "Mamaearth Onion Hair Fall Control Shampoo";
const LIVE = "/work/copilot/live";

type SectionId = "brief" | "positioning" | "watermark" | "distribution";

/** campaign-overview-section-visuals.ts */
const VISUALS: Record<SectionId, { icon: KumbaIconName; background: string; accent: string }> = {
  brief: { icon: "file-02", background: "#f4f4f5", accent: "#52525b" },
  positioning: { icon: "idea", background: "#F5EAFF", accent: "#A13CFF" },
  watermark: { icon: "image-01", background: "#EAF2FF", accent: "#3478E8" },
  distribution: { icon: "megaphone-02", background: "#FFEDD5", accent: "#EA580C" },
};

const POSITIONING = {
  coreMessage: "A little care. A better hair day.",
  supporting:
    "Make Mamaearth Onion Hair Fall Control Shampoo part of a thoughtful wash-day routine. Pair familiar creator moments with the goodness of Onion & Plant Keratin, then invite people to discover the product.",
};

/* Brief edit panel options (campaign-overview-brief-edit-panel.tsx) */
const DATE_OPTIONS = ["Nov 2, 2026", "Nov 3, 2026", "Nov 4, 2026", "Nov 5, 2026", "Nov 6, 2026"];
const AUDIENCE_OPTIONS = [
  "Indian adults building a simple, thoughtful hair-care routine",
  "Young professionals exploring everyday hair care",
  "Beauty and personal-care shoppers in India",
];
const REGION_OPTIONS = ["India", "Maharashtra", "Karnataka", "Delhi NCR"];
const TIMEZONE_OPTIONS = ["India Time (Mumbai) • GMT+05:30", "Pacific Time (US) • GMT-07:00", "Eastern Time (US) • GMT-04:00", "UTC • GMT+00:00"];

const POSITIONS = [
  { id: "top-left", label: "Top left" },
  { id: "top-right", label: "Top right" },
  { id: "bottom-left", label: "Bottom left" },
  { id: "bottom-right", label: "Bottom right" },
] as const;
type WatermarkPosition = (typeof POSITIONS)[number]["id"];

const BRANDHUB_MARK = { src: `${LIVE}/kumba-logo-icon.png`, name: "Kumba logo", source: "From BrandHub" };
const CUSTOM_MARK = { src: `${LIVE}/watermark-custom.png`, name: "Screenshot 2026-08-04 at 00.14.50", source: "Custom upload" };

const PLATFORMS = [
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "tiktok", label: "TikTok" },
  { id: "x", label: "X" },
] as const;
type PlatformId = (typeof PLATFORMS)[number]["id"];

function cycle<T>(current: T, options: readonly T[]): T {
  const index = options.indexOf(current);
  return options[(index + 1) % options.length] ?? options[0];
}

export default function LivePlanScreen({
  screenshot,
  caption,
  backStepId,
  nextStepId,
}: {
  /** Shown on phones, and before the live screen hydrates. */
  screenshot?: string;
  caption: string;
  /** Step heading the back arrow scrolls to. */
  backStepId: string;
  /** Step heading Continue scrolls to. */
  nextStepId: string;
}) {
  return (
    <LiveFigure screenshot={screenshot} caption={caption} hint="Try it: open a section, switch on a moment" url="kumba.ai/copilot/overview">
      <OverviewApp backStepId={backStepId} nextStepId={nextStepId} />
    </LiveFigure>
  );
}

function OverviewApp({ backStepId, nextStepId }: { backStepId: string; nextStepId: string }) {
  const [openId, setOpenId] = useState<SectionId | null>(null);
  const toggle = (id: SectionId) => setOpenId((current) => (current === id ? null : id));

  // Brief
  const [briefEditing, setBriefEditing] = useState(false);
  const [audience, setAudience] = useState(AUDIENCE_OPTIONS[0]);
  const [region, setRegion] = useState(REGION_OPTIONS[0]);
  const [startDate, setStartDate] = useState(DATE_OPTIONS[0]);
  const [endDate, setEndDate] = useState(DATE_OPTIONS[4]);
  const [timezone, setTimezone] = useState(TIMEZONE_OPTIONS[0]);

  // Moments, watermark, channels
  const [mark, setMark] = useState<{ src: string; name: string; source: string } | null>(BRANDHUB_MARK);
  const [position, setPosition] = useState<WatermarkPosition>("top-right");
  const [opacity, setOpacity] = useState(53);
  const [channels, setChannels] = useState<Set<PlatformId>>(() => new Set(["instagram", "facebook", "x"]));

  const toggleBrief = () => {
    setBriefEditing(false);
    toggle("brief");
  };
  const positionLabel = POSITIONS.find((option) => option.id === position)?.label ?? "Top right";
  const markKind = mark?.source === "From BrandHub" ? "BrandHub mark" : "Brand watermark";
  const channelLabels = PLATFORMS.filter((platform) => channels.has(platform.id)).map((platform) => platform.label);

  return (
    <KumbaAppShell>
      <div className="lp-body">
        <div className="lb-scroll">
          <div className="lp-column">
            <button type="button" className="lp-back" aria-label="Back to step 1" data-cursor="interactive" onClick={() => scrollToStep(backStepId)}>
              <KIcon name="arrow-left-01-round" className="lb-icon--20" />
            </button>
            <p className="lp-eyebrow">Step 1 of 3 · Social Media Copilot</p>
            <p className="lp-title">Campaign Overview</p>
            <p className="lp-lead">Review your Mamaearth brief, positioning, audience, and distribution — then continue to campaign ideas.</p>

            <div className="lp-stack">
              <Section
                id="brief"
                title="Campaign brief"
                summary={`${PRODUCT} • ${region} • 5 days`}
                openId={openId}
                onToggle={toggleBrief}
                onView={() => {
                  setBriefEditing(true);
                  if (openId !== "brief") toggle("brief");
                }}
                expandedCta={briefEditing ? "Close" : "Edit"}
                onExpandedCta={briefEditing ? toggleBrief : () => setBriefEditing(true)}
                bordered
              >
                {briefEditing ? (
                  <div className="lp-brief-edit">
                    <p className="lp-sentence">
                      <span>I am promoting</span> <span className="lp-field lp-field--locked">{PRODUCT}</span> <span>through a</span>{" "}
                      <span className="lp-field lp-field--locked">Product Campaign</span> <span>campaign</span>
                    </p>
                    <p className="lp-sentence">
                      <span>for</span> <InlineField label={audience} onClick={() => setAudience(cycle(audience, AUDIENCE_OPTIONS))} /> <span>in</span>{" "}
                      <InlineField label={region} onClick={() => setRegion(cycle(region, REGION_OPTIONS))} />
                      <span>, running from</span> <InlineField label={startDate} onClick={() => setStartDate(cycle(startDate, DATE_OPTIONS))} /> <span>to</span>{" "}
                      <InlineField label={endDate} onClick={() => setEndDate(cycle(endDate, DATE_OPTIONS))} /> <span>in</span>{" "}
                      <InlineField label={timezone.split(" • ")[0]} onClick={() => setTimezone(cycle(timezone, TIMEZONE_OPTIONS))} />
                      <span>.</span>
                    </p>
                    <div className="lp-sources">
                      <p className="lp-overline lp-sources__label">Source images</p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="lp-source" src={`${LIVE}/mamaearth-product.webp`} alt="" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="lp-source" src={`${LIVE}/mamaearth-product-details.webp`} alt="" />
                      <button type="button" className="lp-source-add" aria-label="Add images" data-cursor="interactive">
                        <KIcon name="upload-01" className="lp-icon-14" />
                      </button>
                      <span className="lp-caption">Add images</span>
                    </div>
                  </div>
                ) : (
                  <div className="lp-brief">
                    <div>
                      <p className="lp-strong">{PRODUCT}</p>
                      <p className="lp-muted lp-gap-6">Product Campaign · {region}</p>
                      <p className="lp-muted">
                        {startDate} – {endDate}
                      </p>
                    </div>
                    <div className="lp-brief__col">
                      <p className="lp-overline">Audience</p>
                      <p className="lp-body lp-gap-4">{audience}</p>
                    </div>
                    <div className="lp-brief__col">
                      <p className="lp-overline">Source images</p>
                      <span className="lp-thumbs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`${LIVE}/mamaearth-product.webp`} alt="" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`${LIVE}/mamaearth-product-details.webp`} alt="" />
                      </span>
                      <p className="lp-caption">Mamaearth product references</p>
                    </div>
                  </div>
                )}
              </Section>

              <Section id="positioning" title="Campaign positioning" summary={POSITIONING.coreMessage} openId={openId} onToggle={toggle}>
                <p className="lp-overline">Core message</p>
                <div className="lp-quote">
                  <p className="lp-quote__message">{POSITIONING.coreMessage}</p>
                  <p className="lp-quote__supporting">{POSITIONING.supporting}</p>
                </div>
                <div className="lp-actions">
                  <button type="button" className="lp-link" data-cursor="interactive">
                    <KIcon name="refresh" className="lp-icon-14" />
                    New campaign
                  </button>
                  <button type="button" className="lp-link" data-cursor="interactive">
                    <KIcon name="sparkles" className="lp-icon-14" />
                    Refine campaign
                  </button>
                </div>
              </Section>

              <Section
                id="watermark"
                title="Watermark"
                summary={mark ? `${markKind} • ${positionLabel}` : `No watermark • ${positionLabel}`}
                openId={openId}
                onToggle={toggle}
              >
                <p className="lp-muted">Apply your brand mark to every generated creative.</p>
                <div className="lp-watermark">
                  <div className="lp-preview">
                    <span className="lp-preview__label">Preview</span>
                    {mark ? (
                      <span className={`lp-preview__mark is-${position}`} style={{ opacity: opacity / 100 }} aria-hidden>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={mark.src} alt="" />
                        <span>{mark.name}</span>
                      </span>
                    ) : null}
                  </div>
                  <div className="lp-watermark__controls">
                    <p className="lp-overline">Watermark asset</p>
                    {mark ? (
                      <div className="lp-asset">
                        <div className="lp-asset__info">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={mark.src} alt="" />
                          <div>
                            <p className="lp-asset__name">{mark.name}</p>
                            <p className="lp-caption">{mark.source}</p>
                          </div>
                        </div>
                        <button type="button" className="lp-link" data-cursor="interactive" onClick={() => setMark(null)}>
                          Remove
                        </button>
                      </div>
                    ) : null}
                    <div className="lp-asset-actions">
                      <button type="button" className="lp-link lp-link--brand" data-cursor="interactive" onClick={() => setMark(CUSTOM_MARK)}>
                        <b>+</b> Add new
                      </button>
                      <button type="button" className="lp-link" data-cursor="interactive" onClick={() => setMark(BRANDHUB_MARK)}>
                        Use BrandHub mark
                      </button>
                    </div>
                    <div className="lp-position">
                      <p className="lp-overline">Position</p>
                      <div className="lp-chips">
                        {POSITIONS.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            className={`lp-chip${position === option.id ? " is-selected" : ""}`}
                            aria-pressed={position === option.id}
                            data-cursor="interactive"
                            onClick={() => setPosition(option.id)}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      <div className="lp-opacity">
                        <div className="lp-row">
                          <p className="lp-overline">Opacity</p>
                          <p className="lp-overline">{opacity}%</p>
                        </div>
                        <input
                          className="lp-range"
                          type="range"
                          min={0}
                          max={100}
                          value={opacity}
                          aria-label="Watermark opacity"
                          style={{ "--lp-fill": `${opacity}%` } as CSSProperties}
                          onChange={(event) => setOpacity(Number(event.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Section>

              <Section
                id="distribution"
                title="Where it will appear"
                summary={channelLabels.length ? `${channelLabels.join(", ")} (${channels.size})` : "No channels selected (0)"}
                openId={openId}
                onToggle={toggle}
              >
                <div className="lp-row">
                  <p className="lp-muted">Choose channels now; formatting adapts later.</p>
                  <p className="lp-caption">{channels.size} selected</p>
                </div>
                <div className="lp-platforms">
                  {PLATFORMS.map((platform) => {
                    const selected = channels.has(platform.id);
                    return (
                      <button
                        key={platform.id}
                        type="button"
                        className="lp-platform"
                        aria-pressed={selected}
                        data-cursor="interactive"
                        onClick={() =>
                          setChannels((prev) => {
                            const next = new Set(prev);
                            if (next.has(platform.id)) next.delete(platform.id);
                            else next.add(platform.id);
                            return next;
                          })
                        }
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="lp-checkbox" src={`${LIVE}/checkbox-${selected ? "checked-16" : "default"}.svg`} alt="" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="lp-platform__logo" src={`${LIVE}/platforms/${platform.id}.svg`} alt="" />
                        {platform.label}
                      </button>
                    );
                  })}
                </div>
              </Section>
            </div>
          </div>
        </div>

        <footer className="lp-footer">
          <div className="lp-footer__inner">
            <button type="button" className="lb-generate lp-continue" data-cursor="interactive" onClick={() => scrollToStep(nextStepId)}>
              Continue
              <KIcon name="arrow-up-right-01-round" className="lb-icon--16" />
            </button>
          </div>
        </footer>
      </div>
    </KumbaAppShell>
  );
}

/** Editable sentence field (BriefInlineField): brand text, brand underline, chevron; click cycles the option. */
function InlineField({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="lp-field" data-cursor="interactive" onClick={onClick}>
      {label}
      <KIcon name="arrow-down-01-round" className="lp-icon-14" />
    </button>
  );
}

function Section({
  id,
  title,
  summary,
  openId,
  onToggle,
  onView,
  expandedCta = "Close",
  onExpandedCta,
  bordered,
  children,
}: {
  id: SectionId;
  title: string;
  summary: string;
  openId: SectionId | null;
  onToggle: (id: SectionId) => void;
  /** Collapsed "View" CTA; defaults to toggling. */
  onView?: () => void;
  expandedCta?: string;
  onExpandedCta?: () => void;
  /** Border above and below (the brief); others only below. */
  bordered?: boolean;
  children: ReactNode;
}) {
  const expanded = openId === id;
  const visual = VISUALS[id];
  const toggleSelf = () => onToggle(id);
  return (
    <section className={`lp-section${expanded ? " is-open" : ""}${bordered ? " lp-section--bordered" : ""}`}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        className="lp-section__head"
        data-cursor="interactive"
        onClick={toggleSelf}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleSelf();
          }
        }}
      >
        {expanded ? null : (
          <span className="lp-well" style={{ background: visual.background, color: visual.accent }} aria-hidden>
            <KIcon name={visual.icon} className="lb-icon--20" />
          </span>
        )}
        <span className="lp-section__titles">
          <span className="lp-section__title">{title}</span>
          {expanded ? null : <span className="lp-section__summary">{summary}</span>}
        </span>
        <button
          type="button"
          className="lp-view"
          data-cursor="interactive"
          aria-label={expanded ? `${expandedCta} ${title}` : `View ${title}`}
          onClick={(event) => {
            event.stopPropagation();
            if (expanded) (onExpandedCta ?? toggleSelf)();
            else (onView ?? toggleSelf)();
          }}
        >
          {expanded ? (
            <>
              {expandedCta}
              {expandedCta === "Close" ? <KIcon name="cancel-01" className="lp-icon-14" /> : null}
            </>
          ) : (
            <>
              View
              <KIcon name="arrow-down-01-round" className="lb-icon--16" />
            </>
          )}
        </button>
      </div>
      <div className="lp-expand">
        <div className="lp-expand__inner">
          <div className="lp-section__body">{children}</div>
        </div>
      </div>
    </section>
  );
}
