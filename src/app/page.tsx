import Hero from "@/components/Hero";
import SideProjectsSection from "@/components/side-projects/SideProjectsSection";
import WorkStrip from "@/components/WorkStrip";

export default function Home() {
  return (
    <main>
      <Hero />
      <WorkStrip />
      <SideProjectsSection />
    </main>
  );
}
