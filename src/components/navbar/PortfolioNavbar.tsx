"use client";

import { launchResumePlane } from "@/components/resume/launchResumePlane";
import { FileText, House, Mail, NotebookPen, UserRound, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "./data";
import LiquidGlass from "./LiquidGlass";
import { useNavbarScroll } from "./useNavbarScroll";
import "./navbar.css";

const DOCK_ICONS: Record<(typeof navLinks)[number]["label"], LucideIcon> = {
  Home: House,
  About: UserRound,
  Resume: FileText,
  Contact: Mail,
  Notes: NotebookPen,
};

function isCurrent(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
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
            {navLinks.map((link) => {
              const Icon = DOCK_ICONS[link.label];
              const current = isCurrent(link.href, pathname);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="portfolio-dock__item"
                  aria-current={current ? "page" : undefined}
                  aria-label={current ? undefined : link.label}
                  onClick={(event) => {
                    if (link.label === "Resume") launchResumePlane(event);
                  }}
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
