import Experience from "@/components/Experience";
import FeatureCards from "@/components/FeatureCards";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import WorkStrip from "@/components/WorkStrip";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeatureCards />
      <WorkStrip />
      <Experience />
      <Experience id="experience-alt" showIdCard={false} />
      <Testimonials />
    </main>
  );
}
