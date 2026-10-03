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
];
