"use client";

import { heroEditorialTypography, heroFontClassName } from "@/lib/heroFonts";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { playgroundCards } from "./playground-data";
import "./playground.css";

const typography = heroEditorialTypography;

export default function PlaygroundCanvas() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{
    active: boolean;
    pointerId: number | null;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  }>({
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOffset({ x: 0, y: 0 });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest("a, button")) return;

    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
    };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) return;
    setOffset({
      x: drag.originX + (event.clientX - drag.startX),
      y: drag.originY + (event.clientY - drag.startY),
    });
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) return;
    drag.active = false;
    drag.pointerId = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div className={`playground ${heroFontClassName}`}>
      <div className="playground__dots" aria-hidden />

      <div className="playground__intro" style={typography.headline}>
        <h1 className="playground__title">Playground</h1>
        <p className="playground__lede">
          Old work, side projects
          <br />
          &amp; random explorations
        </p>
        <p className="playground__hint">Drag to look around · Esc to reset</p>
      </div>

      <div
        ref={viewportRef}
        className={`playground__viewport${dragging ? " is-dragging" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        role="application"
        aria-label="Draggable playground canvas"
      >
        <div
          className="playground__stage"
          style={{
            transform: `translate3d(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px), 0)`,
          }}
        >
          {playgroundCards.map((card) => (
            <figure
              key={card.id}
              className="playground__card"
              style={{
                width: card.width,
                aspectRatio: String(card.aspect),
                transform: `translate(-50%, -50%) translate(${card.x}px, ${card.y}px) rotate(${card.rotate}deg)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={card.src} alt={card.alt} draggable={false} />
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
