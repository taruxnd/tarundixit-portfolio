"use client";

import { stripFontClassName } from "@/lib/heroFonts";
import { contentContainerClassName } from "@/lib/sectionLayout";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import DragStrip from "./DragStrip";
import { xhuliaProjects, type XhuliaProject } from "./xhuliaProjects";
import "./work-strip.css";

function ProjectPanel({ project }: { project: XhuliaProject }) {
  const cta = (
    <>
      <span>{project.ctaLabel}</span>
      {!project.ctaDisabled ? (
        <ArrowUpRight size={15} strokeWidth={2} aria-hidden />
      ) : null}
    </>
  );

  return (
    <article className="xhulia-panel">
      <div className={`xhulia-panel__copy ${contentContainerClassName}`}>
        <div className="xhulia-panel__identity">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="xhulia-panel__logo"
            src={project.logo}
            alt=""
            width={24}
            height={24}
            loading="lazy"
            decoding="async"
          />
          <p className="xhulia-panel__label">{project.label}</p>
        </div>

        <h3 className="xhulia-panel__title">{project.title}</h3>
        <p className="xhulia-panel__outcomes">{project.outcomes}</p>

        {project.ctaDisabled || !project.href ? (
          <span
            className="xhulia-panel__cta xhulia-panel__cta--disabled"
            aria-disabled="true"
          >
            {cta}
          </span>
        ) : (
          <Link
            href={project.href}
            data-cursor="interactive"
            className="xhulia-panel__cta"
          >
            {cta}
          </Link>
        )}
      </div>

      <DragStrip frames={project.frames} label={project.label} />
    </article>
  );
}

/** In-flow project strips — native swipe, no sticky stack, mobile-first. */
export default function WorkStripSection() {
  return (
    <section
      id="work"
      className={`xhulia-work theme-transition ${stripFontClassName}`}
      aria-label="Selected work"
    >
      <div className="xhulia-work__list">
        {xhuliaProjects.map((project) => (
          <ProjectPanel key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
