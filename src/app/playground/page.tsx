import PlaygroundCanvas from "@/components/playground/PlaygroundCanvas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playground — Tarun Dixit",
  description:
    "Old work, side projects, and random explorations — a draggable canvas of visual experiments.",
};

export default function PlaygroundPage() {
  return <PlaygroundCanvas />;
}
