# shootingstarspro-framer-website

A Next.js project generated from [https://shootingstarspro.framer.website/](https://shootingstarspro.framer.website/) by [FNJ](https://framertonextjs.com).

## What this is

2 page(s) built from 0 React section component(s). Unlike a
look-alike export, these are real components you can read and edit — and they
still render **the same DOM** as the original Framer site: every element,
attribute, text node and hydration marker, in the same order. Framer's runtime
adopts the page exactly as it would its own, so nothing about the published
behaviour changes.

(The bytes are not character-for-character identical, and don't need to be:
React writes `fetchPriority` where Framer wrote `fetchpriority`, and
re-serialises `style="a: 1;"` as `style="a:1"`. Both parse to the same DOM
and compute the same CSS.)

```
src/views/         one component per route, composed from its sections
src/sections/      the Framer sections, named as you named them in Framer
src/styles/        the stylesheets — edit these to change how the site looks
src/manifest.json  the <head> and the verbatim fragments for each page
scripts/           the prerender step, and `new-page` for adding routes
app/               route handlers that serve the prerendered HTML
public/assets/     self-hosted images, fonts and media
```

## Running it

```bash
npm install
npm run dev
```

## Where things live

A section that Framer rendered at more than one breakpoint is a folder:

```
src/sections/shared/Footer/
  index.tsx     composes the three
  Desktop.tsx   one file per breakpoint
  Tablet.tsx
  Phone.tsx
  copy.ts       every repeated string, in one place
```

Framer inlines a separate subtree per breakpoint, and they are not merely
restyled — a third of them are genuinely different markup (a phone menu is not
a shrunken desktop nav). They are kept separate for that reason. What they do
share is the text, which lives in `copy.ts` so editing a heading changes
every breakpoint at once.

Sections used by more than one page live in `src/sections/shared/`; their
header says which pages they serve.

## Changing how it looks

Write your own CSS in `src/styles/custom.css`. It ships empty, it is the last
stylesheet on every page, and nothing regenerates it — so a plain rule there
beats Framer's without `!important`, and a re-conversion will not overwrite
your work:

```css
/* src/styles/custom.css */
.framer-1nbtmz1 { background: #111; }
```

Framer's own stylesheets are in `src/styles/` too — `fonts.css` is shared by
every page and each page has its own. Editing them works and is sometimes what
you want, but they are generated, so prefer `custom.css` for anything you
intend to keep. Either way, run `npm run prerender` (or just `npm run dev`).

Class names like `framer-1nbtmz1` are Framer's and must not be renamed — they
are what the CSS binds to. To find an element, search for its
`data-framer-name`, which carries the layer name you gave it in Framer.

## Finding what to restyle

`src/styles/SELECTORS.md` maps every layer name you used in Framer to the CSS
selector that reaches it. Look up the layer, write a rule against that selector
in `custom.css`, done:

```css
/* "Footer" -> .framer-1nbtmz1 */
.framer-1nbtmz1 { background: #111; }
```

## Page titles and descriptions

Framer's are in the `<head>` and are what ships. To change them durably, write
`src/meta.json` — it ships as `{}`, an empty entry changes nothing, and unlike
an edit to `src/manifest.json` it survives a re-conversion:

```json
{
  "/": { "title": "Studio — Portfolie", "description": "Design and code, in one place." },
  "/contact": { "title": "Talk to us" }
}
```

Title also sets `og:title` and `twitter:title`; description sets the
`og:` and `twitter:` descriptions too.

## Links

Every repeated link target is in the section's `copy.ts` next to its text,
named for where it goes — `linkContact: "./contact"`. Change it there and every
breakpoint follows. One-off links stay inline where they are.

## Something in every `<head>` — analytics, favicons, fonts

Write it in `src/head.html`. It ships empty and is inserted, exactly as
written, at the end of every page's `<head>`; nothing regenerates it.

```html
<link rel="icon" href="/favicon.ico">
<script defer data-domain="example.com" src="https://plausible.io/js/script.js"></script>
```

## Something on every page — a banner, a chat widget, a provider

`src/Layout.tsx` wraps the content of every page, just inside `<body>`. It
ships as a passthrough, so it renders nothing until you change it:

```tsx
import React, { type ReactNode } from "react"; // keep: JSX here needs React in scope

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <CookieBanner />
    </>
  );
}
```

## What survives a re-conversion

Converting the site again regenerates everything Framer produced: sections,
views, stylesheets, the manifest. These are yours and are never regenerated:

```
src/styles/custom.css   your CSS, last in the cascade
src/meta.json           your titles and descriptions
src/head.html           your <head> additions
src/Layout.tsx          your page wrapper
```

Edit Framer's files freely while Framer is no longer the source of truth; put
anything you want to keep across re-conversions in the four above.

## Collections

Pages that share one design with different content — a Framer CMS collection —
come out as **one template and a data file**, not N copies:

```
src/collections/projects.ts              one typed record per item
src/sections/collections/projects/Hero/  the template, reading from a record
src/views/ProjectsItemPage.tsx           the page composition, once
src/views/ProjectsFinedgePage.tsx        three lines: which record to render
```

Edit a record and run `npm run prerender`; the page changes. The record holds
exactly what differed between the items — text, image sources and sizes, the
CMS id — and nothing else, so the five existing pages render byte for byte as
Framer published them.

A page that does not fit the template (an extra paragraph, a different tree)
is named at the top of the data file and stays an ordinary page.

To add an item, copy from one that exists:

```bash
npm run new-page -- --route /projects/new-thing --from /projects/finedge --title "New thing"
```

That appends a record (a copy of the source's, with the slug and route
changed) for you to edit, and gives it a page.

## Adding a page

A page is not just markup: its `<head>` carries the CSS for every component it
uses, which is why a new one starts as a copy of a page that already works.

```bash
npm run new-page -- --route /about --from /contact --title "About us"
```

That writes `src/views/AboutPage.tsx` (a copy of the source page's composition),
its route handler, and a manifest entry with the title and description
replaced. Edit the view to change which sections appear — they are ordinary
imports — then run `npm run prerender`. Existing pages are untouched.

## Before you deploy: set `SITE_URL`

```bash
SITE_URL=https://your-domain.com
```

Framer hard-codes `<link rel="canonical">` and `og:url` to its own domain.
Left alone, your deployed copy would tell Google the real page still lives on
Framer, so they were rewritten to root-relative paths at conversion — at which
point nobody yet knew your domain.

Setting `SITE_URL` makes them absolute again at build time, pointing at you.
Without it they stay relative: still valid, but a weaker signal to Google and
a failing Lighthouse canonical audit. On Vercel this falls back to your
production domain automatically, so setting it explicitly matters most
everywhere else.

## Editing

Edit any file under `src/sections/` and refresh — the dev server renders the
components on every request, so the change is there. (`npm run build` renders
them once to static HTML, which is what production serves.)

Two things in the generated JSX are load-bearing rather than stylistic:

- **`<Suspense>` boundaries** are Framer's hydration markers. Its runtime reads
  them to adopt this DOM instead of re-rendering the page, so removing one
  changes how that part of the page boots.
- **`data-fnj-slot` spans** are placeholders for fragments React cannot emit in
  place (scripts, comments). The prerender step swaps them for the original
  bytes.

Everything else — classes, styles, text, structure — is ordinary JSX.

### Text

Every visible string and link sits in a `copy` object — `copy.ts` in a
section folder, or at the top of a single-file section or view. Edit it there
and refresh.

That is the ONLY place to edit text, and the reason is worth knowing. Framer's
runtime carries its own copy of every string it renders, inside the compiled
chunks under `public/assets/framer/` and, for collection pages, in the CMS
data files there. Change the JSX alone and the server sends your text while
the runtime re-renders the old text a moment later. `src/render.ts` prevents
that by regenerating those files from the `copy` objects and the collection
records before every render, using the table in `src/runtime-content.ts` —
so what the runtime renders is what you wrote. Do not edit
`fnj-content.mjs` or the `.framercms` files by hand; the next render
rewrites them.

One string, one text. Where the same string appears in several places — a
collection record and the listing that shows it, a nav label in two pages —
editing it in any one of them changes it everywhere, the way one CMS value
fed all of them in Framer.

**Refresh the page itself after an edit** — `Ctrl-Shift-R`, or open the URL
directly. Framer's runtime navigates between pages on the client, so clicking
a link in the site's own nav never asks the dev server for anything, and an
edit you just made will not be there. Only a real page load re-renders. If a
change seems not to have taken, that is almost always why.
