import AboutPageHero from "@/components/about-page/AboutPageHero";
import Hero from "@/components/Hero";
import WorkStrip from "@/components/WorkStrip";
/* Critical for first paint — same as /about route */
import "@/components/about-page/about-page.css";
import "@/components/about-page/about-page-road.css";

export default function Home() {
  return (
    <main>
      <Hero />
      <WorkStrip />
      <AboutPageHero id="about" moreHref="/about" />
    </main>
  );
}
