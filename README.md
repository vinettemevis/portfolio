# Vinette Sequeira — Portfolio

A single-page personal portfolio themed as a vintage travel atlas / boarding
pass. Warm paper tones, editorial serif headlines, an atlas-ink blue accent,
and two signature interactions:

- **The flight route** — one continuous dashed line runs down the whole page.
  A plane travels along it, driven by scroll progress, filling in a dashed
  trail behind it, with passport-stamp waypoints at each section.
- **City skylines** — recognizable engraved SVG line-art horizons per section
  (Bengaluru, Tokyo, New York, London, Singapore) with gentle parallax.

## Run

```sh
npm install
npm run dev
```

Production build: `npm run build` (output in `dist/`), preview with
`npm run preview`.

## Stack

React 18 · Vite 5 · TypeScript · Tailwind CSS 3 · Framer Motion 11 ·
shadcn/ui-style components (cva + tailwind-merge) · lucide-react.

Everything is self-contained HTML/SVG/CSS + Framer Motion — no WebGL, no
external assets beyond Google Fonts (Fraunces + Inter).

## Notes

- Palette lives as HSL CSS variables in `src/index.css` and is wired into
  Tailwind tokens in `tailwind.config.ts` (`paper`, `ink`, `accent`, `teal`,
  `gold`, `line`).
- `FlightRoute` accepts `marker="bird"` for a wing-flapping bird variant of
  the travelling marker (default is the plane).
- Full `prefers-reduced-motion` support: static route with the plane parked
  at the section in view, no parallax, content simply fades in.
- On mobile the route runs as a slim rail down the far left and skylines
  drop their secondary detail.
- `public/resume.pdf` is a placeholder — replace it with the real resume.
