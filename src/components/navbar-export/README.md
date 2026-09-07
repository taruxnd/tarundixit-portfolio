# Liquid Glass Navbar Export

Self-contained top navigation bar extracted from the Framer project. Includes the liquid glass pill bar, mega-menu dropdown, gradient link hovers, and mobile slide-in drawer.

**No sidebar** — only the top navbar.

## Required npm packages

```bash
npm install react react-dom next
```

No Tailwind, Framer, or other UI libraries are required. Styling is plain CSS + inline styles (matching the original).

TypeScript is recommended but optional.

## Installation

### 1. Copy the folder

Copy the entire `navbar-export/` directory into your Next.js project:

```
your-next-app/
├── app/
├── navbar-export/     ← paste here
│   ├── Navbar.tsx
│   ├── components/
│   ├── hooks/
│   ├── styles/
│   ├── assets/
│   └── ...
```

### 2. Serve static assets

Copy `navbar-export/assets/` into your `public/` folder so fonts and the logo are reachable:

```bash
cp -r navbar-export/assets public/navbar-export/assets
```

Update the default logo path in `config/defaultConfig.ts` if needed:

```ts
logo: "/navbar-export/assets/logo.svg",
```

### 3. Add to your layout

```tsx
// app/layout.tsx
import Navbar from "@/navbar-export/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar top={24} />
        {children}
      </body>
    </html>
  );
}
```

### 4. TypeScript path alias (optional)

In `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/navbar-export/*": ["./navbar-export/*"]
    }
  }
}
```

## Fonts

The navbar uses two font families (included in `assets/fonts/`):

| Font | Usage |
|------|--------|
| **Geist** | Nav links, mobile menu text |
| **Departure Mono Regular** | Mega-menu card titles, mobile CTA buttons |

Fonts are loaded via `styles/fonts.css`, which is imported automatically by `Navbar.tsx`.

If you already use Geist via `next/font`, you can remove the Geist `@font-face` rules from `styles/fonts.css` and set `typography.navFont.fontFamily` to match your font stack.

## Customization

Pass props to override the default Framer configuration:

```tsx
<Navbar
  top={32}
  brand={{
    logo: "/navbar-export/assets/logo.svg",
    logoLink: "/",
    logoWidth: 120,
  }}
  content={{
    dropdowns: [
      {
        label: "Products",
        links: [
          { label: "Feature A", description: "...", image: "/img/a.jpg", link: "/a" },
        ],
      },
    ],
    navLinks: [
      { label: "About", link: "/about" },
      { label: "Contact", link: "/contact" },
    ],
  }}
/>
```

See `types.ts` for the full prop API. Defaults live in `config/defaultConfig.ts`.

## Mega-menu images

Default dropdown card images are loaded from `framerusercontent.com`. For production, download them and host locally:

1. Save images to `public/navbar-export/assets/` (or your CDN).
2. Update `image` URLs in `config/defaultConfig.ts`.

## Environment variables

None required. The navbar has no API keys or external service dependencies.

## Tailwind projects

This component does not use Tailwind. It works alongside Tailwind — no conflicts. Do not wrap it in Tailwind classes that override `position`, `backdrop-filter`, or font styles unless intentional.

## File structure

```
navbar-export/
├── Navbar.tsx              # Main entry — import this
├── types.ts                # TypeScript interfaces
├── config/
│   └── defaultConfig.ts    # Default nav content & styling
├── components/
│   ├── LiquidGlassNavBar.tsx
│   ├── GlassBackground.tsx
│   ├── MegaMenuDropdown.tsx
│   ├── MobileDrawer.tsx
│   ├── DropdownItems.tsx
│   ├── icons.tsx
│   ├── lensDisplacement.ts
│   └── utils.ts
├── hooks/
│   ├── useIsMobile.ts
│   └── useInjectNavbarStyles.ts
├── styles/
│   ├── fonts.css
│   └── navbar.css
└── assets/
    ├── logo.svg
    └── fonts/*.woff2
```

## Features preserved from original

- Advanced glass overlay with SVG chromatic aberration
- Orange gradient text hover on links
- Mega-menu with image cards and animated link list
- Mobile hamburger → right slide-in drawer with accordion dropdowns
- Body scroll lock when mobile menu is open
- Responsive breakpoint at 768px (configurable via `mobile.breakpoint`)

## License

Extracted from a Framer export. Ensure you have rights to use the design, fonts (Geist, Departure Mono), and images in your project.
