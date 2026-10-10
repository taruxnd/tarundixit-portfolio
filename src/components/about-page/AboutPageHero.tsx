"use client";

import AboutPageRoad from "@/components/about-page/AboutPageRoad";
import AboutGuests from "@/components/about-page/AboutGuests";
import LiquidGlass from "@/components/navbar/LiquidGlass";
import { assetUrl } from "@/lib/cdnAssets";
import { stripFontClassName } from "@/lib/heroFonts";
import { contentContainerClassName } from "@/lib/sectionLayout";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import "../hero.css";
import "./about-page.css";

const AVATAR_IMAGE = assetUrl("profile/tarun-avatar.jpg");

type AboutWordKind = "designer" | "engineers" | "craft" | "years";

function Word({
  kind,
  children,
}: {
  kind: AboutWordKind;
  children: ReactNode;
}) {
  const [active,setActive]=useState(false);
  const interactive=kind === "years";
  return (
    <span
      className={`about-page-word about-page-word--${kind}`}
      data-cursor="interactive"
      role={interactive?"button":undefined}
      tabIndex={interactive?0:undefined}
      aria-pressed={interactive?active:undefined}
      data-word-active={active?"true":undefined}
      onClick={interactive?()=>setActive(value=>!value):undefined}
      onKeyDown={interactive?event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();setActive(value=>!value);}}:undefined}
    >
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
      {kind === "years" && <svg className="about-word-hourglass" viewBox="0 0 24 28" aria-hidden="true"><path d="M5 3h14v4q0 4-7 7 7 3 7 7v4H5v-4q0-4 7-7-7-3-7-7Z" fill="#dab67c22" stroke="#c5ae84" strokeWidth="1.4"/><path d="m7 7 5 5 5-5Zm5 10-5 6h10Z" fill="#cfac70"/><path d="M3 3h18M3 25h18" stroke="#c5ae84" strokeWidth="2" strokeLinecap="round"/></svg>}

      {kind === "designer" ? (
        <span className="about-page-word__figma" aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </span>
      ) : null}
      {kind === "engineers" ? (
        <span className="about-page-word__caret" aria-hidden />
      ) : null}
      {kind === "craft" ? (
        <span className="about-page-word__craft-line" aria-hidden />
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
          sizes="80px"
          quality={75}
          className="hero-intro__avatar-img"
          priority
        />
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
  story?: boolean;
};

/** About hero — copy + road, no ID card. Shared by `/` and `/about`. */
export default function AboutPageHero({
  id,
  moreHref,
  story = false,
}: AboutPageHeroProps = {}) {
  const HeadingTag = id ? "h2" : "h1";

  // Soft-nav from a scrolled home page can leave window.scrollY past the
  // one-fold /about height (blank). Only pin standalone use to the top;
  // homepage sections must preserve scrolling and hash navigation.
  useEffect(() => {
    if (id || moreHref) return;
    window.scrollTo(0, 0);
  }, [id, moreHref]);

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
            {!story && <AboutGuests />}
            <p>
              A <Word kind="designer">product designer</Word> who{" "}
              <Word kind="engineers">engineers</Word>, currently working at{" "}
              <span data-guest="kumba"><KumbaAiLink /></span>.
            </p>
            {story ? <>
              <p>I have four years of design experience, including three in product design. Before that, I was a graphic designer. But my first design goes back to when I was 14: a banner for a marathon company. T-shirts and client projects followed, and I kept finding new things to make.</p>
              <p>One moment that stayed with me was a Ganesh Chaturthi creative I made that <a className="about-story-link" href="https://www.socialsamosa.com/" target="_blank" rel="noopener noreferrer">Social Samosa</a> reposted. Seeing something I’d created reach people beyond my own circle gave me a reason to take design more seriously.</p>
              <p>Along the way, I also worked as a WordPress developer for Fasbeam, developing CarAdvice.in. Moving between graphics, websites, and products made me curious about both how things look and how they work.</p>
            </> : <>
            <p>
              Three years into product design, I still enjoy figuring out how
              something can look better and work better. Before Kumba AI, I was
              at <a className="about-brand" href="https://1cardsolution.com/" target="_blank" rel="noopener noreferrer"><span className="about-brand__onecard" aria-hidden="true"><img src="/about/brands/one-card.png" alt=""/></span>One Card Solution</a>, working on products for <a className="about-brand" href="https://www.nerolac.com/" target="_blank" rel="noopener noreferrer"><img className="about-brand__nerolac" src="/about/brands/nerolac-favicon.png" alt=""/>Nerolac</a>.
              Before that, I worked with Osos Web on <span className="about-spaarks">Spaarks</span>.
            </p>
            <p>
              My path into products started with building websites. As a
              WordPress developer, I developed <a className="about-story-link" href="https://caradvice.in/" target="_blank" rel="noopener noreferrer">CarAdvice.in</a> for <a className="about-brand" href="https://www.fasbeam.com/" target="_blank" rel="noopener noreferrer"><svg className="about-brand__youtube" viewBox="0 0 28 20" aria-hidden="true"><rect width="28" height="20" rx="6" fill="#f04444"/><path d="m11 5 8 5-8 5Z" fill="white"/></svg>FasBeam</a>, automotive creator Faisal Khan.
              Being a petrolhead, that was a pretty good place to start.
            </p>
            <p>
              I like looking beyond just the <Word kind="craft">design</Word>. I
              want to understand the user, the business, and what we are trying
              to achieve. Then I try to figure out where I can bring value
              through design and technology.
            </p>
            <p>
              I believe UX comes first. There is always <span className="about-person" data-cursor="interactive">a real person<span className="about-person__bubble" aria-hidden><Image src={AVATAR_IMAGE} alt="" width={64} height={64} /></span></span> on the
              other side of what we build, and understanding that person is
              something you have to do yourself. AI can help us explore ideas,
              make things faster, and even build a lot of what we imagine. But I
              don&apos;t think AI will truly understand people the way people
              understand people.
            </p>
            <p>
              And then there is <span className="about-accent"><Word kind="craft">taste</Word></span>. You can use AI
              to make almost anything today, but knowing what looks right, what
              feels right, what to keep, what to remove, and what makes
              something worth remembering is a different thing. I don&apos;t
              think AI will master that anytime soon. Maybe not even in <Word kind="years">100 years</Word>.
            </p>
            </>}
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

      {!story && <AboutPageRoad />}
    </section>
  );
}
