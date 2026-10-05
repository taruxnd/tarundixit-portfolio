import AboutBentoGrid from "@/components/about-bento/AboutBentoGrid";
import AboutMusicShelf from "@/components/about-music/AboutMusicShelf";
import AboutPageHero from "@/components/about-page/AboutPageHero";
import Hero from "@/components/Hero";
import PolaroidTimeline from "@/components/polaroid-timeline/PolaroidTimeline";
import SideProjectsSection from "@/components/side-projects/SideProjectsSection";
import WorkStrip from "@/components/WorkStrip";
import "@/components/about-page/about-page.css";
import "@/components/about-page/about-page-road.css";

export default function Home() {
  return (
    <main>
      <Hero />
      <WorkStrip />
      <SideProjectsSection />
      <AboutPageHero id="about" />
      <PolaroidTimeline />
      <AboutBentoGrid />
      <AboutMusicShelf />
    </main>
  );
}
