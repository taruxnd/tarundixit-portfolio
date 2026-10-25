/**
 * Rejected vs accepted, one row per decision. A side without `src` renders a
 * DRAFT slot naming the asset Tarun still needs to send; drop the file into
 * public/work/copilot/iterations/ and set `src` to switch it on.
 */

type Side = {
  title: string;
  line: string;
  src?: string;
  /** Shown in the draft slot until the real asset exists. */
  needs?: string;
};

type Pair = { topic: string; rejected: Side; accepted: Side };

const PAIRS: Pair[] = [
  {
    topic: "Where a campaign starts",
    rejected: {
      title: "Event-led",
      line: "Pick an occasion, get posts for it. There was no way to start from your own campaign.",
      src: "/work/copilot/iterations/event-led.webp",
    },
    accepted: {
      title: "Campaign-led",
      line: "Start from your own brief. Occasions become days inside it, and the brief adjusts for that day.",
      src: "/work/copilot/iterations/campaign-led.webp",
    },
  },
  {
    topic: "When people correct the AI",
    rejected: {
      title: "Generate first",
      line: "Twenty posts straight away. One wrong angle meant twenty fixes.",
      src: "/work/copilot/iterations/generate-first.webp",
    },
    accepted: {
      title: "Plan first",
      line: "Review the plan, then generate. Fixing a plan takes seconds.",
      src: "/work/copilot/iterations/plan-first.webp",
    },
  },
];

function Card({ side, verdict }: { side: Side; verdict: "Rejected" | "Accepted" }) {
  return (
    <figure className={`cs-iter__card cs-iter__card--${verdict.toLowerCase()}`}>
      <div className={`cs-iter__media${side.src ? "" : " cs-iter__media--draft"}`}>
        {side.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={side.src} alt={`${side.title}: ${side.line}`} loading="lazy" decoding="async" />
        ) : (
          <span>
            <b>Draft</b>
            {side.needs}
          </span>
        )}
      </div>
      <figcaption>
        <span className="cs-iter__verdict">{verdict}</span>
        <strong>{side.title}</strong>
        <span className="cs-iter__line">{side.line}</span>
      </figcaption>
    </figure>
  );
}

export default function IterationPairs() {
  return (
    <div className="cs-iter">
      {PAIRS.map((pair) => (
        <section key={pair.topic} className="cs-iter__pair" aria-label={pair.topic}>
          <h3 className="cs-iter__topic">{pair.topic}</h3>
          <div className="cs-iter__row">
            <Card side={pair.rejected} verdict="Rejected" />
            <Card side={pair.accepted} verdict="Accepted" />
          </div>
        </section>
      ))}
    </div>
  );
}
