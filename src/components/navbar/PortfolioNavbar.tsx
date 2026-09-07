"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { navLinks } from "./data";
import LiquidGlass from "./LiquidGlass";
import { useNavbarScroll } from "./useNavbarScroll";
import "./navbar.css";

const DESKTOP_NAV_MQ = "(min-width: 768px)";

function FlipLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
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
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useNavbarScroll();
  const navRef = useRef<HTMLElement>(null);
  const closeMenu = () => setMenuOpen(false);

  /* Close drawer when crossing desktop breakpoint */
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_NAV_MQ);
    const onChange = () => {
      if (mq.matches) setMenuOpen(false);
    };

    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* Escape + click-outside dismiss */
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (navRef.current?.contains(event.target as Node)) return;
      closeMenu();
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  /* Prevent background scroll while mobile drawer is open */
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <header
      className="portfolio-navbar"
      data-scrolled={scrolled ? "true" : undefined}
      data-menu-open={menuOpen ? "true" : undefined}
    >
      <nav
        ref={navRef}
        aria-label="Main navigation"
        className="portfolio-navbar__shell"
      >
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

            <div className="portfolio-navbar__end">
              <button
                type="button"
                className="portfolio-navbar__menu-btn"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                data-cursor="interactive"
                onClick={() => setMenuOpen((open) => !open)}
              >
                <span className="portfolio-navbar__menu-line portfolio-navbar__menu-line-top" />
                <span className="portfolio-navbar__menu-line portfolio-navbar__menu-line-bottom" />
              </button>
            </div>
          </div>

          <div
            className={`portfolio-navbar__drawer ${menuOpen ? "is-open" : ""}`}
            aria-hidden={!menuOpen}
          >
            <div className="portfolio-navbar__drawer-inner" inert={menuOpen ? undefined : true}>
              <div className="portfolio-navbar__drawer-content">
                {navLinks.map((link) => (
                  <FlipLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    onClick={closeMenu}
                  />
                ))}
              </div>
            </div>
          </div>
        </LiquidGlass>
      </nav>
    </header>
  );
}
