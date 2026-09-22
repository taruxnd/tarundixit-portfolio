import { contentContainerClassName } from "@/lib/sectionLayout";
import { stripFontClassName } from "@/lib/heroFonts";
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
}[] = [
  {
    key: "a",
    title: "Ranjish Hi Sahi",
    artist: "Mehdi Hassan",
    coverSrc: "/about-music/ranjish-hi-sahi.jpg",
    coverAlt: "Ranjish Hi Sahi — Mehdi Hassan",
    audioSrc: "/about-music/ranjish-hi-sahi.mp3",
    audioStartSeconds: 4 * 60 + 52,
  },
  {
    key: "b",
    title: "Raabta",
    artist: "Arijit Singh & Shreya Ghoshal",
    coverSrc: "/about-music/raabta.jpg",
    coverAlt: "Raabta — Arijit Singh & Shreya Ghoshal",
  },
  {
    key: "c",
    title: "Khat",
    artist: "Navjot Ahuja",
    coverSrc: "/about-music/khat.jpg",
    coverAlt: "Khat — Navjot Ahuja",
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
            }) => (
              <div key={key} className="about-music__track">
                <CoverClose
                  coverSrc={coverSrc}
                  coverAlt={coverAlt}
                  audioSrc={audioSrc}
                  audioStartSeconds={audioStartSeconds}
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
