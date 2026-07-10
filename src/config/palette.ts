import type { Palette, SkyBand, TimeOfDay } from "@/types/portfolio";

/**
 * "Traveler's atlas at dawn" — V4 brightness lift. All values are HSL
 * triplets ("H S% L%") consumed as `hsl(var(--token))` in CSS or via
 * `hsl(${value})` string construction for three.js.
 *
 * PALETTE mirrors the :root vars in index.css — keep the two in sync.
 * muted must hold >= 4.5:1 (WCAG AA) against BOTH background and surface.
 */
export const PALETTE: Palette = {
  background: "214 32% 24%",
  surface: "215 30% 28%",
  foreground: "40 30% 98%",
  muted: "214 18% 82%",
  primary: "18 92% 62%",
  accent: "42 96% 68%",
  ocean: "196 78% 62%",
};

/**
 * Per-time-of-day sky gradients for the city backgrounds. These run lighter
 * than the base page background so each section feels airy, and together
 * they progress dawn -> bright day -> golden -> dusk -> soft night down the
 * page (never back to black — night keeps warm, lit windows).
 */
export const SKY_BANDS: Record<TimeOfDay, SkyBand> = {
  dawn: {
    stops: ["24 70% 88%", "16 82% 78%", "280 40% 62%", "234 42% 34%"],
    glow: "18 90% 72%",
    silhouette: "250 32% 30%",
  },
  day: {
    stops: ["200 70% 90%", "199 76% 78%", "202 70% 62%", "210 55% 42%"],
    glow: "45 85% 78%",
    silhouette: "212 40% 32%",
  },
  golden: {
    stops: ["32 88% 84%", "24 90% 68%", "12 78% 52%", "255 32% 30%"],
    glow: "28 95% 70%",
    silhouette: "18 40% 26%",
  },
  dusk: {
    stops: ["272 42% 60%", "285 46% 42%", "255 44% 28%", "236 40% 18%"],
    glow: "300 70% 70%",
    silhouette: "255 30% 20%",
  },
  night: {
    stops: ["224 36% 36%", "224 34% 29%", "222 32% 22%", "220 30% 17%"],
    glow: "38 90% 70%",
    silhouette: "222 28% 14%",
  },
};
