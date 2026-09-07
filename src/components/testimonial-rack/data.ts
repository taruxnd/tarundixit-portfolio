export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  companyLogo: string;
  initials: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "01",
    quote:
      "We stopped keeping a second copy of everything. One place, one version, and the arguing about it just ended.",
    name: "Rowan Ashcroft",
    role: "Creative Director, Foldwork",
    companyLogo: "/testimonials/5efc81d3055dadb0.svg",
    initials: "RA",
  },
  {
    id: "02",
    quote:
      "It survived our busiest quarter without a single where-is-that-file message. That is the whole review.",
    name: "Ines Delacroix",
    role: "Head of Product, Northline",
    companyLogo: "/testimonials/55c2f5ddea13f9de.svg",
    initials: "ID",
  },
  {
    id: "03",
    quote:
      "Handover used to be a meeting. Now it is one link, and the new person is useful by lunchtime.",
    name: "Tomas Ferreira",
    role: "Engineering Lead, Stackform",
    companyLogo: "/testimonials/e13707b0dce0b3d4.svg",
    initials: "TF",
  },
  {
    id: "04",
    quote:
      "Every brief and every round of notes, in order. I stopped rebuilding context at the start of each week.",
    name: "Yuki Moriyama",
    role: "Design Ops, Meridian",
    companyLogo: "/testimonials/473b17e4cc11c2f9.svg",
    initials: "YM",
  },
  {
    id: "05",
    quote:
      "Six of us doing the work of fifteen, mostly because nothing falls through the cracks any more.",
    name: "Adaeze Nwankwo",
    role: "Founder, Parcel & Co.",
    companyLogo: "/testimonials/81d03f7a3dd246a5.svg",
    initials: "AN",
  },
  {
    id: "06",
    quote:
      "Specs, tickets and the decisions behind them finally live together. Code review got noticeably shorter.",
    name: "Halvard Ness",
    role: "VP Product, Kitehouse",
    companyLogo: "/testimonials/f25bdaf35198bbdc.svg",
    initials: "HN",
  },
];
