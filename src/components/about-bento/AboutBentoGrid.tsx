import { stripFontClassName } from "@/lib/heroFonts";
import { assetUrl } from "@/lib/cdnAssets";
import { contentContainerClassName } from "@/lib/sectionLayout";
import AboutBentoTile from "./AboutBentoTile";
import "./about-bento-grid.css";

/**
 * Hover reveals real photos through a pixel dissolve.
 * Media paths go through jsDelivr (`assetUrl`) once pushed to main.
 */
const BENTO_IMAGES = [
  {
    cartoonSrc: assetUrl("about-bento/shin-swim.jpg"),
    realVideoSrc: assetUrl("about-bento/chlorine-swim.mp4"),
    alt: "Shin-chan swimming race in the pool",
    label: "Chlorine in my veins",
  },
  {
    cartoonSrc: assetUrl("about-bento/shin-run.jpg"),
    realSrc: assetUrl("about-bento/real-travel.jpg"),
    alt: "Shin-chan and Shiro running by a mossy bridge",
    label: "Love to travel",
  },
  {
    cartoonSrc: assetUrl("about-bento/shin-aviation.jpg"),
    realSrc: assetUrl("about-bento/real-aviation.jpg"),
    alt: "Shin-chan as a pilot, and a MiG-21 on the runway",
    label: "Aviation paglu",
    realCoverFocus: { x: 0.5, y: 0.48 },
  },
  {
    cartoonSrc: assetUrl("about-bento/shin-dogs.jpg"),
    realSrc: assetUrl("about-bento/real-dogs.jpg"),
    alt: "Holding a German Shepherd puppy outdoors",
    label: "Soft for dogs",
    // Portrait in a wide tile — keep puppy + face in frame
    realCoverFocus: { x: 0.42, y: 0.38 },
  },
  {
    cartoonSrc: assetUrl("about-bento/shin-cook.jpg"),
    realSrc: assetUrl("about-bento/real-cook.jpg"),
    alt: "A pot of creamy orange chicken curry on the stove",
    label: "Dangerously good cook",
    realCoverFocus: { x: 0.5, y: 0.42 },
  },
];

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
          <p className="about-bento__subline">
            Hover a tile to reveal the real moment.
          </p>
        </header>

        <div className="about-bento__grid">
          {BENTO_IMAGES.map((image, index) => (
            <AboutBentoTile
              key={image.cartoonSrc}
              cartoonSrc={image.cartoonSrc}
              realSrc={"realSrc" in image ? image.realSrc : undefined}
              realVideoSrc={
                "realVideoSrc" in image ? image.realVideoSrc : undefined
              }
              alt={image.alt}
              label={image.label}
              index={index}
              sizes={
                index < 2
                  ? "(max-width: 767px) 50vw, 50vw"
                  : "(max-width: 767px) 50vw, 33vw"
              }
              realCoverFocus={
                "realCoverFocus" in image ? image.realCoverFocus : undefined
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
