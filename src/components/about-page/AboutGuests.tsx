"use client";

import { FigmaNameTag, FigmaPointer } from "@/components/cursor/CursorParts";
import { useTheme } from "@/components/ThemeController";
import { useEffect, useRef, useState } from "react";
import "./about-guests.css";

/**
 * The people in the story are in the file too. When their name scrolls into
 * view, a Figma-style collaborator cursor wanders in, selects the word for a
 * moment, then leaves. Each guest visits once per page load.
 */
const GUESTS = [
  { id: "kumba", name: "Kumba AI", color: "#7c5cff" },
  { id: "nerolac", name: "Nerolac", color: "#e0312e" },
  { id: "faisal", name: "Faisal Khan", color: "#f24e1e" },
] as const;

type Guest = (typeof GUESTS)[number];

const VISIT_MS = 2600;

export default function AboutGuests() {
  const { reducedMotion } = useTheme();
  const layerRef = useRef<HTMLDivElement>(null);
  const [visiting, setVisiting] = useState<Record<string, boolean>>({});
  const done = useRef(new Set<string>());

  useEffect(() => {
    const layer = layerRef.current;
    const prose = layer?.parentElement;
    if (!layer || !prose) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const targets = new Map<Element, Guest>();
    for (const guest of GUESTS) {
      const el = prose.querySelector(`[data-guest="${guest.id}"]`);
      if (el) targets.set(el, guest);
    }

    const visit = (guest: Guest, word: Element) => {
      const cursor = layer.querySelector<HTMLElement>(`[data-guest-cursor="${guest.id}"]`);
      const box = layer.querySelector<HTMLElement>(`[data-guest-box="${guest.id}"]`);
      if (!cursor || !box) return;

      const proseRect = prose.getBoundingClientRect();
      const rect = word.getBoundingClientRect();
      const x = rect.left - proseRect.left;
      const y = rect.top - proseRect.top;
      // Come in from whichever side of the prose is nearer.
      const fromLeft = x < proseRect.width / 2;
      // Hover the word like a person would; on the right half, sit toward the
      // word's start so the name tag stays inside the prose box.
      const endX = x + rect.width * (fromLeft ? 0.72 : 0.2);
      const endY = y + rect.height * 0.78;
      const startX = fromLeft ? -140 : proseRect.width + 140;
      const startY = endY + (fromLeft ? 120 : -90);

      box.style.left = `${x - 4}px`;
      box.style.top = `${y - 3}px`;
      box.style.width = `${rect.width + 8}px`;
      box.style.height = `${rect.height + 6}px`;

      setVisiting((v) => ({ ...v, [guest.id]: true }));

      if (reducedMotion) {
        cursor.style.transform = `translate(${endX}px, ${endY}px)`;
        timers.push(setTimeout(() => setVisiting((v) => ({ ...v, [guest.id]: false })), VISIT_MS));
        return;
      }

      const arrive = cursor.animate(
        [
          { transform: `translate(${startX}px, ${startY}px)`, opacity: 0 },
          { transform: `translate(${startX}px, ${startY}px)`, opacity: 1, offset: 0.08 },
          { transform: `translate(${endX + 18}px, ${endY - 10}px)`, opacity: 1, offset: 0.7 },
          { transform: `translate(${endX}px, ${endY}px)`, opacity: 1 },
        ],
        { duration: 1400, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" },
      );
      arrive.onfinish = () => {
        // Small idle wobble while "reading", then wander off the way they came.
        cursor.animate(
          [
            { transform: `translate(${endX}px, ${endY}px)` },
            { transform: `translate(${endX + 3}px, ${endY + 2}px)` },
            { transform: `translate(${endX - 2}px, ${endY + 4}px)` },
            { transform: `translate(${endX}px, ${endY}px)` },
          ],
          { duration: VISIT_MS, easing: "ease-in-out", fill: "forwards" },
        ).onfinish = () => {
          setVisiting((v) => ({ ...v, [guest.id]: false }));
          cursor.animate(
            [
              { transform: `translate(${endX}px, ${endY}px)`, opacity: 1 },
              { transform: `translate(${startX}px, ${startY - 60}px)`, opacity: 0 },
            ],
            { duration: 1100, easing: "cubic-bezier(0.4, 0, 0.6, 1)", fill: "forwards" },
          );
        };
      };
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const guest = targets.get(entry.target);
          if (!guest || done.current.has(guest.id)) continue;
          done.current.add(guest.id);
          observer.unobserve(entry.target);
          // Stagger so two guests never arrive in the same beat.
          timers.push(setTimeout(() => visit(guest, entry.target), 500 + done.current.size * 350));
        }
      },
      { threshold: 1, rootMargin: "-10% 0px -20% 0px" },
    );
    targets.forEach((_, el) => observer.observe(el));

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [reducedMotion]);

  return (
    <div ref={layerRef} className="about-guests" aria-hidden>
      {GUESTS.map((guest) => (
        <div key={guest.id}>
          <span
            data-guest-box={guest.id}
            className={`about-guests__box${visiting[guest.id] ? " is-on" : ""}`}
            style={{ borderColor: guest.color }}
          />
          <div data-guest-cursor={guest.id} className="about-guests__cursor">
            <FigmaPointer color={guest.color} />
            <div className="figma-cursor__tag-wrap">
              <FigmaNameTag name={guest.name} color={guest.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
