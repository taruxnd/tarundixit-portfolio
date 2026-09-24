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
}[] = [
  {
    key: "a",
    title: "Ranjish Hi Sahi",
    artist: "Mehdi Hassan",
    coverSrc: assetUrl("about-music/ranjish-hi-sahi.jpg"),
    coverAlt: "Ranjish Hi Sahi — Mehdi Hassan",
    // Trimmed to the former preview window (4:52 → end)
    audioSrc: assetUrl("about-music/ranjish-hi-sahi.mp3"),
  },
  {
    key: "b",
    title: "Raabta",
    artist: "Arijit Singh & Shreya Ghoshal",
    coverSrc: assetUrl("about-music/raabta.jpg"),
    coverAlt: "Raabta — Arijit Singh & Shreya Ghoshal",
    // Trimmed to the former preview window (2:00 → 3:00)
    audioSrc: assetUrl("about-music/raabta.mp3"),
  },
  {
    key: "c",
    title: "Khat",
    artist: "Navjot Ahuja",
    coverSrc: assetUrl("about-music/khat.jpg"),
    coverAlt: "Khat — Navjot Ahuja",
    // Trimmed to the former preview window (1:49 → 2:30)
    audioSrc: assetUrl("about-music/khat.mp3"),
  },
  {
    key: "d",
    title: "Khat",
    artist: "Navjot Ahuja",
    coverSrc: assetUrl("about-music/khat.jpg"),
    coverAlt: "Khat — Navjot Ahuja",
    audioSrc: assetUrl("about-music/khat.mp3"),
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
          <p className="about-music__subline">
            Tap a cover to play or pause.
          </p>
        </header>

        <div className="about-music__grid">
          {COVERS.map(({ key, title, artist, coverSrc, coverAlt, audioSrc }) => (
              <div key={key} className="about-music__track">
                <CoverClose
                  coverSrc={coverSrc}
                  coverAlt={coverAlt}
                  audioSrc={audioSrc}
                />
                <div className="about-music__meta">
                  <p className="about-music__title">{title}</p>
                  <p className="about-music__artist">{artist}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
