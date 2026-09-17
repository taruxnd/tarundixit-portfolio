"use client";

import AboutPageRoad from "@/components/about-page/AboutPageRoad";
import { stripFontClassName } from "@/lib/heroFonts";
import { contentContainerClassName } from "@/lib/sectionLayout";
import Link from "next/link";
import type { ReactNode } from "react";
import "./about-page.css";

function Word({
  kind,
  children,
}: {
  kind: "designer" | "engineers" | "ai";
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
      {kind === "engineers" ? (
        <span className="about-page-word__caret" aria-hidden />
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

/** First-fold /about hero — copy + road. Built from scratch for this route. */
export default function AboutPageHero() {
  return (
    <section
      className={`about-page-hero theme-transition ${stripFontClassName}`}
      aria-labelledby="about-page-heading"
    >
      <div className="about-page-hero__stage">
        <div className={`${contentContainerClassName} about-page-hero__inner`}>
          <p className="about-page-hero__eyebrow">About</p>
          <h1 id="about-page-heading" className="sr-only">
            About
          </h1>

          <div className="about-page-hero__prose">
            <p>
              I&apos;m Tarun Dixit, a <Word kind="designer">product designer</Word>{" "}
              who <Word kind="engineers">engineers</Word>, currently working at{" "}
              <KumbaAiLink />.
            </p>
            <p>
              I like looking beyond just the design. I want to understand the
              user, the business, and what we are trying to achieve. Then I try
              to figure out where I can bring value through design and
              technology.
            </p>
            <p>
              I believe UX comes first. There is always a real person on the
              other side of what we build, and understanding that person is
              something you have to do yourself. <Word kind="ai">AI</Word> can
              help us explore ideas, make things faster, and even build a lot of
              what we imagine. But I don&apos;t think AI will truly understand
              people the way people understand people.
            </p>
            <p>
              And then there is taste. You can use AI to make almost anything
              today, but knowing what looks right, what feels right, what to
              keep, what to remove, and what makes something worth remembering
              is a different thing. I don&apos;t think AI will master that
              anytime soon. Maybe not even in 100 years.
            </p>
          </div>
        </div>
      </div>

      <AboutPageRoad />
    </section>
  );
}
