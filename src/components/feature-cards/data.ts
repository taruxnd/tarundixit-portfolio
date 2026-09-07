export type ProjectVisualId = "copilot" | "brand-hub" | "design-system";

export interface FeatureCard {
  id: ProjectVisualId;
  index: string;
  title: string;
  description: string;
  status: string;
  href: string;
  size: "flagship" | "secondary";
}

export const featureCards: FeatureCard[] = [
  {
    id: "copilot",
    index: "01",
    title: "Social Media Copilot",
    description: "From Brief to Campaign, Faster",
    status: "Shipped",
    href: "#work",
    size: "flagship",
  },
  {
    id: "brand-hub",
    index: "02",
    title: "Brand Hub",
    description: "One Brand, Every Creative Surface",
    status: "Shipped",
    href: "#work",
    size: "secondary",
  },
  {
    id: "design-system",
    index: "03",
    title: "AI Design System",
    description: "A System Built for AI",
    status: "In use",
    href: "#work",
    size: "secondary",
  },
];
