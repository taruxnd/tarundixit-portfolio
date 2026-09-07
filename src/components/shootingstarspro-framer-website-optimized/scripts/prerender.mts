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

const { manifest, renderPage, syncRuntimeContent } = await import("../src/render.js");

const root = process.cwd();

/**
 * Mark the nav links that point at the page being rendered.
 *
 * Framer puts data-framer-page-link-current on the link to the page you are
 * on, and styles it. That attribute is the ONLY thing that differed between
 * copies of a shared section, so the components are generated without it and
 * it is applied here instead — which is what lets one Footer.tsx serve every
 * page rather than one copy per page.
 *
 * Matching the href exactly, rather than by pattern, is deliberate: it was
 * checked to reproduce Framer's own output byte for byte on every page of a
 * real site.
 */
function markCurrentPage(html: string, route: string, which?: number[]): string {
  const self = route === "/" ? "./" : "." + route;
  const href = ' href="' + self + '"';
  const marked = href + ' data-framer-page-link-current="true"';
  const parts = html.split(href);
  // `which` lists the ordinals Framer marked on this page: it marks page
  // links and not URL links to the same page, and the manifest recorded which
  // were which. Absent (an older manifest), every link to the page is marked.
  return parts
    .map((part, i) => (i === 0 ? part : (which ? which.includes(i - 1) : true) ? marked + part : href + part))
    .join("");
}

// The runtime's files follow the source (src/runtime-content.ts). Regenerated
// here, before anything reads them, so a fresh clone builds from its source
// rather than from whatever was last written under public/.
syncRuntimeContent();

for (const page of manifest.pages) {
  const mod = await import(pathToFileURL(resolve(root, `src/views/${page.component}.tsx`)).href);
  let doc = await renderPage(page, mod.default);
  doc = markCurrentPage(doc, page.route, page.currentLinks);
  const out = join(root, ".rendered", page.file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, doc);
  console.log(`  ${page.route.padEnd(24)} ${(doc.length / 1024).toFixed(0)} KB`);
}

console.log(`prerendered ${manifest.pages.length} page(s) to .rendered/`);
