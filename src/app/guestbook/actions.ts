"use server";

import { createHash, randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { updateTag } from "next/cache";
import type { Entry } from "@/components/guestbook/types";
import { ROW_COLUMNS, toEntry } from "@/lib/guestbook/entries";
import type { Row } from "@/lib/guestbook/entries";
import { GUESTBOOK_TAG, isConfigured, removePhoto, rest, uploadPhoto } from "@/lib/guestbook/supabase";

export type PlantInput = {
  name: string;
  company: string;
  message: string;
  linkedin: string;
  /** JPEG data URL produced by the browser (already resized to ≤800px), or "". */
  photo: string;
  /** Honeypot: hidden from people, filled in by bots. */
  website?: string;
};

export type PlantResult = { ok: true; entry: Entry } | { ok: false; error: string };

const HOURLY_LIMIT = 3;
const MAX_PHOTO_BYTES = 1024 * 1024;

/** Trim, drop control characters, and enforce a length. */
function clean(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
}

function cleanLinkedin(value: unknown) {
  const raw = clean(value, 300);
  if (!raw) return "";
  try {
    const link = new URL(raw);
    if (link.protocol !== "https:" || !/(^|\.)linkedin\.com$/i.test(link.hostname)) return null;
    return link.href;
  } catch {
    return null;
  }
}

function decodePhoto(value: unknown): Uint8Array | null | "invalid" {
  if (typeof value !== "string" || !value) return null;
  const match = /^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/.exec(value);
  if (!match) return "invalid";
  const bytes = Buffer.from(match[1], "base64");
  // Must really be a JPEG (FF D8 FF), and small.
  if (bytes.length > MAX_PHOTO_BYTES || bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) return "invalid";
  return new Uint8Array(bytes);
}

async function visitorHash() {
  const list = await headers();
  const ip = list.get("x-forwarded-for")?.split(",")[0]?.trim() || list.get("x-real-ip") || "unknown";
  const salt = process.env.GUESTBOOK_SALT ?? process.env.SUPABASE_SECRET_KEY ?? "";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export async function plantHello(input: PlantInput): Promise<PlantResult> {
  if (!isConfigured()) return { ok: false, error: "The guestbook isn't connected yet. Try again soon." };

  const name = clean(input.name, 60);
  const company = clean(input.company, 60);
  const message = clean(input.message, 300);
  const linkedin = cleanLinkedin(input.linkedin);
  const photo = decodePhoto(input.photo);

  if (!name || !message) return { ok: false, error: "Add your name and a little hello first." };
  if (linkedin === null) return { ok: false, error: "Use a full LinkedIn link, starting with https://www.linkedin.com/." };
  if (photo === "invalid") return { ok: false, error: "That photo didn't come through. Try another one." };

  const ipHash = await visitorHash();

  // Bots that fill the honeypot get a convincing success and nothing is saved.
  if (input.website) {
    return {
      ok: true,
      entry: { id: randomUUID(), name, company: company || undefined, message, linkedin, photo: "", createdAt: new Date().toISOString() },
    };
  }

  try {
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const recent = await rest(`guestbook_entries?select=id&ip_hash=eq.${ipHash}&created_at=gte.${encodeURIComponent(since)}`, {
      method: "HEAD",
      headers: { Prefer: "count=exact" },
      cache: "no-store",
    });
    const count = Number(recent.headers.get("content-range")?.split("/")[1] ?? 0);
    if (count >= HOURLY_LIMIT) {
      return { ok: false, error: "You've planted a few hellos already. Come back in a little while." };
    }

    const id = randomUUID();
    const photoName = photo ? `${id}.jpg` : "";
    const photoUrl = photo ? await uploadPhoto(photoName, photo) : "";

    const response = await rest(`guestbook_entries?select=${ROW_COLUMNS}`, {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ id, name, company, message, linkedin, photo_url: photoUrl, ip_hash: ipHash }),
      cache: "no-store",
    });
    if (!response.ok) {
      if (photoName) await removePhoto(photoName);
      throw new Error(`Guestbook insert failed (${response.status}): ${await response.text()}`);
    }
    const [row] = (await response.json()) as Row[];
    updateTag(GUESTBOOK_TAG);
    return { ok: true, entry: toEntry(row) };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Something went wrong planting your hello. Please try again." };
  }
}
