"use client";

/** Editorial product fragments for the Copilot flagship bento. */
export default function CopilotBento() {
  return (
    <div className="bento-visual bento-visual--copilot" aria-hidden>
      <div className="bento-visual__glow" />

      <div className="bento-tile bento-tile--metric">
        <span className="bento-tile__label">Campaign span</span>
        <strong className="bento-tile__value">5 days</strong>
        <span className="bento-tile__hint">brief → publish-ready</span>
      </div>

      <div className="bento-tile bento-tile--composer">
        <span className="bento-tile__label">Composer</span>
        <p className="bento-composer__prompt">
          Launch a family mobility campaign for Kia Carens Clavis…
        </p>
        <div className="bento-composer__meta">
          <span className="bento-dot bento-dot--ig" />
          <span className="bento-dot bento-dot--x" />
          <span className="bento-dot bento-dot--li" />
          <em>Drafting posts…</em>
        </div>
      </div>

      <div className="bento-tile bento-tile--post bento-tile--post-a">
        <span className="bento-post__format">Carousel · IG</span>
        <strong>Day 1 · Family mobility</strong>
        <p>Five seats. One Clavis. Weekend ready.</p>
      </div>

      <div className="bento-tile bento-tile--post bento-tile--post-b">
        <span className="bento-post__format">Reel · TikTok</span>
        <strong>Day 2 · Open road</strong>
        <p>School run to Sunday drive — in 15s.</p>
      </div>

      <div className="bento-tile bento-tile--objectives">
        <span className="bento-chip is-active">Promote a Product</span>
        <span className="bento-chip">Brand Awareness</span>
        <span className="bento-chip">Announce an Event</span>
      </div>
    </div>
  );
}
