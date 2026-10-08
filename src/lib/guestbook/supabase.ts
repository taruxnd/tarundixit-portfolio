/**
 * Minimal server-side Supabase access over plain HTTP (PostgREST + Storage),
 * so reads can go through Next's tagged fetch cache. Never import this from a
 * Client Component: it reads the secret key.
 */

const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
const key = process.env.SUPABASE_SECRET_KEY;

export const GUESTBOOK_TAG = "guestbook";
export const PHOTO_BUCKET = "guestbook";

export function isConfigured() {
  return Boolean(url && key);
}

function authHeaders(): Record<string, string> {
  if (!url || !key) throw new Error("Guestbook storage is not configured.");
  // New-style keys (sb_secret_…) go in `apikey` only; legacy service_role JWTs
  // are also sent as a bearer token.
  return key.startsWith("sb_") ? { apikey: key } : { apikey: key, Authorization: `Bearer ${key}` };
}

export function restUrl(path: string) {
  return `${url}/rest/v1/${path}`;
}

export function rest(path: string, init: RequestInit & { next?: NextFetchRequestConfig } = {}) {
  return fetch(restUrl(path), {
    ...init,
    headers: { ...authHeaders(), "Content-Type": "application/json", ...init.headers },
  });
}

export async function uploadPhoto(name: string, bytes: Uint8Array) {
  const response = await fetch(`${url}/storage/v1/object/${PHOTO_BUCKET}/${name}`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "image/jpeg", "x-upsert": "false" },
    body: bytes as BodyInit,
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Photo upload failed (${response.status}).`);
  return `${url}/storage/v1/object/public/${PHOTO_BUCKET}/${name}`;
}

export async function removePhoto(name: string) {
  await fetch(`${url}/storage/v1/object/${PHOTO_BUCKET}/${name}`, {
    method: "DELETE",
    headers: authHeaders(),
    cache: "no-store",
  }).catch(() => {});
}
