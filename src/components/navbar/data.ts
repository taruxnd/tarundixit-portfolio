import { NOTES_VISIBLE } from "@/lib/workInProgress";

const allNavLinks = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/resume-sample.pdf", label: "Resume" },
  { href: "/#contact", label: "Contact" },
  { href: "/notes", label: "Notes" },
] as const;

/** Notes drop out of the nav while they're hidden (see lib/workInProgress). */
export const navLinks = allNavLinks.filter(
  (link) => NOTES_VISIBLE || link.href !== "/notes",
) as unknown as typeof allNavLinks;
