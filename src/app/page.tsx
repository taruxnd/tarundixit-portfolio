import EditorialAbout from "@/components/EditorialAbout";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import WorkStrip from "@/components/WorkStrip";

export default function Home() {
  return (
    <main>
      <Hero />
      <WorkStrip />
      <EditorialAbout moreHref="/about" />
      <Experience showIdCard={false} showLead />
      <Experience id="experience-alt" showIdCard={false} />
      <Testimonials />
    </main>
  );
}
