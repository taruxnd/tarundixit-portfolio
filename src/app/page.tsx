import Experience from "@/components/Experience";
import FeatureCards from "@/components/FeatureCards";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeatureCards />
      <Experience />
      <Experience id="experience-alt" showIdCard={false} />
      <Testimonials />
    </main>
  );
}
