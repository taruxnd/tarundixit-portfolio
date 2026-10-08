import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { marked } from "marked";

/**
 * Notes are Markdown files in content/notes/<slug>.md with a small header:
 *
 *   ---
 *   title: Design the second visit
 *   date: 2026-09-14
 *   category: Design
 *   summary: One line for previews and search.
 *   ---
 *
 * Write a file, push, and it's published. Files starting with "_" are drafts.
 */

export type NoteMeta = {
  slug: string;
  title: string;
  date: string;
  category: string;
  summary: string;
};

export type Note = NoteMeta & { html: string };

const DIR = path.join(process.cwd(), "content", "notes");

function parse(file: string): { meta: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(file);
  if (!match) return { meta: {}, body: file };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const at = line.indexOf(":");
    if (at > 0) meta[line.slice(0, at).trim()] = line.slice(at + 1).trim().replace(/^["']|["']$/g, "");
  }
  return { meta, body: match[2] };
}

function read(slug: string) {
  const { meta, body } = parse(readFileSync(path.join(DIR, `${slug}.md`), "utf8"));
  return {
    meta: {
      slug,
      title: meta.title || slug,
      date: meta.date || "",
      category: meta.category || "Notes",
      summary: meta.summary || "",
    } satisfies NoteMeta,
    body,
  };
}

/** All published notes, newest first. */
export function getNotes(): NoteMeta[] {
  let files: string[] = [];
  try {
    files = readdirSync(DIR);
  } catch {
    return [];
  }
  return files
    .filter((name) => name.endsWith(".md") && !name.startsWith("_"))
    .map((name) => read(name.slice(0, -3)).meta)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getNote(slug: string): Note | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    const { meta, body } = read(slug);
    return { ...meta, html: marked.parse(body, { async: false }) };
  } catch {
    return null;
  }
}

export function formatNoteDate(iso: string) {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}
