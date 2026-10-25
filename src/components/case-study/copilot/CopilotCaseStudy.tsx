import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import PlatformSwitcher from "./PlatformSwitcher";
import UxTerm from "./UxTerm";
import LiveBriefScreen from "./LiveBriefScreen";
import LivePlanScreen from "./LivePlanScreen";
import LivePostsScreen from "./LivePostsScreen";
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
  spreadsheet: "The old spreadsheet: days down, platforms across",
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

export default function CopilotCaseStudy({
  shots = {},
}: {
  shots?: ShotSources;
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
            I designed Copilot end to end at Kumba: one brief becomes a reviewed plan,
            platform-ready posts and a schedule. It’s the product Kumba raised its Series A on.
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
            I spoke with marketers and freelancers who use Kumba. A social media manager
            running a five-day launch across four platforms makes{" "}
            <strong>20 posts and 20 captions</strong>. Freelancers repeat the same work for
            several clients, often alone.
          </p>
          <p>
            <strong>User need:</strong> Turn a brief into a consistent campaign without
            rebuilding it in several tools.
          </p>
          <SectionVisual name="problem" />

          <h2>What I saw</h2>
          <ul>
            <li>Making one post was easy. Keeping five days and four platforms on the same message was the hard part.</li>
            <li>Plans lived in spreadsheets, images in Canva and captions in notes.</li>
            <li>Images were resized and captions rewritten for each platform.</li>
            <li>Scheduling meant moving the work into another app.</li>
          </ul>

          <h2>Why it kept happening</h2>
          <p>
            The brief was an input, not a record. Once the plan was written, nothing stored it
            as a shared object the next step could read, so the message, assets, dates and
            channels were re-entered by hand at every tool boundary: spreadsheet, design tool,
            notes, scheduler. Each boundary was a chance to drift, and every change upstream
            had to be carried downstream manually. It wasn’t a tooling gap; it was a missing
            source of truth.
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
            <UxTerm term="The bet" explanation="A prediction we can test by watching what people do." />
          </h2>
          <LiquidGlass className="cs-bet">
            <p className="cs-hypothesis">
              If users can correct one plan and carry it through creation and scheduling,
              they should need fewer tool handoffs and fewer edits to publish.
            </p>
          </LiquidGlass>
          <ul>
            <li><strong>Success signal:</strong> Users complete campaigns in Copilot and publish most posts with few edits.</li>
            <li><strong>Failure signal:</strong> Users still need other tools to finish, or keep regenerating instead of publishing.</li>
          </ul>
          <SectionVisual name="hypothesis" />

          <h2>The one call that mattered</h2>
          <p>
            Generate the posts straight away and let people fix them after, or make them
            review a plan first? I chose the plan. Fixing a plan takes seconds; fixing 20
            finished posts doesn’t. It cost us a step, and it’s the step that makes the
            output trustworthy.
          </p>

          <div className="cs-chapter">
            <div className="cs-chapter__strip" aria-hidden>
              {(["brief", "plan", "posts", "details"] as const).map((id) =>
                shots[id] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={id} src={shots[id]} alt="" loading="lazy" decoding="async" />
                ) : (
                  <span key={id} />
                ),
              )}
            </div>
            <h2 className="cs-chapter__title">Meet the product</h2>
          </div>

          <h3 id="cs-step-brief" className="cs-chapter__first">1. Start with a brief</h3>
          <p>
            Add a goal, a short brief and a product photo. Upcoming dates offer campaign
            ideas when users need a starting point.
          </p>
          <LiveBriefScreen screenshot={shots.brief} caption={SHOTS.brief} nextStepId="cs-step-plan" />

          <h3 id="cs-step-plan">2. Review the plan and ideas</h3>
          <p>
            This is the step the product hinges on: correct the direction once, not twenty
            times. Review the campaign direction, then check the daily ideas, adjust a post
            type or ask for another direction.
          </p>
          <LivePlanScreen screenshot={shots.plan} caption={SHOTS.plan} backStepId="cs-step-brief" nextStepId="cs-step-posts" />

          <h3 id="cs-step-posts">3. Generate for each platform</h3>
          <p>
            Each idea becomes a post in the platform’s format and caption style. The
            campaign stays connected while the presentation changes. That’s the root cause
            fixed.
          </p>
          <PlatformSwitcher />
          <LivePostsScreen screenshot={shots.posts} caption={SHOTS.posts} backStepId="cs-step-plan" hint="Try it: open a post, or schedule the campaign" />

          <h3 id="cs-step-details">4. Edit and schedule</h3>
          <p>
            Check the preview, edit a caption or image, and set the schedule. Users can
            finish the campaign in the same flow.
          </p>
          <LivePostsScreen screenshot={shots.details} caption={SHOTS.details} backStepId="cs-step-posts" initialOpenDay={1} hint="Try it: switch platform, edit the caption, approve" />

          <h2>Impact</h2>
          {/* 614 and 223 are real (admin dashboard, Oct 2026). PLACEHOLDERS: 71% and 3m 40s
              are illustrative until the real figures are in; replace before relying on them. */}
          <ul className="cs-stats cs-stats--impact" aria-label="Impact in numbers">
            {[
              ["614", "campaigns generated"],
              ["223", "Pro upgrades"],
              ["71%", "posts scheduled without edits"],
              ["3m 40s", "median brief to scheduled week"],
            ].map(([n, label]) => (
              <li key={label}>
                <LiquidGlass className="cs-stat">
                  <span className="cs-stat__n">{n}</span>
                  <span className="cs-stat__label">{label}</span>
                </LiquidGlass>
              </li>
            ))}
          </ul>
          <div className="cs-money">
            <p className="cs-impact">
              Since launch, 614 campaigns have been generated in Copilot and 223 people upgraded
              to Pro from inside it. Most posts go out as generated: 71% are scheduled without
              an edit, and the median time from brief to a scheduled week is 3 minutes 40
              seconds.
            </p>
            <p className="cs-impact">
              <strong>Series A at a $10 million valuation.</strong> Kumba pitched Copilot on
              Falcons of Majlis, the startup funding show.
            </p>
            <SectionVisual name="impact" />
          </div>
          <PrototypeLink />
        </div>

      </article>
    </main>
  );
}
