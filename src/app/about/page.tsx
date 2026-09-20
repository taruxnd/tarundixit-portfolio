import AboutPageHero from "@/components/about-page/AboutPageHero";
import Experience from "@/components/Experience";
import type { Metadata } from "next";
/* Critical for /about — load with the route so landmark sizes apply on first paint */
import "@/components/about-page/about-page.css";
import "@/components/about-page/about-page-road.css";

export const metadata: Metadata = {
  title: "About — Tarun Dixit",
  description:
    "Product designer who engineers — currently at Kumba AI. About Tarun Dixit.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutPageHero />
      <Experience showIdCard={false} showLead />
      <Experience id="experience-alt" showIdCard={false} />
    </main>
  );
}
