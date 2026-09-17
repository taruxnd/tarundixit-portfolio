"use client";

import AboutDioramaRoad from "@/components/about-diorama-road/AboutDioramaRoad";
import BusinessCard3D from "@/components/3d-business-card-framer-website-optimized/src/BusinessCard3D";
import LiquidGlass from "@/components/navbar/LiquidGlass";
import { stripFontClassName } from "@/lib/heroFonts";
import { contentContainerClassName } from "@/lib/sectionLayout";
import Link from "next/link";
import type { ReactNode } from "react";
import "./editorial-about.css";

type WordKind =
  | "designer"
  | "engineers"
  | "ai"
  | "systems"
  | "code"
  | "making"
  | "music"
  | "writing";

function Word({
  kind,
  href,
  children,
}: {
  kind: WordKind;
  href?: string;
  children: ReactNode;
}) {
  const inner = (
    <>
      {kind === "engineers" ? (
        <svg
          className="about-word__cursor-icon"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            fill="currentColor"
            d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23"
          />
        </svg>
      ) : null}
      <span className="about-word__label">{children}</span>
      <span className="about-word__aura" aria-hidden />
      {kind === "designer" ? (
        <span className="about-word__figma" aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </span>
      ) : null}
      {kind === "engineers" || kind === "code" ? (
        <span className="about-word__caret" aria-hidden />
      ) : null}
      {kind === "ai" ? (
        <span className="about-word__spark" aria-hidden>
          <i />
          <i />
          <i />
        </span>
      ) : null}
      {kind === "systems" ? (
        <span className="about-word__blocks" aria-hidden>
          <i />
          <i />
          <i />
        </span>
      ) : null}
      {kind === "music" ? (
        <span className="about-word__eq" aria-hidden>
          <i />
          <i />
          <i />
          <i />
        </span>
      ) : null}
      {kind === "writing" ? (
        <span className="about-word__cursor" aria-hidden />
      ) : null}
      {kind === "making" ? (
        <span className="about-word__dot" aria-hidden />
      ) : null}
    </>
  );

  const className = `about-word about-word--${kind}${href ? " about-word--link" : ""}`;

  if (href) {
    return (
      <Link href={href} className={className} data-cursor="interactive">
        {inner}
      </Link>
    );
  }

  return (
    <span className={className} data-cursor="interactive">
      {inner}
    </span>
  );
}

function KumbaAiLink() {
  return (
    <Link
      href="/#work"
      data-cursor="interactive"
      className="about-kumba-link"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="about-kumba-link__icon"
        src="/about/kumba-logo-icon.png"
        alt=""
        width={48}
        height={48}
        draggable={false}
      />
      Kumba AI
    </Link>
  );
}

/**
 * Editorial personal intro — typography left, ID card right.
 * Used on the home page About section (not /about — that route has its own page).
 */
export default function EditorialAbout({
  moreHref = "/about",
}: {
  moreHref?: string;
} = {}) {
  return (
    <section
      id="about"
      className={`editorial-about theme-transition ${stripFontClassName}`}
      aria-labelledby="about-heading"
    >
      <div id="about-stage" className="editorial-about__stage">
        <div className={`${contentContainerClassName} editorial-about__grid`}>
          <div className="editorial-about__copy" id="about-copy">
            <p className="editorial-about__eyebrow">About</p>
            <h2 id="about-heading" className="sr-only">
              About
            </h2>

            <div className="editorial-about__prose">
              <p>
                I&apos;m Tarun Dixit, a{" "}
                <Word kind="designer">product designer</Word> who{" "}
                <Word kind="engineers">engineers</Word>, currently working at{" "}
                <KumbaAiLink />.
              </p>
              <p>
                I like looking beyond just the design. I want to understand the
                user, the business, and what we are trying to achieve, then
                figure out where I can bring value through design and
                technology.
              </p>
              <p>
                I believe UX comes first, but taste is what can make a product
                feel truly great. <Word kind="ai">AI</Word> can help us make
                almost anything, but knowing what is worth making and what feels
                right is still deeply human.
              </p>
              <p>
                I&apos;m interested in AI,{" "}
                <Word kind="making">building things</Word>, and pretty much
                anything that makes me curious.
              </p>
            </div>

            <div className="editorial-about__cta">
              <Link
                href={moreHref}
                data-cursor="interactive"
                className="editorial-about__more"
              >
                <LiquidGlass className="editorial-about__more-glass">
                  <span className="editorial-about__more-label">
                    There&apos;s more to me
                    <span className="editorial-about__arrow" aria-hidden>
                      →
                    </span>
                  </span>
                </LiquidGlass>
              </Link>
            </div>
          </div>

          <aside className="editorial-about__card" aria-label="Employee ID badge">
            <BusinessCard3D
              hangFromSelector="#about-stage"
              matchHeightSelector="#about-copy"
            />
          </aside>
        </div>
      </div>

      <AboutDioramaRoad />
    </section>
  );
}
