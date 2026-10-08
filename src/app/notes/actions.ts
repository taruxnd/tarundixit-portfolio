"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { revalidateTag } from "next/cache";
import { getNote } from "@/lib/notes/notes";
import { isReaction, REACTIONS_TAG } from "@/lib/notes/reactions";
import { isConfigured, rest } from "@/lib/guestbook/supabase";

export type ReactResult = { ok: true; count: number } | { ok: false };

/** Generous: enough for a real reader toggling around, not enough for a script. */
const HOURLY_LIMIT = 40;

async function visitorHash() {
  const list = await headers();
  const ip = list.get("x-forwarded-for")?.split(",")[0]?.trim() || list.get("x-real-ip") || "unknown";
  const salt = process.env.GUESTBOOK_SALT ?? process.env.SUPABASE_SECRET_KEY ?? "";
  return createHash("sha256").update(`notes:${salt}:${ip}`).digest("hex").slice(0, 32);
}

/** Add (on = true) or take back (on = false) one reaction on a note. */
export async function react(slug: string, reaction: string, on: boolean): Promise<ReactResult> {
  if (!isConfigured() || typeof slug !== "string" || !isReaction(reaction) || !getNote(slug)) return { ok: false };
  try {
    const ipHash = await visitorHash();
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const recent = await rest(`note_reaction_log?select=ip_hash&ip_hash=eq.${ipHash}&created_at=gte.${encodeURIComponent(since)}`, {
      method: "HEAD",
      headers: { Prefer: "count=exact" },
      cache: "no-store",
    });
    const used = Number(recent.headers.get("content-range")?.split("/")[1] ?? 0);
    if (used >= HOURLY_LIMIT) return { ok: false };

    const response = await rest("rpc/bump_note_reaction", {
      method: "POST",
      body: JSON.stringify({ p_slug: slug, p_reaction: reaction, p_delta: on ? 1 : -1 }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Reaction failed (${response.status}): ${await response.text()}`);
    const count = Number(await response.json());

    await rest("note_reaction_log", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ ip_hash: ipHash }),
      cache: "no-store",
    });
    // Others see the new count within a minute; this visitor already sees it.
    revalidateTag(REACTIONS_TAG, "max");
    return { ok: true, count };
  } catch (error) {
    console.error(error);
    return { ok: false };
  }
}
