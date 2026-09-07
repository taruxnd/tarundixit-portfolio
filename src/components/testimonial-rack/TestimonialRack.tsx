"use client";

import { contentContainerClassName } from "@/lib/sectionLayout";
import { testimonials } from "./data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import RackCard from "./RackCard";
import { cardLayout, responsiveGap, STAGE_HEIGHT, wrapOffset } from "./layout";
import { useFanCarousel } from "./useFanCarousel";

const TOTAL = testimonials.length;

export default function TestimonialRack() {
  const [gap, setGap] = useState(responsiveGap(1200));
  const { activeIndex, isDragging, stageRef, surfaceRef, goNext, goPrev } =
    useFanCarousel({ total: TOTAL });

  const active = testimonials[activeIndex];

  useEffect(() => {
    const update = () => setGap(responsiveGap(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev]);

  return (
    <section
      id="testimonials"
      className="testimonial-rack relative overflow-visible py-20 sm:py-24"
      aria-roledescription="testimonial carousel"
      aria-label="In their words"
    >
      <div className={`${contentContainerClassName} overflow-visible`}>
        <div className="mb-5 flex items-baseline justify-between text-xs tracking-[0.04em] text-[#8e8e86]">
          <span>In their words</span>
          <span>
            {String(activeIndex + 1).padStart(2, "0")}
            <span className="mx-1.5 text-[#c8c8c0]">/</span>
            {String(TOTAL).padStart(2, "0")}
          </span>
        </div>

        <div className="relative overflow-visible">
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-[#deded8]"
          />

          <div
            ref={stageRef}
            className={`testimonial-rack-stage relative w-full overflow-visible select-none ${isDragging ? "is-dragging" : ""}`}
            style={{ height: STAGE_HEIGHT }}
          >
            {testimonials.map((testimonial, index) => {
              const offset = wrapOffset(index, activeIndex, TOTAL);
              const layout = cardLayout(offset, gap);

              return (
                <RackCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  index={index}
                  isActive={index === activeIndex}
                  isDragging={isDragging}
                  layout={layout}
                />
              );
            })}

            <div
              ref={surfaceRef}
              className="absolute inset-0 z-30 touch-none"
              style={{ touchAction: "none", WebkitTouchCallout: "none" }}
              aria-label="Drag to browse testimonials"
              role="presentation"
            />
          </div>
        </div>

        <p className="mt-3 text-center text-[11px] tracking-[0.04em] text-[#b0b0a8]">
          Drag the cards · swipe on mobile · or use arrows
        </p>

        <div className="mt-8 flex flex-col items-center gap-2.5">
          <div
            key={active.id}
            className="flex flex-col items-center gap-2.5 text-center"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1a1c1e] text-sm font-medium text-white">
              {active.initials}
            </div>
            <div>
              <p className="text-lg font-medium tracking-[-0.01em] text-[#1a1c1e]">
                {active.name}
              </p>
              <p className="mt-1 text-[15px] text-[#8e8e86]">{active.role}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-[18px] text-[#8e8e86]">
          <button
            type="button"
            aria-label="Previous quote"
            data-cursor="interactive"
            onClick={goPrev}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full transition-colors hover:text-[#1a1c1e]"
          >
            <ChevronLeft size={14} strokeWidth={1.2} />
          </button>
          <span aria-hidden className="h-px w-11 bg-[#deded8]" />
          <button
            type="button"
            aria-label="Next quote"
            data-cursor="interactive"
            onClick={goNext}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full transition-colors hover:text-[#1a1c1e]"
          >
            <ChevronRight size={14} strokeWidth={1.2} />
          </button>
        </div>
      </div>
    </section>
  );
}
