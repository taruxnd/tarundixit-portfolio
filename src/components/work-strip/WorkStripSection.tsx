"use client";

import { stripFontClassName } from "@/lib/heroFonts";
import { contentContainerClassName } from "@/lib/sectionLayout";
import { ArrowUpRight, Play } from "lucide-react";
import Link from "next/link";
import DragStrip from "./DragStrip";
import { workProjects, type WorkProject } from "./workProjects";
import "./work-strip.css";

function ProjectPanel({ project }: { project: WorkProject }) {
  const primaryCta = (
    <>
      <span>{project.ctaLabel}</span>
      {!project.ctaDisabled ? (
        <ArrowUpRight size={15} strokeWidth={2} aria-hidden />
      ) : null}
    </>
  );

  return (
    <article className="xhulia-panel">
      <div className={contentContainerClassName}>
        <div className="xhulia-panel__copy">
          <p className="xhulia-panel__label">{project.label}</p>
          <h3 className="xhulia-panel__title">{project.title}</h3>
          <p className="xhulia-panel__outcomes">{project.outcomes}</p>

          <div className="xhulia-panel__actions">
            {project.ctaDisabled || !project.href ? (
              <span
                className="xhulia-panel__cta xhulia-panel__cta--disabled"
                aria-disabled="true"
              >
                {primaryCta}
              </span>
            ) : (
              <Link
                href={project.href}
                data-cursor="interactive"
                className="xhulia-panel__cta xhulia-panel__cta--primary"
              >
                {primaryCta}
              </Link>
            )}

            {project.videoHref ? (
              <Link
                href={project.videoHref}
                data-cursor="interactive"
                className="xhulia-panel__cta xhulia-panel__cta--video"
              >
                <Play size={12} strokeWidth={2.4} aria-hidden />
                <span>Watch as video</span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <DragStrip frames={project.frames} label={project.label} />
    </article>
  );
}

export default function WorkStripSection() {
  return (
    <section
      id="work"
      className={`xhulia-work theme-transition ${stripFontClassName}`}
      aria-labelledby="work-heading"
    >
      <div className={contentContainerClassName}>
        <header className="xhulia-work__header">
          <h2 id="work-heading" className="xhulia-work__heading">
            Some of my recent work.
          </h2>
          <p className="xhulia-work__lede">
            The problems, decisions, and details behind the work.
          </p>
        </header>
      </div>

      <div className="xhulia-work__list">
        {workProjects.map((project) => (
          <ProjectPanel key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
