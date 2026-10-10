"use client";

import { InteractiveFrame } from "./InteractiveFrame";
import "./figma-stickers.css";

const STICKERS = [
  { id: "figma", name: "Figma", src: "/stickers/figma.svg", width: 61, aspect: 384 / 256, minWidth: 28, maxWidth: 140 },
] as const;

/** Figma-style stickers beside the hero headline: select, drag and resize. */
export default function FigmaStickers() {
  return (
    <div className="figma-stickers" data-frame-scale>
      {STICKERS.map((sticker) => (
        <div key={sticker.id} className={`figma-stickers__slot figma-stickers__slot--${sticker.id}`}>
          <InteractiveFrame
            name={sticker.name}
            alwaysSelected
            width={sticker.width}
            aspect={sticker.aspect}
            minWidth={sticker.minWidth}
            maxWidth={sticker.maxWidth}
            className={`figma-stickers__frame--${sticker.id}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="figma-stickers__art" src={sticker.src} alt="" draggable={false} />
          </InteractiveFrame>
        </div>
      ))}
    </div>
  );
}
