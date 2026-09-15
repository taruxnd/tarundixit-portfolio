"use client";

import { useEffect, useMemo, useState } from "react";
import type { StripMedia } from "./xhuliaProjects";

type DragStripProps = {
  frames: StripMedia[];
  label: string;
};

/**
 * Native overflow-x strip — uses the browser scroller (smooth on mobile).
 * Videos are dropped on coarse pointers so mobile doesn’t decode MP4s while scrolling.
 */
export default function DragStrip({ frames, label }: DragStripProps) {
  const [allowVideo, setAllowVideo] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setAllowVideo(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const visibleFrames = useMemo(() => {
    if (allowVideo) return frames;
    return frames.filter((frame) => frame.type === "image");
  }, [allowVideo, frames]);

  return (
    <div
      className="xhulia-strip__viewport"
      role="region"
      aria-label={`${label} screens, swipe horizontally`}
    >
      <div className="xhulia-strip__track">
        {visibleFrames.map((frame, index) => (
          <figure
            key={`${frame.src}-${index}`}
            className="xhulia-strip__frame"
          >
            {frame.type === "video" ? (
              <video
                src={frame.src}
                muted
                loop
                playsInline
                autoPlay
                preload="metadata"
                draggable={false}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={frame.src}
                alt={frame.alt ?? ""}
                draggable={false}
                loading="lazy"
                decoding="async"
              />
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}
