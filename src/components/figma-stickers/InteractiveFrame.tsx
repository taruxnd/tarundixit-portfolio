"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";

type Corner = "nw" | "ne" | "sw" | "se";

const CORNERS: Corner[] = ["nw", "ne", "sw", "se"];

/**
 * A Figma-style frame around a sticker: hover shows a thin outline, clicking
 * selects it (blue box, corner handles, name tag, W × H pill), dragging moves
 * it and dragging a corner resizes it with its aspect ratio locked.
 * Escape or clicking elsewhere deselects.
 */
/** Follow one pointer across the window until it's released. */
function track(pointerId: number, onMove: (event: PointerEvent) => void, onEnd: () => void) {
  const move = (event: PointerEvent) => {
    if (event.pointerId === pointerId) onMove(event);
  };
  const end = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", end);
    window.removeEventListener("pointercancel", end);
    onEnd();
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", end);
  window.addEventListener("pointercancel", end);
}

export function InteractiveFrame({
  name,
  description,
  alwaysSelected = false,
  width: initialWidth,
  aspect,
  minWidth,
  maxWidth,
  className = "",
  children,
}: {
  name: string;
  description?: string;
  alwaysSelected?: boolean;
  width: number;
  /** height / width of the artwork */
  aspect: number;
  minWidth: number;
  maxWidth: number;
  className?: string;
  children: ReactNode;
}) {
  const descriptionId = useId();
  const frameRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [width, setWidth] = useState(initialWidth);
  const height = Math.round(width * aspect);

  // Deselect on Escape or a press anywhere outside the frame.
  useEffect(() => {
    if (alwaysSelected || !selected) return;
    const onDown = (event: PointerEvent) => {
      if (!frameRef.current?.contains(event.target as Node)) setSelected(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(false);
    };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [selected, alwaysSelected]);

  /** CSS scale on an ancestor (e.g. phones), so moves follow the pointer 1:1. */
  const ancestorScale = () => {
    const scaled = frameRef.current?.closest<HTMLElement>("[data-frame-scale]");
    return scaled ? parseFloat(getComputedStyle(scaled).scale) || 1 : 1;
  };

  const startMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    setSelected(true);
    setDragging(true);
    const k = ancestorScale();
    const start = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y };
    track(
      event.pointerId,
      (e) => setOffset({ x: start.ox + (e.clientX - start.x) / k, y: start.oy + (e.clientY - start.y) / k }),
      () => setDragging(false),
    );
  };

  const startResize = (corner: Corner) => (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    setDragging(true);
    const sx = corner.includes("e") ? 1 : -1;
    const sy = corner.includes("s") ? 1 : -1;
    const k = ancestorScale();
    const start = { x: event.clientX, y: event.clientY, w: width, ox: offset.x, oy: offset.y };
    const onMove = (e: PointerEvent) => {
      // Use whichever axis moved further, so diagonal drags feel natural.
      const dx = ((e.clientX - start.x) * sx) / k;
      const dy = ((e.clientY - start.y) * sy) / k / aspect;
      const next = Math.min(maxWidth, Math.max(minWidth, start.w + (Math.abs(dx) > Math.abs(dy) ? dx : dy)));
      const grow = next - start.w;
      // Keep the opposite corner pinned.
      setWidth(next);
      setOffset({ x: sx < 0 ? start.ox - grow : start.ox, y: sy < 0 ? start.oy - grow * aspect : start.oy });
    };
    track(event.pointerId, onMove, () => setDragging(false));
  };

  return (
    <div
      ref={frameRef}
      className={`figma-frame${alwaysSelected || selected ? " is-selected" : ""}${dragging ? " is-dragging" : ""} ${className}`}
      style={{ width, height, translate: `${offset.x}px ${offset.y}px` }}
      onPointerDown={startMove}
      role="img"
      aria-label={`${name} sticker`}
      aria-describedby={description ? descriptionId : undefined}
      tabIndex={description ? 0 : undefined}
    >
      {children}
      {description && <span id={descriptionId} role="tooltip" className="figma-frame__tooltip">{description}</span>}
      <span className="figma-frame__name" aria-hidden>
        {name}
      </span>
      <span className="figma-frame__box" aria-hidden />
      {CORNERS.map((corner) => (
        <span
          key={corner}
          className={`figma-frame__handle figma-frame__handle--${corner}`}
          onPointerDown={startResize(corner)}
          aria-hidden
        />
      ))}
      <span className="figma-frame__size" aria-hidden>
        {Math.round(width)} × {height}
      </span>
    </div>
  );
}
