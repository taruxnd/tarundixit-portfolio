export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  description: string;
  period: string;
  location: string;
}

export const experiences: ExperienceEntry[] = [
  {
    id: "kumba",
    company: "Kumba",
    role: "Product Designer",
    description:
      "Designing AI-powered tools for modern marketing teams. Building products at the intersection of creativity and intelligence.",
    period: "Feb 2024 — Present",
    location: "Bengaluru",
  },
  {
    id: "squadstack",
    company: "SquadStack",
    role: "Product Designer",
    description:
      "Worked on CRM and engagement products for high-growth businesses, focusing on usability, speed, and scale.",
    period: "May 2022 — Feb 2024",
    location: "Bengaluru",
  },
  {
    id: "streamalive",
    company: "StreamAlive",
    role: "Product Designer",
    description:
      "Designed interactive live-streaming experiences across web and event platforms for global users.",
    period: "Apr 2021 — May 2022",
    location: "Remote",
  },
];
