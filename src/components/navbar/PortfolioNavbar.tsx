"use client";

import { launchResumePlane } from "@/components/resume/launchResumePlane";
import { House, Mail, NotebookPen, UserRound, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks } from "./data";
import LiquidGlass from "./LiquidGlass";
import { useNavbarScroll } from "./useNavbarScroll";
import "./navbar.css";

type NavLink = (typeof navLinks)[number];
type DockLink = Exclude<NavLink, { label: "Resume" }>;

/** The hero already has a Resume button, so the dock skips it. */
const DOCK_LINKS = navLinks.filter((link): link is DockLink => link.label !== "Resume");

const DOCK_ICONS: Record<DockLink["label"], LucideIcon> = {
  Home: House,
  About: UserRound,
  Contact: Mail,
  Notes: NotebookPen,
};

/** Home-page sections the dock can point at, in page order. */
const HOME_SECTIONS = ["about", "contact"] as const;

/**
 * On the home page, which section is on screen: the last one whose top has
 * passed 40% of the viewport (or the last section once the page bottoms
 * out), or "" while still in the hero / work.
 */
function useHomeSection(pathname: string) {
  const [section, setSection] = useState("");

  useEffect(() => {
    if (pathname !== "/") return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let active = "";
      for (const id of HOME_SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) active = id;
      }
      // The footer is shorter than a screen, so it never reaches the line:
      // at the very bottom of the page, the last section wins.
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      if (atBottom) active = HOME_SECTIONS[HOME_SECTIONS.length - 1];
      setSection(active);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return pathname === "/" ? section : "";
}

function isCurrent(href: string, pathname: string, section: string) {
  if (href === "/") return pathname === "/" && section === "";
  if (href.startsWith("/#")) return pathname === "/" && href.slice(2) === section;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function FlipLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      onClick={(event) => {
        if (label === "Resume") launchResumePlane(event);
      }}
      data-cursor="interactive"
      className="portfolio-navbar__link"
    >
      <span className="portfolio-navbar__link-mask">
        <span className="portfolio-navbar__link-stack">
          <span className="portfolio-navbar__link-line">{label}</span>
          <span className="portfolio-navbar__link-line portfolio-navbar__link-line--hover">
            {label}
          </span>
        </span>
      </span>
    </Link>
  );
}

export default function PortfolioNavbar() {
  const scrolled = useNavbarScroll();
  const pathname = usePathname();
  const section = useHomeSection(pathname);

  return (
    <>
      <header className="portfolio-navbar" data-scrolled={scrolled ? "true" : undefined}>
        <nav aria-label="Main navigation" className="portfolio-navbar__shell">
          <div className="portfolio-navbar__glow" aria-hidden>
            <div className="portfolio-navbar__glow-beam" />
            <div className="portfolio-navbar__glow-floor" />
          </div>

          <LiquidGlass className="portfolio-navbar__pill">
            <div className="portfolio-navbar__row">
              <div className="portfolio-navbar__links">
                {navLinks.map((link) => (
                  <FlipLink key={link.href} href={link.href} label={link.label} />
                ))}
              </div>
            </div>
          </LiquidGlass>
        </nav>
      </header>

      {/* Mobile: always-open icon dock; only the current page shows its name */}
      <nav
        aria-label="Main navigation"
        className="portfolio-dock"
        data-scrolled={scrolled ? "true" : undefined}
      >
        <LiquidGlass className="portfolio-navbar__pill">
          <div className="portfolio-dock__row">
            {DOCK_LINKS.map((link) => {
              const Icon = DOCK_ICONS[link.label];
              const current = isCurrent(link.href, pathname, section);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="portfolio-dock__item"
                  aria-current={current ? "page" : undefined}
                  aria-label={current ? undefined : link.label}
                >
                  <Icon size={19} strokeWidth={1.7} aria-hidden />
                  {current && <span className="portfolio-dock__label">{link.label}</span>}
                </Link>
              );
            })}
          </div>
        </LiquidGlass>
      </nav>
    </>
  );
}
