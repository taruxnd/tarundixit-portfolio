// Add a page to this project.
//
// A Framer page is not only its markup: it carries a <head> holding the CSS
// for every component it uses (170 KB is normal), the hydration fragments its
// runtime expects, and Framer's own meta tags. None of that can sensibly be
// written by hand, which is why a new page starts as a copy of one that
// already works — you pick the page whose sections and styling you want, and
// this rewires the parts that must differ.
//
//   npm run new-page -- --route /about --from /contact --title "About us"
//
// Then edit src/views/AboutPage.tsx to compose the sections you want, and run
// npm run prerender. Existing pages are never touched.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

interface Page {
  route: string;
  component: string;
  file: string;
  prologue: string;
  htmlAttrs: string;
  head: string;
  afterHead: string;
  verbatim: string[];
  item?: { collection: string };
  currentLinks?: number[];
}

const args = process.argv.slice(2);
const arg = (name: string): string | undefined => {
  const i = args.indexOf("--" + name);
  return i >= 0 ? args[i + 1] : undefined;
};

const usage =
  'Usage: npm run new-page -- --route /about --from /contact [--title "About us"] [--description "..."]';

const route = arg("route");
const from = arg("from");
const title = arg("title");
const description = arg("description");

if (!route) {
  console.error(usage);
  process.exit(1);
}

// Git Bash on Windows rewrites a leading-slash argument into a Windows path,
// so "--route /about" arrives as "C:/Program Files/Git/about". Say so, rather
// than failing with a usage line that looks like the user typed it correctly.
if (route.indexOf(":") >= 0) {
  console.error("That route came through as a file path: " + route);
  console.error("Git Bash rewrote it. Either drop the leading slash:");
  console.error("  npm run new-page -- --route about --from contact");
  console.error("or disable the rewriting: MSYS_NO_PATHCONV=1 npm run new-page -- --route /about ...");
  process.exit(1);
}

// A leading slash is optional, so "about" and "/about" both work.
const path = route[0] === "/" ? route : "/" + route;

const root = process.cwd();
const manifestPath = join(root, "src/manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as { pages: Page[] };

if (manifest.pages.some((p) => p.route === path)) {
  console.error("A page already exists at " + path);
  process.exit(1);
}

const fromPath = !from ? "/" : from[0] === "/" ? from : "/" + from;
const source = manifest.pages.find((p) => p.route === fromPath);
if (!source) {
  console.error("No page at " + fromPath + ".");
  console.error("Pick one to copy from: " + manifest.pages.map((p) => p.route).join(", "));
  process.exit(1);
}

const slug = path === "/" ? "home" : path.slice(1).split("/").join("-");
const words = slug.split("-").filter(Boolean);
const component = words.map((w) => w[0].toUpperCase() + w.slice(1)).join("") + "Page";
const file = path === "/" ? "index.html" : slug + ".html";

/** Replace the text between two markers, searching from the first. */
function between(html: string, open: string, close: string, value: string): string {
  const a = html.indexOf(open);
  if (a < 0) return html;
  const b = html.indexOf(close, a + open.length);
  if (b < 0) return html;
  return html.slice(0, a + open.length) + value + html.slice(b);
}

/** Replace an attribute's value on the element carrying `marker`. */
function attrAfter(html: string, marker: string, attr: string, value: string): string {
  const at = html.indexOf(marker);
  if (at < 0) return html;
  const c = html.indexOf(attr, at);
  if (c < 0) return html;
  const start = c + attr.length;
  const end = html.indexOf(String.fromCharCode(34), start);
  if (end < 0) return html;
  return html.slice(0, start) + value + html.slice(end);
}

let head = source.head;
if (title) head = between(head, "<title>", "</title>", " " + title + " ");
if (description) {
  head = attrAfter(head, 'name="description"', 'content="', description);
  head = attrAfter(head, 'property="og:description"', 'content="', description);
}
if (title) {
  head = attrAfter(head, 'property="og:title"', 'content="', title);
  head = attrAfter(head, 'name="twitter:title"', 'content="', title);
}

// The view: the source page's composition, renamed. Edit it afterwards to
// change which sections appear — they are ordinary imports.
const viewPath = join(root, "src/views/" + component + ".tsx");
if (existsSync(viewPath)) {
  console.error("src/views/" + component + ".tsx already exists.");
  process.exit(1);
}
const sourceView = readFileSync(join(root, "src/views/" + source.component + ".tsx"), "utf8");

// A collection member is three lines over a template plus a record in the
// data file. Copying it means: a record of its own (a copy of the source's,
// with the slug and route changed, for you to edit) and a view naming it.
// Anything else is copied as the markup it is.
const collectionImport = /import \{ (\w+)Item \} from "@\/src\/collections\/(\w+)";/.exec(sourceView);
const templateImport = /import (\w+ItemPage) from "@\/src\/views\/\w+ItemPage";/.exec(sourceView);
if (collectionImport && templateImport) {
  const [, collection, dataName] = collectionImport;
  const templateView = templateImport[1];
  const dataPath = join(root, "src/collections/" + dataName + ".ts");
  const data = readFileSync(dataPath, "utf8");
  const routeLine = "    route: " + JSON.stringify(source.route) + ",";
  const at = data.indexOf(routeLine);
  const start = at < 0 ? -1 : data.lastIndexOf("  {", at);
  const endMarker = "  },";
  const end = at < 0 ? -1 : data.indexOf(endMarker, at) + endMarker.length;
  if (start < 0 || end < endMarker.length) {
    console.error("Could not find the record for " + source.route + " in " + dataPath);
    process.exit(1);
  }
  const itemSlug = path.split("/").filter(Boolean).pop() as string;
  const record = data
    .slice(start, end)
    .split("    slug: " + JSON.stringify(source.route.split("/").filter(Boolean).pop()) + ",")
    .join("    slug: " + JSON.stringify(itemSlug) + ",")
    .split(routeLine)
    .join("    route: " + JSON.stringify(path) + ",");
  const listEnd = data.lastIndexOf("];");
  writeFileSync(dataPath, data.slice(0, listEnd) + record + String.fromCharCode(10) + data.slice(listEnd), "utf8");
  writeFileSync(
    viewPath,
    [
      'import React from "react";',
      "import " + templateView + ' from "@/src/views/' + templateView + '";',
      "import { " + collection + 'Item } from "@/src/collections/' + dataName + '";',
      "",
      "/** " + path + ' — one record of the "' + dataName + '" collection, rendered by ' + templateView + ".",
      " *  Its content lives in src/collections/" + dataName + ".ts. */",
      "export default function " + component + "() {",
      "  return <" + templateView + " item={" + collection + "Item(" + JSON.stringify(path) + ")!} />;",
      "}",
      "",
    ].join(String.fromCharCode(10)),
    "utf8"
  );
  console.log("  src/collections/" + dataName + ".ts   (record appended — edit its fields)");
} else {
  writeFileSync(
    viewPath,
    sourceView.split("function " + source.component + "(").join("function " + component + "("),
    "utf8"
  );
}

// The route handler, identical in shape to the generated ones.
const routeDir = path === "/" ? "app" : "app" + path;
const up = "../".repeat(routeDir.split("/").length);
const handler = `import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pageFor, renderPage } from "${up}src/render";
import View from "${up}src/views/${component}";

export const dynamic = "force-static";

export async function GET() {
  const html =
    process.env.NODE_ENV === "development"
      ? await renderPage(pageFor(${JSON.stringify(file)}), View)
      : readFileSync(join(process.cwd(), ".rendered", ${JSON.stringify(file)}), "utf8");
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
`;
const handlerPath = join(root, routeDir, "route.ts");
mkdirSync(dirname(handlerPath), { recursive: true });
writeFileSync(handlerPath, handler, "utf8");

// The verbatim fragments are indexed per page and referenced by the view, so
// they are copied wholesale with it — sharing the source page's array would
// break the moment either page's markup changed.
manifest.pages.push({
  route: path,
  component,
  file,
  prologue: source.prologue,
  htmlAttrs: source.htmlAttrs,
  head,
  afterHead: source.afterHead,
  verbatim: [...source.verbatim],
  // The copied markup's links to the SOURCE page are not links to this one,
  // so nothing is marked until the links are updated; the ordinals carry
  // over for when they are.
  ...(source.currentLinks ? { currentLinks: [...source.currentLinks] } : {}),
  // A collection member's fragments are filled from the record whose route
  // matches the page — the new page's own record, appended above.
  ...(source.item ? { item: source.item } : {}),
});
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");

console.log("Added " + path);
console.log("  src/views/" + component + ".tsx   (copied from " + source.component + " — edit to change sections)");
console.log("  " + routeDir + "/route.ts");
console.log("  src/manifest.json updated");
console.log("");
console.log("Run: npm run prerender");
