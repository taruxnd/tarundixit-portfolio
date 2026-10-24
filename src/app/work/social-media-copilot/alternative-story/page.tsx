import type { Metadata } from "next";
import CopilotStory from "@/components/case-study/copilot-story/CopilotStory";

export const metadata: Metadata = {
  title: "Arjun has 20 posts to make — An alternative Copilot story",
  description: "One brief, twenty posts, and a chance to rethink the workflow. The story behind designing Social Media Copilot at Kumba.",
};

export default function AlternativeStoryPage() {
  return <CopilotStory />;
}
