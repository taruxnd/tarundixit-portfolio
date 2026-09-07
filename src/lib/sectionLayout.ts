/**
 * Shared page layout containers.
 *
 * Content (wide) — visual sections: hero, cards, media, mockups, interactive.
 * Reading (narrow) — body copy: paragraphs, about, case studies, process text.
 *
 * Reading columns stay left-aligned inside the content container so both share
 * the same left edge; do not center reading blocks independently.
 */

/** ~1360px default; expands on large external monitors (≥1800px) */
export const contentContainerClassName =
  "layout-content mx-auto w-full max-w-[1360px] min-[1800px]:max-w-[1560px] px-8 sm:px-12 lg:px-24 xl:px-32";

/**
 * ~720px reading measure. Place inside a content container (or equivalent
 * padded shell) and keep left-aligned — no mx-auto.
 */
export const readingContainerClassName =
  "layout-reading w-full max-w-[720px]";

/** @deprecated Prefer contentContainerClassName — kept for existing imports */
export const sectionContainerClassName = contentContainerClassName;
