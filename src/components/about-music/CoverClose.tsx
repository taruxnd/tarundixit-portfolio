"use client";

import { assetUrl } from "@/lib/cdnAssets";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const spring = { type: "spring" as const, stiffness: 380, damping: 28, mass: 0.85 };

const DEFAULT_COVER = assetUrl("precious-channel/assets/img/b5f5356f32bfb4f5.webp");
const DEFAULT_COVER_SRCSET = [
  `${assetUrl("precious-channel/assets/img/f925b42254b16db5.webp")} 512w`,
  `${assetUrl("precious-channel/assets/img/545880a8bdf50a38.webp")} 1024w`,
  `${assetUrl("precious-channel/assets/img/b5f5356f32bfb4f5.webp")} 1200w`,
].join(", ");
const DISC_ART = assetUrl("precious-channel/assets/img/badb7d17ffb20811.webp");
const DISC_ART_SRCSET = [
  `${assetUrl("precious-channel/assets/img/7e500d0abef6578b.webp")} 512w`,
  `${assetUrl("precious-channel/assets/img/6e2f57f75aca3015.webp")} 1024w`,
  `${assetUrl("precious-channel/assets/img/badb7d17ffb20811.webp")} 1125w`,
].join(", ");

type CoverCloseProps = {
  /** Square album art for the sleeve only — disc centre stays default. */
  coverSrc?: string;
  coverAlt?: string;
  /** Vinyl ring color (outer disc, not the yellow centre). */
  discColor?: string;
  /** Optional vinyl ring color used only in dark mode. */
  darkModeDiscColor?: string;
  /** Optional preview clip — plays / pauses on tap. */
  audioSrc?: string;
  /** Seek here (seconds) each time playback starts. */
  audioStartSeconds?: number;
  /** Pause (and stay ready) when playback reaches this time. */
  audioEndSeconds?: number;
  /** Controlled playback — when set, parent owns exclusive play state. */
  playing?: boolean;
  onPlayingChange?: (playing: boolean) => void;
};

/**
 * Exact `Cover_close` markup from
 * precious-channel-784858-framer-app-optimized/src/sections/home/Variant1.tsx
 * Hover spring matches Framer open variant (framer-v-1inx27t).
 */
export default function CoverClose({
  coverSrc = DEFAULT_COVER,
  coverAlt = "Album cover",
  discColor = "rgb(92, 92, 92)",
  darkModeDiscColor,
  audioSrc,
  audioStartSeconds = 0,
  audioEndSeconds,
  playing: playingProp,
  onPlayingChange,
}: CoverCloseProps = {}) {
  const reducedMotion = useReducedMotion();
  /** Tap / click / keyboard only — no hover play. */
  const [internalPlaying, setInternalPlaying] = useState(false);
  const controlled = playingProp !== undefined;
  const playing = controlled ? playingProp : internalPlaying;
  const setPlaying = (next: boolean) => {
    if (!controlled) setInternalPlaying(next);
    onPlayingChange?.(next);
  };
  const active = playing && !reducedMotion;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isCustomCover = coverSrc !== DEFAULT_COVER;
  const discTinted = discColor !== "rgb(92, 92, 92)";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioSrc) return;

    const stop = () => {
      audio.pause();
      audio.currentTime = audioStartSeconds;
      setPlaying(false);
    };

    const onTimeUpdate = () => {
      if (audioEndSeconds == null) return;
      if (audio.currentTime >= audioEndSeconds) stop();
    };

    const onEnded = () => stop();

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    if (playing) {
      const start = () => {
        audio.currentTime = audioStartSeconds;
        void audio.play().catch(() => {});
      };

      if (audio.readyState >= 1) {
        start();
      } else {
        audio.addEventListener("loadedmetadata", start, { once: true });
      }
    } else {
      audio.pause();
    }

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- setPlaying is stable enough for stop callbacks
  }, [playing, audioSrc, audioStartSeconds, audioEndSeconds]);

  const togglePlay = () => setPlaying(!playing);

  return (
    <div
      className="about-music-cover-slot"
      data-cursor="interactive"
      data-playing={playing ? "true" : "false"}
      tabIndex={0}
      role="button"
      aria-pressed={playing}
      aria-label={
        audioSrc
          ? `${playing ? "Pause" : "Play"} preview: ${coverAlt}`
          : coverAlt
      }
      onClick={togglePlay}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          togglePlay();
        }
      }}
    >
      {audioSrc ? (
        <>
          <span className="about-music-cover-tooltip" aria-hidden>
            Play
          </span>
          <audio ref={audioRef} src={audioSrc} preload="metadata" playsInline />
        </>
      ) : null}
      <div
        className={`about-music-cover${isCustomCover ? " about-music-cover--custom" : ""}`}
      >
        <div
          className={`framer-z5dBK framer-1n23hte ${active ? "framer-v-1inx27t" : "framer-v-1n23hte"}`}
          data-framer-name="Cover_close"
          data-highlight="true"
          data-open={active ? "true" : undefined}
          style={{ height: "100%", width: "100%" }}
        >
          <motion.div
            className={`framer-oqb1nw${darkModeDiscColor ? " about-music-disc--theme" : ""}`}
            initial={false}
            animate={
              active
                ? { bottom: 30, left: 109, width: 202, rotate: 360 }
                : { bottom: 31, left: 34, width: 202, rotate: 0 }
            }
            transition={{
              bottom: spring,
              left: spring,
              width: spring,
              rotate: active
                ? {
                    repeat: Infinity,
                    ease: "linear",
                    duration: 2.8,
                    repeatType: "loop",
                  }
                : { duration: 0.35, ease: "easeOut" },
            }}
            style={{
              backgroundColor: discColor,
              ["--music-disc-dark-color" as string]: darkModeDiscColor,
              borderBottomLeftRadius: "101.18px",
              borderBottomRightRadius: "101.18px",
              borderTopLeftRadius: "101.18px",
              borderTopRightRadius: "101.18px",
              opacity: 1,
              position: "absolute",
            }}
          >
            <div className="framer-z329vc" data-framer-name="Image">
              <div
                style={{
                  position: "absolute",
                  borderRadius: "inherit",
                  top: "0",
                  right: "0",
                  bottom: "0",
                  left: "0",
                }}
                data-framer-background-image-wrapper="true"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  width="1125"
                  height="1122"
                  sizes="207.93px"
                  srcSet={DISC_ART_SRCSET}
                  src={DISC_ART}
                  alt=""
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    borderRadius: "inherit",
                    objectPosition: "center",
                    objectFit: "cover",
                    ...(discTinted
                      ? {
                          mixBlendMode: "multiply" as const,
                          opacity: 0.28,
                        }
                      : {}),
                  }}
                  loading="eager"
                />
              </div>
            </div>
            <div
              className="framer-zrovny"
              style={{
                backgroundColor: "rgb(255, 251, 0)",
                borderBottomLeftRadius: "38.24px",
                borderBottomRightRadius: "38.24px",
                borderTopLeftRadius: "38.24px",
                borderTopRightRadius: "38.24px",
                boxShadow:
                  "inset 0.421531111242075px 0.6021873017743928px 3.6753163950988705px -1.5px rgba(0, 0, 0, 0.85), inset 1.60197331227042px 2.288533303243457px 13.967554522250012px -3px rgba(0, 0, 0, 0.72), inset 7px 10px 61.032778078668514px -4.5px rgba(0, 0, 0, 0.1)",
                transform: "translate(-50%, -50%)",
              }}
            />
            <div
              className="framer-ej3vxg"
              style={{
                backgroundColor: "rgb(255, 255, 255)",
                borderBottomLeftRadius: "34.26px",
                borderBottomRightRadius: "34.26px",
                borderTopLeftRadius: "34.26px",
                borderTopRightRadius: "34.26px",
                boxShadow: "inset 0px 0.8px 2px 0px rgba(0, 0, 0, 0.25)",
                transform: "translate(-50%, -50%)",
              }}
            />
          </motion.div>

          <motion.div
            className="framer-3y739j"
            initial={false}
            animate={
              active
                ? { top: 59, left: 2, width: 203 }
                : { top: 66, left: 2, width: 198 }
            }
            transition={spring}
            style={{
              background:
                "linear-gradient(180deg, rgb(255, 54, 54) 5%, rgb(141, 0, 0) 20%)",
              borderBottomLeftRadius: "4.78px",
              borderBottomRightRadius: "4.78px",
              borderTopLeftRadius: "4.78px",
              borderTopRightRadius: "4.78px",
              boxShadow:
                "0.24087492070975713px 0.3010936508871964px 1.9279400537329519px -1.3333333333333333px rgba(0, 0, 0, 0.62), 0.9154133212973828px 1.1442666516217286px 7.32688153108522px -2.6666666666666665px rgba(0, 0, 0, 0.54), 4px 5px 32.01562118716424px -4px rgba(0, 0, 0, 0.16)",
              position: "absolute",
            }}
          />

          <motion.div
            className="framer-t5gqtq"
            initial={false}
            animate={active ? { bottom: 26 } : { bottom: 27 }}
            transition={spring}
            style={{
              backgroundColor: "rgb(51, 51, 51)",
              borderBottomLeftRadius: "4.78px",
              borderBottomRightRadius: "4.78px",
              borderTopLeftRadius: "4.78px",
              borderTopRightRadius: "4.78px",
              boxShadow:
                "0.421531111242075px 0.3010936508871964px 2.3828970791111983px -1.6666666666666665px rgba(0, 0, 0, 0.94), 1.60197331227042px 1.1442666516217286px 9.05588561512147px -3.333333333333333px rgba(0, 0, 0, 0.77), 7px 5px 39.57069622839609px -5px rgba(0, 0, 0, 0)",
              left: 0,
              width: 211,
              position: "absolute",
            }}
          >
            <div className="framer-p786x8" data-framer-name="Image">
              <div
                style={{
                  position: "absolute",
                  borderRadius: "inherit",
                  top: "0",
                  right: "0",
                  bottom: "0",
                  left: "0",
                }}
                data-framer-background-image-wrapper="true"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  width="1200"
                  height="1200"
                  sizes="218.29px"
                  {...(isCustomCover ? {} : { srcSet: DEFAULT_COVER_SRCSET })}
                  src={coverSrc}
                  alt=""
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    borderRadius: "inherit",
                    objectPosition: "center",
                    /* Custom posters need the full square; default art used cover+bleed */
                    objectFit: isCustomCover ? "fill" : "cover",
                  }}
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              <div
                className="framer-1c6q1mh"
                data-framer-appear-id="1c6q1mh"
                data-framer-component-type="RichTextContainer"
                style={{
                  ["--extracted-r6o4lv" as string]: "rgb(255, 251, 0)",
                  willChange: "transform",
                  opacity: "0.001",
                  transform: "translateX(-150px)",
                }}
              >
                <p
                  dir="auto"
                  className="framer-text"
                  style={{
                    ["--framer-font-family" as string]:
                      '"Mattone", "Mattone Placeholder", sans-serif',
                    ["--framer-font-size" as string]: "27px",
                    ["--framer-font-weight" as string]: "700",
                    ["--framer-letter-spacing" as string]: "0.01em",
                    ["--framer-text-color" as string]:
                      "var(--extracted-r6o4lv, rgb(255, 251, 0))",
                  }}
                >
                  TYRON
                </p>
              </div>
              <div
                className="framer-kmm8a"
                style={{
                  backgroundColor: "rgb(255, 46, 46)",
                  borderBottomLeftRadius: "14.34px",
                  borderBottomRightRadius: "14.34px",
                  borderTopLeftRadius: "14.34px",
                  borderTopRightRadius: "14.34px",
                  boxShadow:
                    "inset 0.5971439051427296px 0.39809593676181976px 0.4306065937645834px -1.1875px rgba(0, 0, 0, 0.91), inset 1.8108796073283884px 1.207253071552259px 1.3058438555829202px -2.375px rgba(0, 0, 0, 0.84), inset 4.786990141113346px 3.1913267607422307px 3.4519476817849544px -3.5625px rgba(0, 0, 0, 0.66), inset 15px 10px 10.81665382639197px -4.75px rgba(0, 0, 0, 0.05)",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
