import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import UxTerm from "@/components/case-study/copilot/UxTerm";
import { PROJECT_LINKS_LIVE, WORK_IN_PROGRESS } from "@/lib/workInProgress";
import LiquidGlass from "@/components/navbar/LiquidGlass";
import { stripFontClassName } from "@/lib/heroFonts";
import "@/components/notes/notes.css";
import "@/components/case-study/copilot/copilot-case-study.css";
import "./brand-hub-case-study.css";
import ClientStrip from "@/components/client-strip/ClientStrip";

/**
 * Screenshot slots. Drop files into public/work/brand-hub/shots/ with these
 * names (webp or png) and the frames fill in; until then they show a
 * captioned placeholder. The page checks the folder at build time.
 */
export const SHOTS = {
  import: "Onboarding: paste the website URL, Kumba pulls the brand in seconds",
  review: "Detected brand: the logo, colours and font found on the site, ready to confirm",
  home: "Brand Hub home: visual identity, brand information and audience, all filled from the import",
  identity: "Visual identity: logo, icon mark, three colours and the typeface, each one editable",
  voice: "Mission and tone of voice, written from the site and marked as AI generated until edited",
  guardrails: "Guardrails: dos and don'ts, hashtags and keywords that every generation respects",
  products: "Products: the catalogue the studios can reference, added by hand or from a product URL",
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


const TIMELINE = [
  { when: "Week 1", title: "A long form", body: "Eight sections, forty fields, all empty. Nobody finished it. The first version proved what not to build." },
  { when: "Week 2", title: "Import from a URL", body: "Paste the website, get the logo, colours, font and a draft of the voice back. The form became a review." },
  { when: "Week 3", title: "Onboarding first", body: "Brand setup moved to the first run, before any studio. Confirm three screens and you are in." },
  { when: "Later", title: "Advanced sections", body: "Mission, tone, dos and don'ts, keywords, hashtags and products, each one read by a different tool." },
];

const CONSUMERS = [
  ["Social Media Copilot", "Reads the brand name, products, tone and hashtags to write the plan. Adds the Brand Hub mark as the watermark on every post."],
  ["Image studio", "Uses the colour palette and logo for posters and ad creatives, so the output does not need a second pass in Canva."],
  ["Video and UGC studios", "Scripts speak in the saved tone of voice and avoid the don'ts. Product videos pull the catalogue entries."],
  ["Chat", "Every answer starts from the brand context, so a one-line prompt comes back on-brand."],
] as const;

export default function BrandHubCaseStudy({
  shots = {},
  logos = "/work/brand-hub/logos",
}: {
  shots?: ShotSources;
  /** Folder with the client logo PNGs. */
  logos?: string;
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
          <h1 className="notes-title">Brand Hub: set the brand once, every tool stays on-brand</h1>
          <p className="cs-summary">
            Every studio in Kumba used to ask for the logo, the colours and the tone again. Brand
            Hub imports a brand from its website in seconds, lets the team confirm it, and then
            feeds Social Media Copilot, the image studio and the video studios from one place.
          </p>
          <dl className="cs-facts">
            <div>
              <dt>Timeline</dt>
              <dd>[Month – Month 2025] · ~4 weeks</dd>
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
                Onboarding and hub design in Figma
                <br />
                Coded prototype for the team
              </dd>
            </div>
          </dl>
        </header>

        <div className="note-body cs-body">
          <ClientStrip logos={logos} className="bh-proof" label={<>Used every day by <strong>2,000+ brands</strong> creating with Kumba</>} />

          <Kicker>Context</Kicker>
          <h2>What Kumba is</h2>
          <p>
            Kumba is an AI tool for marketing teams and freelancers. It makes images, videos and
            social posts for a brand. Each of those lives in its own studio, and each studio needs
            to know the brand before it can make anything useful. Brand Hub is where that
            knowledge lives.
          </p>
          <p className="cs-aside">
            Kumba&apos;s own brand is used as the example throughout, not a client&apos;s.
          </p>

          <h2>Who it is for</h2>
          <dl className="cs-people">
            <div>
              <dt>Arjun, in-house</dt>
              <dd>
                Runs social media for a mid-size brand. Has a brand guide PDF somewhere, a logo
                folder on Drive, and hex codes in a notes app.
              </dd>
            </div>
            <div>
              <dt>A freelancer</dt>
              <dd>
                Runs accounts for three clients. Switches brand several times a day and cannot
                afford to re-enter any of them.
              </dd>
            </div>
          </dl>
          <dl className="cs-needs">
            <div>
              <dt>User need</dt>
              <dd>Tell Kumba about the brand once, then never again</dd>
            </div>
            <div>
              <dt>Goal</dt>
              <dd>Every studio produces on-brand work from the first prompt</dd>
            </div>
          </dl>

          <Kicker>Problem</Kicker>
          <h2>The repeat</h2>
          <p className="cs-brief">
            <span className="cs-brief__label">What a new user did before Brand Hub</span>
            Open the image studio, upload the logo, type the colours. Open the video studio, do
            it again. Open Copilot, paste the tone of voice into the prompt. Repeat for every
            client.
          </p>
          <ul className="cs-stats" aria-label="The maths of one brand">
            {[
              ["5", "studios"],
              ["12", "brand details each"],
              ["60", "fields per brand"],
              ["3", "clients for a freelancer"],
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
            <li>The same logo was uploaded to three studios, in three versions, one of them old.</li>
            <li>Colours were typed from memory and drifted a shade between posters.</li>
            <li>Tone of voice lived inside prompts, so it changed every time someone rewrote one.</li>
            <li>New users hit an empty studio and left before making anything.</li>
          </ul>

          <h2>Root cause</h2>
          <p>
            [We spoke to N marketers and freelancers.] Nobody minded telling Kumba about their
            brand. They minded telling it five times, and they minded a long form before they had
            seen the product do anything.
          </p>
          <ul className="cs-insights">
            <li>
              <strong>The brand is already on the website.</strong> Logo, colours, font and voice
              are public. Asking for them is extra work for no reason.
            </li>
            <li>
              <strong>Confirming beats typing.</strong> People check a prefilled screen in seconds
              and abandon an empty one.
            </li>
            <li>
              <strong>Guardrails matter more than assets.</strong> The expensive mistakes were a
              wrong claim or a competitor name, not a wrong shade of green.
            </li>
          </ul>

          <h2>
            <UxTerm term="Hypothesis" explanation="A prediction we can test by watching what people do." />
          </h2>
          <p className="cs-hypothesis">
            If Kumba fills the brand from the website and asks people only to confirm it, more
            users will finish setup and the studios will produce on-brand work from the first
            prompt.
          </p>
          <ul>
            <li>
              <strong>Success signal:</strong> Most new users complete setup in one sitting and
              rarely edit what was imported.
            </li>
            <li>
              <strong>Failure signal:</strong> People skip the import, or re-upload the logo inside
              a studio anyway.
            </li>
          </ul>

          <Kicker>Thinking</Kicker>
          <h2>Aligning the team</h2>
          <p>
            Brand Hub started as a settings page and became the first thing a user sees. That
            order mattered more than any screen. I took it to the founders and the developers,
            and we agreed on what fit in four weeks.
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

          <h2>Making it feel right</h2>
          <p>
            The hub is a long page, so the work was making it feel short. Every section shows
            its status, AI generated or edited, so you know what to trust. Each one opens on its
            own. The import plays as four quick steps so the wait feels like progress, and the
            detected brand lands on a gradient panel built from the brand&apos;s own colours.
          </p>

          <h2 className="cs-product-title">The <span>final product</span></h2>

          <h3>Import in seconds</h3>
          <p>
            On first run Kumba asks for one thing: the website. A brand guide PDF or a manual
            setup are there for people who want them, but the URL is the fast path.
          </p>
          <Shot id="import" src={shots.import} />

          <h3>Confirm what was found</h3>
          <p>
            Three short screens: the brand name and description, the visual identity, then
            audience and preferences. Everything is filled in. The job is to glance and press
            Continue, or fix one thing.
          </p>
          <Shot id="review" src={shots.review} />

          <h3>The hub</h3>
          <p>
            After setup, Brand Hub is a page the team comes back to. Visual identity on top,
            brand information below, audience under that, and the advanced sections in the
            side menu. A freelancer switches brands from the same page.
          </p>
          <Shot id="home" src={shots.home} />

          <h3>Visual identity</h3>
          <p>
            Logo, icon mark, three colours and the typeface, each in its own card with one
            action. The icon mark is what Copilot stamps on posts as a watermark.
          </p>
          <Shot id="identity" src={shots.identity} />

          <h3>Mission and tone of voice</h3>
          <p>
            Two paragraphs the studios read before they write anything. Both are drafted from
            the website and carry an AI generated tag until someone edits them.
          </p>
          <Shot id="voice" src={shots.voice} />

          <h3>Guardrails</h3>
          <p>
            Dos and don&apos;ts are the rules a caption must follow, like no competitor names and
            no exaggerated claims. Keywords are the words the brand owns. Hashtags come in two
            sets: the ones that always appear and the ones Kumba can pick from.
          </p>
          <Shot id="guardrails" src={shots.guardrails} />

          <h3>Products</h3>
          <p>
            The catalogue the studios can reference. Add a product by hand with its selling
            points, or paste a product URL and let Kumba read it.
          </p>
          <Shot id="products" src={shots.products} />

          <Kicker>Reach</Kicker>
          <h2>Where the brand goes</h2>
          <p>
            Brand Hub has no output of its own. Its value shows up in every other tool. When
            Copilot plans a week, the brief, the watermark and the hashtags come from here. When
            the image studio makes a poster, the palette does. Change the tone once and every
            studio speaks differently tomorrow.
          </p>
          <dl className="bh-consumers">
            {CONSUMERS.map(([tool, body]) => (
              <div key={tool}>
                <dt>{tool}</dt>
                <dd>{body}</dd>
              </div>
            ))}
          </dl>

          <Kicker>Proof</Kicker>
          <h2>Impact</h2>
          {/* PLACEHOLDER NUMBERS: these four are illustrative, not measured.
              Replace with real values from the admin dashboard before this
              page is pushed. Labels are final. */}
          <ul className="cs-stats cs-stats--impact" aria-label="Impact in numbers">
            {[
              ["84%", "new users finish brand setup"],
              ["41s", "median import to confirmed brand"],
              ["2.6", "brands per freelancer account"],
              ["0", "logo re-uploads inside studios"],
            ].map(([n, label]) => (
              <li key={label}>
                <LiquidGlass className="cs-stat">
                  <span className="cs-stat__n">{n}</span>
                  <span className="cs-stat__label">{label}</span>
                </LiquidGlass>
              </li>
            ))}
          </ul>
          <p className="cs-impact">
            <strong>The brands on Kumba run through Brand Hub daily.</strong> Every campaign,
            poster and video they make starts from the brand saved here.
          </p>
          <ClientStrip logos={logos} className="bh-proof" label={<>Used every day by <strong>2,000+ brands</strong> creating with Kumba</>} />
        </div>

        <div className="note-divider" aria-hidden="true">
          <span>✿</span>
        </div>
        <p className="notes-intro cs-foot">
          More work on the <Link href="/#work">home page</Link>
          {PROJECT_LINKS_LIVE ? (
            <>
              , or read the <Link href="/work/social-media-copilot">Social Media Copilot</Link>{" "}
              case study.
            </>
          ) : (
            "."
          )}
        </p>
      </article>
    </main>
  );
}
