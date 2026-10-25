import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import PlatformSwitcher from "./PlatformSwitcher";
import UxTerm from "./UxTerm";
import LiveBriefScreen from "./LiveBriefScreen";
import LivePlanScreen from "./LivePlanScreen";
import LivePostsScreen from "./LivePostsScreen";
import SectionVisual from "./SectionVisual";
import { Detail, DetailProvider, DetailSection, DetailToggle, ReadTime } from "./CaseDetail";
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
      <DetailProvider>
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
            <ReadTime />
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
              <dd>Aug – Sep 2026 · ~2 months</dd>
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
          <DetailToggle />
        </header>

        <div className="note-body cs-body">
          <h2>Context</h2>
          <p>
            Kumba makes AI marketing tools for brands and freelancers. I designed Social
            Media Copilot to connect campaign planning, post creation and scheduling in one flow.
          </p>
          <Detail label="Where it started">
            <p>
              Copilot didn’t start as a campaign tool. The first version was event-led: pick an
              upcoming occasion, like a festival or a national day, and get posts for it. There
              was no way to start from your own campaign.
            </p>
            <p>
              Two things shaped that version. Technically, generation worked one occasion at a
              time, so it couldn’t hold a single brief steady across several days and
              platforms. And the founders believed in{" "}
              <UxTerm term="moment marketing" explanation="Brands joining a festival, a national day or a news moment while people are already talking about it." />:
              Indian brands win attention on topical posts, the way Amul has for decades.
            </p>
            <p>
              The belief had data behind it. In YouGov’s 2023 festive study of 2,010 urban
              Indians, social relevance was the top reason a festive ad stood out (49%). So the
              question was never whether occasions matter. It was where they sit in the way
              marketers actually plan.
            </p>
          </Detail>

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
          <Detail label="How I researched it">
            <p>
              Over the two months I kept talking to agency people: social media managers,
              account managers and freelancers who run several clients at once. They were{" "}
              <UxTerm term="semi-structured interviews" explanation="A short list of fixed questions, with room to follow whatever the person brings up." />,
              and the most useful prompt was always the same: walk me through your last
              campaign, from the client’s brief to the last scheduled post.
            </p>
            <p>
              I grouped what I heard with{" "}
              <UxTerm term="affinity mapping" explanation="Writing observations on notes and clustering them until patterns show up." />{" "}
              and framed the core{" "}
              <UxTerm term="job to be done" explanation="The progress a person is trying to make in a situation, independent of any product." />:
            </p>
            <blockquote className="cs-detail__quote">
              When a client signs off a brief, I want to turn it into a week of on-brand posts
              for every platform, so I can get one approval and ship without rework.
            </blockquote>
            <p>
              Notice what the job doesn’t mention: occasions. Events show up inside the job, as
              days in a plan. They are not where it starts.
            </p>
          </Detail>
          <SectionVisual name="problem" />

          <h2>What I saw</h2>
          <ul>
            <li>Making one post was easy. Keeping five days and four platforms on the same message was the hard part.</li>
            <li>Plans lived in spreadsheets, images in Canva and captions in notes.</li>
            <li>Images were resized and captions rewritten for each platform.</li>
            <li>Scheduling meant moving the work into another app.</li>
          </ul>
          <Detail label="The mismatch">
            <p>
              The biggest finding was a{" "}
              <UxTerm term="mental model" explanation="The picture in someone’s head of how a thing works. Products feel easy when they match it." />{" "}
              mismatch. Agencies think in campaigns: a launch, a sale, a quarter. The first
              Copilot thought in occasions. So users had to break their campaign into events
              before the product could help, which is backwards.
            </p>
            <ul>
              <li>
                <strong>Campaign first, moment second.</strong> An Independence Day post that
                ignores the launch running that week reads as off-brand. People wanted the
                occasion folded into the campaign’s message.
              </li>
              <li>
                <strong>Adapting is rework, not craft.</strong> Resizing for each feed and
                trimming captions to each limit was the part nobody wanted to do twice.
              </li>
              <li>
                <strong>Trust is earned before generation.</strong> People were happy to let AI
                draft, but only if they could steer the direction before twenty posts existed.
              </li>
            </ul>
            <p>
              Sprout Social’s 2025 Index points the same way from the audience side: consumers
              want brands to understand the context of a cultural moment, not recreate every
              meme. Context lives in the campaign, not in the calendar.
            </p>
          </Detail>

          <h2>Root cause</h2>
          <p>
            The brief was an input, not a record. Once the plan was written, nothing stored it
            as a shared object the next step could read, so the message, assets, dates and
            channels were re-entered by hand at every tool boundary: spreadsheet, design tool,
            notes, scheduler. Each boundary was a chance to drift, and every change upstream
            had to be carried downstream manually. It wasn’t a tooling gap; it was a missing
            source of truth.
          </p>
          <Detail label="What that meant for the product">
            <p>
              In the event-led version, the event was the main object. Nothing stored a
              campaign, so there was nothing for later steps to read from. The fix was to make
              the campaign the{" "}
              <UxTerm term="single source of truth" explanation="One place where a piece of information lives, so every other step reads it instead of copying it." />:
              one object holding the goal, brief, positioning, dates, channels and brand assets.
            </p>
            <p>
              Every generated post points back to it. Change the core message once and the plan,
              the posts and the schedule all follow. Occasions became days inside that object,
              which is how they could finally take the campaign’s context with them.
            </p>
          </Detail>

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
          <Detail label="Why a plan, not a prompt">
            <p>
              Nielsen Norman Group watched people work with generative AI and named two habits
              that waste time:{" "}
              <UxTerm term="accordion editing" explanation="Repeatedly asking the AI to make its answer shorter or longer to land on what you wanted." />{" "}
              and{" "}
              <UxTerm term="apple picking" explanation="Retyping or pasting bits of earlier AI answers into a new prompt to reuse or fix them." />.
              Both come from interfaces where the only way to fix output is to ask again.
            </p>
            <p>
              Their advice was to let people edit part of a result directly, and regenerate only
              that part. That’s the shape of Copilot’s plan: a{" "}
              <UxTerm term="human-in-the-loop" explanation="A checkpoint where a person reviews and corrects AI work before it moves on." />{" "}
              checkpoint, broken into sections you can edit or refine one at a time.
            </p>
          </Detail>
          <SectionVisual name="hypothesis" />

          <h2>The one call that mattered</h2>
          <p>
            Generate the posts straight away and let people fix them after, or make them
            review a plan first? I chose the plan. Fixing a plan takes seconds; fixing 20
            finished posts doesn’t. It cost us a step, and it’s the step that makes the
            output trustworthy.
          </p>
          <Detail label="The options we weighed">
            <ul>
              <li>
                <strong>Generate everything at once.</strong> Fastest first result. But a wrong
                angle meant fixing it in twenty places, and people fell back to regenerating.
              </li>
              <li>
                <strong>Refine in a chat.</strong> Familiar, but it pushed people straight into
                accordion editing, and a chat log is a poor place to review a week of content.
              </li>
              <li>
                <strong>Review a structured plan first.</strong> One extra step, but every fix
                happens where it’s cheapest. This is what we shipped.
              </li>
            </ul>
            <p>
              To keep the extra step light, the plan uses{" "}
              <UxTerm term="progressive disclosure" explanation="Show the essentials first and reveal detail only when someone asks for it." />:
              sections stay collapsed until you open one, and editing happens in place.
            </p>
          </Detail>

          <DetailSection>
            <h2>Two months of iteration</h2>
            <p>
              We built Copilot over about two months, with a lot of back and forth. Each round
              followed the same loop: design in Figma, build a coded prototype, review it with the
              founders and developers, then put it in front of agency people and adjust.
            </p>
            <ul>
              <li>
                <strong>From events to campaigns.</strong> The pivot itself. Occasions moved from
                the entry point to optional days inside a campaign.
              </li>
              <li>
                <strong>From a long form to three inputs.</strong> Early briefs asked for too much
                up front. We cut to a goal, a short brief and a product photo to lower the{" "}
                <UxTerm term="cognitive load" explanation="How much someone has to hold in their head at once to use something." />{" "}
                of starting.
              </li>
              <li>
                <strong>From generate-first to plan-first.</strong> The call above, made once
                it was clear how expensive fixes became after generation.
              </li>
              <li>
                <strong>From a separate schedule screen to scheduling in the editor.</strong>{" "}
                Reviewing a post and setting its time are one decision, so they live in one
                place.
              </li>
            </ul>
            <p>
              Everything was built on Kumba’s design system, so new screens reused existing
              components and the developers could ship each round without one-off UI.
            </p>
          </DetailSection>

          <h2 className="cs-product-title">Meet the product</h2>

          <h3 id="cs-step-brief" className="cs-flow-first">1. Start with a brief</h3>
          <p>
            Add a goal, a short brief and a product photo. Upcoming dates offer campaign
            ideas when users need a starting point.
          </p>
          <Detail>
            <p>
              This is where the pivot shows. The campaign is custom: it starts from the user’s
              own goal and brief. Upcoming dates still appear, but as suggestions. Add
              Independence Day to a skincare launch and that day’s brief adjusts: the post
              keeps the launch’s message and finds an angle that fits the occasion, instead of
              becoming a generic flag post.
            </p>
            <p>
              Goals come from a short fixed list, so the plan knows what success looks like
              before anything is generated. That small{" "}
              <UxTerm term="constraint" explanation="A deliberate limit on choices that makes the next step easier and the result more predictable." />{" "}
              gives generation a clear target, which a free-text goal doesn’t.
            </p>
          </Detail>
          <LiveBriefScreen screenshot={shots.brief} caption={SHOTS.brief} nextStepId="cs-step-plan" />

          <h3 id="cs-step-plan">2. Review the plan and ideas</h3>
          <p>
            This is the step the product hinges on: correct the direction once, not twenty
            times. Review the campaign direction, then check the daily ideas, adjust a post
            type or ask for another direction.
          </p>
          <Detail>
            <p>
              The plan’s{" "}
              <UxTerm term="information architecture" explanation="How content is grouped, ordered and labelled so people can find and understand it." />{" "}
              follows the order agencies sign things off: the brief, the positioning and core
              message, brand marks, then where it goes.
            </p>
            <ul>
              <li>
                <strong>Positioning</strong> can be refined or replaced with a new direction,
                without touching the rest of the plan.
              </li>
              <li>
                <strong>Watermark</strong> exists because agencies put the client’s mark on
                every post, and doing it by hand per image is exactly the rework we were cutting.
              </li>
              <li>
                <strong>Distribution</strong> picks the platforms once, so nobody re-selects
                them per post.
              </li>
            </ul>
          </Detail>
          <LivePlanScreen screenshot={shots.plan} caption={SHOTS.plan} backStepId="cs-step-brief" nextStepId="cs-step-posts" />

          <h3 id="cs-step-posts">3. Generate for each platform</h3>
          <p>
            Each idea becomes a post in the platform’s format and caption style. The
            campaign stays connected while the presentation changes. That’s the root cause
            fixed.
          </p>
          <Detail>
            <p>
              Platform-native means more than resizing. Each platform gets its own aspect ratio,
              caption length and tone, within the same campaign message. X has a 280-character
              limit for most accounts; Instagram allows up to 2,200. The caption is rewritten
              for each, not truncated.
            </p>
            <p>
              Generation takes a moment, so the grid uses a{" "}
              <UxTerm term="skeleton state" explanation="A placeholder shaped like the content that’s coming, so waiting feels shorter and nothing jumps when it loads." />{" "}
              and reveals posts as they’re ready.
            </p>
          </Detail>
          <PlatformSwitcher />
          <LivePostsScreen screenshot={shots.posts} caption={SHOTS.posts} backStepId="cs-step-plan" hint="Try it: open a post, or schedule the campaign" />

          <h3 id="cs-step-details">4. Edit and schedule</h3>
          <p>
            Check the preview, edit a caption or image, and set the schedule. Users can
            finish the campaign in the same flow.
          </p>
          <Detail>
            <p>
              The editor previews each post at its real feed width, so what you approve is
              what people see. A segmented control switches platforms without leaving the post,
              and each caption has a live counter against that platform’s limit.
            </p>
            <p>
              If a caption runs over, scheduling is blocked with a plain reason: shorten the X
              caption to schedule. That’s{" "}
              <UxTerm term="error prevention" explanation="Designing so mistakes can’t happen, instead of explaining them after they do." />{" "}
              at the point it matters, not an error after the post fails to publish. Each post
              also carries its own date, time and timezone, because agencies often post for
              clients in other cities and countries.
            </p>
          </Detail>
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

          <DetailSection>
            <h2>What I learned</h2>
            <ul>
              <li>
                <strong>A strong belief can be right and still be the wrong entry point.</strong>{" "}
                Moment marketing works. It just belongs inside a campaign, not in front of it.
              </li>
              <li>
                <strong>The data model is part of the design.</strong> The pivot was really a
                change in what the product stores. The screens followed from that.
              </li>
              <li>
                <strong>With AI, design the correction, not just the generation.</strong> The
                plan step is where trust gets built.
              </li>
            </ul>
          </DetailSection>
          <PrototypeLink />
        </div>

      </article>
      </DetailProvider>
    </main>
  );
}
