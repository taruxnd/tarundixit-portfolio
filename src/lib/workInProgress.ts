/**
 * Review mode. On the live site (production builds) unfinished work is
 * hidden; locally (`npm run dev`) everything shows so it can be worked on.
 * A local `next build && next start` counts as production, which is handy
 * for checking what a reviewer sees.
 *
 * To end review mode everywhere, set REVIEW_MODE to false and push.
 */
const REVIEW_MODE = true;

const IS_PROD = process.env.NODE_ENV === "production";
const HIDE = REVIEW_MODE && IS_PROD;

/** Project images become "Work in progress" placeholders (containers keep their size). */
export const WORK_IN_PROGRESS = HIDE;

/** Notes link in the nav, and the notes pages (404 when hidden). */
export const NOTES_VISIBLE = !HIDE;

/** Case-study and video buttons on the work strip, and links between case studies. */
export const PROJECT_LINKS_LIVE = !HIDE;

/** "More about me" links, and the /more-about-me page (404 when hidden). */
export const MORE_ABOUT_VISIBLE = !HIDE;
