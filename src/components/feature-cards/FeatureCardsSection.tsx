"use client";

import BrandHubBento from "@/components/feature-cards/bento/BrandHubBento";
import CopilotBento from "@/components/feature-cards/bento/CopilotBento";
import DesignSystemBento from "@/components/feature-cards/bento/DesignSystemBento";
import { featureCards, type FeatureCard } from "@/components/feature-cards/data";
import { heroFontClassName } from "@/lib/heroFonts";
import { contentContainerClassName } from "@/lib/sectionLayout";
import { ArrowUpRight, Play } from "lucide-react";
import Link from "next/link";
import "./feature-cards.css";

function ProjectVisual({ id }: { id: FeatureCard["id"] }) {
  switch (id) {
    case "copilot":
      return <CopilotBento />;
    case "brand-hub":
      return <BrandHubBento />;
    case "design-system":
      return <DesignSystemBento />;
    default:
      return null;
  }
}

function ProjectCard({ card }: { card: FeatureCard }) {
  const isFlagship = card.size === "flagship";

  return (
    <article
      className={`work-bento work-bento--${card.size}${isFlagship ? " work-bento--hero" : ""}`}
    >
      <div className="work-bento__stage">
        <ProjectVisual id={card.id} />
      </div>

      <div className="work-bento__meta">
        <p className="work-bento__index">
          <span className="work-bento__index-num">{card.index}</span>
          <span className="work-bento__index-rule" aria-hidden />
        </p>

        <h3 className="work-bento__title">{card.title}</h3>
        <p className="work-bento__desc">{card.description}</p>

        <div className="work-bento__actions">
          <Link
            href={card.caseStudyHref}
            data-cursor="interactive"
            className="work-bento__cta work-bento__cta--primary"
          >
            <span>View case study</span>
            <ArrowUpRight size={15} strokeWidth={2} aria-hidden />
          </Link>

          <Link
            href={card.videoHref}
            data-cursor="interactive"
            className="work-bento__cta work-bento__cta--video"
          >
            <Play size={12} strokeWidth={2.4} aria-hidden />
            <span>Watch the story</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function FeatureCardsSection() {
  const flagship = featureCards.find((card) => card.size === "flagship");
  const secondary = featureCards.filter((card) => card.size === "secondary");

  return (
    <section
      id="work"
      className={`feature-cards-section theme-transition ${heroFontClassName}`}
      aria-labelledby="work-heading"
    >
      <div className={contentContainerClassName}>
        <header className="feature-cards-section__header">
          <p className="feature-cards-section__eyebrow">Selected work</p>
          <h2
            id="work-heading"
            className="feature-cards-section__title theme-transition"
          >
            Selected projects.
          </h2>
        </header>

        <div className="work-bento-grid">
          {flagship ? <ProjectCard card={flagship} /> : null}

          <div className="work-bento-grid__pair">
            {secondary.map((card) => (
              <ProjectCard key={card.id} card={card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
