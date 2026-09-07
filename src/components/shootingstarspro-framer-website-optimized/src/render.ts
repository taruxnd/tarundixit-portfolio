// Renders one page to the exact HTML Framer published.
//
// Shared by two callers:
//   scripts/prerender.mts  — at build time, writing .rendered/*.html
//   app/**/route.ts        — per request in development, so an edit to a
//                            section shows up on refresh
//
// Production always serves the prerendered file; this module is what produced
// it, so the two cannot drift.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { ComponentType } from "react";
import { collections, runtimeText } from "./runtime-content";

export interface Page {
  route: string;
  component: string;
  file: string;
  prologue: string;
  htmlAttrs: string;
  head: string;
  afterHead: string;
  verbatim: string[];
  /** A collection member: its fragments hold placeholders for the record's fields. */
  item?: { collection: string };
  /** Ordinals of the links to this page that Framer marked as current. */
  currentLinks?: number[];
}

const root = process.cwd();

export const manifest: { pages: Page[] } = JSON.parse(
  readFileSync(join(root, "src/manifest.json"), "utf8")
);

// ---- Keeping Framer's runtime in step with the source ----------------------
//
// The server renders text from the components; Framer's runtime then
// re-renders it from its own files — the content module the chunks import,
// and the CMS data a collection page reads. src/runtime-content.ts says which
// source value each of those strings now comes from. Before every render the
// two files are regenerated from that table, so the page a visitor sees after
// hydration is the page the server sent. Nothing edited: nothing rewritten —
// both files come out byte for byte as converted.

const CONTENT_HEADER = "// GENERATED from this project's source — do not edit here.\n//\n// This is what Framer's runtime reads for the site's text. It is rebuilt on\n// every render from the copy objects in src/sections and src/views and the\n// records in src/collections, so the text the runtime renders is always the\n// text the server rendered. Edit those files; this one follows.\n";
/** One `  key: "value",` line of the content module. */
const CONTENT_ENTRY = /^ {2}("(?:[^"\\]|\\.)*"|[A-Za-z_$][\w$]*): ("(?:[^"\\]|\\.)*"),$/;
const keyName = (key: string) => (/^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key));

function parseContent(text: string): [string, string][] {
  const out: [string, string][] = [];
  for (const line of text.split("\n")) {
    const m = CONTENT_ENTRY.exec(line);
    if (!m) continue;
    out.push([m[1].startsWith('"') ? (JSON.parse(m[1]) as string) : m[1], JSON.parse(m[2]) as string]);
  }
  return out;
}

/** A string exactly as a .framercms file stores it: type byte, big-endian length, UTF-8. */
function cmsString(s: string): Buffer {
  const bytes = Buffer.from(s, "utf8");
  const head = Buffer.alloc(5);
  head[0] = 0x0c;
  head.writeUInt32BE(bytes.length, 1);
  return Buffer.concat([head, bytes]);
}

function spliceCms(buf: Buffer, from: string, to: string): Buffer {
  const needle = cmsString(from);
  const replacement = cmsString(to);
  const parts: Buffer[] = [];
  let at = 0;
  for (;;) {
    const i = buf.indexOf(needle, at);
    if (i === -1) break;
    parts.push(buf.subarray(at, i), replacement);
    at = i + needle.length;
  }
  if (!parts.length) return buf;
  parts.push(buf.subarray(at));
  return Buffer.concat(parts);
}

function writeIfChanged(path: string, data: Buffer | string): void {
  const next = typeof data === "string" ? Buffer.from(data, "utf8") : data;
  if (existsSync(path) && readFileSync(path).equals(next)) return;
  writeFileSync(path, next);
}

/** Regenerate the runtime's text files from the source. Safe to call often. */
export function syncRuntimeContent(): void {
  const dir = join(root, "public/assets/framer");
  const edits: { key?: string; cms?: string[]; original: string; now: string }[] = [];
  for (const t of runtimeText) {
    const now = t.get();
    if (typeof now === "string" && now !== t.original) edits.push({ key: t.key, cms: t.cms, original: t.original, now });
  }

  const originalPath = join(dir, "fnj-content.original.mjs");
  if (existsSync(originalPath)) {
    const entries = parseContent(readFileSync(originalPath, "utf8"));
    const value = new Map(entries);
    for (const e of edits) if (e.key && value.has(e.key)) value.set(e.key, e.now);
    const lines = entries.map(([k]) => `  ${keyName(k)}: ${JSON.stringify(value.get(k))},`);
    writeIfChanged(
      join(dir, "fnj-content.mjs"),
      `${CONTENT_HEADER}export const c = {\n${lines.join("\n")}\n};\n\nexport default c;\n`
    );
  }

  for (const name of new Set(runtimeText.flatMap((t) => t.cms ?? []))) {
    const pristine = join(root, "src/cms", name);
    if (!existsSync(pristine)) continue;
    let buf = readFileSync(pristine);
    for (const e of edits) if (e.cms?.includes(name)) buf = spliceCms(buf, e.original, e.now);
    writeIfChanged(join(dir, name), buf);
  }
}

/** Text as React writes it into HTML. */
const escapeText = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");

/**
 * Carry each edited string to every place it appears in the rendered HTML.
 *
 * Framer's runtime holds one copy of each distinct string, so an edit reaches
 * every place the runtime renders it. The source is not one copy: the same
 * CMS value sits in a record AND in the listing that shows it, the same nav
 * label in two pages' copy objects. Edit one and the server would render the
 * old text in the others while the runtime renders the new — and React
 * refuses to hydrate text that differs, re-rendering the whole page on the
 * client (measured: a record edit broke hydration on the home page, whose
 * listing showed the same description). Substituting whole text nodes that
 * equal the original makes the server say what the runtime says, which is
 * also what the site said when one CMS value fed all of them.
 */
function applyRuntimeEdits(html: string): string {
  const seen = new Set<string>();
  let out = html;
  for (const t of runtimeText) {
    const now = t.get();
    if (typeof now !== "string" || now === t.original || seen.has(t.original)) continue;
    seen.add(t.original);
    out = out.split(">" + escapeText(t.original) + "<").join(">" + escapeText(now) + "<");
  }
  return out;
}

/**
 * Your titles and descriptions, applied over Framer's.
 *
 * src/meta.json maps a route to the fields to override. It ships as {} and an
 * empty override changes nothing, so an untouched export renders byte for
 * byte. Write in it and the change survives a re-conversion — the same edit
 * made directly in src/manifest.json would be overwritten by the next one.
 */
interface MetaOverride {
  title?: string;
  description?: string;
}

/**
 * Anything you want in every page's <head>: analytics, a favicon, a font.
 *
 * src/head.html ships empty and is inserted, exactly as written, at the end
 * of every page's <head>. Empty inserts nothing, so an untouched export is
 * unchanged to the byte; nothing regenerates the file, so it survives a
 * re-conversion. Whitespace-only counts as empty, so an editor that insists
 * on a trailing newline cannot silently change the output.
 */
const extraHeadCache: { value?: string } = {};
function extraHead(): string {
  if (CACHE_CSS && extraHeadCache.value !== undefined) return extraHeadCache.value;
  let v = "";
  try {
    v = readFileSync(join(root, "src/head.html"), "utf8");
  } catch {
    v = "";
  }
  if (!v.trim()) v = "";
  if (CACHE_CSS) extraHeadCache.value = v;
  return v;
}

function readMeta(): Record<string, MetaOverride> {
  try {
    return JSON.parse(readFileSync(join(root, "src/meta.json"), "utf8")) as Record<string, MetaOverride>;
  } catch {
    return {};
  }
}

/** Replace the text between two markers, searching from the first. */
function between(html: string, open: string, close: string, value: string): string {
  const a = html.indexOf(open);
  if (a < 0) return html;
  const b = html.indexOf(close, a + open.length);
  if (b < 0) return html;
  return html.slice(0, a + open.length) + value + html.slice(b);
}

/** Replace an attribute's value on the element carrying the marker. */
function attrAfter(html: string, marker: string, attr: string, value: string): string {
  const at = html.indexOf(marker);
  if (at < 0) return html;
  const c = html.indexOf(attr, at);
  if (c < 0) return html;
  const start = c + attr.length;
  const end = html.indexOf('"', start);
  if (end < 0) return html;
  return html.slice(0, start) + value + html.slice(end);
}

function applyMeta(head: string, route: string): string {
  // Read per render rather than once: in development the route handler
  // renders on every request so an edit shows on refresh, and this file is
  // tiny. Production renders once at build.
  const m = readMeta()[route];
  if (!m) return head;
  let out = head;
  if (m.title) {
    out = between(out, "<title>", "</title>", m.title + " ");
    out = attrAfter(out, 'property="og:title"', 'content="', m.title);
    out = attrAfter(out, 'name="twitter:title"', 'content="', m.title);
  }
  if (m.description) {
    out = attrAfter(out, 'name="description"', 'content="', m.description);
    out = attrAfter(out, 'property="og:description"', 'content="', m.description);
    out = attrAfter(out, 'name="twitter:description"', 'content="', m.description);
  }
  return out;
}

/**
 * Put the stylesheets back where Framer had them.
 *
 * The <head> stores a marker in place of each stylesheet body; the CSS itself
 * lives in src/styles/ so it can be read and edited. Substituting it back here
 * reproduces the document byte for byte, and means an edit to a .css file is
 * picked up by the next render with no build step of its own.
 *
 * Read once per file per process: prerender renders every page, and the font
 * stylesheet is shared by all of them.
 *
 * NOT cached in development, where the route handler re-renders on every
 * request precisely so that an edit shows up on refresh. Caching there would
 * make a change to a stylesheet do nothing until the dev server was restarted,
 * which is indistinguishable from the edit having had no effect.
 */
const cssCache = new Map<string, string>();
const CACHE_CSS = process.env.NODE_ENV !== "development";

function inlineStyles(head: string): string {
  const OPEN = "/*fnj:";
  const CLOSE = "*/";
  let out = "";
  let i = 0;
  for (;;) {
    const a = head.indexOf(OPEN, i);
    if (a < 0) break;
    const b = head.indexOf(CLOSE, a + OPEN.length);
    if (b < 0) break;
    const file = head.slice(a + OPEN.length, b);
    let css = CACHE_CSS ? cssCache.get(file) : undefined;
    if (css === undefined) {
      css = readFileSync(join(root, file), "utf8");
      if (CACHE_CSS) cssCache.set(file, css);
    }
    out += head.slice(i, a) + css;
    i = b + CLOSE.length;
  }
  return out + head.slice(i);
}

export function pageFor(file: string): Page {
  const page = manifest.pages.find((p) => p.file === file);
  if (!page) throw new Error(`No manifest entry for ${file}`);
  return page;
}

/**
 * The origin this site will be served from, used to make canonical and og:url
 * absolute. Set SITE_URL to your own domain — that is the one answer that
 * survives preview deployments, which each get a different generated hostname
 * and must not advertise themselves as canonical.
 *
 * Falls back to Vercel's production domain, which is correct on Vercel and
 * absent everywhere else. Empty means "leave them relative".
 */
const SITE_ORIGIN = (() => {
  const raw = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const value = raw || (vercel ? `https://${vercel}` : "");
  if (!value) return "";
  try {
    // Normalise away a trailing slash so `origin + "/about"` cannot double up.
    return new URL(value.startsWith("http") ? value : `https://${value}`).origin;
  } catch {
    return "";
  }
})();

/** One page component -> the complete HTML document Framer would have served. */
export async function renderPage(page: Page, Component: ComponentType): Promise<string> {
  // Both imports are dynamic on purpose: NODE_ENV decides which build of react
  // AND react-dom is loaded, and a static import would be hoisted above the
  // NODE_ENV assignment the prerender script makes before calling this.
  // Loading one build of react against the other build of react-dom fails
  // outright ("dispatcher.getOwner is not a function").
  const { createElement } = await import("react");
  const { renderToString } = await import("react-dom/server");

  // What the runtime will render must match what is about to be rendered.
  syncRuntimeContent();

  let body = applyRuntimeEdits(renderToString(createElement(Component)));

  // Anything React emitted BEFORE <body> is its own hoisted output, not ours:
  // every <link>/<meta>/<script> of Framer's was parked verbatim, and React 19
  // additionally invents <link rel="preload" as="image"> for images it sees
  // with fetchPriority="high". Useful in a React app, but here it is a tag
  // Framer never wrote, sitting outside the document's <head>.
  const bodyStart = body.indexOf("<body");
  if (bodyStart > 0) body = body.slice(bodyStart);

  // Splice back the fragments React cannot reproduce in place. On a
  // collection member they hold placeholders for the record's fields —
  // Framer's handover payload names the item's title and text — filled here
  // from the record, encoded the way the payload had them (a value inside
  // a JSON string, or inside a JSON string inside another one).
  const record = page.item ? collections[page.item.collection]?.find((r) => r.route === page.route) : undefined;
  const fill = (frag: string) =>
    record
      ? frag.replace(/__FNJV_(\d)_([A-Za-z0-9_]+)__/g, (m, depth: string, field: string) => {
          const value = record[field];
          if (typeof value !== "string") return m;
          let s = value;
          for (let i = 0; i < Number(depth); i++) s = JSON.stringify(s).slice(1, -1);
          return s;
        })
      : frag;
  page.verbatim.forEach((frag, i) => {
    body = body.replace(`<span data-fnj-slot="${i}"></span>`, () => fill(frag));
  });

  // React inserts <!-- --> between adjacent text nodes so IT can hydrate them
  // later. Nothing here hydrates through React — Framer's own runtime adopts
  // this DOM — so the separators are dead weight, and the last remaining
  // difference from the original bytes.
  body = body.replace(/<!-- -->/g, "");

  // Canonical / og:url are stored ROOT-RELATIVE, because conversion happens
  // long before anyone knows which domain will serve this. Render time is when
  // that stops being true, so resolve them here: Google treats a relative
  // canonical as a weak signal and Lighthouse's canonical audit fails outright
  // on one. Without an origin they stay relative — still correct, just weaker
  // — so an export that is only ever run locally is unaffected.
  const withCss = applyMeta(inlineStyles(page.head), page.route);
  const head = SITE_ORIGIN
    ? withCss
        .replace(
          /(<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=)["'](\/[^"']*)["']/gi,
          (_m, pre, path) => `${pre}"${SITE_ORIGIN}${path}"`
        )
        .replace(
          /(<meta\b[^>]*\bproperty=["']og:url["'][^>]*\bcontent=)["'](\/[^"']*)["']/gi,
          (_m, pre, path) => `${pre}"${SITE_ORIGIN}${path}"`
        )
    : withCss;

  return `${page.prologue}<html${page.htmlAttrs}><head>${head}${extraHead()}</head>${page.afterHead}${body}</html>`;
}
