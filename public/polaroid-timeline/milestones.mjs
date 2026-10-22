// The journey, one polaroid per moment, oldest first.
//
// Each card: title + caption + date on the front, flipText on the back.
// To add a photo, give a card an `image`, e.g. image: asset("/timeline/kumba.jpg")
// (put the file in public/timeline/). Cards without one use sample photos.
// Give a card `images` (an array) instead and it switches photo every 5 seconds.
// Same rule as assetUrl() in src/lib/cdnAssets.ts: the dev server reads
// public/ directly, the live site loads photos from the jsDelivr CDN.
const ASSET_CDN = "https://cdn.jsdelivr.net/gh/taruxnd/tarundixit-portfolio@main/public";
const isDev = typeof location !== "undefined" && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
const asset = (path) => (isDev ? path : ASSET_CDN + path);

export const milestones = [
  {
    "image": asset("/timeline/born.webp"),
    "title": "Hello, world",
    "caption": "Where it started",
    "date": "2004",
    "flipText": "I used to cry a lot as a kid. Like, a lot."
  },
  {
    "image": asset("/timeline/run-to-thrive.webp"),
    "title": "The first banner",
    "caption": "Class 9",
    "date": "2018",
    "flipText": "I designed banners, t-shirts and flyers for my brother's marathons. Didn't know that was called design."
  },
  {
    "images": [asset("/timeline/samosa-durex.webp"), asset("/timeline/samosa-ganesh.webp")],
    "title": "Posts nobody asked for",
    "caption": "Featured by Social Samosa",
    "date": "2018 – 22",
    "flipText": "I made posts for brands nobody asked me to. Social Samosa shared one, and I got serious."
  },
  {
    "image": asset("/timeline/btech-campus.webp"),
    "title": "B.Tech",
    "caption": "Where I found UX",
    "date": "2022 – 2026",
    "flipText": "I came in doing graphics and found UX on the way. Engineering is why I can build what I design."
  },
  {
    "image": asset("/timeline/caradvice.webp"),
    "title": "CarAdvice.in",
    "caption": "One cold DM",
    "date": "2022",
    "flipText": "I cold-DMed Faisal Khan, and somehow ended up building CarAdvice.in."
  },
  {
    "image": asset("/timeline/spaarks.webp"),
    "title": "Spaarks",
    "caption": "My first product team",
    "date": "2023",
    "flipText": "I designed for Spaarks, an app to meet people, join groups and find jobs nearby."
  },
  {
    "image": asset("/timeline/nerolac.webp"),
    "title": "Nerolac",
    "caption": "Internal tools",
    "date": "2023 – 24",
    "flipText": "A year inside a paint giant, designing the internal tools their teams use every day."
  },
  {
    "image": asset("/timeline/kumba.webp"),
    "title": "Kumba AI",
    "caption": "Founding product designer",
    "date": "2025 – now",
    "flipText": "First designer here. I shaped how 2,000+ brands go from one idea to a full campaign."
  }
];
