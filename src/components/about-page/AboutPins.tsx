"use client";

import { assetUrl } from "@/lib/cdnAssets";
import { useEffect, useId, useRef, useState } from "react";
import "./about-pins.css";

const AVATAR = assetUrl("profile/tarun-avatar.jpg");

/**
 * A Figma-style comment pin sitting right after a phrase. Click to read a
 * one-line note from Tarun in the margin of his own bio.
 */
export function AboutPin({ id, note }: { id: string; note: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const cardId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    // Only one note open at a time: closing happens when another pin opens.
    const onOther = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== id) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("about-pin-open", onOther);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("about-pin-open", onOther);
    };
  }, [open, id]);

  return (
    <span ref={ref} className={`about-pin${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="about-pin__dot"
        aria-expanded={open}
        aria-controls={cardId}
        aria-label={open ? "Hide note" : "Read a note from Tarun"}
        data-cursor="interactive"
        onClick={() => {
          if (!open) window.dispatchEvent(new CustomEvent("about-pin-open", { detail: id }));
          setOpen((value) => !value);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={AVATAR} alt="" width={40} height={40} draggable={false} />
      </button>
      <span id={cardId} className="about-pin__card" role="note" hidden={!open}>
        <span className="about-pin__meta">
          <span className="about-pin__name">Tarun Dixit</span>
          <span className="about-pin__time">just now</span>
        </span>
        <span className="about-pin__text">{note}</span>
      </span>
    </span>
  );
}
