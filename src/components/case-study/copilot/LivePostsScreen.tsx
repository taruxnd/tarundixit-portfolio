"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Bookmark, ChartNoAxesColumn, Ellipsis, Globe, Heart, MessageCircle, Repeat2, Send, Share2, ThumbsUp } from "lucide-react";
import { KIcon, KumbaAppShell, LiveFigure, scrollToStep } from "./LiveKumbaFrame";
import "./live-posts.css";

/**
 * Steps 3 and 4 of the Copilot flow, working: Kumba's Generated Posts screen
 * (smart-campaign-generated-posts-screen.tsx) with the post editor dialog
 * (campaign-generated-post-details-dialog.tsx). Opening a post, or Schedule
 * Campaign, edits it in place; step 4 starts with Day 1 already open. No backend: captions, dates and approvals
 * live in component state.
 */

const LIVE = "/work/copilot/live/posts";
const CAMPAIGN_NAME = "A little care. A better hair day.";

type PlatformId = "instagram" | "facebook" | "x";
const PLATFORM_ORDER: PlatformId[] = ["instagram", "facebook", "x"];
const PLATFORM_LABEL: Record<PlatformId, string> = { instagram: "Instagram", facebook: "Facebook", x: "X" };
const PLATFORM_LOGO: Record<PlatformId, string> = {
  instagram: "/work/copilot/live/platforms/instagram.svg",
  facebook: "/work/copilot/live/platforms/facebook.svg",
  x: "/work/copilot/live/platforms/x.svg",
};
/** Feed widths on desktop web, so the preview reads at real size. */
const PREVIEW_WIDTHS: Record<PlatformId, number> = { instagram: 470, facebook: 500, x: 560 };
/** Card chrome around the media (header, actions, caption). */
const PREVIEW_CHROME: Record<PlatformId, number> = { instagram: 200, facebook: 180, x: 176 };
const CAPTION_LIMITS: Record<PlatformId, number> = { instagram: 2200, facebook: 63206, x: 280 };
const SEGMENT_ICON: Record<PlatformId, "instagram" | "facebook-01" | "twitter"> = { instagram: "instagram", facebook: "facebook-01", x: "twitter" };
const TIMEZONES = ["India Time (Mumbai) • GMT+05:30", "Pacific Time (US) • GMT-07:00", "Eastern Time (US) • GMT-04:00", "UTC • GMT+00:00"];
const LOADING_MESSAGES = ["Composing wash-day moments…", "Applying Mamaearth’s campaign style…", "Preparing Instagram, Facebook, and X creatives…"];
/** Stage height inside the 1200 × 828 dialog: 828 − 60 header − 48 padding. */
const STAGE_HEIGHT = 720;

/* campaign-generated-posts-data.ts */
const DAYS = [
  {
    day: 1, title: "A familiar hair-fall moment.", time: "09:30", video: true,
    instagram: "Some wash-day moments feel a little too familiar. Meet Mamaearth Onion Hair Fall Control Shampoo, with Onion & Plant Keratin. A little care. A better hair day.\n\n#Mamaearth #OnionShampoo #HairCare #WashDay",
    facebook: "A familiar hair-fall moment, a little more care in your routine. Discover Mamaearth Onion Hair Fall Control Shampoo with Onion & Plant Keratin, and make your next wash day a moment for yourself.",
    x: "A familiar wash-day moment. A little more care. Meet Mamaearth Onion Hair Fall Control Shampoo, with Onion & Plant Keratin. #Mamaearth #HairCare",
  },
  {
    day: 2, title: "Meet your wash-day essentials.", time: "11:00", video: false,
    instagram: "Meet the ingredients behind your wash-day essential: Onion + Plant Keratin. A simple addition to your hair-care shelf, with Mamaearth Onion Hair Fall Control Shampoo.\n\n#Mamaearth #OnionShampoo #PlantKeratin #WashDayEssentials",
    facebook: "Meet your wash-day essentials. Onion and Plant Keratin come together in Mamaearth Onion Hair Fall Control Shampoo. Discover the product and make a little space for hair care in your routine.",
    x: "Your wash-day essentials, introduced. Onion + Plant Keratin in Mamaearth Onion Hair Fall Control Shampoo. #Mamaearth #OnionShampoo",
  },
  {
    day: 3, title: "A little care in your everyday routine.", time: "18:00", video: true,
    instagram: "A familiar bathroom, a quiet moment, and a little hair care. Bring Mamaearth Onion Hair Fall Control Shampoo into your wash-day ritual.\n\n#Mamaearth #HairCareRoutine #OnionShampoo #ALittleCare",
    facebook: "The best routines make room for you. Take a moment for your hair-care ritual with Mamaearth Onion Hair Fall Control Shampoo. Watch a little everyday care unfold.",
    x: "A little care belongs in your everyday routine. Make room for Mamaearth Onion Hair Fall Control Shampoo. #Mamaearth #WashDay",
  },
  {
    day: 4, title: "Make room for a little hair care.", time: "10:00", video: false,
    instagram: "Your towel. Your favourite brush. A moment that’s just yours. Make room for Mamaearth Onion Hair Fall Control Shampoo in your wash-day ritual.\n\n#Mamaearth #WashDayRitual #SelfCare #OnionShampoo",
    facebook: "Make room for a little hair care. Turn your everyday bathroom shelf into a reminder to slow down and care for yourself, with Mamaearth Onion Hair Fall Control Shampoo.",
    x: "A towel, a brush, a little time for you. Make room for hair care with Mamaearth Onion Hair Fall Control Shampoo. #Mamaearth #SelfCare",
  },
  {
    day: 5, title: "Your next wash day starts here.", time: "09:30", video: false,
    instagram: "Your next wash day starts here. Discover Mamaearth Onion Hair Fall Control Shampoo with Onion & Plant Keratin. Shop now and make a little room for hair care.\n\n#Mamaearth #OnionShampoo #HairCare #ShopNow",
    facebook: "A little care. A better hair day. Discover Mamaearth Onion Hair Fall Control Shampoo with Onion & Plant Keratin. Ready for your next wash day? Shop now.",
    x: "Your next wash day starts here. Discover Mamaearth Onion Hair Fall Control Shampoo with Onion & Plant Keratin. Shop now. #Mamaearth",
  },
];

type Post = {
  id: string;
  day: number;
  title: string;
  video: boolean;
  /** "Mon, 2 Nov" */
  dateLabel: string;
  /** 2026-11-02 */
  date: string;
  /** 09:30 */
  time: string;
  timezone: string;
  captions: Record<PlatformId, string>;
  approved: boolean;
};

function media(post: Pick<Post, "day" | "video">, platform: PlatformId) {
  return post.video ? `${LIVE}/day-${post.day}.webp` : `${LIVE}/day-${post.day}-${platform}.webp`;
}
function aspectLabel(post: Pick<Post, "video">, platform: PlatformId) {
  return post.video ? "1:1" : platform === "instagram" ? "4:5" : platform === "facebook" ? "1.91:1" : "16:9";
}
function aspectRatio(label: string) {
  const [w, h] = label.split(":").map(Number);
  return w / h || 1;
}
function formatDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

function initialPosts(): Post[] {
  return DAYS.map((d) => ({
    id: `day-${d.day}`,
    day: d.day,
    title: d.title,
    video: d.video,
    date: `2026-11-0${d.day + 1}`,
    dateLabel: `${["Mon", "Tue", "Wed", "Thu", "Fri"][d.day - 1]}, ${d.day + 1} Nov`,
    time: d.time,
    timezone: TIMEZONES[0],
    captions: { instagram: d.instagram, facebook: d.facebook, x: d.x },
    approved: false,
  }));
}

export default function LivePostsScreen({
  screenshot,
  caption,
  backStepId,
  initialOpenDay,
  hint,
}: {
  screenshot?: string;
  caption: string;
  /** Step heading the back arrow scrolls to. */
  backStepId: string;
  /** Open the editor on this day straight away (step 4). */
  initialOpenDay?: number;
  hint: string;
}) {
  return (
    <LiveFigure screenshot={screenshot} caption={caption} hint={hint} url="kumba.ai/copilot/generated-posts">
      <PostsApp backStepId={backStepId} initialOpenDay={initialOpenDay} />
    </LiveFigure>
  );
}

function PostsApp({ backStepId, initialOpenDay }: { backStepId: string; initialOpenDay?: number }) {
  const appRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [openId, setOpenId] = useState<string | null>(initialOpenDay ? `day-${initialOpenDay}` : null);
  // The real screen reveals posts after a generation wait; here a short one, the first time it's seen.
  const [revealing, setRevealing] = useState(!initialOpenDay);

  useEffect(() => {
    if (!revealing) return;
    const app = appRef.current;
    if (!app) return;
    let timer: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        timer = window.setTimeout(() => setRevealing(false), 3200);
      },
      { threshold: 0.4 },
    );
    observer.observe(app);
    return () => {
      observer.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, [revealing]);

  const openIndex = posts.findIndex((post) => post.id === openId);
  const openPost = openIndex >= 0 ? posts[openIndex] : null;
  const replacePost = (next: Post) => setPosts((current) => current.map((post) => (post.id === next.id ? next : post)));

  return (
    <KumbaAppShell appRef={appRef}>
      <div className="lp-body">
        <div className="lb-scroll">
          <div className="lp-column lg-column">
            <button type="button" className="lp-back" aria-label="Back to campaign overview" data-cursor="interactive" onClick={() => scrollToStep(backStepId)}>
              <KIcon name="arrow-left-01-round" className="lb-icon--20" />
            </button>
            <p className="lp-eyebrow">Step 3 of 3 · Social Media Copilot</p>
            <p className="lp-title">Generated Posts</p>
            <p className="lp-lead">{revealing ? "Preparing 5 Mamaearth posts for Instagram, Facebook, and X…" : "Review the generated content before scheduling or publishing."}</p>

            <div className="lg-grid">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} revealing={revealing} onOpen={() => !revealing && setOpenId(post.id)} />
              ))}
            </div>
          </div>
        </div>

        <footer className="lp-footer">
          <div className="lp-footer__inner lg-footer__inner">
            <button type="button" className={`lb-generate lg-cta${revealing ? " is-waiting" : ""}`} data-cursor="interactive" onClick={() => !revealing && setOpenId("day-1")}>
              <KIcon name="calendar-03" className="lb-icon--16" />
              Schedule Campaign
            </button>
          </div>
        </footer>
      </div>

      {openPost ? (
        <PostEditor
          key={openPost.id}
          post={openPost}
          canPrevious={openIndex > 0}
          canNext={openIndex < posts.length - 1}
          onReplace={replacePost}
          onNavigate={(direction) => {
            const next = posts[openIndex + direction];
            if (next) setOpenId(next.id);
          }}
          onClose={() => setOpenId(null)}
        />
      ) : null}
    </KumbaAppShell>
  );
}

/* campaign-generated-post-card.tsx */
function PostCard({ post, revealing, onOpen }: { post: Post; revealing: boolean; onOpen: () => void }) {
  return (
    <article className="lg-card">
      <button type="button" className="lg-card__media-button" data-cursor="interactive" onClick={onOpen}>
        <div className="lg-card__media">
          {revealing ? (
            <GeneratingLoad />
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={media(post, "instagram")} alt="" className={post.video ? "is-cover" : "is-contain"} loading="lazy" />
              {post.video ? (
                <span className="lg-card__play" aria-hidden>
                  <KIcon name="play" className="lb-icon--16" />
                </span>
              ) : null}
              <span className="lg-card__open" aria-hidden>
                <KIcon name="arrow-up-right-01-round" className="lb-icon--16" />
              </span>
              <span className="lg-card__aspect">{aspectLabel(post, "instagram")}</span>
            </>
          )}
        </div>
      </button>
      <div className="lg-card__body">
        <p className="lg-card__title">{post.title}</p>
        <div className="lg-card__meta">
          <div>
            <p className="lg-card__date">
              {post.dateLabel}
              <span className="lg-dim"> · </span>
              {post.time}
            </p>
            <p className="lg-card__format">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PLATFORM_LOGO.instagram} alt="" />
              <KIcon name={post.video ? "video-01" : "image-01"} className="lp-icon-14" />
              {post.video ? "Video" : "Static"}
            </p>
          </div>
          {post.approved ? (
            <span className="lg-badge">
              <i aria-hidden />
              Scheduled
            </span>
          ) : (
            <button type="button" className="lg-edit" data-cursor="interactive" onClick={onOpen}>
              Edit
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/* media-generating-load.tsx */
function GeneratingLoad() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % LOADING_MESSAGES.length), 2600);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div className="lg-loading" role="status" aria-live="polite" aria-label={LOADING_MESSAGES[index]}>
      <span className="lg-loading__shimmer" aria-hidden />
      <span className="lg-loading__spinner" aria-hidden />
      <p key={LOADING_MESSAGES[index]} className="lg-loading__message">
        {LOADING_MESSAGES[index]}
      </p>
    </div>
  );
}

/* campaign-generated-post-details-dialog.tsx */
function PostEditor({
  post,
  canPrevious,
  canNext,
  onReplace,
  onNavigate,
  onClose,
}: {
  post: Post;
  canPrevious: boolean;
  canNext: boolean;
  onReplace: (post: Post) => void;
  onNavigate: (direction: -1 | 1) => void;
  onClose: () => void;
}) {
  const [platform, setPlatform] = useState<PlatformId>("instagram");
  const [captions, setCaptions] = useState(post.captions);
  const [date, setDate] = useState(post.date);
  const [time, setTime] = useState(post.time);
  const [timezone, setTimezone] = useState(post.timezone);
  const [approved, setApproved] = useState(post.approved);
  const captionRef = useRef<HTMLTextAreaElement>(null);

  const caption = captions[platform];
  const limit = CAPTION_LIMITS[platform];
  const overLimit = caption.length > limit;
  const overLimitPlatforms = PLATFORM_ORDER.filter((id) => captions[id].length > CAPTION_LIMITS[id]);
  const validDate = !Number.isNaN(new Date(`${date}T12:00:00`).getTime());
  const aspect = aspectLabel(post, platform);
  const ratio = aspectRatio(aspect);
  const frameWidth = Math.min(PREVIEW_WIDTHS[platform], (STAGE_HEIGHT - PREVIEW_CHROME[platform] - 12) * ratio);

  // Caption field grows with its text.
  useLayoutEffect(() => {
    const el = captionRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
  }, [caption, platform]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captions, date, time, timezone, approved]);

  const draft = (): Post => ({
    ...post,
    captions,
    date,
    dateLabel: validDate ? formatDate(date) : post.dateLabel,
    time: time || post.time,
    timezone,
    approved,
  });
  const close = () => {
    onReplace(draft());
    onClose();
  };
  const navigate = (direction: -1 | 1) => {
    onReplace(draft());
    onNavigate(direction);
  };
  const approve = () => {
    if (overLimitPlatforms.length || !validDate || approved) return;
    setApproved(true);
    onReplace({ ...draft(), approved: true });
  };
  const edit = (next: string) => {
    setCaptions((current) => ({ ...current, [platform]: next }));
    setApproved(false);
  };

  return (
    <Dialog label={`${post.title} editor`} onClose={close} className="lg-editor">
      <header className="lg-editor__header">
        <div className="lg-editor__heading">
          <p className="lg-editor__title">
            Day {post.day} · {post.title.replace(/\.$/, "")}
          </p>
          <p className="lg-editor__description">
            Mamaearth · {CAMPAIGN_NAME} · {validDate ? formatDate(date) : post.dateLabel} · {post.video ? "Video" : "Static"} {aspect}
          </p>
        </div>
        <button type="button" className="lg-icon-button" aria-label="Close post editor" data-cursor="interactive" onClick={close}>
          <KIcon name="cancel-01" className="lb-icon--16" />
        </button>
      </header>
      <div className="lg-editor__layout">
        <section className="lg-stage" aria-label={`${PLATFORM_LABEL[platform]} preview`}>
          <div className="lg-stage__body">
            <button type="button" className="lg-stage__nav is-prev" disabled={!canPrevious} aria-label="Previous day" data-cursor="interactive" onClick={() => navigate(-1)}>
              <KIcon name="arrow-left-01-round" className="lb-icon--20" />
            </button>
            <button type="button" className="lg-stage__nav is-next" disabled={!canNext} aria-label="Next day" data-cursor="interactive" onClick={() => navigate(1)}>
              <KIcon name="arrow-right-01-round" className="lb-icon--20" />
            </button>
            <div className="lg-preview-frame" style={{ width: frameWidth }}>
              <FeedPreview key={`${post.id}-${platform}`} platform={platform} caption={caption}>
                <div className="lg-media" style={{ aspectRatio: ratio }}>
                  {post.video ? (
                    <StageVideo key={`${post.id}-${platform}`} src={`${LIVE}/day-${post.day}.mp4`} poster={media(post, platform)} label={post.title} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={media(post, platform)} alt={post.title} />
                  )}
                </div>
              </FeedPreview>
            </div>
          </div>
        </section>

        <aside className="lg-panel" aria-label="Post editing">
          <div className="lg-panel__scroll">
            <div className="lg-segments" role="tablist" aria-label="Platform">
              {PLATFORM_ORDER.map((id) => (
                <button key={id} type="button" role="tab" aria-selected={platform === id} className="lg-segment" data-cursor="interactive" onClick={() => setPlatform(id)}>
                  <KIcon name={SEGMENT_ICON[id]} className="lb-icon--16" />
                  {PLATFORM_LABEL[id]}
                  {captions[id] !== post.captions[id] || captions[id].length > CAPTION_LIMITS[id] ? (
                    <i className={`lg-segment__dot${captions[id].length > CAPTION_LIMITS[id] ? " is-over" : ""}`} aria-hidden />
                  ) : null}
                </button>
              ))}
            </div>

            <div className="lg-section">
              <div className="lg-section__heading">
                <label htmlFor={`lg-caption-${post.id}`} className="lg-section__label">
                  Caption
                </label>
                <span className={`lg-counter${overLimit ? " is-over" : ""}`} role={overLimit ? "alert" : undefined}>
                  {overLimit ? <span>Over the {PLATFORM_LABEL[platform]} limit · </span> : null}
                  {caption.length.toLocaleString()} / {limit.toLocaleString()}
                </span>
              </div>
              <textarea ref={captionRef} id={`lg-caption-${post.id}`} className="lg-caption" value={caption} aria-invalid={overLimit || undefined} onChange={(event) => edit(event.target.value)} />
            </div>

            <div className="lg-section">
              <div className="lg-section__heading">
                <span className="lg-section__label">Schedule</span>
              </div>
              <div className="lg-schedule">
                <label className="lg-field">
                  <span className="lg-field__label">
                    Date<b>*</b>
                  </span>
                  <input type="date" value={date} aria-label="Date" onChange={(event) => { setDate(event.target.value); setApproved(false); }} />
                </label>
                <label className="lg-field">
                  <span className="lg-field__label lg-field__label--small">Time</span>
                  <input type="time" value={time} aria-label="Time" onChange={(event) => { setTime(event.target.value); setApproved(false); }} />
                </label>
                <label className="lg-field lg-field--wide">
                  <span className="lg-field__label lg-field__label--small">Timezone</span>
                  <span className="lg-select">
                    <select value={timezone} aria-label="Timezone" onChange={(event) => { setTimezone(event.target.value); setApproved(false); }}>
                      {TIMEZONES.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <KIcon name="arrow-down-01-round" className="lb-icon--16" />
                  </span>
                </label>
              </div>
            </div>
          </div>
          <footer className="lg-panel__footer">
            <button type="button" className="lb-generate lg-approve" disabled={approved || overLimitPlatforms.length > 0 || !validDate} data-cursor="interactive" onClick={approve}>
              <KIcon name={approved ? "tick-02" : "calendar-03"} className="lb-icon--16" />
              {approved ? "Scheduled" : "Schedule post"}
            </button>
            {overLimitPlatforms.length ? (
              <p className="lg-footer-note" role="status">
                Shorten the {overLimitPlatforms.map((id) => PLATFORM_LABEL[id]).join(" and ")} caption to schedule.
              </p>
            ) : null}
          </footer>
        </aside>
      </div>
    </Dialog>
  );
}

/** Video with Kumba's centred play button; click toggles play, no native control bar. */
function StageVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  };
  return (
    <>
      <video ref={ref} src={src} poster={poster} playsInline preload="metadata" aria-label={label} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onClick={toggle} />
      {playing ? null : (
        <button type="button" className="lg-media__play" aria-label={`Play ${label}`} data-cursor="interactive" onClick={toggle}>
          <KIcon name="play" className="lb-icon--24" />
        </button>
      )}
    </>
  );
}

/* campaign-platform-post-preview.tsx */
function FeedPreview({ platform, caption, children }: { platform: PlatformId; caption: string; children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const instagram = platform === "instagram";
  const facebook = platform === "facebook";
  const captionBlock = (
    <div className={`lg-feed__caption-wrap${caption.length > 110 ? " has-more" : ""}`}>
      <p className={`lg-feed__caption${expanded ? "" : " is-collapsed"}`}>
        {instagram ? <strong>mamaearth.in </strong> : null}
        {caption}
      </p>
      {caption.length > 110 ? (
        <button type="button" className="lg-feed__more" aria-expanded={expanded} data-cursor="interactive" onClick={() => setExpanded((value) => !value)}>
          {expanded ? "less" : "more"}
        </button>
      ) : null}
    </div>
  );
  return (
    <figure className={`lg-feed is-${platform}`} aria-label={`${PLATFORM_LABEL[platform]} feed preview`}>
      <header className="lg-feed__header">
        <span className="lg-feed__avatar" aria-hidden>
          m
        </span>
        <span className="lg-feed__identity">
          <span className="lg-feed__name">{instagram ? "mamaearth.in" : "Mamaearth"}</span>
          <span className="lg-feed__meta">
            {instagram ? "Original content" : facebook ? <>Just now · <Globe size={10} /></> : "@mamaearthindia · Now"}
          </span>
        </span>
        <Ellipsis size={19} className="lg-feed__ellipsis" aria-hidden />
      </header>
      {instagram ? null : captionBlock}
      <div className="lg-feed__media">{children}</div>
      {instagram ? (
        <>
          <div className="lg-feed__actions" aria-hidden>
            <Heart />
            <MessageCircle />
            <Send />
            <Bookmark className="lg-feed__save" />
          </div>
          {captionBlock}
        </>
      ) : facebook ? (
        <div className="lg-feed__fb-actions" aria-hidden>
          <span>
            <ThumbsUp /> Like
          </span>
          <span>
            <MessageCircle /> Comment
          </span>
          <span>
            <Share2 /> Share
          </span>
        </div>
      ) : (
        <div className="lg-feed__x-actions" aria-hidden>
          <MessageCircle />
          <Repeat2 />
          <Heart />
          <ChartNoAxesColumn />
          <Bookmark />
          <Share2 />
        </div>
      )}
    </figure>
  );
}

/* KumbaDialogShell, inside the window rather than the page */
function Dialog({ label, onClose, className, children }: { label: string; onClose: () => void; className: string; children: ReactNode }) {
  return (
    <div className="lg-overlay" onPointerDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className={`lg-dialog ${className}`} role="dialog" aria-modal="true" aria-label={label} style={{ "--lg-pad": "0px" } as CSSProperties}>
        {children}
      </div>
    </div>
  );
}
