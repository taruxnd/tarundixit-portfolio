"use client";

import Image from "next/image";

/** Editorial fragments for Brand Hub — cropped product surface + brand chips. */
export default function BrandHubBento() {
  return (
    <div className="bento-visual bento-visual--brand" aria-hidden>
      <div className="bento-tile bento-tile--shot">
        <Image
          src="/work/kumba-signin-mockup.jpg"
          alt=""
          fill
          sizes="(max-width: 768px) 80vw, 28vw"
          className="bento-shot__img"
        />
        <div className="bento-shot__veil" />
      </div>

      <div className="bento-tile bento-tile--brand-stack">
        <span className="bento-tile__label">Surfaces</span>
        <strong>Web · Social · Deck</strong>
        <div className="bento-brand-swatches">
          <span style={{ background: "#1a1a1a" }} />
          <span style={{ background: "#c4a574" }} />
          <span style={{ background: "#f4efe6" }} />
          <span style={{ background: "#e85d4c" }} />
        </div>
      </div>

      <div className="bento-tile bento-tile--note">
        <span className="bento-tile__label">Single source</span>
        <p>Guidelines, assets, and approvals — one hub.</p>
      </div>
    </div>
  );
}
