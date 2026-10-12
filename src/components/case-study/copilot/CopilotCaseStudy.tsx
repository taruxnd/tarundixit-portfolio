import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import PlatformSwitcher from "./PlatformSwitcher";
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
  spreadsheet: "Dash's old spreadsheet: days down, platforms across",
  evolution: "Early planner screen next to the final Copilot screen",
  brief: "Copilot home: text box, goal menu, attached product photo",
  plan: "Campaign plan screen with all five sections",
  ideas: "Campaign Ideas screen with Day 2 expanded and the post type menu open",
  posts: "Generated posts grid for the five days",
  details: "Post Details: preview on the left, platform captions and schedule on the right",
} as const;

export type ShotId = keyof typeof SHOTS;
export type ShotSources = Partial<Record<ShotId, string>>;

function Shot({ id, src }: { id: ShotId; src?: string }) {
  const caption = SHOTS[id];
  return (
    <figure className={`cs-shot${src ? "" : " cs-shot--empty"}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={caption} loading="lazy" decoding="async" />
      ) : (
        <div className="cs-shot__placeholder" aria-hidden>
          <span>Screenshot</span>
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
  {
    when: "Week 1",
    title: "Campaign Planner",
    body: "A planner that produced ideas only. No posts, no scheduling. Useful, but it left Dash with the same 20 posts to make.",
  },
  {
    when: "Week 2",
    title: "Renamed to Copilot",
    body: "We added generation and a plan-review step between the brief and the posts. The name changed because the tool now did the work, not just the thinking.",
  },
  {
    when: "Week 3",
    title: "End-to-end flow",
    body: "Brief → plan → ideas → posts → schedule worked in one sitting. This is the version investors used.",
  },
  {
    when: "Later",
    title: "Dropped and added",
    body: "We removed the prompt Enhance button and added a connect-account gate and the Pro upgrade moment.",
  },
];

const DECISIONS = [
  {
    title: "The goal is required",
    body: "Copilot will not generate without a goal. The goal decides what the ideas, captions and call to action focus on.",
  },
  {
    title: "Plan first, posts second",
    body: "Dash sees and edits the plan before any post is made. Changing a plan takes seconds. Remaking 20 finished posts takes much longer and uses credits.",
  },
  {
    title: "Every idea explains itself",
    body: "Each day shows why that post is in the campaign. Dash often has to explain the plan to his manager, so the reason is written down for him.",
  },
  {
    title: "One idea, adapted per platform",
    body: "The message stays the same across platforms. Only the size, format and caption style change. This keeps the campaign consistent.",
  },
  {
    title: "Connect an account before generating",
    body: "Copilot is visible but locked until a social account is connected. We did not want to create posts that Dash could not publish.",
  },
  {
    title: "We removed the prompt enhancer",
    body: "An early version had an Enhance button for the prompt. We removed it. If the brief is short, Copilot should fill the gaps, not ask the user to rewrite it.",
  },
];

export default function CopilotCaseStudy({ shots = {} }: { shots?: ShotSources }) {
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
            <span>6 min read</span>
          </p>
          <h1 className="notes-title">
            Social Media Copilot: one brief, a week of posts for every platform
          </h1>
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
                End-to-end design
                <br />
                Coded prototype on the Kumba Design System
              </dd>
            </div>
          </dl>
          <PrototypeLink />
        </header>

        <div className="note-body cs-body">
          <Kicker>Some overview</Kicker>
          <h2>Product context</h2>
          <p>
            Kumba is an AI tool for small marketing teams. It helps them make images, videos and
            social media posts for their brand. Brand Hub stores the brand&apos;s logo, colours,
            tone of voice and products, so every tool in Kumba knows the brand.
          </p>
          <p>
            Social Media Copilot is the part of Kumba that handles a whole campaign: planning it,
            making the posts, and scheduling them across platforms.
          </p>
          <p className="cs-aside">
            Mamaearth is used as an example product. This is not an official campaign or brand
            partnership.
          </p>

          <h2>Problem statement</h2>
          <p>A normal request to a social media manager looks like this:</p>
          <blockquote>
            &ldquo;Launch the new shampoo on Instagram, Facebook, LinkedIn and X. Post every day
            for five days.&rdquo;
          </blockquote>
          <p>
            For every day of the campaign, someone has to come up with an idea, choose the post
            type, make the image, resize it for each platform, write a caption for each platform,
            and schedule it.
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
          <dl className="cs-needs">
            <div>
              <dt>User</dt>
              <dd>Social media managers at small brands</dd>
            </div>
            <div>
              <dt>User need</dt>
              <dd>A full campaign across platforms, not one post at a time</dd>
            </div>
            <div>
              <dt>Goal</dt>
              <dd>Go from a short brief to scheduled posts without a team</dd>
            </div>
          </dl>

          <Kicker>Preliminary research</Kicker>
          <h2>What existed before</h2>
          <p>I started by looking at how a campaign actually gets made today.</p>
          <ul>
            <li>Dash kept the plan in a spreadsheet: one row per day, one column per platform.</li>
            <li>Images were made in Canva, then resized by hand four times.</li>
            <li>Captions were written in a notes app and pasted into each platform.</li>
            <li>Scheduling happened in each app separately, or in a third-party scheduler.</li>
          </ul>
          <p>
            [We spoke to N marketers at small brands.] The pattern was the same: making one post
            was easy, keeping a week consistent across platforms was the hard part. Existing AI
            tools generated a single image or caption. None carried the campaign from idea to
            scheduled post.
          </p>
          <Shot id="spreadsheet" src={shots.spreadsheet} />

          <Kicker>Getting to work</Kicker>
          <h2>Ideation</h2>
          <p>I looked at the problem as two connected needs.</p>
          <ul>
            <li>
              <strong>Planning.</strong> Deciding what to say each day, in what order, and why.
              This is the thinking work, and it is the part that keeps a campaign consistent.
            </li>
            <li>
              <strong>Production.</strong> Making every post in the right size with the right
              caption for each platform. This is the repetitive work.
            </li>
          </ul>
          <p>
            The first version only did the planning. It gave Dash five ideas and stopped. That was
            useful, but it left him with the same 20 posts to make by hand.
          </p>
          <p>
            The second version did both, with one important step in between: Dash reviews and
            edits the plan before anything is generated. Fixing the plan takes seconds. Fixing 20
            finished posts does not.
          </p>
          <Shot id="evolution" src={shots.evolution} />

          <h2>Aligning the team</h2>
          <p>
            I discussed the two-step flow with the founders and the developers to agree on what
            was possible in the time we had. We settled on:
          </p>
          <ul>
            <li>
              A plan review step between the brief and the posts, written as sentences the user
              can edit, not a form.
            </li>
            <li>
              Platform-specific output: every post is made in each platform&apos;s size and
              caption style, so there is no manual resizing or rewriting.
            </li>
            <li>
              A working prototype in code, built on the Kumba Design System, so the flow could be
              clicked through end to end instead of shown as slides.
            </li>
          </ul>
          <ol className="cs-timeline">
            {TIMELINE.map((step) => (
              <li key={step.when}>
                <span className="cs-timeline__when">{step.when}</span>
                <span className="cs-timeline__title">{step.title}</span>
                <span className="cs-timeline__body">{step.body}</span>
              </li>
            ))}
          </ol>

          <Kicker>What we shipped</Kicker>
          <h2>The final product</h2>
          <p>The flow has five steps.</p>
          <ol>
            <li>
              <strong>Write the brief.</strong> Describe the campaign in one line and pick a goal.
            </li>
            <li>
              <strong>Check the plan.</strong> Review the audience, message, dates, logo and
              platforms.
            </li>
            <li>
              <strong>Review the ideas.</strong> See one idea per day and change the post type if
              needed.
            </li>
            <li>
              <strong>Generate the posts.</strong> Get every post in the right size and caption
              for each platform.
            </li>
            <li>
              <strong>Edit and schedule.</strong> Make changes, set the time, and schedule the
              whole week.
            </li>
          </ol>

          <h3>Write the brief</h3>
          <p>
            Dash types one line, picks a goal (promote a product, promote a service, build
            awareness, or announce an event) and attaches a product photo. If he has no idea where
            to start, cards below the box suggest upcoming dates to build a campaign around.
          </p>
          <Shot id="brief" src={shots.brief} />

          <h3>Check the plan</h3>
          <p>
            Before any post is made, Copilot shows the plan in five collapsed sections: the brief
            as an editable sentence, the main message and why it should work, dates worth
            considering, the brand logo and where it sits, and the platforms. Dash opens only what
            he wants to change.
          </p>
          <Shot id="plan" src={shots.plan} />

          <h3>Review the ideas</h3>
          <p>
            One idea per day, in a sequence: introduce the problem, explain the product, show it in
            use, share results, end with an offer. Each idea has a headline, a post type and a note
            on why it is there. Dash can change the post type, choose how a video starts, or ask
            for a new idea.
          </p>
          <Shot id="ideas" src={shots.ideas} />

          <h3>Generate the posts</h3>
          <p>
            Copilot makes every post in about a minute. Each day&apos;s idea becomes one post per
            platform, in that platform&apos;s size and caption style. Switch platforms below to see
            what changes.
          </p>
          <PlatformSwitcher />
          <Shot id="posts" src={shots.posts} />

          <h3>Edit and schedule</h3>
          <p>
            Opening a post shows the preview, the caption for each platform, and the schedule.
            Dash can edit the caption, ask for changes in plain words, get a new image, set the
            time, and schedule the whole week with one button.
          </p>
          <Shot id="details" src={shots.details} />

          <h2>Design decisions</h2>
          <ol className="cs-decisions">
            {DECISIONS.map((d, i) => (
              <li key={d.title}>
                <span className="cs-decisions__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="cs-decisions__title">{d.title}</span>
                <span className="cs-decisions__body">{d.body}</span>
              </li>
            ))}
          </ol>

          <h2>Impact</h2>
          <p className="cs-impact">
            <strong>$100,000 raised for 1% equity.</strong> This values Kumba at $10 million.
          </p>
          <p>
            Social Media Copilot helped us show investors what Kumba does: start with one brief
            and end with a scheduled, multi-platform campaign.
          </p>
          <p>
            The investment shows that the idea is convincing. Measuring results for real users,
            such as time saved and posts published, is the next step.
          </p>
          <p>
            I could not gather usage numbers yet, because the product is a prototype. The clearest
            signal so far is that investors could sit down with it and go from a brief to
            scheduled posts without help.
          </p>

          <h2>Pausing to reflect</h2>
          <p>
            The hard part was deciding what the user should see and approve before anything is
            generated, and where they should be able to step in. Showing the plan first,
            explaining each idea, and keeping every post editable made the output something people
            could trust and actually publish.
          </p>
          <p>
            This was a short project with a lot riding on it. I am grateful I was trusted to take
            it from the first sketch to a working prototype. There are things I would do
            differently, mostly around testing the plan-review step with real marketers earlier,
            but that is always the case. We do, we learn, we do better next time.
          </p>
          <PrototypeLink />
        </div>

        <div className="note-divider" aria-hidden="true">
          <span>✿</span>
        </div>
        <p className="notes-intro cs-foot">
          More work on the <Link href="/#work">home page</Link>, or read the{" "}
          <Link href="/work/ai-design-system">AI design system</Link> case study.
        </p>
      </article>
    </main>
  );
}
