import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import PlatformSwitcher from "./PlatformSwitcher";
import UxTerm from "./UxTerm";
import { PROJECT_LINKS_LIVE, WORK_IN_PROGRESS } from "@/lib/workInProgress";
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
  brief: "Copilot home: text box, goal menu, attached product photo",
  plan: "Campaign plan screen with all five sections",
  ideas: "Campaign Ideas screen with Day 2 expanded and the post type menu open",
  posts: "Generated posts grid for the five days",
  details: "Post Details: preview on the left, platform captions and schedule on the right",
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

function Kicker({ children }: { children: string }) {
  return <p className="cs-kicker">{children}</p>;
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

const TIMELINE = [
  { when: "Week 1", title: "Campaign Planner", body: "Ideas only. No posts, no scheduling. Arjun still had 20 posts to make." },
  { when: "Week 2", title: "Renamed to Copilot", body: "Generation added, with a plan-review step between the brief and the posts." },
  { when: "Week 3", title: "End-to-end flow", body: "Brief → plan → ideas → posts → schedule in one sitting. The version investors used." },
  { when: "Later", title: "Dropped, added, handed over", body: "Enhance button removed, account gate and Pro moment added, flow prototyped in code for the team." },
];



/** Where the funding news aired. Left empty until the clip has a public URL. */
const TV_VIDEO_URL = "";

export default function CopilotCaseStudy({
  shots = {},
  tv,
  pocket,
  shin,
}: {
  shots?: ShotSources;
  /** public/work/copilot/funding-tv.(webp|png|jpg): a still from the TV segment. */
  tv?: string;
  /** public/work/copilot/pocket-meme.(webp|png|jpg|gif): the famous one. */
  pocket?: string;
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
            <span>4 min read</span>
          </p>
          <h1 className="notes-title">
            Social Media Copilot: one brief, a week of posts for every platform
          </h1>
          <p className="cs-summary">
            Social media managers were making 20 posts by hand for every five-day campaign.
            Copilot turns one brief into a plan they can check, then a scheduled week across four
            platforms. It is the product behind Kumba&apos;s Series A at a $10 million valuation.
          </p>
          <dl className="cs-facts">
            <div>
              <dt>Timeline</dt>
              <dd>Aug – Sep 2026 · ~6 weeks</dd>
            </div>
            <div>
              <dt>Contributors</dt>
              <dd>
                1 Product Designer (me)
                <br />
                [1 Product Manager]
                <br />
                [N Developers]
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
          <Kicker>Context</Kicker>
          <h2>What Kumba is</h2>
          <p>
            Kumba is an AI tool for marketing teams and freelancers. It makes images, videos and
            social posts for a brand, and Brand Hub keeps the logo, colours, tone and products so
            every tool knows the brand. Social Media Copilot is the part that handles a whole
            campaign: plan it, make the posts, schedule them.
          </p>
          <p className="cs-aside">Mamaearth is used as an example product, not a real campaign.</p>

          <h2>Who it is for</h2>
          <dl className="cs-people">
            <div>
              <dt>Arjun, in-house</dt>
              <dd>
                Runs social media for a mid-size brand. Gets a brief on Monday, posts every day,
                and reports to a manager who asks why.
              </dd>
            </div>
            <div>
              <dt>A freelancer</dt>
              <dd>
                Runs accounts for three clients at once. Same work as Arjun, times three, with no
                team behind her.
              </dd>
            </div>
          </dl>
          <dl className="cs-needs">
            <div>
              <dt>User need</dt>
              <dd>A full campaign across platforms, not one post at a time</dd>
            </div>
            <div>
              <dt>Goal</dt>
              <dd>Go from a short brief to scheduled posts without a team</dd>
            </div>
          </dl>

          <Kicker>Problem</Kicker>
          <h2>The request</h2>
          <p className="cs-brief">
            <span className="cs-brief__label">A normal request to a social media manager</span>
            Launch the new shampoo on Instagram, Facebook, LinkedIn and X. Post every day for
            five days.
          </p>
          <ul className="cs-stats" aria-label="The maths of one campaign">
            {[
              ["5", "days"],
              ["4", "platforms"],
              ["20", "posts to make"],
              ["20", "captions to write"],
            ].map(([n, label]) => (
              <li key={label}>
                <LiquidGlass className="cs-stat">
                  <span className="cs-stat__n">{n}</span>
                  <span className="cs-stat__label">{label}</span>
                </LiquidGlass>
              </li>
            ))}
          </ul>

          <Kicker>Research</Kicker>
          <h2>Symptoms</h2>
          <ul>
            <li>The plan lived in a spreadsheet: one row per day, one column per platform.</li>
            <li>Images were made in Canva, then resized by hand four times.</li>
            <li>Captions were written in a notes app and pasted into each platform.</li>
            <li>Scheduling happened in each app separately, or in a third-party scheduler.</li>
          </ul>
          <Shot id="spreadsheet" src={shots.spreadsheet} />

          <h2>Root cause</h2>
          <p>
            [We spoke to N marketers and freelancers.] Making a post was easy. Keeping a week
            consistent across four platforms was the hard part, and no AI tool carried a campaign
            from the idea to a scheduled post.
          </p>
          <ul className="cs-insights">
            <li>
              <strong>Consistency is the work.</strong> Five posts that belong together, not one
              good post.
            </li>
            <li>
              <strong>People fix plans, not assets.</strong> Changing a sentence takes seconds.
              Remaking a post takes an hour and credits.
            </li>
            <li>
              <strong>Captions change more than images.</strong> The same photo works everywhere.
              The words do not.
            </li>
          </ul>

          <h2>
            <UxTerm term="Hypothesis" explanation="A prediction we can test by watching what people do." />
          </h2>
          <p className="cs-hypothesis">
            Letting Arjun review and edit the plan before generation should build trust and
            help him publish more posts with fewer edits.
          </p>
          <p>
            V1 gave him five ideas, leaving 20 posts to make. V2 generates the posts too, with{" "}
            <UxTerm term="user control" explanation="People can review and change what the AI plans to do before it creates the posts." />
            : review the plan, then generate. A quick plan edit saves reworking 20 posts.
          </p>
          <ul>
            <li>
              <strong>Success signal:</strong> People review the plan, tweak it if needed, and
              publish most posts as generated.
            </li>
            <li>
              <strong>Failure signal:</strong> People skip the plan and repeatedly regenerate posts.
            </li>
          </ul>
          <Shot id="evolution" src={shots.evolution} />

          <Kicker>Thinking</Kicker>
          <h2>Aligning the team</h2>
          <p>
            I took the two-step flow to the founders and the developers, and we agreed on what
            was possible in six weeks.
          </p>
          <ol className="cs-timeline">
            {TIMELINE.map((step) => (
              <li key={step.when}>
                <span className="cs-timeline__when">{step.when}</span>
                <span className="cs-timeline__title">{step.title}</span>
                <span className="cs-timeline__body">{step.body}</span>
              </li>
            ))}
          </ol>

          <h2>What I kept in my pocket</h2>
          <p>
            I had a few more ideas. Some were bigger than six weeks. Some were only mine. I made
            the case, listened, and went with the team. A launch that ships beats a design that
            is right in my head.
          </p>
          <figure className={`cs-meme${pocket ? "" : " cs-meme--empty"}`}>
            {pocket ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pocket} alt="The epic handshake meme" loading="lazy" />
            ) : (
              <div className="cs-meme__placeholder" aria-hidden>
                <span>Famous meme</span>
              </div>
            )}
            <figcaption>My ideas, meet the deadline. Shipped.</figcaption>
          </figure>

          <h2>Making it feel right</h2>
          <p>
            Everything so far was designed in Figma. About eighty percent of the work, and all of
            the decisions.
          </p>
          <p>
            When the flow was done, I went back to the screens and worked on how they look and
            feel. Spacing. Colour. The order things appear in. The small moments that make a
            screen nice to use, like the plan opening one section at a time, or the one button at
            the end. This is slow work. You look, you change something, you look again. A prompt
            cannot do it for you.
          </p>

          <Kicker>The product</Kicker>
          <h2>The final product</h2>

          <h3>Write the brief</h3>
          <p>
            Arjun types one line, picks a goal and attaches a product photo. If he has no idea
            where to start, cards below suggest upcoming dates to build a campaign around.
          </p>
          <Shot id="brief" src={shots.brief} />

          <h3>Check the plan</h3>
          <p>
            Before any post is made, Copilot shows the plan in five collapsed sections: brief,
            message, dates, logo, platforms. Arjun opens only what he wants to change.
          </p>
          <Shot id="plan" src={shots.plan} />

          <h3>Review the ideas</h3>
          <p>
            One idea per day: introduce the problem, explain the product, show it in use, share
            results, end with an offer. Each idea says why it is there. Arjun can change the post
            type or ask for a new idea.
          </p>
          <Shot id="ideas" src={shots.ideas} />

          <h3>Generate the posts</h3>
          <p>
            About a minute later, every idea is a post on every platform, in that platform&apos;s
            size and caption style.
          </p>
          <PlatformSwitcher />
          <Shot id="posts" src={shots.posts} />

          <h3>Edit and schedule</h3>
          <p>
            Open a post to see the preview, the caption for each platform and the schedule. Edit
            the caption, ask for changes in plain words, get a new image, set the time, and
            schedule the whole week with one button.
          </p>
          <Shot id="details" src={shots.details} />

          <Kicker>Proof</Kicker>
          <h2>Impact</h2>
          {/* PLACEHOLDER NUMBERS: these four are illustrative, not measured.
              Replace with real values from the admin dashboard before this
              page is pushed. Labels are final. */}
          <ul className="cs-stats cs-stats--impact" aria-label="Impact in numbers">
            {[
              ["412", "campaigns since launch"],
              ["71%", "posts scheduled without edits"],
              ["3m 40s", "median brief to scheduled week"],
              ["38", "Pro upgrades from inside Copilot"],
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
              <strong>
                Series A at a $10 million valuation.
                <span
                  className="cs-shin"
                  aria-hidden
                  style={shin ? { backgroundImage: `url(${shin})`, backgroundPosition: "50% 40%" } : undefined}
                />
              </strong>{" "}
              Copilot was the product Kumba raised on.
            </p>
            {(() => {
              const frame = (
                <figure className="cs-polaroid__frame">
                  {tv ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={tv} alt="The Kumba funding segment on TV" loading="lazy" />
                  ) : (
                    <div className="cs-polaroid__placeholder" aria-hidden>
                      <span>TV still</span>
                    </div>
                  )}
                  <figcaption>It was on TV.{TV_VIDEO_URL ? " Watch ↗" : ""}</figcaption>
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

        <div className="note-divider" aria-hidden="true">
          <span>✿</span>
        </div>
        <p className="notes-intro cs-foot">
          More work on the <Link href="/#work">home page</Link>
          {PROJECT_LINKS_LIVE ? (
            <>
              , or read the <Link href="/work/ai-design-system">AI design system</Link> case
              study.
            </>
          ) : (
            "."
          )}
        </p>
      </article>
    </main>
  );
}
