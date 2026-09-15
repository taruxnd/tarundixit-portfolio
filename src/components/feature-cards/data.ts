export type ProjectVisualId = "copilot" | "brand-hub" | "design-system";

export interface FeatureCard {
  id: ProjectVisualId;
  index: string;
  title: string;
  description: string;
  status: string;
  caseStudyHref: string;
  videoHref: string;
  size: "flagship" | "secondary";
}

export const featureCards: FeatureCard[] = [
  {
    id: "copilot",
    index: "01",
    title: "Social Media Copilot",
    description:
      "An AI workspace that turns a brief into a multi-day content plan — drafted, voiced, and ready to publish.",
    status: "Shipped",
    caseStudyHref: "/#work",
    videoHref: "#watch-copilot",
    size: "flagship",
  },
  {
    id: "brand-hub",
    index: "02",
    title: "Brand Hub",
    description:
      "One living brand system for every surface — guidelines, assets, and approvals in a single place.",
    status: "Shipped",
    caseStudyHref: "/#work",
    videoHref: "#watch-brand-hub",
    size: "secondary",
  },
  {
    id: "design-system",
    index: "03",
    title: "AI Design System",
    description:
      "Tokens, patterns, and code-connected components that help product teams ship with less debate.",
    status: "In use",
    caseStudyHref: "/work/ai-design-system",
    videoHref: "#watch-design-system",
    size: "secondary",
  },
];
