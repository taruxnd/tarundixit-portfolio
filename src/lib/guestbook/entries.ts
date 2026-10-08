import type { Entry } from "@/components/guestbook/types";
import { GUESTBOOK_TAG, isConfigured, rest } from "./supabase";

export type Row = {
  id: string;
  name: string;
  company: string;
  message: string;
  linkedin: string;
  photo_url: string;
  created_at: string;
};

export const ROW_COLUMNS = "id,name,company,message,linkedin,photo_url,created_at";

export function toEntry(row: Row): Entry {
  return {
    id: row.id,
    name: row.name,
    company: row.company || undefined,
    message: row.message,
    linkedin: row.linkedin,
    photo: row.photo_url,
    createdAt: row.created_at,
  };
}

/**
 * Visible entries, newest first. Cached under the guestbook tag: a new hello
 * expires it straight away, and hiding a row in Supabase shows up within 5 min.
 * Returns null when storage isn't configured (local dev without keys).
 */
export async function getEntries(): Promise<Entry[] | null> {
  if (!isConfigured()) return null;
  try {
    const response = await rest(`guestbook_entries?select=${ROW_COLUMNS}&hidden=eq.false&order=created_at.desc&limit=300`, {
      next: { tags: [GUESTBOOK_TAG], revalidate: 300 },
    });
    if (!response.ok) throw new Error(`Guestbook read failed (${response.status}).`);
    return ((await response.json()) as Row[]).map(toEntry);
  } catch (error) {
    console.error(error);
    return [];
  }
}
