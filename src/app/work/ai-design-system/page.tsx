import DesignSystemCaseStudy from "@/components/case-study/DesignSystemCaseStudy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Design System — Tarun Dixit",
  description:
    "Case study: a design system that reduced UI debate and helped product teams ship faster, built for AI-assisted workflows.",
};

export default function AiDesignSystemPage() {
  return <DesignSystemCaseStudy />;
}
