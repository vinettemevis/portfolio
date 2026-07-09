import type { Choreography } from "@/types/portfolio";
import { STAGE_COLORS } from "@/config/palette";

/**
 * Scroll -> camera keyframe map for the fixed globe backdrop.
 *
 * Conventions:
 * - `camera` is [x, y, z] in world units; the camera always looks at the
 *   scene origin, so x/y shifts add parallax while the globe stays framed.
 * - `globeOffset` is [x, y] applied to the globe group, moving the sphere
 *   out from under the centered text column (positive x = globe right).
 * - `timeOfDay` progresses monotonically dawn -> dusk over the six stages.
 * - Globe radius is 2 at scale 1; ~0.6 scale + |x| ~1.7 offset keeps the
 *   sphere fully in one lateral gutter beside a max-w-5xl/6xl column.
 */
export const JOURNEY: Choreography = {
  stages: [
    // HERO — full sunrise reveal: globe near-full size, dead center and
    // nudged down so the horizon sits under the headline; camera pulled
    // back to z 5.8 for breathing room around the entire sphere.
    {
      id: "hero",
      timeOfDay: "dawn",
      focusPinId: "callhub",
      camera: [0, 0.4, 5.8],
      globeScale: 1,
      globeOffset: [0, -0.2],
      colors: STAGE_COLORS.dawn,
    },

    // ABOUT — journey origin story: globe shrinks to 0.6 and slides into
    // the right gutter; camera eases right (x 0.5) and in (z 5.0) so the
    // offset globe reads as deliberately framed, not falling off-screen.
    {
      id: "about",
      timeOfDay: "morning",
      focusPinId: "teknotrait",
      camera: [0.5, 0.3, 5.0],
      globeScale: 0.6,
      globeOffset: [1.7, 0],
      colors: STAGE_COLORS.morning,
    },

    // ITINERARY — mid-journey under high sun: mirror of "about" on the
    // LEFT side; small +y offset and lower camera y give a gentle
    // over-the-shoulder tilt change as the user scrolls past the list.
    {
      id: "itinerary",
      timeOfDay: "noon",
      focusPinId: "kaleyra",
      camera: [-0.5, 0.2, 4.8],
      globeScale: 0.6,
      globeOffset: [-1.7, 0.1],
      colors: STAGE_COLORS.noon,
    },

    // EXPEDITIONS — featured work spotlight: back to the RIGHT gutter,
    // slightly larger (0.65) and camera a touch closer/higher to make the
    // callhub pin feel like the hero object beside the project cards.
    {
      id: "expeditions",
      timeOfDay: "golden",
      focusPinId: "callhub",
      camera: [0.6, 0.35, 5.0],
      globeScale: 0.65,
      globeOffset: [1.8, -0.1],
      colors: STAGE_COLORS.golden,
    },

    // TOOLKIT — quiet supporting beat: smallest scale (0.55) tucked LEFT
    // and raised, camera at its closest (z 4.6); stays "golden" so the
    // light only turns dusk once, at the final stage.
    {
      id: "toolkit",
      timeOfDay: "golden",
      focusPinId: "spotdraft",
      camera: [-0.45, 0.25, 4.6],
      globeScale: 0.55,
      globeOffset: [-1.6, 0.2],
      colors: STAGE_COLORS.golden,
    },

    // CONTACT — dusk finale: globe drifts back to center at 0.8 scale but
    // sinks below the fold line (y -0.9) so it glows behind/beneath the
    // CTA; camera recenters and pulls back, echoing the hero framing.
    {
      id: "contact",
      timeOfDay: "dusk",
      focusPinId: "next",
      camera: [0, 0.1, 5.6],
      globeScale: 0.8,
      globeOffset: [0, -0.9],
      colors: STAGE_COLORS.dusk,
    },
  ],
  smoothing: 0.06,
};
