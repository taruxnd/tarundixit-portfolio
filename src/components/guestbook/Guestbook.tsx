"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import HeroGarden from "@/components/hero-garden/HeroGarden";
import { geist, playfairDisplay } from "@/lib/heroFonts";
import ComposeDialog from "./ComposeDialog";
import type { Draft } from "./ComposeDialog";
import PlantedEntry, { PlantedInvite } from "./PlantedEntry";
import type { Entry } from "./types";
import { plantHello } from "@/app/guestbook/actions";
import "./guestbook.css";

/** Demo visitors, shown only when storage isn't configured (local dev). Newest first. */
const DEMO_ENTRIES: Entry[] = [
  { name: "Aisha", message: "Stayed for the garden. Such a lovely little corner of the internet, I didn't want to leave.", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop", linkedin: "https://www.linkedin.com/", daysAgo: 1 },
  { name: "Kabir", message: "Came for the design. Stayed for a shot.", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop", linkedin: "", daysAgo: 2 },
  { name: "Maya", message: "That raven has opinions. Keep making things!", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop", linkedin: "https://www.linkedin.com/", daysAgo: 4 },
  { name: "Arjun", message: "A little hello from my corner of the internet.", photo: "https://i.pravatar.cc/160?img=11", linkedin: "", daysAgo: 6 },
  { name: "Zoe", message: "The garden made me smile on a grey Tuesday.", photo: "https://i.pravatar.cc/160?img=47", linkedin: "", daysAgo: 9 },
  { name: "Rohan", message: "Beautiful details everywhere. Keep creating!", photo: "https://i.pravatar.cc/160?img=12", linkedin: "https://www.linkedin.com/", daysAgo: 12 },
  { name: "Priya", message: "One more shot before I leave. Okay, two.", photo: "https://i.pravatar.cc/160?img=44", linkedin: "", daysAgo: 15 },
  { name: "Sam", message: "Such a fun place to explore. The lamp got me.", photo: "https://i.pravatar.cc/160?img=13", linkedin: "", daysAgo: 19 },
  { name: "Neha", message: "Love the work and the little surprises along the way.", photo: "https://i.pravatar.cc/160?img=45", linkedin: "https://www.linkedin.com/", daysAgo: 24 },
  { name: "Dev", message: "Planted a hello. Will come back to see how it grows.", photo: "https://i.pravatar.cc/160?img=14", linkedin: "", daysAgo: 30 },
  { name: "Isha", message: "Took a photo in the dark. Still smiling.", photo: "https://i.pravatar.cc/160?img=49", linkedin: "", daysAgo: 38 },
  { name: "Alex", message: "The owl. I need to know more about the owl.", photo: "https://i.pravatar.cc/160?img=15", linkedin: "", daysAgo: 45 },
  { name: "Nina", message: "Warm, playful, and quietly very well built.", photo: "https://i.pravatar.cc/160?img=48", linkedin: "https://www.linkedin.com/", daysAgo: 52 },
  { name: "Leo", message: "Hello from Lisbon. Great basketball footer.", photo: "https://i.pravatar.cc/160?img=16", linkedin: "", daysAgo: 60 },
].map((seed, i) => ({
  id: `demo-${i + 1}`,
  name: seed.name,
  company: ["Figma", "Google", "Notion", "Adobe", "Spotify", "Canva", "Microsoft"][i % 7],
  message: seed.message,
  linkedin: seed.linkedin,
  photo: seed.photo,
  createdAt: new Date(Date.UTC(2026, 9, 7) - seed.daysAgo * 86_400_000).toISOString(),
}));

/** `initialEntries` is null when storage isn't configured: show the demo wall and keep hellos local. */
export default function Guestbook({ initialEntries }: { initialEntries: Entry[] | null }) {
  const live = initialEntries !== null;
  const [entries, setEntries] = useState<Entry[]>(initialEntries ?? DEMO_ENTRIES);
  const [open, setOpen] = useState<string | null>(null);
  const [newest, setNewest] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  // Open the signing card, remembering what opened it. Safari doesn't focus
  // buttons on click, so without this the dialog hands focus back to the bed.
  function openCompose(trigger: HTMLElement) {
    opener.current = trigger;
    dialog.current?.showModal();
  }
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const restore = () => opener.current?.focus({ preventScroll: true, focusVisible: false } as FocusOptions);
    element.addEventListener("close", restore);
    return () => element.removeEventListener("close", restore);
  }, []);
  const bed = useRef<HTMLDivElement>(null);

  // Close an open note when clicking anywhere else.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest(".guest-entry.is-open")) setOpen(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  /** Resolves to an error message for the form, or null once the hello is planted. */
  async function plant(draft: Draft): Promise<string | null> {
    let entry: Entry;
    if (live) {
      const result = await plantHello(draft);
      if (!result.ok) return result.error;
      entry = result.entry;
    } else {
      const { website: _bot, company, ...rest } = draft;
      entry = { id: crypto.randomUUID(), ...rest, company: company || undefined, createdAt: new Date().toISOString() };
    }
    setEntries((values) => [entry, ...values.filter((value) => value.id !== entry.id)]);
    setNewest(entry.id);
    setOpen(null);
    setStatus(
      live
        ? `${entry.name}, your hello is planted at the front of the bed. Thanks for stopping by.`
        : `${entry.name}, your hello is planted at the front of the bed. It lives in this tab until you reload.`,
    );
    requestAnimationFrame(() => {
      bed.current?.scrollTo({
        left: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    });
    return null;
  }

  // ---- Panning: drag with a mouse, wheel sideways, or arrow keys. ----
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const element = bed.current;
    if (!element) return;
    drag.current = { x: event.clientX, left: element.scrollLeft, moved: false };
  }
  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const state = drag.current;
    const element = bed.current;
    if (!state || !element) return;
    const delta = event.clientX - state.x;
    if (!state.moved && Math.abs(delta) > 5) {
      state.moved = true;
      element.classList.add("is-dragging");
      element.setPointerCapture(event.pointerId);
    }
    if (state.moved) element.scrollLeft = state.left - delta;
  }
  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const state = drag.current;
    const element = bed.current;
    if (!state || !element) return;
    if (state.moved) {
      element.classList.remove("is-dragging");
      if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
      // Swallow the click that follows a drag so cards don't toggle.
      suppressClick.current = true;
      setTimeout(() => { suppressClick.current = false; }, 0);
    }
    drag.current = null;
  }
  const onWheel = useCallback((event: ReactWheelEvent<HTMLDivElement>) => {
    const element = bed.current;
    if (!element) return;
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) element.scrollLeft += event.deltaY;
  }, []);
  function onKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      bed.current?.scrollBy({ left: event.key === "ArrowRight" ? 280 : -280, behavior: "smooth" });
    }
  }

  return (
    <main className={`guestbook-page ${geist.variable} ${playfairDisplay.variable}`}>
      <header className="guestbook-header">
        <Link href="/#contact" className="guestbook-back">
          <ArrowLeft size={15} />
          Back to garden
        </Link>
        <h1>Guestbook</h1>
        <p>
          {entries.length === 0
            ? "No hellos yet. Be the first to "
            : `${entries.length} ${entries.length === 1 ? "hello" : "hellos"} planted so far. Hover a face to read theirs, or `}
          <button type="button" className="guestbook-inline-sign" onClick={(event) => openCompose(event.currentTarget)}>
            plant your own
            <ArrowUpRight size={13} />
          </button>
        </p>
        <p className="guestbook-status" role="status">
          {status}
        </p>
      </header>

      <div
        className="guestbook-bed"
        ref={bed}
        tabIndex={0}
        aria-label="Visitor garden. Scroll sideways for more faces."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
        onKeyDown={onKeyDown}
        onClickCapture={(event) => {
          if (suppressClick.current) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
      >
        <ol className="guestbook-row">
          <PlantedInvite onOpen={openCompose} />
          {entries.map((entry) => (
            <PlantedEntry
              key={entry.id}
              entry={entry}
              open={open === entry.id}
              isNew={newest === entry.id}
              onToggle={() => setOpen((value) => (value === entry.id ? null : entry.id))}
            />
          ))}
        </ol>
      </div>

      <div className="guestbook-garden">
        <HeroGarden placement="court" />
      </div>

      <ComposeDialog ref={dialog} onPlant={plant} />
    </main>
  );
}
