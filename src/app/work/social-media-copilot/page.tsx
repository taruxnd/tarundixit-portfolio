import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { assetUrl } from "@/lib/cdnAssets";
import CopilotCaseStudy, {
  SHOTS,
  type ShotId,
  type ShotSources,
} from "@/components/case-study/copilot/CopilotCaseStudy";

export const metadata: Metadata = {
  title: "Social Media Copilot — Tarun Dixit",
  description:
    "Case study: an AI workspace at Kumba that turns one brief into a week of scheduled, platform-specific posts, for marketing teams and freelancers.",
};

/** Screenshots live in public/work/copilot/shots/<id>.webp|png|jpg; missing ones render as placeholders. */
function findShots(): ShotSources {
  const dir = path.join(process.cwd(), "public", "work", "copilot", "shots");
  const found: ShotSources = {};
  for (const id of Object.keys(SHOTS) as ShotId[]) {
    for (const ext of ["webp", "png", "jpg"]) {
      if (existsSync(path.join(dir, `${id}.${ext}`))) {
        found[id] = assetUrl(`work/copilot/shots/${id}.${ext}`);
        break;
      }
    }
  }
  return found;
}

export default function SocialMediaCopilotPage() {
  return (
    <CopilotCaseStudy
      shots={findShots()}
    />
  );
}
