import { assetUrl } from "@/lib/cdnAssets";

export type SideProject = {
  id: string;
  title: string;
  category: string;
  imageSrc: string;
  imageAlt: string;
  href?: string;
};

export const sideProjects: SideProject[] = [
  {
    id: "pixel-pulse",
    title: "Pixel Pulse",
    category: "Branding",
    imageSrc: assetUrl("playground/efab4f3555f418a4.webp"),
    imageAlt: "Pixel Pulse — branding exploration",
  },
  {
    id: "field-notes",
    title: "Field Notes",
    category: "Visual",
    imageSrc: assetUrl("playground/cf237469619ba3bb.webp"),
    imageAlt: "Field Notes — visual study",
  },
  {
    id: "slow-signal",
    title: "Slow Signal",
    category: "Motion",
    imageSrc: assetUrl("playground/a3f63ca94ad36e09.webp"),
    imageAlt: "Slow Signal — motion experiment",
  },
];
