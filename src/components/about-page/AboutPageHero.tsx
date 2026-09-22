"use client";

import AboutPageRoad from "@/components/about-page/AboutPageRoad";
import LiquidGlass from "@/components/navbar/LiquidGlass";
import { useTheme } from "@/components/ThemeController";
import { assetUrl } from "@/lib/cdnAssets";
import { stripFontClassName } from "@/lib/heroFonts";
import { contentContainerClassName } from "@/lib/sectionLayout";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import "../hero.css";
import "./about-page.css";

const AVATAR_IMAGE = assetUrl("profile/tarun-avatar.jpg");
const AVATAR_VIDEO = assetUrl("profile/tarun-avatar.mov");

type AboutWordKind =
  | "name"
  | "designer"
  | "engineers"
  | "ai"
  | "ux"
  | "craft"
  | "technology";

function Word({
  kind,
  children,
}: {
  kind: AboutWordKind;
  children: ReactNode;
}) {
  return (
    <span className={`about-page-word about-page-word--${kind}`} data-cursor="interactive">
      {kind === "engineers" ? (
        <svg
          className="about-page-word__cursor-icon"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            fill="currentColor"
            d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23"
          />
        </svg>
      ) : null}
      <span className="about-page-word__label">{children}</span>
      {kind === "designer" ? (
        <span className="about-page-word__figma" aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </span>
      ) : null}
      {kind === "engineers" || kind === "technology" ? (
        <span className="about-page-word__caret" aria-hidden />
      ) : null}
      {kind === "ux" ? (
        <span className="about-page-word__ux-mark" aria-hidden>
          ◦
        </span>
      ) : null}
      {kind === "craft" ? (
        <span className="about-page-word__craft-line" aria-hidden />
      ) : null}
      {kind === "ai" ? (
        <span className="about-page-word__spark" aria-hidden>
          <i />
          <i />
          <i />
        </span>
      ) : null}
    </span>
  );
}

function KumbaAiLink() {
  return (
    <Link href="/#work" data-cursor="interactive" className="about-page-kumba">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="about-page-kumba__icon"
        src={assetUrl("about/kumba-logo-icon.png")}
        alt=""
        width={48}
        height={48}
        draggable={false}
      />
      Kumba AI
    </Link>
  );
}

function AboutIntro() {
  const { reducedMotion } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const showVideo = !reducedMotion && !videoFailed;

  useEffect(() => {
    if (!showVideo) return;
    const video = videoRef.current;
    if (!video) return;
    void video.play().catch(() => setVideoFailed(true));
  }, [showVideo]);

  return (
    <p
      className="hero-intro about-page-hero__intro theme-transition"
      style={{
        fontFamily: "var(--font-geist), ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <span className="hero-intro__text" lang="hi">
        नमस्ते
      </span>
      <span className="hero-intro__avatar">
        <Image
          src={AVATAR_IMAGE}
          alt=""
          width={256}
          height={256}
          sizes="(max-width: 380px) 32px, (min-width: 1600px) 40px, 36px"
          quality={95}
          className="hero-intro__avatar-img"
          priority
        />
        {showVideo ? (
          <video
            ref={videoRef}
            className={`hero-intro__avatar-video${videoReady ? " is-ready" : ""}`}
            src={AVATAR_VIDEO}
            muted
            playsInline
            autoPlay
            loop
            preload="auto"
            aria-hidden
            onPlaying={() => setVideoReady(true)}
            onError={() => setVideoFailed(true)}
          />
        ) : null}
      </span>
      <span className="hero-intro__text">
        I&apos;m <span className="hero-intro__name">Tarun Dixit</span>
      </span>
    </p>
  );
}

type AboutPageHeroProps = {
  /** Anchor id for in-page nav (e.g. homepage `#about`). */
  id?: string;
  /** Optional CTA to the full about route (homepage only). */
  moreHref?: string;
};

/** About hero — copy + road, no ID card. Shared by `/` and `/about`. */
export default function AboutPageHero({
  id,
  moreHref,
}: AboutPageHeroProps = {}) {
  const HeadingTag = id ? "h2" : "h1";

  // Soft-nav from a scrolled home page can leave window.scrollY past the
  // one-fold /about height (blank). Always pin to top on the dedicated route.
  useEffect(() => {
    if (moreHref) return;
    window.scrollTo(0, 0);
  }, [moreHref]);

  return (
    <section
      id={id}
      className={`about-page-hero theme-transition ${stripFontClassName}${
        moreHref ? " about-page-hero--with-cta" : ""
      }`}
      aria-labelledby="about-page-heading"
    >
      <div className="about-page-hero__stage">
        <div className={`${contentContainerClassName} about-page-hero__inner`}>
          <AboutIntro />
          <HeadingTag id="about-page-heading" className="sr-only">
            About Tarun Dixit
          </HeadingTag>

          <div className="about-page-hero__prose">
            <p>
              A <Word kind="designer">product designer</Word> who{" "}
              <Word kind="engineers">engineers</Word>, currently working at{" "}
              <KumbaAiLink />.
            </p>
            <p>
              I like looking beyond just the <Word kind="craft">design</Word>. I
              want to understand the user, the business, and what we are trying
              to achieve. Then I try to figure out where I can bring value
              through design and <Word kind="technology">technology</Word>.
            </p>
            <p>
              I believe <Word kind="ux">UX</Word> comes first. There is always a
              real person on the other side of what we build, and understanding
              that person is something you have to do yourself.{" "}
              <Word kind="ai">AI</Word> can
              help us explore ideas, make things faster, and even build a lot of
              what we imagine. But I don&apos;t think AI will truly understand
              people the way people understand people.
            </p>
            <p>
              And then there is <Word kind="craft">taste</Word>. You can use AI
              to make almost anything today, but knowing what looks right, what
              feels right, what to keep, what to remove, and what makes
              something worth remembering is a different thing. I don&apos;t
              think AI will master that anytime soon. Maybe not even in 100
              years.
            </p>
          </div>

          {moreHref ? (
            <div className="about-page-hero__cta">
              <Link
                href={moreHref}
                scroll
                data-cursor="interactive"
                className="about-page-hero__more"
              >
                <LiquidGlass className="about-page-hero__more-glass">
                  <span className="about-page-hero__more-label">
                    There&apos;s more to me
                    <span className="about-page-hero__arrow" aria-hidden>
                      →
                    </span>
                  </span>
                </LiquidGlass>
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      <AboutPageRoad />
    </section>
  );
}
