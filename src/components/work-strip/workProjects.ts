import { assetUrl } from "@/lib/cdnAssets";

export type StripMedia = { type: "image"; src: string; alt?: string };

export type WorkProject = {
  id: string;
  label: string;
  title: string;
  outcomes: string;
  href?: string;
  videoHref?: string;
  ctaLabel: string;
  ctaDisabled?: boolean;
  frames: StripMedia[];
};

const xhulia = assetUrl("work/xhulia");
const copilot = assetUrl("work/copilot-strip");

export const workProjects: WorkProject[] = [
  {
    id: "copilot",
    label: "Kumba · Social Media Copilot — 2024–26",
    title:
      "An AI workspace that turns a brief into a multi-day content plan",
    outcomes:
      "Faster campaign setup  •  Brand-voiced drafts  •  Schedule-ready posts  •  Dev-friendly handoff",
    href: "/work/social-media-copilot",
    videoHref: "#watch-copilot",
    ctaLabel: "View case study",
    frames: [
      { type: "image", src: `${copilot}/mockup-01.webp`, alt: "Generated posts screen" },
      { type: "image", src: `${copilot}/mockup-02.webp`, alt: "Post editor with platform preview" },
      { type: "image", src: `${copilot}/mockup-03.webp`, alt: "Instagram and X previews at real size" },
      { type: "image", src: `${copilot}/mockup-04.webp`, alt: "Review panel: caption and schedule" },
      { type: "image", src: `${copilot}/mockup-05.webp`, alt: "Generated posts in dark mode" },
      { type: "image", src: `${copilot}/mockup-06.webp`, alt: "Campaign overview and ideas" },
      { type: "image", src: `${copilot}/mockup-07.webp`, alt: "Brief, ideas and posts" },
      { type: "image", src: `${copilot}/mockup-08.webp`, alt: "Copilot brief screen" },
    ],
  },
  {
    id: "brand-hub",
    label: "Kumba · Brand Hub — 2024–25",
    title:
      "One living brand system for every surface — guidelines, assets, and approvals",
    outcomes:
      "Single source of truth  •  Faster brand requests  •  Consistent multi-surface output  •  Clearer approvals",
    href: "#",
    videoHref: "#watch-brand-hub",
    ctaLabel: "View case study",
    frames: [
      { type: "image", src: `${xhulia}/img/b4efd3bce9dd209a.webp`, alt: "mockup" },
      {
        type: "image",
        src: `${xhulia}/img/9bf115362d1241e7.webp`,
        alt: "report info card",
      },
      { type: "image", src: `${xhulia}/img/1255d100293325a4.webp`, alt: "graphs" },
      {
        type: "image",
        src: `${xhulia}/img/0ca59bea0379521e.webp`,
        alt: "hacktivity",
      },
    ],
  },
  {
    id: "design-system",
    label: "Kumba · AI Design System — 2025–26",
    title:
      "Tokens, patterns, and code-connected components that help teams ship with less debate",
    outcomes:
      "Fewer UI debates  •  Faster delivery  •  Shared standards  •  Code-connected components",
    href: "/work/ai-design-system",
    videoHref: "#watch-design-system",
    ctaLabel: "View case study",
    frames: [
      { type: "image", src: `${xhulia}/img/431a25cd646d3b53.webp` },
      { type: "image", src: `${xhulia}/img/3ee965add8e554e1.webp` },
      { type: "image", src: `${xhulia}/img/458efb8525a11b1e.webp` },
      { type: "image", src: `${xhulia}/img/3e807d5c969bbdd6.webp` },
      { type: "image", src: `${xhulia}/img/fc9ff26d42c19dbf.webp` },
      { type: "image", src: `${xhulia}/img/291209627ff1923d.webp` },
    ],
  },
];
