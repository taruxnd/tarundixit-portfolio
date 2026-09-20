import AboutPageHero from "@/components/about-page/AboutPageHero";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import WorkStrip from "@/components/WorkStrip";
/* Same about CSS as /about so landmark sizes match on first paint */
import "@/components/about-page/about-page.css";
import "@/components/about-page/about-page-road.css";

export default function Home() {
  return (
    <main>
      <Hero />
      <WorkStrip />
      <AboutPageHero id="about" moreHref="/about" />
      <Experience showIdCard={false} showLead />
      <Experience id="experience-alt" showIdCard={false} />
      <Testimonials />
    </main>
  );
}
