import { stripFontClassName } from "@/lib/heroFonts";
import { contentContainerClassName } from "@/lib/sectionLayout";
import AboutBentoTile from "./AboutBentoTile";
import "./about-bento-grid.css";

const BENTO_IMAGES = [
  {
    cartoonSrc: "/about-bento/shin-hands.jpg",
    alt: "Shin-chan holding hands under sparkles",
    label: "Professional yapper",
  },
  {
    cartoonSrc: "/about-bento/shin-run.jpg",
    alt: "Shin-chan and Shiro running by a mossy bridge",
    label: "Love to travel",
  },
  {
    cartoonSrc: "/about-bento/shin-car.jpg",
    alt: "Shin-chan sitting cool in a yellow toy car",
    label: "Petrolhead",
  },
  {
    cartoonSrc: "/about-bento/shin-swim.jpg",
    alt: "Shin-chan swimming race in the pool",
    label: "Chlorine in my veins",
  },
  {
    cartoonSrc: "/about-bento/shin-cook.jpg",
    alt: "Shin-chan cooking on a step stool",
    label: "Dangerously good cook",
  },
] as const;

export default function AboutBentoGrid() {
  return (
    <section
      className={`about-bento theme-transition ${stripFontClassName}`}
      aria-labelledby="about-bento-heading"
    >
      <div className={`${contentContainerClassName} about-bento__inner`}>
        <header className="about-bento__header">
          <h2 id="about-bento-heading" className="about-bento__heading">
            Me, minus the Figma file.
          </h2>
        </header>

        <div className="about-bento__grid">
          {BENTO_IMAGES.map((image, index) => (
            <AboutBentoTile
              key={image.cartoonSrc}
              cartoonSrc={image.cartoonSrc}
              alt={image.alt}
              label={image.label}
              index={index}
              sizes={
                index < 2
                  ? "(max-width: 767px) 50vw, 50vw"
                  : "(max-width: 767px) 50vw, 33vw"
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
