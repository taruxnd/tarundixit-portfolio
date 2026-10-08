import { isConfigured, rest } from "@/lib/guestbook/supabase";

/** Tarun's own reaction set. Keys are stored in the database; don't rename them. */
export const REACTIONS = [
  { key: "seed", emoji: "🌱", label: "Planted a seed" },
  { key: "felt", emoji: "🫶", label: "Felt this" },
  { key: "well-put", emoji: "✍️", label: "Well put" },
  { key: "saving", emoji: "🔖", label: "Saving this" },
  { key: "smile", emoji: "😄", label: "Made me smile" },
] as const;

export type ReactionKey = (typeof REACTIONS)[number]["key"];
export type ReactionCounts = Partial<Record<ReactionKey, number>>;

export const REACTIONS_TAG = "note-reactions";

export function isReaction(value: unknown): value is ReactionKey {
  return REACTIONS.some((reaction) => reaction.key === value);
}

/**
 * Every note's reaction counts, keyed by slug. Cached for a minute and
 * refreshed in the background after reactions come in.
 */
export async function getAllReactionCounts(): Promise<Record<string, ReactionCounts>> {
  if (!isConfigured()) return {};
  try {
    const response = await rest("note_reactions?select=slug,reaction,count", {
      next: { tags: [REACTIONS_TAG], revalidate: 60 },
    });
    // 404 = the reactions table hasn't been created yet (see supabase/notes-reactions.sql).
    if (response.status === 404) return {};
    if (!response.ok) throw new Error(`Reaction read failed (${response.status}).`);
    const rows = (await response.json()) as { slug: string; reaction: string; count: number }[];
    const result: Record<string, ReactionCounts> = {};
    for (const row of rows) {
      if (!isReaction(row.reaction)) continue;
      (result[row.slug] ??= {})[row.reaction] = row.count;
    }
    return result;
  } catch (error) {
    console.error(error);
    return {};
  }
}

export function totalReactions(counts: ReactionCounts | undefined) {
  return Object.values(counts ?? {}).reduce((sum, value) => sum + (value ?? 0), 0);
}
