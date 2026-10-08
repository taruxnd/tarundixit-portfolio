"use client";
import { ArrowUpRight, Flower2 } from "lucide-react";
import type { CSSProperties } from "react";
import type { Entry } from "./types";
import { formatPlanted, seededLook } from "./types";

/** A polaroid on a wooden stake, with a vine, and a note tucked behind it. */
export default function PlantedEntry({
  entry,
  open,
  isNew,
  onToggle,
}: {
  entry: Entry;
  open: boolean;
  isNew: boolean;
  onToggle: () => void;
}) {
  const look = seededLook(entry.id);
  const noteId = `guest-note-${entry.id}`;
  const style = {
    "--tilt": `${look.tilt.toFixed(2)}deg`,
    "--tape-x": `${look.tapeX.toFixed(0)}px`,
    "--sway-duration": `${look.swayDuration.toFixed(2)}s`,
    "--sway-delay": `${look.swayDelay.toFixed(2)}s`,
    "--lean": `${look.lean.toFixed(2)}deg`,
  } as CSSProperties;

  return (
    <li
      className={`guest-entry${open ? " is-open" : ""}${isNew ? " is-new" : ""}`}
      style={style}
    >
      <div className="guest-stake" aria-hidden="true">
        <Vine seed={entry.id} />
      </div>
      <div className="guest-card-slot"><div className="guest-card-flipper">
        <div className="guest-note" id={noteId} role="region" aria-label={`${entry.name}'s message`}>
          <p>{entry.message}</p>
          <footer>
            <span>
              {entry.name}
              {entry.createdAt && <em> · {formatPlanted(entry.createdAt)}</em>}
            </span>
            {entry.linkedin && (
              <a href={entry.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${entry.name} on LinkedIn`}>
                in
                <ArrowUpRight size={11} />
              </a>
            )}
          </footer>
        </div>
        <button
          type="button"
          className="guest-polaroid"
          aria-expanded={open}
          aria-controls={noteId}
          onClick={onToggle}
        >
          <span className="guest-photo">
            {entry.photo ? <img src={entry.photo} alt="" loading="lazy" draggable={false} /> : <Flower2 size={30} strokeWidth={1} />}
          </span>
          <span className="guest-caption"><span>{entry.name}</span>{entry.company&&<span className="guest-company"> · {entry.company}</span>}</span>
        </button>
      </div></div>
    </li>
  );
}

/** A little life growing up the stake. Leaf side alternates per entry. */
function Vine({ seed }: { seed: string }) {
  const flip = seed.length % 2 === 0;
  return (
    <svg className="guest-vine" viewBox="0 0 44 170" aria-hidden="true">
      <path d="M23 166C10 140 35 120 20 98S33 56 23 8" fill="none" stroke="#6c8041" strokeWidth="1.5" />
      {[35, 68, 100, 135].map((y, j) => (
        <g key={y} transform={`translate(23 ${y}) ${(j % 2 === 0) === flip ? "scale(-1 1)" : ""}`}>
          <path d="M0 0C-19-17-23-4-12 3-7 5-2 3 0 0" fill={j % 2 ? "#78944b" : "#4e743d"} />
          <path d="M-2 0-15-5" stroke="#a2b36a" strokeWidth=".6" />
        </g>
      ))}
      {[58, 119].map((y) => (
        <g key={y} transform={`translate(${y === 58 ? 29 : 14} ${y})`}>
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <ellipse key={angle} cx="0" cy="-3" rx="1.7" ry="3.8" fill="#eae7d6" transform={`rotate(${angle})`} />
          ))}
          <circle r="1.8" fill="#dbb74c" />
        </g>
      ))}
    </svg>
  );
}

/** The empty frame at the front of the bed that invites a visitor to sign. */
export function PlantedInvite({ onOpen }: { onOpen: (trigger: HTMLElement) => void }) {
  return (
    <li className="guest-entry guest-entry--invite">
      <div className="guest-stake" aria-hidden="true" />
      <div className="guest-card-slot">
        <button type="button" className="guest-polaroid guest-polaroid--invite" onClick={(event) => onOpen(event.currentTarget)}>
          <span className="guest-photo">
            <span className="guest-invite-plus" aria-hidden="true">
              +
            </span>
          </span>
          <span className="guest-caption">Your face here</span>
        </button>
      </div>
    </li>
  );
}
