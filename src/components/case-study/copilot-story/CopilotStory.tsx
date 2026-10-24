import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { stripFontClassName } from "@/lib/heroFonts";
import UxTerm from "../copilot/UxTerm";
import "@/components/notes/notes.css";
import "../copilot/copilot-case-study.css";
import styles from "./story.module.css";

function Arjun({ pose }: { pose: "overwhelmed" | "reviewing" | "relieved" }) {
  return (
    <figure className={styles.illustration}>
      <div role="img" aria-label={`Arjun, ${pose}`} className={`${styles.arjun} ${styles[pose]}`} />
    </figure>
  );
}

function Screen({ name, alt }: { name: string; alt: string }) {
  return (
    <figure className={styles.screen}>
      <a href={`/work/copilot/shots/${name}.webp`} target="_blank" rel="noopener noreferrer" aria-label={`${alt}. Open full-size image in a new tab`}>
        <Image src={`/work/copilot/shots/${name}.webp`} width={2000} height={1250} sizes="(max-width: 680px) calc(100vw - 40px), 640px" alt={alt} />
      </a>
    </figure>
  );
}

export default function CopilotStory() {
  return (
    <main className={`notes-page note-page cs-page ${styles.page} ${stripFontClassName}`}>
      <article className="notes-column cs-column">
        <Link href="/#work" className="note-back" data-cursor="interactive">
          <ArrowLeft size={14} /> All work
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
            platforms. Kumba pitched it on the TV show Falcons of Majlis and raised a Series A at a $10
            million valuation.
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
        </header>

        <div className="note-body cs-body">
          <h2>One brief. Twenty posts. One Arjun.</h2>
          <p>
            Imagine Monday morning for Arjun, an in-house social media manager. The brief
            sounds simple: launch a shampoo across four platforms for five days. For him,
            that means twenty posts, twenty captions and a week that still needs to feel
            like one campaign.
          </p>
          <Arjun pose="overwhelmed" />
          <p>
            He starts in a spreadsheet, moves to Canva, writes captions in Notes, then
            opens another tool to schedule. Every move means carrying the same idea into
            a different place. That was the problem I wanted to solve at Kumba: help him
            finish a campaign without piecing the workflow together himself.
          </p>

          <h2>His brief had nowhere to go</h2>
          <p>
            The first Campaign Planner only supported campaigns around events. Arjun
            could start with a calendar moment, but he couldn’t bring his own brief.
            His custom campaign had no starting point.
          </p>
          <p>
            The planner became Copilot, with a custom-brief starting point, post generation
            and scheduling. That raised the next design question: if the direction is wrong,
            have we just made twenty things for Arjun to fix?
          </p>

          <h2>Let him fix the plan first</h2>
          <p>
            I put a review step before generation. Arjun sees the plan, checks the message,
            timing and platforms, and changes what feels wrong. Fix the direction once,
            before it becomes twenty finished posts.
          </p>
          <p>
            This is <UxTerm term="user control" explanation="Let people review and change what the AI plans to do before it creates the posts." />.
            My <UxTerm term="hypothesis" explanation="A prediction we can test by watching what people actually do." /> was simple:
            reviewing the plan should build trust and help Arjun publish more posts with fewer edits.
          </p>
          <Arjun pose="reviewing" />
          <Screen name="plan" alt="The campaign plan Arjun can review before generating posts" />
          <p>
            The plan starts with a short overview. Arjun opens only the sections he wants to
            change. This <UxTerm term="progressive disclosure" explanation="Show the essentials first. Let people open more detail when they need it." /> keeps
            the review manageable without taking away the detail.
          </p>

          <h2>Now he can finish what he started</h2>
          <p>
            Arjun gives Copilot a brief, a goal and a product photo. He reviews the plan and
            daily ideas, then generates the posts. The campaign keeps one direction while
            each platform gets its own format and caption.
          </p>
          <Screen name="posts" alt="Generated campaign posts across social platforms" />
          <p>
            He opens a preview, adjusts a caption and sets the schedule. This time, the
            product doesn’t stop at giving him ideas. It carries the work through to the
            last step.
          </p>
          <Screen name="details" alt="Post preview, caption editing and scheduling in the same flow" />

          <Arjun pose="relieved" />

          <h2>Six weeks to make the whole story work</h2>
          <p>
            With the founders and developers, I narrowed the scope to what we could ship
            in six weeks. I designed the flow in Figma, refined the screens and interactions,
            and coded a prototype for the team. By week three, the journey ran from brief
            to schedule in one sitting. This was the version investors used.
          </p>

          <h2>Then Copilot became the pitch</h2>
          <p>
            The product we built around that everyday problem went onto a bigger stage.
            Kumba pitched Copilot on <strong>Falcons of Majlis</strong> and raised a
            <strong> Series A at a $10 million valuation.</strong>
          </p>
          <p>
            For me, the key decision was letting Arjun shape the plan before asking him to
            trust the output. Funding is a business outcome; whether people
            review the plan and publish with fewer edits is the user outcome I’d measure next.
          </p>
          <p className={styles.footer}>
            <Link href="/work/social-media-copilot">Read the original case study</Link> for the full process and project context.
          </p>
        </div>
      </article>
    </main>
  );
}
