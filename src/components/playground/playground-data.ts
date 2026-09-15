export type PlaygroundCard = {
  id: string;
  src: string;
  alt: string;
  aspect: number;
  width: number;
  x: number;
  y: number;
  rotate: number;
};

/** Scatter inspired by Xhulia's playground infinite canvas. */
export const playgroundCards: PlaygroundCard[] = [
  {
    id: "a",
    src: "/playground/cf237469619ba3bb.webp",
    alt: "Exploration board",
    aspect: 1.41,
    width: 280,
    x: -420,
    y: -260,
    rotate: -3,
  },
  {
    id: "b",
    src: "/playground/efab4f3555f418a4.webp",
    alt: "Side project still",
    aspect: 1.04,
    width: 220,
    x: 180,
    y: -300,
    rotate: 4,
  },
  {
    id: "c",
    src: "/playground/0e5d60296e93b2f5.gif",
    alt: "Motion experiment",
    aspect: 1.38,
    width: 300,
    x: 460,
    y: -80,
    rotate: -5,
  },
  {
    id: "d",
    src: "/playground/d71f60a3da1b3986.webp",
    alt: "Square study",
    aspect: 1,
    width: 180,
    x: -120,
    y: 40,
    rotate: -7,
  },
  {
    id: "e",
    src: "/playground/a3f63ca94ad36e09.webp",
    alt: "Visual study",
    aspect: 1,
    width: 240,
    x: -520,
    y: 120,
    rotate: 8,
  },
  {
    id: "f",
    src: "/playground/fcc61dfffab8cab3.webp",
    alt: "Icon exploration",
    aspect: 1,
    width: 160,
    x: 40,
    y: 280,
    rotate: 2,
  },
  {
    id: "g",
    src: "/playground/6258849456846094.webp",
    alt: "Tall frame study",
    aspect: 0.47,
    width: 140,
    x: 320,
    y: 180,
    rotate: -2,
  },
  {
    id: "h",
    src: "/playground/a8244d3237fd6d28.webp",
    alt: "Tall frame study two",
    aspect: 0.47,
    width: 140,
    x: -280,
    y: 320,
    rotate: 3,
  },
  {
    id: "i",
    src: "/playground/1f2ca155d2d1153f.webp",
    alt: "Wide collage",
    aspect: 2.61,
    width: 360,
    x: -40,
    y: -420,
    rotate: -5,
  },
  {
    id: "j",
    src: "/playground/c034476a1c617ebe.webp",
    alt: "Poster exploration",
    aspect: 1,
    width: 210,
    x: 520,
    y: 260,
    rotate: 4,
  },
  {
    id: "k",
    src: "/playground/0aeb12bbbd7bf83b.webp",
    alt: "UI fragment",
    aspect: 1,
    width: 200,
    x: -600,
    y: -80,
    rotate: -4,
  },
  {
    id: "l",
    src: "/playground/c8ce5635974f6777.webp",
    alt: "Texture study",
    aspect: 1,
    width: 190,
    x: 280,
    y: -480,
    rotate: 6,
  },
];
