// Writes every page to .rendered/ as the exact HTML Framer published.
//
// Runs automatically before `dev` and `build` — see package.json. The
// rendering itself lives in src/render.ts, which the route handlers also use
// in development, so what you see while editing is what gets built.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

// react-dom's development build warns about the non-standard style properties
// Framer emits (webkit-user-drag). The rendered output is identical either
// way, so render through the production build and keep the console clean.
// This must happen before src/render.ts pulls react in.
(process.env as Record<string, string | undefined>).NODE_ENV ??= "production";

const { manifest, renderPage } = await import("../src/render.js");

const root = process.cwd();

/**
 * Your edits to the content file, applied to the server-rendered HTML.
 *
 * The runtime reads that file directly, so an edit shows up as soon as
 * JavaScript runs. The HTML the server sends is built here, from components
 * that do not read it — so without this step the two disagree: the page
 * arrives with the original text, then swaps to yours. That is a visible
 * flash, and a crawler reading the HTML never sees the new text at all.
 *
 * Diffing `c` against `original` gives exactly what changed, so only
 * deliberate edits are substituted and an untouched site renders byte for
 * byte as before.
 */
async function contentEdits(): Promise<[string, string][]> {
  try {
    const dir = resolve(root, "public/assets/framer");
    const edited = (await import(pathToFileURL(resolve(dir, "fnj-content.mjs")).href)) as {
      c?: Record<string, string>;
    };
    const base = (await import(pathToFileURL(resolve(dir, "fnj-content.original.mjs")).href)) as {
      original?: Record<string, string>;
    };
    if (!edited.c || !base.original) return [];
    const edits: [string, string][] = [];
    for (const [key, was] of Object.entries(base.original)) {
      const now = edited.c[key];
      if (typeof now === "string" && now !== was && was) edits.push([was, now]);
    }
    return edits;
  } catch {
    // No content file (or an unparseable one): nothing to substitute.
    return [];
  }
}

const EDITS = await contentEdits();
if (EDITS.length) console.log(`applying ${EDITS.length} content edit(s) to the prerendered HTML`);

for (const page of manifest.pages) {
  const mod = await import(pathToFileURL(resolve(root, `src/views/${page.component}.tsx`)).href);
  let doc = await renderPage(page, mod.default);
  for (const [was, now] of EDITS) doc = doc.split(was).join(now);
  const out = join(root, ".rendered", page.file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, doc);
  console.log(`  ${page.route.padEnd(24)} ${(doc.length / 1024).toFixed(0)} KB`);
}

console.log(`prerendered ${manifest.pages.length} page(s) to .rendered/`);
