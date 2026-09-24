import LiquidGlass from "@/components/navbar/LiquidGlass";
import { stripFontClassName } from "@/lib/heroFonts";
import { contentContainerClassName } from "@/lib/sectionLayout";
import Image from "next/image";
import Link from "next/link";
import { sideProjects } from "./data";
import "./side-projects.css";

export default function SideProjectsSection() {
  return (
    <section
      id="side-projects"
      className={`side-projects theme-transition ${stripFontClassName}`}
      aria-labelledby="side-projects-heading"
    >
      <div className={`${contentContainerClassName} side-projects__inner`}>
        <header className="side-projects__header">
          <h2
            id="side-projects-heading"
            className="side-projects__heading hero-headline"
          >
            Things I{" "}
            <span className="side-projects__make">
              <svg
                className="side-projects__cursor-icon"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  fill="currentColor"
                  d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23"
                />
              </svg>
              make
            </span>{" "}
            for fun.
          </h2>
          <p className="side-projects__lede">
            Some experiments, side quests, and things I wanted to see exist.
          </p>
        </header>

        <ul className="side-projects__grid">
          {sideProjects.map((project) => {
            const body = (
              <>
                <div className="side-projects__media">
                  <Image
                    src={project.imageSrc}
                    alt={project.imageAlt}
                    width={800}
                    height={600}
                    className="side-projects__image"
                    sizes="(max-width: 767px) 100vw, (max-width: 1099px) 50vw, 33vw"
                  />
                </div>
                <LiquidGlass className="side-projects__meta">
                  <div className="side-projects__meta-row">
                    <p className="side-projects__meta-left">
                      <span className="side-projects__title">
                        {project.title}
                      </span>
                      <span className="side-projects__dot" aria-hidden>
                        ·
                      </span>
                      <span className="side-projects__category">
                        {project.category}
                      </span>
                    </p>
                  </div>
                </LiquidGlass>
              </>
            );

            return (
              <li key={project.id} className="side-projects__item">
                {project.href ? (
                  <Link
                    href={project.href}
                    className="side-projects__card"
                    data-cursor="interactive"
                  >
                    {body}
                  </Link>
                ) : (
                  <article className="side-projects__card">{body}</article>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
