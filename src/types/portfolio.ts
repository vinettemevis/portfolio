/**
 * Shared contracts for the V4 pass: cities-as-background travel theme, a
 * demoted globe accent, a brighter dawn/day palette, and the new Story
 * section. These types are the interface between CityScene, GlobeAccent,
 * the section layouts, and the palette module — change them only in
 * lockstep with every consumer.
 */

export interface CopyMap {
  [key: string]: string; // slug -> final string
}

/** Progresses dawn -> soft night down the page; drives sky color + brightness. */
export type TimeOfDay = "dawn" | "day" | "golden" | "dusk" | "night";

/** One low-poly city background, in scroll order. */
export type CityId =
  | "bangalore"
  | "london"
  | "tokyo"
  | "singapore"
  | "bali"
  | "hanoi";

/** Where (if at all) the small globe accent appears. Max two sections, ever. */
export type GlobePlacement = "hero-corner" | "contact-corner" | "none";

/** All values are HSL triplets, e.g. "214 32% 24%" (no hsl() wrapper). */
export interface Palette {
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  primary: string;
  accent: string;
  ocean: string;
}

/** Sky gradient stops for one time-of-day band. All values are HSL triplets. */
export interface SkyBand {
  /** Gradient stops, top to bottom (each an "H S% L%" triplet). */
  stops: string[];
  /** Warm window-glow / sun tint used for building highlights and haze. */
  glow: string;
  /** Base silhouette color for buildings against this sky. */
  silhouette: string;
}

/** One per page section, in DOM/scroll order. */
export interface SectionScene {
  /** DOM id of the section element. */
  id: string;
  city: CityId;
  timeOfDay: TimeOfDay;
  globe: GlobePlacement;
}

export interface CitySceneProps {
  city: CityId;
  timeOfDay: TimeOfDay;
  className?: string;
}

export interface GlobeAccentProps {
  placement: "hero-corner" | "contact-corner";
  className?: string;
}
