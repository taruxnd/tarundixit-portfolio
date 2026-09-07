"use client";

import type { Testimonial } from "./data";
import type { CardLayout } from "./layout";
import { cardTransform } from "./layout";

function Stars() {
  return (
    <span className="inline-flex gap-[3px]" aria-label="Rated 5 out of 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 12 12" aria-hidden>
          <path
            d="M6 1 L7.4 4.4 L11 4.7 L8.3 7.1 L9.1 10.6 L6 8.8 L2.9 10.6 L3.7 7.1 L1 4.7 L4.6 4.4 Z"
            fill="#1a1c1e"
            opacity="0.85"
          />
        </svg>
      ))}
    </span>
  );
}

interface RackCardProps {
  testimonial: Testimonial;
  index: number;
  isActive: boolean;
  isDragging: boolean;
  layout: CardLayout;
}

export default function RackCard({
  testimonial,
  index,
  isActive,
  isDragging,
  layout,
}: RackCardProps) {
  const transform = cardTransform(layout.x, layout.scale);
  const motion = isDragging
    ? "none"
    : "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1)";

  return (
    <article
      data-rack-card
      data-base-x={layout.x}
      data-scale={layout.scale}
      aria-hidden={!isActive}
      className="testimonial-rack-card pointer-events-none absolute top-0 left-1/2 w-[350px] -ml-[175px]"
      style={{
        zIndex: layout.zIndex,
        transform,
        WebkitTransform: transform,
        opacity: layout.opacity,
        transformOrigin: "50% 0%",
        WebkitTransformOrigin: "50% 0%",
        transition: motion,
        WebkitTransition: motion,
      }}
    >
      <div
        className="flex flex-col items-center"
        style={{
          transform: `rotate(${layout.rotate}deg)`,
          WebkitTransform: `rotate(${layout.rotate}deg)`,
          transformOrigin: "50% 0%",
          WebkitTransformOrigin: "50% 0%",
          transition: isDragging
            ? "none"
            : "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
          WebkitTransition: isDragging
            ? "none"
            : "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <span
          aria-hidden
          className="-mt-[3.5px] h-[7px] w-[7px] shrink-0 rounded-full border border-[#b8b8b0] bg-[#f7f7f4]"
        />
        <span aria-hidden className="h-[26px] w-px shrink-0 bg-[#b8b8b0]" />

        <div className="testimonial-rack-card__panel relative flex h-[300px] w-full flex-col overflow-hidden rounded border border-[#e7e7e1] bg-white p-7 text-left select-none">
          <span
            aria-hidden
            className="absolute top-[9px] left-1/2 -ml-1 h-2 w-2 rounded-full border border-[#e7e7e1] bg-[#f7f7f4]"
          />

          <div className="flex shrink-0 items-center justify-between gap-3 text-xs tracking-[0.04em] text-[#8e8e86]">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <Stars />
          </div>

          <div className="flex min-h-0 flex-1 items-center overflow-hidden py-[18px]">
            <p className="testimonial-rack-card__quote text-lg leading-[1.5] tracking-[-0.015em] text-[#1a1c1e]">
              {testimonial.quote}
            </p>
          </div>

          <div className="flex min-h-[18px] shrink-0 items-center border-t border-[#e7e7e1] pt-3.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={testimonial.companyLogo}
              alt=""
              draggable={false}
              className="h-[18px] w-auto max-w-[70%] object-contain object-left opacity-75 grayscale"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
