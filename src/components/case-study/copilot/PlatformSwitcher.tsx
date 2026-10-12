"use client";

import { useId, useState } from "react";
import LiquidGlass from "@/components/navbar/LiquidGlass";

type Platform = {
  id: "instagram" | "facebook" | "linkedin" | "x";
  name: string;
  size: string;
  shape: string;
  /** Aspect ratio of the post image, width / height. */
  ratio: number;
  caption: string[];
  note: string;
};

const PLATFORMS: Platform[] = [
  {
    id: "instagram",
    name: "Instagram",
    size: "1080 × 1350",
    shape: "Portrait",
    ratio: 1080 / 1350,
    caption: [
      "Hair fall season is here 🍂",
      "Our Onion Hair Fall Shampoo is made with onion oil and plant keratin to help strengthen hair from the root.",
      "Use it 3 times a week as part of your routine. 💜",
      "#HairFall #OnionShampoo #HairCare #Mamaearth",
    ],
    note: "Longer caption, emojis, hashtags at the end.",
  },
  {
    id: "facebook",
    name: "Facebook",
    size: "1080 × 1080",
    shape: "Square",
    ratio: 1,
    caption: [
      "Seeing more hair on your comb lately? You're not the only one. Seasonal hair fall affects most of us.",
      "We made our Onion Hair Fall Shampoo for exactly this. Tell us in the comments: how often do you wash your hair?",
    ],
    note: "Friendly tone, ends with a question to start comments.",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    size: "1200 × 627",
    shape: "Landscape",
    ratio: 1200 / 627,
    caption: [
      "Today we are launching our Onion Hair Fall Shampoo.",
      "Hair fall is one of the most common concerns we hear from customers. This shampoo is our answer: onion oil and plant keratin, made for regular use.",
      "Thank you to the product team who brought it to life.",
    ],
    note: "Professional tone, focus on the story and the numbers.",
  },
  {
    id: "x",
    name: "X",
    size: "1600 × 900",
    shape: "Wide",
    ratio: 1600 / 900,
    caption: ["Hair fall season? Meet our new Onion Hair Fall Shampoo. Onion oil + keratin. 🧅"],
    note: "Short and direct, under 280 characters.",
  },
];

/** One idea, four platforms: switch to see the size and caption change. */
export default function PlatformSwitcher() {
  const [active, setActive] = useState<Platform["id"]>("instagram");
  const baseId = useId();
  const platform = PLATFORMS.find((p) => p.id === active) ?? PLATFORMS[0];

  return (
    <section className="cs-demo" aria-labelledby={`${baseId}-label`}>
      <p id={`${baseId}-label`} className="cs-demo__label">
        One idea, four platforms. Switch to see the size and caption change.
      </p>
      <LiquidGlass className="cs-demo__tabs-glass">
        <div className="cs-demo__tabs" role="tablist" aria-label="Platform">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${p.id}`}
              aria-selected={p.id === active}
              aria-controls={`${baseId}-panel`}
              className={`cs-demo__tab${p.id === active ? " is-active" : ""}`}
              data-cursor="interactive"
              onClick={() => setActive(p.id)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/work/copilot/platforms/${p.id}.svg`} alt="" width={14} height={14} />
              {p.name}
            </button>
          ))}
        </div>
      </LiquidGlass>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${platform.id}`}
        className="cs-post"
        data-platform={platform.id}
      >
        <div className="cs-post__head">
          <span className="cs-post__avatar" aria-hidden>
            m
          </span>
          <span className="cs-post__who">
            <span className="cs-post__name">mamaearth</span>
            <span className="cs-post__meta">
              {platform.id === "linkedin"
                ? "12,400 followers · 1h"
                : platform.id === "x"
                  ? "@mamaearth · 1h"
                  : "Sponsored · 1h"}
            </span>
          </span>
        </div>

        {platform.id === "x" ? <p className="cs-post__text">{platform.caption[0]}</p> : null}

        <div className="cs-post__image" style={{ aspectRatio: platform.ratio }}>
          <span className="cs-post__size">
            {platform.size} · {platform.shape}
          </span>
          <span className="cs-post__product">Onion Hair Fall Shampoo</span>
        </div>

        {platform.id !== "x" ? (
          <div className="cs-post__text">
            {platform.caption.map((line, i) => (
              <p key={line}>
                {i === 0 && platform.id === "instagram" ? (
                  <strong className="cs-post__name">mamaearth </strong>
                ) : null}
                {line}
              </p>
            ))}
          </div>
        ) : null}

        <p className="cs-post__note">{platform.note}</p>
      </div>
    </section>
  );
}
