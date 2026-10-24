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
  /** public/work/copilot/platforms/post-<id>.webp: the Mamaearth poster for this platform. */
  image: string;
  caption: string[];
  note: string;
};

const PLATFORMS: Platform[] = [
  {
    id: "x",
    name: "X",
    size: "1600 × 900",
    shape: "Wide",
    ratio: 1600 / 900,
    image: "/work/copilot/platforms/post-x.webp",
    caption: ["Hair fall season? Meet our new Onion Hair Fall Shampoo. Onion oil + keratin. 🧅"],
    note: "Short and direct, under 280 characters.",
  },
  {
    id: "instagram",
    name: "Instagram",
    size: "1080 × 1350",
    shape: "Portrait",
    ratio: 1080 / 1350,
    image: "/work/copilot/platforms/post-instagram.webp",
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
    size: "1200 × 630",
    shape: "Landscape",
    ratio: 1200 / 630,
    image: "/work/copilot/platforms/post-facebook.webp",
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
    image: "/work/copilot/platforms/post-linkedin.webp",
    caption: [
      "Today we are launching our Onion Hair Fall Shampoo.",
      "Hair fall is one of the most common concerns we hear from customers. This shampoo is our answer: onion oil and plant keratin, made for regular use.",
      "Thank you to the product team who brought it to life.",
    ],
    note: "Professional tone, focused on the product launch.",
  },

];

const ICONS: Record<string, string> = {
  instagram: '<defs><radialGradient id="cs-ig-grad" cx="30%" cy="107%" r="150%"><stop offset="0" stop-color="#fdf497"/><stop offset=".09" stop-color="#fdf497"/><stop offset=".45" stop-color="#fd5949"/><stop offset=".6" stop-color="#d6249f"/><stop offset=".9" stop-color="#285AEB"/></radialGradient></defs><rect width="24" height="24" rx="6" fill="url(#cs-ig-grad)"/><g transform="translate(4.2 4.2) scale(0.65)"><path fill="#fff" d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></g>',
  facebook: '<circle cx="12" cy="12" r="11" fill="#fff"/><path fill="#1877F2" d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/>',
  linkedin: '<rect x="1" y="1" width="22" height="22" rx="3" fill="#fff"/><path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
  x: '<rect width="24" height="24" rx="6" fill="#fff"/><g transform="translate(5 5) scale(0.5833)"><path fill="#000" d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"/></g>',
};

/** One idea, four platforms: switch to see the size and caption change. */
export default function PlatformSwitcher() {
  const [active, setActive] = useState<Platform["id"]>(PLATFORMS[0].id);
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
              aria-label={p.name}
              title={p.name}
              onClick={() => setActive(p.id)}
            >
              <svg
                className="cs-demo__icon"
                viewBox="0 0 24 24"
                width={16}
                height={16}
                aria-hidden
                dangerouslySetInnerHTML={{ __html: ICONS[p.id] }}
              />
              <span className="cs-demo__tab-label">{p.name}</span>
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={platform.image} alt="Mamaearth Onion Hair Fall Control Shampoo post" loading="lazy" decoding="async" />
          <span className="cs-post__size">
            {platform.size} · {platform.shape}
          </span>
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
