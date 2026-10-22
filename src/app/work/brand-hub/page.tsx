import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import BrandHubCaseStudy, {
  SHOTS,
  type ShotId,
  type ShotSources,
} from "@/components/case-study/brand-hub/BrandHubCaseStudy";

export const metadata: Metadata = {
  title: "Brand Hub — Tarun Dixit",
  description:
    "Case study: Brand Hub at Kumba imports a brand from its website in seconds and feeds every studio, from Social Media Copilot to image and video, from one place.",
};

/** Screenshots live in public/work/brand-hub/shots/<id>.webp|png|jpg; missing ones render as placeholders. */
function findShots(): ShotSources {
  const dir = path.join(process.cwd(), "public", "work", "brand-hub", "shots");
  const found: ShotSources = {};
  for (const id of Object.keys(SHOTS) as ShotId[]) {
    for (const ext of ["webp", "png", "jpg"]) {
      if (existsSync(path.join(dir, `${id}.${ext}`))) {
        found[id] = `/work/brand-hub/shots/${id}.${ext}`;
        break;
      }
    }
  }
  return found;
}

export default function BrandHubPage() {
  return <BrandHubCaseStudy shots={findShots()} />;
}
