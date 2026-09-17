export type StripMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; alt?: string };

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

const xhulia = "/work/xhulia";
const copilot = "/work/copilot-strip";

export const workProjects: WorkProject[] = [
  {
    id: "copilot",
    label: "Kumba · Social Media Copilot — 2024–26",
    title:
      "An AI workspace that turns a brief into a multi-day content plan",
    outcomes:
      "Faster campaign setup  •  Brand-voiced drafts  •  Schedule-ready posts  •  Dev-friendly handoff",
    href: "#",
    videoHref: "#watch-copilot",
    ctaLabel: "View case study",
    frames: [
      { type: "image", src: `${copilot}/431a25cd646d3b53.webp` },
      { type: "image", src: `${copilot}/3ee965add8e554e1.webp` },
      { type: "image", src: `${copilot}/458efb8525a11b1e.webp` },
      { type: "image", src: `${copilot}/3e807d5c969bbdd6.webp` },
      { type: "image", src: `${copilot}/fc9ff26d42c19dbf.webp` },
      { type: "image", src: `${copilot}/291209627ff1923d.webp` },
      { type: "image", src: `${copilot}/15e1564e2f6c33e6.webp` },
      { type: "image", src: `${copilot}/5b12ee81c1013051.webp` },
      { type: "image", src: `${copilot}/7426ae3c88c29466.webp` },
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
      { type: "video", src: `${xhulia}/media/e1ecafe451653dd0.mp4` },
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
