"use client";

import { stripFontClassName } from "@/lib/heroFonts";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import DragStrip from "./DragStrip";
import { xhuliaProjects, type XhuliaProject } from "./xhuliaProjects";
import "./work-strip.css";

function ProjectPanel({
  project,
  index,
  sticky,
}: {
  project: XhuliaProject;
  index: number;
  sticky: boolean;
}) {
  const cta = (
    <>
      <span>{project.ctaLabel}</span>
      {!project.ctaDisabled ? (
        <ArrowUpRight size={15} strokeWidth={2} aria-hidden />
      ) : null}
    </>
  );

  return (
    <article
      className={`xhulia-panel${sticky ? " xhulia-panel--sticky" : ""}`}
      style={{ zIndex: index + 1 }}
    >
      <div className="xhulia-panel__top">
        <div className="xhulia-panel__copy">
          <div className="xhulia-panel__identity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="xhulia-panel__logo"
              src={project.logo}
              alt=""
              width={24}
              height={24}
            />
            <p className="xhulia-panel__label">{project.label}</p>
          </div>

          <div className="xhulia-panel__text">
            <h3 className="xhulia-panel__title">{project.title}</h3>
            <p className="xhulia-panel__outcomes">{project.outcomes}</p>
          </div>
        </div>

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

      <div className="xhulia-panel__strip">
        <DragStrip frames={project.frames} label={project.label} />
      </div>
    </article>
  );
}

/**
 * Duplicate work section — Xhulia sticky project stack (102vh panels),
 * with a custom lightweight drag strip (not the laggy Framer swipe).
 */
export default function WorkStripSection() {
  const lastIndex = xhuliaProjects.length - 1;

  return (
    <section
      className={`xhulia-work theme-transition ${stripFontClassName}`}
      aria-label="Xhulia-style project cards"
    >
      <div className="xhulia-work__stack">
        {xhuliaProjects.map((project, index) => (
          <ProjectPanel
            key={project.id}
            project={project}
            index={index}
            sticky={index < lastIndex}
          />
        ))}
      </div>
    </section>
  );
}
