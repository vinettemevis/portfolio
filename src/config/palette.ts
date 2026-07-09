import type { Palette, StageColors, TimeOfDay } from "@/types/portfolio";

/**
 * "Blue hour → dawn" treatment.
 * All values are HSL triplets ("H S% L%") meant to be consumed as `hsl(var(--token))`
 * or passed to three.js via `hsl(${value})` string construction.
 */
export const PALETTE: Palette = {
  background: "222 39% 12%",
  foreground: "40 30% 97%",
  muted: "220 16% 74%",
  primary: "18 90% 60%",
  accent: "40 96% 68%",
  ocean: "190 72% 58%",
  glow: "28 92% 62%",
};

/**
 * Scroll-driven scene grading: the globe warms and brightens across the page,
 * then settles into a lit indigo dusk (never back to black).
 *
 * - atmosphere: fresnel rim tint
 * - keyLight:   directional key light color
 * - dot:        surface point cloud color
 * - bg:         scene / clear background (kept 10%–18% lightness for text contrast)
 */
export const STAGE_COLORS: Record<TimeOfDay, StageColors> = {
  dawn: {
    atmosphere: "14 80% 70%", // peach-rose rim
    keyLight: "32 70% 72%", // soft warm sun just under the horizon
    dot: "220 30% 92%", // cool off-white
    bg: "228 34% 14%", // cool periwinkle sky
  },
  morning: {
    atmosphere: "40 90% 70%", // warming toward gold
    keyLight: "45 42% 84%", // brighter, whiter sun
    dot: "45 25% 95%",
    bg: "220 30% 16%", // clearer, lifted blue
  },
  noon: {
    atmosphere: "205 70% 78%", // pale sky blue
    keyLight: "50 15% 95%", // near-white, brightest stage
    dot: "210 20% 97%", // high-legibility
    bg: "215 25% 18%", // brightest allowable sky
  },
  golden: {
    atmosphere: "30 95% 62%", // orange-gold hour
    keyLight: "35 90% 66%", // warm amber sun
    dot: "35 30% 92%", // warmed off-white
    bg: "245 30% 15%", // sky warms slightly toward violet
  },
  dusk: {
    atmosphere: "330 75% 64%", // magenta-rose afterglow
    keyLight: "24 80% 60%", // low warm ember light
    dot: "260 25% 88%", // twilight lavender-white
    bg: "240 35% 12%", // deep indigo, still clearly lit
  },
};
