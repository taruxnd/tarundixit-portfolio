import { contentContainerClassName } from "@/lib/sectionLayout";
import { stripFontClassName } from "@/lib/heroFonts";
import { assetUrl } from "@/lib/cdnAssets";
import CoverClose from "./CoverClose";
import "./about-music.css";
import "./cover-close.css";

const COVERS: {
  key: string;
  title: string;
  artist: string;
  coverSrc: string;
  coverAlt: string;
  audioSrc?: string;
  audioStartSeconds?: number;
  audioEndSeconds?: number;
}[] = [
  {
    key: "a",
    title: "Ranjish Hi Sahi",
    artist: "Mehdi Hassan",
    coverSrc: assetUrl("about-music/ranjish-hi-sahi.jpg"),
    coverAlt: "Ranjish Hi Sahi — Mehdi Hassan",
    audioSrc: assetUrl("about-music/ranjish-hi-sahi.mp3"),
    audioStartSeconds: 4 * 60 + 52,
  },
  {
    key: "b",
    title: "Raabta",
    artist: "Arijit Singh & Shreya Ghoshal",
    coverSrc: assetUrl("about-music/raabta.jpg"),
    coverAlt: "Raabta — Arijit Singh & Shreya Ghoshal",
    audioSrc: assetUrl("about-music/raabta.mp3"),
    audioStartSeconds: 2 * 60,
    audioEndSeconds: 3 * 60,
  },
  {
    key: "c",
    title: "Khat",
    artist: "Navjot Ahuja",
    coverSrc: assetUrl("about-music/khat.jpg"),
    coverAlt: "Khat — Navjot Ahuja",
    audioSrc: assetUrl("about-music/khat.mp3"),
    audioStartSeconds: 1 * 60 + 49,
    audioEndSeconds: 2 * 60 + 30,
  },
];

/** Favorites shelf on /about — Framer Cover_close players. */
export default function AboutMusicShelf() {
  return (
    <section
      className={`about-music theme-transition ${stripFontClassName}`}
      aria-labelledby="about-music-heading"
    >
      <div className={`${contentContainerClassName} about-music__inner`}>
        <header className="about-music__header">
          <h2 id="about-music-heading" className="about-music__heading">
            Some of the songs I keep close.
          </h2>
        </header>

        <div className="about-music__grid">
          {COVERS.map(
            ({
              key,
              title,
              artist,
              coverSrc,
              coverAlt,
              audioSrc,
              audioStartSeconds,
              audioEndSeconds,
            }) => (
              <div key={key} className="about-music__track">
                <CoverClose
                  coverSrc={coverSrc}
                  coverAlt={coverAlt}
                  audioSrc={audioSrc}
                  audioStartSeconds={audioStartSeconds}
                  audioEndSeconds={audioEndSeconds}
                />
                <div className="about-music__meta">
                  <p className="about-music__title">{title}</p>
                  <p className="about-music__artist">{artist}</p>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
