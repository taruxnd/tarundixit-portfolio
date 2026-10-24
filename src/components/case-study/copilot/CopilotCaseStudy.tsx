import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import PlatformSwitcher from "./PlatformSwitcher";
import UxTerm from "./UxTerm";
import SectionVisual from "./SectionVisual";
import { WORK_IN_PROGRESS } from "@/lib/workInProgress";
import LiquidGlass from "@/components/navbar/LiquidGlass";
import { stripFontClassName } from "@/lib/heroFonts";
import "@/components/notes/notes.css";
import "./copilot-case-study.css";

/** Public URL of the clickable prototype. Left empty until it has a public home. */
const PROTOTYPE_URL = "";

/**
 * Screenshot slots. Drop files into public/work/copilot/shots/ with these
 * names (webp or png) and the frames fill in; until then they show a
 * captioned placeholder. The page checks the folder at build time.
 */
export const SHOTS = {
  spreadsheet: "Arjun's old spreadsheet: days down, platforms across",
  evolution: "Early planner screen next to the final Copilot screen",
  brief: "Start with a brief, goal and product photo",
  moments: "Upcoming dates and optional campaign moments",
  momentsDetail: "Close up: upcoming-date cards with their angle and Build button, and the Campaign moments list with Movember, a midweek reset, Stress Awareness Day and Dhanteras",
  plan: "Review the campaign before creating posts",
  ideas: "Campaign Ideas screen with Day 2 expanded and the post type menu open",
  posts: "A five-day campaign, ready to review",
  details: "Preview, edit and schedule in one place",
} as const;

export type ShotId = keyof typeof SHOTS;
export type ShotSources = Partial<Record<ShotId, string>>;

function Shot({ id, src: rawSrc }: { id: ShotId; src?: string }) {
  const caption = SHOTS[id];
  const src = WORK_IN_PROGRESS ? undefined : rawSrc;
  return (
    <figure className={`cs-shot${src ? "" : " cs-shot--empty"}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={caption} loading="lazy" decoding="async" />
      ) : (
        <div className="cs-shot__placeholder" aria-hidden>
          <span>Work in progress</span>
        </div>
      )}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function PrototypeLink() {
  if (!PROTOTYPE_URL) return null;
  return (
    <a
      className="cs-proto"
      href={PROTOTYPE_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="interactive"
    >
      Open the prototype
      <ArrowUpRight size={14} />
    </a>
  );
}

/** Where the funding news aired. Left empty until the clip has a public URL. */
const TV_VIDEO_URL = "";

export default function CopilotCaseStudy({
  shots = {},
  tv,
  shin,
}: {
  shots?: ShotSources;
  /** public/work/copilot/funding-tv.(webp|png|jpg): a still from the TV segment. */
  tv?: string;
  /** public/work/copilot/shin-money.(webp|png|jpg): Shin-chan with cash. Falls back to the toy car. */
  shin?: string;
}) {
  return (
    <main className={`notes-page note-page cs-page ${stripFontClassName}`}>
      <article className="notes-column cs-column">
        <Link href="/#work" className="note-back" data-cursor="interactive">
          <ArrowLeft size={14} />
          All work
        </Link>

        <header className="note-header cs-header">
          <p className="note-meta">
            <span className="note-tag" data-category="product">
              Case study
            </span>
            <span>3 min read</span>
          </p>
          <h1 className="notes-title">
            Social Media Copilot: one brief, a week of posts for every platform
          </h1>
          <p className="cs-summary">
            Copilot turns a brief into a reviewed plan, posts and a schedule. Kumba pitched
            it on Falcons of Majlis and raised a Series A at a $10 million valuation.
          </p>
          <dl className="cs-facts">
            <div>
              <dt>Timeline</dt>
              <dd>Aug – Sep 2026 · ~6 weeks</dd>
            </div>
            <div>
              <dt>Contributors</dt>
              <dd>
                Product designer (me)
                <br />
                Founders and developers
              </dd>
            </div>
            <div>
              <dt>My contribution</dt>
              <dd>
                Research
                <br />
                End-to-end design in Figma
                <br />
                Coded prototype for the team
              </dd>
            </div>
          </dl>
          <PrototypeLink />
        </header>

        <div className="note-body cs-body">
          <h2>Context</h2>
          <p>
            Kumba makes AI marketing tools for brands and freelancers. I designed Social
            Media Copilot to connect campaign planning, post creation and scheduling in one flow.
          </p>

          <h2>Problem</h2>
          <p>
            I spoke with marketers and freelancers who use Kumba. Arjun stands in for the
            in-house social media managers among them. A five-day launch across four platforms
            means <strong>20 posts and 20 captions</strong>. Freelancers repeat the same work
            for several clients, often alone.
          </p>
          <p>
            <strong>User need:</strong> Turn a brief into a consistent campaign without
            rebuilding it in several tools.
          </p>
          <SectionVisual name="problem" />

          <h2>Symptoms</h2>
          <ul>
            <li>Making one post was easy. Keeping five days and four platforms on the same message was the hard part.</li>
            <li>Plans lived in spreadsheets, images in Canva and captions in notes.</li>
            <li>Images were resized and captions rewritten for each platform.</li>
            <li>Scheduling meant moving the work into another app.</li>
          </ul>

          <h2>Root cause</h2>
          <p>
            My diagnosis: nothing held the campaign’s direction once the work left the brief.
            Each tool did its own task, so users carried the message, assets and timing between
            steps themselves, and keeping the campaign consistent depended on them.
          </p>
          <figure className="cs-cat-meme cs-cat-meme--mechanic">
            <figcaption>
              <span>Found the problem.</span>
              <span>Nothing’s connected.</span>
            </figcaption>
            <Image
              src="/work/copilot/memes/mechanic-cat.jpg"
              alt="A cat holding a wrench beside a car like a mechanic inspecting the problem"
              width={600}
              height={1064}
              sizes="(max-width: 680px) calc(100vw - 40px), 640px"
            />
          </figure>

          <h2>
            <UxTerm term="Hypothesis" explanation="A prediction we can test by watching what people do." />
          </h2>
          <p className="cs-hypothesis">
            If users can correct one plan and carry it through creation and scheduling,
            they should need fewer tool handoffs and fewer edits to publish.
          </p>
          <ul>
            <li><strong>Success signal:</strong> Users complete campaigns in Copilot and publish most posts with few edits.</li>
            <li><strong>Failure signal:</strong> Users still need other tools to finish, or keep regenerating instead of publishing.</li>
          </ul>
          <SectionVisual name="hypothesis" />

          <h2>Design decisions</h2>
          <p>
            Campaign Planner only supported event campaigns. Users couldn’t bring their own brief.
          </p>
          <figure className="cs-cat-meme">
            <Image
              src="/work/copilot/memes/crying-cat-thumbs-up.png"
              alt="Crying cat giving a thumbs-up"
              width={1050}
              height={591}
              sizes="(max-width: 680px) calc(100vw - 40px), 640px"
            />
            <figcaption>
              <span>Great. An event campaign.</span>
              <span>But I need a custom one.</span>
            </figcaption>
          </figure>
          <p>
            I added custom briefs and connected planning, generation and scheduling in one flow.
          </p>
          <p>
            A review step gave users <UxTerm term="user control" explanation="People can change what the AI plans to do before it creates the posts." />:
            fix the plan before generating 20 posts.
          </p>
          <p>
            I used <UxTerm term="progressive disclosure" explanation="Show the essentials first. Let people open more detail when they need it." /> to keep the plan review manageable.
            Users see an overview and open details only when they need to make a change.
          </p>

          <h2>Product flow</h2>

          <h3>1. Start with a brief</h3>
          <p>
            Add a goal, a short brief and a product photo. Upcoming dates offer campaign
            ideas when users need a starting point.
          </p>
          <Shot id="brief" src={shots.brief} />
          <p>
            Relevant <strong>campaign moments</strong> can also be switched on inside the
            plan, so the content fits both the launch and what’s happening that week.
          </p>
          <Shot id="moments" src={shots.moments} />

          <h3>2. Review the plan and ideas</h3>
          <p>
            Review the campaign direction, then check the daily ideas, adjust a post type
            or ask for another direction.
          </p>
          <Shot id="plan" src={shots.plan} />

          <h3>3. Generate for each platform</h3>
          <p>
            Each idea becomes a post in the platform’s format and caption style. The
            campaign stays connected while the presentation changes.
          </p>
          <PlatformSwitcher />
          <Shot id="posts" src={shots.posts} />

          <h3>4. Edit and schedule</h3>
          <p>
            Check the preview, edit a caption or image, and set the schedule. Users can
            finish the campaign in the same flow.
          </p>
          <Shot id="details" src={shots.details} />

          <h2>Impact</h2>
          <SectionVisual name="impact" />
          {/* Real numbers from the admin dashboard (Oct 2026). */}
          <ul className="cs-stats cs-stats--impact" aria-label="Impact in numbers">
            {[
              ["614", "campaigns generated"],
              ["223", "Pro upgrades"],
            ].map(([n, label]) => (
              <li key={label}>
                <LiquidGlass className="cs-stat">
                  <span className="cs-stat__n">{n}</span>
                  <span className="cs-stat__label">{label}</span>
                </LiquidGlass>
              </li>
            ))}
          </ul>
          <div className={`cs-money${tv ? "" : " cs-money--text"}`}>
            <p className="cs-impact">
              <strong>
                Series A at a $10 million valuation.
                <span
                  className="cs-shin"
                  aria-hidden
                  style={shin ? { backgroundImage: `url(${shin})`, backgroundPosition: "50% 40%" } : undefined}
                />
              </strong>{" "}
              Kumba pitched Copilot on Falcons of Majlis, the startup funding show.
            </p>
            {(() => {
              if (!tv) return null;
              const frame = (
                <figure className="cs-polaroid__frame">
                  {tv ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={tv} alt="Kumba on Falcons of Majlis" loading="lazy" />
                  ) : (
                    <div className="cs-polaroid__placeholder">
                      <span className="cs-polaroid__show">Falcons of Majlis</span>
                      <span className="cs-polaroid__soon">Coming soon</span>
                    </div>
                  )}
                  <figcaption>
                    {TV_VIDEO_URL ? "Watch the pitch ↗" : "Coming to ZEE5 & Aaj Tak"}
                  </figcaption>
                </figure>
              );
              return TV_VIDEO_URL ? (
                <a
                  className="cs-polaroid"
                  href={TV_VIDEO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="interactive"
                >
                  {frame}
                </a>
              ) : (
                <div className="cs-polaroid">{frame}</div>
              );
            })()}
          </div>
          <PrototypeLink />
        </div>

      </article>
    </main>
  );
}
