"use client";

import BusinessCard3D from "@/components/3d-business-card-framer-website-optimized/src/BusinessCard3D";
import { heroEditorialTypography, heroFontClassName } from "@/lib/heroFonts";
import { contentContainerClassName } from "@/lib/sectionLayout";
import { experiences, type ExperienceEntry } from "./data";
import "./experience.css";

const typography = heroEditorialTypography;

function ExperienceEntryRow({
  entry,
  isLast,
}: {
  entry: ExperienceEntry;
  isLast: boolean;
}) {
  return (
    <li className={`experience-entry${isLast ? " experience-entry--last" : ""}`}>
      <article className="experience-entry__content">
        <header className="experience-entry__header">
          <div className="experience-entry__identity">
            <h3 className="experience-entry__company">{entry.company}</h3>
            <p className="experience-entry__role">{entry.role}</p>
          </div>
          <div className="experience-entry__meta">
            <time className="experience-entry__period">{entry.period}</time>
            <span className="experience-entry__location">{entry.location}</span>
          </div>
        </header>

        <p className="experience-entry__description">{entry.description}</p>
      </article>
    </li>
  );
}

interface ExperienceSectionProps {
  id?: string;
  showIdCard?: boolean;
}

export default function ExperienceSection({
  id = "experience",
  showIdCard = true,
}: ExperienceSectionProps) {
  const headingId = `${id}-heading`;
  const stageId = `${id}-stage`;

  return (
    <section
      id={id}
      className={`experience-section theme-transition ${heroFontClassName}${
        showIdCard
          ? " experience-section--with-card"
          : " experience-section--list-only"
      }`}
      aria-labelledby={headingId}
    >
      {showIdCard ? (
        <div className={`${contentContainerClassName} experience-section__lead`}>
          <div className="experience-section__rule" aria-hidden />

          <header className="experience-section__intro">
            <h2
              id={headingId}
              className="experience-section__title"
              style={typography.headline}
            >
              Work history.
            </h2>
          </header>
        </div>
      ) : (
        <h2 id={headingId} className="sr-only">
          Work history
        </h2>
      )}

      <div
        id={showIdCard ? stageId : undefined}
        className={`experience-section__stage${
          showIdCard ? " experience-section__stage--hang" : ""
        }`}
      >
        <div
          className={`${contentContainerClassName} experience-section__grid${
            showIdCard ? "" : " experience-section__grid--list-only"
          }`}
        >
          {showIdCard ? (
            <aside
              className="experience-section__aside"
              aria-label="Employee ID badge"
            >
              <BusinessCard3D
                hangFromSelector={`#${stageId}`}
                matchHeightSelector={`#${id}-panel`}
              />
            </aside>
          ) : null}

          <div className="experience-section__main">
            <div className="experience-glass" id={showIdCard ? `${id}-panel` : undefined}>
              <div className="experience-glass__edge" aria-hidden />
              <div className="experience-glass__glint" aria-hidden />

              <ol className="experience-list">
                {experiences.map((entry, index) => (
                  <ExperienceEntryRow
                    key={entry.id}
                    entry={entry}
                    isLast={index === experiences.length - 1}
                  />
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
