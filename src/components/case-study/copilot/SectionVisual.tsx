import Image from "next/image";

const VISUALS = {
  context: "A brief becomes a plan, a set of posts and a schedule, linked by one continuous line",
  problem: "Five days multiplied by four platforms adds up to twenty posts",
  symptoms: "A spreadsheet, image, caption and calendar scattered across separate paper scraps",
  "root-cause": "The thread carrying a campaign’s direction tangles and breaks between separate tools",
  hypothesis: "A pencil corrects one plan before it becomes a whole set of posts",
  "design-decisions": "The product evolves from ideas only to reviewing a plan and scheduling finished posts",
  impact: "An illustrated campaign brief becomes a product demonstration on a pitch stage",
} as const;

export default function SectionVisual({ name }: { name: keyof typeof VISUALS }) {
  return (
    <figure className="cs-editorial">
      <Image
        src={`/work/copilot/editorial/${name}.png`}
        alt={VISUALS[name]}
        width={1536}
        height={1024}
        sizes="(max-width: 680px) calc(100vw - 40px), 640px"
      />
    </figure>
  );
}
