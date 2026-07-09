/** Shared contracts for the dawn treatment + scroll-reactive globe. */

export interface CopyMap {
  [key: string]: string; // slug -> final string
}

export type TimeOfDay = "dawn" | "morning" | "noon" | "golden" | "dusk";

/** All values are HSL triplets, e.g. "222 39% 12%" (no hsl() wrapper). */
export interface Palette {
  background: string;
  foreground: string;
  muted: string;
  primary: string;
  accent: string;
  ocean: string;
  glow: string;
}

export interface StageColors {
  atmosphere: string;
  keyLight: string;
  dot: string;
  bg: string;
}

/** One per page section. */
export interface SceneStage {
  id: string;
  timeOfDay: TimeOfDay;
  focusPinId: string;
  camera: [number, number, number];
  globeScale: number;
  globeOffset: [number, number];
  colors: StageColors;
}

export interface Choreography {
  stages: SceneStage[];
  smoothing: number;
}
