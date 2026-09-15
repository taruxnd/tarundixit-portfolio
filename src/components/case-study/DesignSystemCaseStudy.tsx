import GlassLabel from "@/components/case-study/GlassLabel";
import {
  aiDesignSystemCaseStudy,
  type CaseStudyContentBlock,
  type CaseStudyMedia,
} from "@/components/case-study/ai-design-system-data";
import { heroEditorialTypography, heroFontClassName } from "@/lib/heroFonts";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import "./case-study.css";

const study = aiDesignSystemCaseStudy;
const typography = heroEditorialTypography;

function ChapterDivider({ id, label }: { id: string; label: string }) {
  return (
    <div id={id} className="case-chapter">
      <span className="case-chapter__rule" aria-hidden />
      <GlassLabel>
        <span className="case-chapter__label">{label}</span>
      </GlassLabel>
      <span className="case-chapter__rule" aria-hidden />
    </div>
  );
}

function SectionFigure({ figure }: { figure: CaseStudyMedia }) {
  return (
    <figure className="case-study__inline-figure">
      <div
        className="case-study__figure"
        style={{ aspectRatio: figure.aspect }}
      >
        <Image
          src={figure.src}
          alt={figure.alt}
          fill
          sizes="(min-width: 1440px) 1100px, (min-width: 810px) min(100vw - 32px, 1100px), min(100vw - 32px, 1100px)"
          className="case-study__image"
        />
      </div>
      {figure.caption ? (
        <figcaption className="case-study__caption">{figure.caption}</figcaption>
      ) : null}
    </figure>
  );
}

function ContentSection({ section }: { section: CaseStudyContentBlock }) {
  return (
    <section
      key={section.id}
      id={section.id}
      className="case-block"
      aria-labelledby={`${section.id}-title`}
    >
      <p className="case-study__eyebrow">{section.eyebrow}</p>
      <h2
        id={`${section.id}-title`}
        className="case-block__title"
        style={typography.headline}
      >
        {section.title}
      </h2>
      {section.body.map((paragraph) => (
        <p key={paragraph} className="case-study__body">
          {paragraph}
        </p>
      ))}
      {section.bullets ? (
        <ul className="case-block__list">
          {section.bullets.map((item) => (
            <li key={item}>
              <GlassLabel className="case-glass-label--list">{item}</GlassLabel>
            </li>
          ))}
        </ul>
      ) : null}
      {section.afterBullets?.map((paragraph) => (
        <p key={paragraph} className="case-study__body">
          {paragraph}
        </p>
      ))}
      {section.figures?.length ? (
        <div
          className={`case-study__section-figures${
            section.figures.length > 1 ? " is-multi" : ""
          }`}
        >
          {section.figures.map((figure) => (
            <SectionFigure key={figure.src} figure={figure} />
          ))}
        </div>
      ) : null}
      {section.id === "impact" ? (
        <div className="case-study__metrics">
          {study.metrics.map((metric) => (
            <article key={metric.headline} className="case-study__metric">
              <p className="case-study__metric-headline">{metric.headline}</p>
              <p className="case-study__metric-detail">{metric.detail}</p>
              <p className="case-study__metric-note">{metric.note}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default function DesignSystemCaseStudy() {
  const processSections = study.sections.filter((s) => s.chapter === "process");
  const resultSections = study.sections.filter((s) => s.chapter === "results");
  const wideMedia = study.media.filter((item) => item.wide);
  const topPair = study.media.filter((item) => !item.wide).slice(0, 2);
  const midPair = study.media.filter((item) => !item.wide).slice(2, 4);
  const solo = study.media.filter((item) => !item.wide).slice(4);

  return (
    <article className={`case-study theme-transition ${heroFontClassName}`}>
      <div className="case-study__inner">
        <Link href="/#work" className="case-study__back" data-cursor="interactive">
          <ArrowLeft size={16} strokeWidth={2} aria-hidden />
          Selected projects
        </Link>

        <header className="case-study__hero">
          <p className="case-study__kicker theme-transition">{study.headline}</p>
          <h1
            className="case-study__title theme-transition"
            style={typography.headline}
          >
            {study.title}
          </h1>
        </header>

        <section className="case-study__intro" aria-labelledby="case-intro">
          <div className="case-study__intro-copy">
            <p id="case-intro" className="case-study__eyebrow">
              Intro
            </p>
            {study.intro.map((paragraph) => (
              <p key={paragraph} className="case-study__body">
                {paragraph}
              </p>
            ))}
            <p className="case-study__note">
              <em>{study.note}</em>
            </p>
          </div>

          <aside className="case-study__meta" aria-label="Project details">
            {study.meta.map((group) => (
              <div key={group.label} className="case-study__meta-group">
                <p className="case-study__eyebrow">{group.label}</p>
                <div className="case-study__tags">
                  {group.tags.map((tag) => (
                    <GlassLabel key={tag}>{tag}</GlassLabel>
                  ))}
                </div>
              </div>
            ))}
          </aside>
        </section>

        <section className="case-study__summary" aria-label="Project summary">
          {study.summary.map((card) => (
            <div key={card.title} className="case-study__summary-card">
              <h2 className="case-study__summary-title">{card.title}</h2>
              <ul className="case-study__summary-list">
                {card.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <ChapterDivider id="screens" label="Final screens" />

        <section className="case-study__media" aria-label="Project screens">
          <div className="case-study__media-pair">
            {topPair.map((item) => (
              <figure
                key={item.src}
                className="case-study__figure"
                style={{ aspectRatio: item.aspect }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 34vw, 92vw"
                  className="case-study__image"
                />
              </figure>
            ))}
          </div>

          {wideMedia.map((item) => (
            <figure
              key={item.src}
              className="case-study__figure case-study__figure--wide"
              style={{ aspectRatio: item.aspect }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 72vw, 92vw"
                className="case-study__image"
              />
            </figure>
          ))}

          <div className="case-study__media-pair">
            {midPair.map((item) => (
              <figure
                key={item.src}
                className="case-study__figure"
                style={{ aspectRatio: item.aspect }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 34vw, 92vw"
                  className="case-study__image"
                />
              </figure>
            ))}
          </div>

          {solo.map((item) => (
            <figure
              key={item.src}
              className="case-study__figure case-study__figure--solo"
              style={{ aspectRatio: item.aspect }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 34vw, 70vw"
                className="case-study__image"
              />
            </figure>
          ))}
        </section>

        <ChapterDivider id="process" label="Process" />

        <div className="case-study__sections">
          {processSections.map((section) => (
            <ContentSection key={section.id} section={section} />
          ))}
        </div>

        <ChapterDivider id="results" label="Results" />

        <div className="case-study__sections">
          {resultSections.map((section) => (
            <ContentSection key={section.id} section={section} />
          ))}
        </div>

        <footer className="case-study__footer">
          <Link
            href={study.next.href}
            className="case-study__next"
            data-cursor="interactive"
          >
            <span>{study.next.label}</span>
            <ArrowUpRight size={18} strokeWidth={2} aria-hidden />
          </Link>
        </footer>
      </div>
    </article>
  );
}
