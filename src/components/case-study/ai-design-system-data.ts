export type CaseStudyMetaGroup = {
  label: string;
  tags: string[];
};

export type CaseStudyMedia = {
  src: string;
  alt: string;
  aspect: string;
  wide?: boolean;
  caption?: string;
};

export type CaseStudySummaryCard = {
  title: string;
  items: string[];
};

export type CaseStudyMetric = {
  headline: string;
  detail: string;
  note: string;
};

export type CaseStudyContentBlock = {
  id: string;
  chapter: "process" | "results";
  eyebrow: string;
  title: string;
  body: string[];
  bullets?: string[];
  afterBullets?: string[];
  figures?: CaseStudyMedia[];
};

/** Full Aria design-system case study structure, adapted for Tarun's AI DS. */
export const aiDesignSystemCaseStudy = {
  headline: "AI Design System",
  title:
    "A design system that stopped UI debates and helped product teams ship faster",
  note: "This project has been anonymized for confidentiality.",
  intro: [
    "The product didn’t have a design system problem. It had a decision problem. Every small UI choice turned into a discussion.",
    "Patterns weren’t shared. Components couldn’t evolve. “If it’s not in the library, we don’t build it.”",
    "So teams either argued or built one-offs. Delivery slowed down. And a lot of small UX fixes never made it onto the roadmap.",
    "I pushed to rebuild the system in a way people would actually use — especially as AI tooling entered the design-to-code loop.",
  ],
  meta: [
    { label: "Role", tags: ["Product Designer"] },
    { label: "Status", tags: ["In use", "2024–26"] },
    { label: "Type", tags: ["Design System", "B2B SaaS", "Multi-product"] },
    { label: "Tools", tags: ["Figma", "Tokens", "Storybook", "Code Connect"] },
  ] satisfies CaseStudyMetaGroup[],
  summary: [
    {
      title: "Problems",
      items: [
        "UI decisions were constantly re-debated.",
        "The component library blocked progress instead of enabling it.",
        "Inconsistencies slowed down delivery.",
      ],
    },
    {
      title: "Solution",
      items: [
        "Rebuilt the system from the inside out.",
        "Defined tokens, patterns, and rules that map to code.",
        "Focused on adoption over completeness.",
      ],
    },
    {
      title: "Results",
      items: [
        "Adopted by 4 product pods.",
        "FE devs rated the system 4.4/5 for speed and efficiency.",
        "Repeated UI debates dropped. QA friction decreased.",
        "Systemic UX improvements shipped without extra tickets.",
      ],
    },
  ] satisfies CaseStudySummaryCard[],
  media: [
    {
      src: "/work/ai-design-system/15e1564e2f6c33e6.webp",
      alt: "Design system component exploration",
      aspect: "0.76",
    },
    {
      src: "/work/ai-design-system/0927869f5d17d7e0.webp",
      alt: "Component library screens",
      aspect: "0.76",
    },
    {
      src: "/work/ai-design-system/5b12ee81c1013051.webp",
      alt: "System overview board",
      aspect: "1.41",
      wide: true,
    },
    {
      src: "/work/ai-design-system/7426ae3c88c29466.webp",
      alt: "Detailed product UI frames",
      aspect: "1.41",
      wide: true,
    },
    {
      src: "/work/ai-design-system/4717718b8854f7ea.webp",
      alt: "Token and pattern documentation",
      aspect: "0.81",
    },
    {
      src: "/work/ai-design-system/bb163bebdaec6906.webp",
      alt: "Component states",
      aspect: "0.81",
    },
    {
      src: "/work/ai-design-system/22ecde1250fe02d9.webp",
      alt: "Implementation handoff",
      aspect: "0.78",
    },
  ] satisfies CaseStudyMedia[],
  sections: [
    {
      id: "scene",
      chapter: "process",
      eyebrow: "Setting the scene",
      title: "The product looked fine. Until you tried to build anything in it.",
      body: [
        "Every UI decision turned into a discussion. The component library existed, but it was too limited to be useful and too rigid to evolve.",
        "“If it’s not in the library, we don’t build it.” This was the default answer to most things.",
        "So teams either argued, hacked around it, or shipped poor UX. As a surprise to no one, delivery slowed, issues piled up.",
        "This was the state of the product when I joined.",
        "It was clear this wouldn’t be sustainable. So I pushed for a proper design system, one that teams could actually use. It wasn’t an easy sell, but over time the need became obvious.",
        "Eventually, we formed a small team: two FE developers (web and mobile) and I (design).",
      ],
      figures: [
        {
          src: "/work/ai-design-system/08fd618079a0ef62.webp",
          alt: "Standard conversation between teammates",
          aspect: "2.51",
          caption: "Fig 1. Standard conversation between teammates",
        },
      ],
    },
    {
      id: "constraints",
      chapter: "process",
      eyebrow: "Constraints",
      title: "With no full-time DS team, I chose speed and adoption over purity.",
      body: [
        "No one was working on the system full-time, so aiming for a “perfect” system wasn’t realistic. For us, the biggest goal was adoption, and that meant making trade-offs.",
        "I worked closely with developers to accelerate setup. Instead of building everything from scratch, we agreed to use existing foundations and align the UI to our brand, rather than reworking component logic.",
        "We landed on WebAwesome for Angular and Material 3 for Flutter. This meant accepting some inconsistencies across platforms.",
        "To keep the system manageable, we set a few clear rules:",
      ],
      bullets: [
        "Add a component only if at least two teams need it",
        "Build for current needs, not hypothetical ones",
      ],
      afterBullets: [
        "This reduced complexity for developers and sped up their work a lot.",
      ],
      figures: [
        {
          src: "/work/ai-design-system/02cee2c6bffacb2b.webp",
          alt: "Adoption trade-off conversation",
          aspect: "1.6",
          caption: "Fig 1. Standard conversation between teammates",
        },
      ],
    },
    {
      id: "foundations",
      chapter: "process",
      eyebrow: "The foundations",
      title: "Setting up a solid token structure.",
      body: [
        "We built the system on an Atomic Design approach, supported by a shared token system between Figma and code.",
        "I set up tokens for color, typography, spacing, radii, and heights, and I defined a three-layer token structure:",
      ],
      bullets: [
        "Primitive: raw values",
        "Semantic: meaning-based tokens",
        "Component: specific overrides when needed",
      ],
      afterBullets: [
        "It was a pain to set up, but it saved us many times down the line.",
        "This token structure made dark mode and multi-brand theming a piece of cake.",
        "Iconography — Icons were a huge topic for us. The previous icons had no unified style and were just jammed together, so I knew they had to be reworked. We decided to adopt Google’s Material Icons (rounded) as a base, due to its extensive library and clean look.",
        "That wasn’t enough — our product is very domain specific — so we had to integrate many icons down the line. We created about 80 custom icons by hand through the design system’s lifecycle.",
      ],
      figures: [
        {
          src: "/work/ai-design-system/e74e884f97673797.webp",
          alt: "Token structure overview",
          aspect: "1.5",
        },
        {
          src: "/work/ai-design-system/bfc3f8e2b6be1de3.webp",
          alt: "Iconography system",
          aspect: "1.5",
        },
        {
          src: "/work/ai-design-system/5b63b46060fe6dce.webp",
          alt: "Custom icon set",
          aspect: "1.5",
        },
      ],
    },
    {
      id: "systemic-fixes",
      chapter: "process",
      eyebrow: "Systemic fixes",
      title: "Making good UX the default.",
      body: [
        "At the same time, I used the system to fix long-standing UX issues — without turning each one into a debate. Instead of proposing isolated improvements (which usually get deprioritized), I embedded them directly into the foundation.",
      ],
      bullets: [
        "Accessibility by default: color tokens were set so text and surface combinations consistently pass WCAG AA or APCA contrast.",
        "Usable touch targets: all interactive elements meet a minimum of 44px, even when visually smaller.",
        "Safer interactions: introduced proper destructive actions, previously missing from the library.",
      ],
      afterBullets: [
        "This way, teams didn’t have to “opt in” to better UX. It came built into the system.",
        "The rest of the UX improvements were covered by individual components and strict patterns.",
      ],
      figures: [
        {
          src: "/work/ai-design-system/b9ceb5b7ed7ea50a.webp",
          alt: "Systemic UX defaults",
          aspect: "1.6",
        },
        {
          src: "/work/ai-design-system/eaaaff009cdcdee3.webp",
          alt: "Component-level UX improvements",
          aspect: "1.6",
        },
      ],
    },
    {
      id: "patterns",
      chapter: "process",
      eyebrow: "Design patterns",
      title: "Reducing design guesswork by defining clear patterns.",
      body: [
        "Once we had a solid base of components, I focused on patterns. I audited other design systems and products (via Mobbin) to define clear guidelines for recurring problems — areas with no single “correct” solution that were causing inconsistency and unnecessary debate.",
        "I focused on:",
      ],
      bullets: [
        "Action hierarchy and button placement",
        "Destructive actions",
        "Feedback and system states",
        "Tables: filtering, sorting, bulk actions",
        "Forms and validation",
        "Containers by use case",
      ],
      figures: [
        {
          src: "/work/ai-design-system/43bc554ff29f201a.webp",
          alt: "Pattern guidelines",
          aspect: "2.53",
        },
      ],
    },
    {
      id: "workflow",
      chapter: "process",
      eyebrow: "Full workflow",
      title: "From Figma to production.",
      body: [
        "Any designer working on a DS knows it’s only as good as the frontend dev building it — luckily, we had two strong ones.",
        "To make this work, through Supernova, we connected the design system to Storybook and Widgetbook, which became the single source of truth for developers.",
        "Later, we pushed it a bit further. Using Figma’s Code Connect and MCP servers, we made the system easier to use in AI-assisted code generation.",
        "My role here was support:",
      ],
      bullets: [
        "Aligning naming conventions with code standards",
        "Adjusting variants to match component props",
      ],
      figures: [
        {
          src: "/work/ai-design-system/dd3b7a459ba9d22d.webp",
          alt: "Figma to production workflow",
          aspect: "1.6",
        },
      ],
    },
    {
      id: "enforcement",
      chapter: "process",
      eyebrow: "Documentation and enforcement",
      title: "Documentation alone wasn’t enough to drive adoption.",
      body: [
        "I initially thought that once we put out solid guidelines, things would naturally fall into place, but no one really reads documentation. Shocker.",
        "To make the system stick, I had to be more proactive. During design reviews, I pushed for proper use of components and patterns and encouraged fellow designers to follow the system more closely. It felt a bit uncomfortable at first, but over time these patterns became the default.",
        "On the dev side, the frontend team supported adoption by running workshops on Figma Dev Mode to help other devs get familiar with the system.",
      ],
      figures: [
        {
          src: "/work/ai-design-system/79b8a54db28b174b.webp",
          alt: "Documentation and review process",
          aspect: "1.6",
        },
      ],
    },
    {
      id: "impact",
      chapter: "results",
      eyebrow: "Results",
      title: "Things shipped faster, and with less friction.",
      body: [
        "A design system is never “done,” but within six months we saw clear impact.",
        "It was adopted by 4 product pods, and developers reported faster delivery, rating it 4.4/5 on average for speed and efficiency. In some cases, work that used to take a week was done in a day.",
        "At the same time, alignment and QA effort dropped significantly, since many inconsistencies were handled upfront by the system.",
        "Stakeholders also noticed, praising speed and calling the UI cleaner and more modern. The system has since also attracted interest from other companies within the group.",
      ],
      figures: [
        {
          src: "/work/ai-design-system/06b106d7bcdb4984.webp",
          alt: "Results overview",
          aspect: "1.6",
        },
      ],
    },
    {
      id: "learnings",
      chapter: "results",
      eyebrow: "Learnings",
      title:
        "Most design problems aren’t actually design problems but alignment problems.",
      body: [
        "Once decisions were clearly defined in the system, a lot of friction disappeared. Teams spent less time debating small details, fewer inconsistencies reached development, and work moved faster.",
        "That’s the lesson I take forward — especially as AI enters the workflow: encode decisions once, then let people and tools reuse them.",
      ],
    },
  ] satisfies CaseStudyContentBlock[],
  metrics: [
    {
      headline: "4.4/5",
      detail: "Average rating for speed & efficiency",
      note: "Reported by front-end devs across 4 product pods",
    },
    {
      headline: "Alignment & QA effort dropped",
      detail: "Both design and dev started from a clear shared base",
      note: "Fewer inconsistencies reached development",
    },
    {
      headline: "Systemic UX improvements",
      detail: "Across the entire platform",
      note: "Without having to write a single ticket for it :)",
    },
  ] satisfies CaseStudyMetric[],
  next: {
    href: "/#work",
    label: "Back to projects",
  },
};
