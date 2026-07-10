import type { SectionScene } from "@/types/portfolio";

/**
 * One entry per page section, in DOM/scroll order. This is the single
 * mapping every section reads to pick its CityScene background, its sky
 * time-of-day, and whether it mounts the small globe accent.
 *
 * Cities run in scroll order (home base first): Bangalore, London, Tokyo,
 * Singapore, Bali, Hanoi. Hero and Story share Bangalore (Story continues
 * the hero's scene). Time of day runs dawn -> day -> golden -> dusk -> soft
 * night down the page — this progression is a big source of the "brighter"
 * feel, since every band sits lighter than the base page background.
 *
 * The globe is a silent side accent on at most two sections, ever.
 */
export const SECTION_SCENES: SectionScene[] = [
  { id: "top", city: "bangalore", timeOfDay: "dawn", globe: "hero-corner" },
  { id: "story", city: "bangalore", timeOfDay: "dawn", globe: "none" },
  { id: "about", city: "london", timeOfDay: "day", globe: "none" },
  { id: "itinerary", city: "tokyo", timeOfDay: "day", globe: "none" },
  { id: "expeditions", city: "singapore", timeOfDay: "golden", globe: "none" },
  { id: "toolkit", city: "bali", timeOfDay: "dusk", globe: "none" },
  { id: "contact", city: "hanoi", timeOfDay: "night", globe: "contact-corner" },
];

export const SECTION_IDS = SECTION_SCENES.map((s) => s.id);

export const SCENE_BY_ID: Record<string, SectionScene> = Object.fromEntries(
  SECTION_SCENES.map((s) => [s.id, s])
);
