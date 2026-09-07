"use client";

import LiquidGlass from "@/components/navbar/LiquidGlass";
import { heroEditorialTypography, heroFontClassName } from "@/lib/heroFonts";
import { contentContainerClassName } from "@/lib/sectionLayout";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { featureCards, type FeatureCard } from "./data";
import BrandHubWindow from "./windows/BrandHubWindow";
import "./feature-cards.css";
import "./windows/windows.css";
import "@/components/navbar/navbar.css";

const typography = heroEditorialTypography;

function ProjectCard({ card }: { card: FeatureCard }) {
  const showInterior = card.id === "brand-hub";

  return (
    <Link
      href={card.href}
      data-cursor="interactive"
      className={`feature-card-item feature-card-item--${card.size} group`}
    >
      <LiquidGlass className={`feature-card feature-card--${card.size}`}>
        {showInterior ? <BrandHubWindow /> : null}

        {showInterior ? (
          <div className="feature-card__top">
            <span className="feature-card__chip">
              <span className="feature-card__chip-inner">{card.status}</span>
            </span>

            <span className="feature-card__action" aria-hidden>
              <ArrowUpRight size={18} strokeWidth={2} />
            </span>
          </div>
        ) : null}
      </LiquidGlass>

      <div className="feature-card__caption">
        <h3 className="feature-card__title">
          <span className="feature-card__name">{card.title}</span>
          <span className="feature-card__sep" aria-hidden>
            —
          </span>
          <span className="feature-card__tagline">{card.description}</span>
        </h3>
      </div>
    </Link>
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
          <h2
            id="work-heading"
            className="feature-cards-section__title theme-transition text-[var(--text-primary)]"
            style={typography.headline}
          >
            Selected projects.
          </h2>
        </header>

        <div className="feature-cards-grid">
          {flagship ? <ProjectCard card={flagship} /> : null}

          <div className="feature-cards-secondary">
            {secondary.map((card) => (
              <ProjectCard key={card.id} card={card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
