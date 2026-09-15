export type StripMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; alt?: string };

export type XhuliaProject = {
  id: string;
  label: string;
  title: string;
  outcomes: string;
  href?: string;
  ctaLabel: string;
  ctaDisabled?: boolean;
  logo: string;
  frames: StripMedia[];
};

const base = "/work/xhulia";

export const xhuliaProjects: XhuliaProject[] = [
  {
    id: "aria",
    label: "Aria: Design System — 2025–26",
    title:
      "A design system that stopped UI debates and helped 4 product teams ship faster",
    outcomes:
      "Fewer debates  •  Faster delivery  •  Dev-rated 4.4/5 for speed & efficiency  •  Shared UX standards",
    href: "#",
    ctaLabel: "View case study",
    logo: `${base}/img/c7c5d7bf23c0ef18.webp`,
    frames: [
      { type: "image", src: `${base}/img/431a25cd646d3b53.webp` },
      { type: "image", src: `${base}/img/3ee965add8e554e1.webp` },
      { type: "image", src: `${base}/img/458efb8525a11b1e.webp` },
      { type: "image", src: `${base}/img/3e807d5c969bbdd6.webp` },
      { type: "image", src: `${base}/img/fc9ff26d42c19dbf.webp` },
      { type: "image", src: `${base}/img/291209627ff1923d.webp` },
    ],
  },
  {
    id: "cyberdart",
    label: "CyberDart — 2024",
    title:
      "Turning a manual bug bounty MVP into a platform enterprise clients could trust",
    outcomes:
      "First funding round  •  Autonomous onboarding  •  Centralized support  •  ~200-screen redesign",
    href: "#",
    ctaLabel: "View case study",
    logo: `${base}/img/5cf46ff6823e300a.webp`,
    frames: [
      { type: "image", src: `${base}/img/b4efd3bce9dd209a.webp`, alt: "mockup" },
      { type: "video", src: `${base}/media/e1ecafe451653dd0.mp4` },
      {
        type: "image",
        src: `${base}/img/9bf115362d1241e7.webp`,
        alt: "report info card",
      },
      { type: "image", src: `${base}/img/1255d100293325a4.webp`, alt: "graphs" },
      {
        type: "image",
        src: `${base}/img/0ca59bea0379521e.webp`,
        alt: "hacktivity",
      },
    ],
  },
  {
    id: "bus",
    label: "Südtirol Mobil (Concept redesign) — Late 2025",
    title:
      "Fixing a city ticket purchase flow that made a €1.50 bus ride feel like booking a train",
    outcomes:
      "~83% faster purchase  •  18 → 5 taps  •  4.76/5 user confidence  •  Clearer ticket activation",
    href: "#",
    ctaLabel: "View case study",
    logo: `${base}/img/7ae0e34e78aa2ca9.webp`,
    frames: [
      { type: "image", src: `${base}/img/25f3fbf1fcbe725a.webp` },
      { type: "video", src: `${base}/media/bdb9656f9d1e561a.mp4` },
      { type: "video", src: `${base}/media/fba3768a54dcb6de.mp4` },
      { type: "image", src: `${base}/img/8443437ae7a38a26.webp` },
      { type: "image", src: `${base}/img/4586e0f49e4d6b7d.webp` },
    ],
  },
  {
    id: "easydrink",
    label: "Easy Drink — 2023",
    title:
      "Redesigning a fragile marketplace by moving effort away from busy bar staff",
    outcomes:
      "Staff friction reduced  •  Customer-led activation  •  Founder-free onboarding  •  Marketplace viability improved",
    ctaLabel: "Coming soon",
    ctaDisabled: true,
    logo: `${base}/img/282a2b39f2820551.webp`,
    frames: [
      { type: "image", src: `${base}/img/09c98d5f47bfa2c4.webp`, alt: "logo" },
      { type: "video", src: `${base}/media/5a8f979ab285ac53.mp4` },
      { type: "image", src: `${base}/img/4c3c1fa10f270e3b.webp`, alt: "mosaic" },
      { type: "image", src: `${base}/img/e1a3506919e52150.webp`, alt: "screens" },
      { type: "video", src: `${base}/media/27f165a742ce04c2.mp4` },
      { type: "image", src: `${base}/img/fb495cfd07f355f8.webp` },
      { type: "image", src: `${base}/img/d014282cdb951182.webp` },
      { type: "image", src: `${base}/img/d71f60a3da1b3986.webp` },
    ],
  },
];
