import BasketballFooter from "@/components/basketball-footer/BasketballFooter";
import AboutPageHero from "@/components/about-page/AboutPageHero";
import PolaroidTimeline from "@/components/polaroid-timeline/PolaroidTimeline";
import AboutBentoGrid from "@/components/about-bento/AboutBentoGrid";
import AboutMusicShelf from "@/components/about-music/AboutMusicShelf";
import "@/components/about-page/about-page.css";
import "@/components/about-page/about-page-road.css";
import Hero from "@/components/Hero";
import WorkStrip from "@/components/WorkStrip";

import "./home-spacing.css";

export default function Home() {
  return (
    <>
    <main id="top">
      <Hero />
      <WorkStrip />
      <AboutPageHero id="about" />
      <PolaroidTimeline />
      <AboutBentoGrid />
      <AboutMusicShelf />
    </main>
    <BasketballFooter />
    </>
  );
}
