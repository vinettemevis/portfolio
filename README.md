# Vinette Sequeira · Portfolio

Single-page PM portfolio with a procedural 3D globe backdrop (React Three Fiber), travel-themed sections, and Framer Motion scroll animations.

**Run:** `npm install && npm run dev`

**Deploy:** `npm run build`, then serve the `dist/` folder anywhere static (Vercel, Netlify, GitHub Pages). Zero external assets; everything is generated in code.

## Stack

React 18 · Vite 5 · TypeScript · Tailwind CSS · shadcn/ui primitives · @react-three/fiber + drei · Framer Motion · lucide-react

## Structure

- `src/components/Globe.tsx` — the full 3D layer: Fibonacci-sphere dots, fresnel atmosphere, career-stop pins with hover tooltips, animated travel arcs
- `src/components/sections/` — Hero, About, Itinerary, Expeditions, Toolkit, Contact, Footer
- `src/index.css` — dusk/horizon palette as CSS variables
- `public/Vinette_Sequeira_PM.pdf` — resume served by the Download resume link

Reduced-motion and mobile fallbacks are built in: the globe freezes to a static frame under `prefers-reduced-motion`, and drops dot/arc counts, drag, and DPR below 768px.
