import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import LiquidGlass from "@/components/navbar/LiquidGlass";
import { assetUrl } from "@/lib/cdnAssets";
import { stripFontClassName } from "@/lib/heroFonts";
import "@/components/notes/notes.css";
import "./microsoft.css";

/**
 * A private hello for people at Microsoft. Not linked anywhere on the site,
 * not in a sitemap, and marked noindex: it's only reached from a shared link.
 * Add ?to=<first name> to greet someone by name, e.g. /microsoft?to=priya.
 */

export const metadata: Metadata = {
  title: "Hello, Microsoft — Tarun Dixit",
  description: "A short note from Tarun Dixit, product designer.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const EMAIL = "taruxndixit@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/tarundux/";

/** First name from the link, cleaned: letters, spaces, hyphens, apostrophes only. */
function firstName(raw: string | string[] | undefined) {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return null;
  const clean = value.replace(/[^\p{L}\s'-]/gu, "").trim().slice(0, 24);
  if (!clean) return null;
  return clean
    .split(/\s+/)
    .map((part) => part.charAt(0).toLocaleUpperCase() + part.slice(1).toLocaleLowerCase())
    .join(" ");
}

const WORK = [
  {
    href: "/work/social-media-copilot",
    label: "Kumba · Social Media Copilot",
    title: "One brief becomes a week of posts for every platform",
    line: "Designed end to end. It’s the product Kumba raised its Series A on, at a $10M valuation, and the demo that helped sign Tata Motors EV.",
    stats: [
      ["4,400", "campaigns generated"],
      ["1,200", "Pro upgrades"],
    ],
  },
  {
    href: "/work/brand-hub",
    label: "Kumba · Brand Hub",
    title: "One living brand system for every surface",
    line: "Guidelines, assets and approvals in one place, so every image, video and post stays on brand.",
  },
];

export default async function MicrosoftPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const name = firstName((await searchParams).to);
  const subject = encodeURIComponent(name ? `Hello from ${name} at Microsoft` : "Hello from Microsoft");

  return (
    <main className={`notes-page ms-page ${stripFontClassName}`}>
      <article className="notes-column ms-column">
        <header className="ms-hello">
          {/* The same four polaroids as the site footer. */}
          <div className="ms-polaroids">
            {/* eslint-disable @next/next/no-img-element */}
            <span className="ms-polaroid"><img src={assetUrl("profile/footer-puppy.jpg")} alt="Tarun holding a puppy" width={84} height={96} /></span>
            <span className="ms-polaroid"><img src={assetUrl("profile/footer-dance.jpg")} alt="Tarun as a kid at a dance performance" width={84} height={96} /></span>
            <span className="ms-polaroid"><img src={assetUrl("profile/footer-park-dog.jpg")} alt="Tarun with a dog in the park" width={84} height={96} /></span>
            {/* eslint-enable @next/next/no-img-element */}
            <span className="ms-polaroid">
              <video src={assetUrl("profile/footer-swim.mp4")} poster={assetUrl("profile/footer-swim.jpg")} width={84} height={96} autoPlay muted loop playsInline preload="metadata" aria-label="Tarun swimming laps" />
            </span>
          </div>
          <h1 className="ms-title">{name ? `Hi ${name},` : "Hi there,"}</h1>
          <p className="ms-lead">
            I’m Tarun, a product designer in India. I made this page for a few people at
            Microsoft, and you’re one of them. You can check out my full portfolio{" "}
            <Link href="/" className="ms-inline-link" data-cursor="interactive">
              here
            </Link>
            .
          </p>
          <p className="ms-lead">
            I’d love to design at Microsoft, on any team in India where AI products are being
            shaped. Here’s the short version of why I think I’d be useful.
          </p>
        </header>

        <section className="ms-section" aria-labelledby="ms-work">
          <h2 id="ms-work" className="ms-heading">What I’ve shipped</h2>
          <div className="ms-work">
            {WORK.map((item) => (
              <Link key={item.href} href={item.href} className="ms-card-link" data-cursor="interactive">
                <LiquidGlass className="ms-card">
                <span className="ms-card__label">{item.label}</span>
                <span className="ms-card__title">
                  {item.title}
                  <ArrowUpRight size={16} aria-hidden />
                </span>
                <span className="ms-card__line">{item.line}</span>
                {item.stats ? (
                  <span className="ms-card__stats">
                    {item.stats.map(([n, label]) => (
                      <span key={label}>
                        <b>{n}</b> {label}
                      </span>
                    ))}
                  </span>
                ) : null}
                </LiquidGlass>
              </Link>
            ))}
          </div>
        </section>

        <section className="ms-section" aria-labelledby="ms-think">
          <h2 id="ms-think" className="ms-heading">How I think about design</h2>
          <p className="ms-text">
            I solve one case study every day and learn something new about UX every day. I
            stay away from flashy terms. Shipping fast with AI matters, but two questions
            matter more.
          </p>
          <div className="ms-questions">
            <LiquidGlass className="ms-question">
              <span className="ms-question__n">01</span>
              <p className="ms-question__q">Did it solve the business problem?</p>
              <p className="ms-question__a">
                I start from the number the business needs to move: activation, upgrades,
                retention. Copilot was judged by campaigns created and Pro upgrades, not by how
                it looked.
              </p>
            </LiquidGlass>
            <LiquidGlass className="ms-question">
              <span className="ms-question__n">02</span>
              <p className="ms-question__q">Do I really understand the user?</p>
              <p className="ms-question__a">
                Then I check it against how people actually work: the job they’re hiring the
                product for, their mental model, and where they hesitate. Interviews, information
                architecture and usability testing get me there.
              </p>
            </LiquidGlass>
          </div>
        </section>

        <section className="ms-section" aria-labelledby="ms-bring">
          <h2 id="ms-bring" className="ms-heading">And on top of that</h2>
          <ul className="ms-list">
            <li>
              <strong>AI products, end to end.</strong> I’m the founding designer at Kumba AI, a
              marketing platform used by 2,000+ brands.
            </li>
            <li>
              <strong>Design that ships.</strong> I studied computer science, prototype in React,
              and hand engineers something that already works.
            </li>
            <li>
              <strong>Systems thinking.</strong> I built Kumba’s design system in Figma and
              worked with frontend engineers to ship it in code.
            </li>
          </ul>
        </section>

        <LiquidGlass className="ms-ask">
        <section aria-labelledby="ms-ask">
          <h2 id="ms-ask" className="ms-heading">The ask</h2>
          <p>
            If there’s a team that could use someone like me, or a person I should talk to, I’d be
            grateful for 15 minutes{name ? `, ${name}` : ""}.
          </p>
          <div className="ms-actions">
            <a className="ms-btn ms-btn--primary" href={`mailto:${EMAIL}?subject=${subject}`} data-cursor="interactive">
              Email me
            </a>
            <a className="ms-btn" href={LINKEDIN} target="_blank" rel="noopener noreferrer" data-cursor="interactive">
              LinkedIn
            </a>
            <a className="ms-btn" href="/tarun-dixit-resume.pdf" target="_blank" rel="noopener noreferrer" data-cursor="interactive">
              Resume
            </a>
          </div>
        </section>
        </LiquidGlass>
      </article>
    </main>
  );
}
