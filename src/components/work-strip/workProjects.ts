import { assetUrl } from "@/lib/cdnAssets";

export type StripMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; poster: string; alt?: string };

export type WorkProject = {
  id: string;
  label: string;
  title: string;
  outcomes: string;
  href?: string;
  alternativeHref?: string;
  videoHref?: string;
  /** Walkthrough that plays in a lightbox from the "Watch as video" button. */
  video?: { src: string; poster?: string };
  ctaLabel: string;
  ctaDisabled?: boolean;
  frames: StripMedia[];
};

const xhulia = assetUrl("work/xhulia");
const copilot = assetUrl("work/copilot-strip");
const brandHub = assetUrl("work/brand-hub-strip");

/** Projects hidden from the home page for now; their data stays below. */
const HIDDEN_PROJECTS = new Set(["design-system"]);

const allWorkProjects: WorkProject[] = [
  {
    id: "copilot",
    label: "Kumba · Social Media Copilot",
    title:
      "An AI workspace that turns a brief into a multi-day content plan",
    outcomes:
      "Faster campaign setup  •  Brand-voiced drafts  •  Schedule-ready posts  •  Dev-friendly handoff",
    href: "/work/social-media-copilot",
    alternativeHref: "/work/social-media-copilot/alternative-story",
    // Walkthrough is ready but hidden for now. To bring the button back:
    // video: { src: "/work/copilot/smc-copilot-demo.mp4", poster: "/work/copilot/smc-copilot-demo-poster.jpg" },
    ctaLabel: "View case study",
    frames: [
      { type: "image", src: `${copilot}/mockup-01.webp`, alt: "Generated posts screen" },
      { type: "image", src: `${copilot}/mockup-03.webp`, alt: "A generated video as an Instagram post on a phone" },
      {
        type: "video",
        src: `${copilot}/previews-video.mp4`,
        poster: `${copilot}/previews-video.webp`,
        alt: "Instagram and X previews at real size, with the generated creator video playing",
      },
      { type: "image", src: `${copilot}/mockup-07.webp`, alt: "Campaign overview and ideas" },
      { type: "image", src: `${copilot}/mockup-08.webp`, alt: "Brief, ideas and posts" },
      { type: "image", src: `${copilot}/mockup-09.webp`, alt: "Copilot brief screen" },
    ],
  },
  {
    id: "brand-hub",
    label: "Kumba · Brand Hub",
    title:
      "One living brand system for every surface — guidelines, assets, and approvals",
    outcomes:
      "Single source of truth  •  Faster brand requests  •  Consistent multi-surface output  •  Clearer approvals",
    href: "/work/brand-hub",
    // No "Watch as video" for now: add videoHref back when there's a walkthrough.
    ctaLabel: "View case study",
    frames: [
      { type: "image", src: `${brandHub}/mockup-01.webp`, alt: "Onboarding: import your brand from a website URL" },
      { type: "image", src: `${brandHub}/mockup-02.webp`, alt: "Onboarding: detected visual identity to confirm" },
      { type: "image", src: `${brandHub}/mockup-03.webp`, alt: "Brand Hub home with the imported brand" },
      { type: "image", src: `${brandHub}/mockup-04.webp`, alt: "Visual identity: logo, icon mark, colours and typography" },
      { type: "image", src: `${brandHub}/mockup-05.webp`, alt: "Dos and don'ts and brand keywords" },
      { type: "image", src: `${brandHub}/mockup-06.webp`, alt: "Add product dialog" },
    ],
  },
  {
    id: "design-system",
    label: "Kumba · AI Design System",
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

export const workProjects = allWorkProjects.filter((p) => !HIDDEN_PROJECTS.has(p.id));
