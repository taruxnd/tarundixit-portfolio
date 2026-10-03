import { assetUrl } from "@/lib/cdnAssets";

export type TimelineMilestone = {
  id: string;
  year: string;
  tag: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

/** Career stops — Framer card fields (title / tag / body). */
export const timelineMilestones: TimelineMilestone[] = [
  {
    id: "curiosity",
    year: "2019",
    tag: "Spark",
    title: "First sketches",
    description:
      "Late nights with Figma, random UI experiments, and figuring out that design could be more than pixels on a screen.",
    imageSrc: assetUrl("playground/55babfb47d091b9a.webp"),
    imageAlt: "Early design experiments",
  },
  {
    id: "foundations",
    year: "2020",
    tag: "Learn",
    title: "Learning in public",
    description:
      "Building small products, shipping side projects, and learning how users actually move through an interface.",
    imageSrc: assetUrl("playground/1f2ca155d2d1153f.webp"),
    imageAlt: "Learning and early projects",
  },
  {
    id: "streamalive",
    year: "2021",
    tag: "Origin",
    title: "Where it all began",
    description:
      "StreamAlive — interactive live-streaming experiences across web and event platforms for global audiences.",
    imageSrc: assetUrl("playground/a3f63ca94ad36e09.webp"),
    imageAlt: "StreamAlive era",
  },
  {
    id: "squadstack",
    year: "2022",
    tag: "Launch",
    title: "The first release",
    description:
      "SquadStack — CRM and engagement products for high-growth businesses. Usability, speed, systems that scale.",
    imageSrc: assetUrl("playground/efab4f3555f418a4.webp"),
    imageAlt: "SquadStack era",
  },
  {
    id: "craft",
    year: "2023",
    tag: "Growth",
    title: "Opening new doors",
    description:
      "Deeper into design systems, AI-assisted workflows, and the details that make products feel inevitable.",
    imageSrc: assetUrl("playground/c034476a1c617ebe.webp"),
    imageAlt: "Systems and craft",
  },
  {
    id: "kumba",
    year: "2024",
    tag: "Focus",
    title: "Rethinking the core",
    description:
      "Kumba AI — building AI-powered tools for modern marketing teams at the intersection of creativity and intelligence.",
    imageSrc: assetUrl("about/kumba-office-sm.png"),
    imageAlt: "Kumba AI",
  },
  {
    id: "present",
    year: "2025",
    tag: "Now",
    title: "Still shipping",
    description:
      "Late-night experiments, sharper taste, and products that make sense and feel right.",
    imageSrc: assetUrl("about-bento/real-travel.jpg"),
    imageAlt: "Still shipping",
  },
  {
    id: "next",
    year: "2026",
    tag: "Next",
    title: "What comes next",
    description:
      "Sharper systems, braver experiments, and products that feel inevitable the moment you open them.",
    imageSrc: assetUrl("playground/c8ce5635974f6777.webp"),
    imageAlt: "Looking ahead",
  },
  {
    id: "beyond",
    year: "2027",
    tag: "Beyond",
    title: "Keep building",
    description:
      "More craft, more curiosity — still chasing the feeling when something finally clicks.",
    imageSrc: assetUrl("about-bento/real-yapper.jpg"),
    imageAlt: "Keep building",
  },
];
