"use client";

import { useEffect, useState } from "react";
import { react } from "@/app/notes/actions";
import { REACTIONS } from "@/lib/notes/reactions";
import type { ReactionCounts, ReactionKey } from "@/lib/notes/reactions";

const storageKey = (slug: string) => `note-reactions:${slug}`;

/**
 * Floating reaction bar at the bottom of a note. Each visitor can toggle each
 * reaction once; what they picked is remembered in this browser.
 */
export default function ReactionBar({ slug, initialCounts }: { slug: string; initialCounts: ReactionCounts }) {
  const [counts, setCounts] = useState<ReactionCounts>(initialCounts);
  const [mine, setMine] = useState<ReactionKey[]>([]);
  const [popped, setPopped] = useState<ReactionKey | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey(slug)) ?? "[]");
      if (Array.isArray(saved)) setMine(saved.filter((key) => REACTIONS.some((r) => r.key === key)));
    } catch {
      /* private mode or bad data: start fresh */
    }
  }, [slug]);

  function remember(next: ReactionKey[]) {
    setMine(next);
    try {
      localStorage.setItem(storageKey(slug), JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  async function toggle(key: ReactionKey) {
    const on = !mine.includes(key);
    const before = counts[key] ?? 0;
    // Optimistic: show it straight away, roll back if the server says no.
    setCounts((value) => ({ ...value, [key]: Math.max(0, before + (on ? 1 : -1)) }));
    remember(on ? [...mine, key] : mine.filter((value) => value !== key));
    if (on) {
      setPopped(key);
      setTimeout(() => setPopped((value) => (value === key ? null : value)), 500);
    }
    const result = await react(slug, key, on);
    if (result.ok) {
      setCounts((value) => ({ ...value, [key]: result.count }));
    } else {
      setCounts((value) => ({ ...value, [key]: before }));
      remember(on ? mine.filter((value) => value !== key) : [...mine, key]);
    }
  }

  return (
    <div className="note-reactions" role="group" aria-label="React to this note">
      {REACTIONS.map((reaction) => {
        const active = mine.includes(reaction.key);
        const count = counts[reaction.key] ?? 0;
        return (
          <button
            key={reaction.key}
            type="button"
            className={`note-reaction${active ? " is-active" : ""}${popped === reaction.key ? " is-popped" : ""}`}
            aria-pressed={active}
            aria-label={`${reaction.label}${count ? `, ${count}` : ""}`}
            title={reaction.label}
            data-cursor="interactive"
            onClick={() => toggle(reaction.key)}
          >
            <span className="note-reaction__emoji" aria-hidden="true">
              {reaction.emoji}
            </span>
            <span className="note-reaction__label" aria-hidden="true">
              {reaction.label}
            </span>
            {count > 0 && (
              <span className="note-reaction__count" aria-hidden="true">
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
