/**
 * Review mode hides unfinished work: project images become "Work in
 * progress" placeholders, and Notes, project links and More about me are
 * hidden. It applies the same way everywhere, locally and on the live site.
 *
 * Off: everything shows. Set to true to hide it again, everywhere.
 */
const REVIEW_MODE = false;

/** Project images become "Work in progress" placeholders (containers keep their size). */
export const WORK_IN_PROGRESS = REVIEW_MODE;

/** Notes link in the nav, and the notes pages (404 when hidden). */
export const NOTES_VISIBLE = !REVIEW_MODE;

/** Case-study and video buttons on the work strip, and links between case studies. */
export const PROJECT_LINKS_LIVE = !REVIEW_MODE;

/** "More about me" links, and the /more-about-me page (404 when hidden). */
export const MORE_ABOUT_VISIBLE = !REVIEW_MODE;

/** Links pointing to /more-about-me. Off for now; the page itself still works. */
const MORE_ABOUT_LINKED = false;
export const MORE_ABOUT_LINKS = MORE_ABOUT_VISIBLE && MORE_ABOUT_LINKED;
