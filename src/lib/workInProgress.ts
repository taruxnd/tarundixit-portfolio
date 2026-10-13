/**
 * While the case studies are being finished, project imagery is swapped for
 * "Work in progress" placeholders. The containers keep their size, so the
 * layout doesn't change. Flip to false to bring every image back.
 */
export const WORK_IN_PROGRESS = true;

/** Notes are hidden from the nav and their pages return 404 while this is false. */
export const NOTES_VISIBLE = false;

/**
 * Project links (case-study and video buttons on the work strip, and
 * cross-links between case studies) are inert in production while the work
 * is in progress. They stay clickable in dev so the pages can be worked on.
 */
export const PROJECT_LINKS_LIVE = !WORK_IN_PROGRESS || process.env.NODE_ENV !== "production";
