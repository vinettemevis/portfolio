import type { PropsWithChildren, ReactNode } from "react";
import { CanvasBoundary } from "@/components/CanvasBoundary";
import CityScene from "@/components/CityScene";
import { SCENE_BY_ID } from "@/config/journey";
import { cn } from "@/lib/utils";

/**
 * Every section's shared frame: the city background sits full-bleed behind
 * it, a translucent panel carries the actual copy so contrast against the
 * city art never depends on which time-of-day sky is behind it, and an
 * optional overlay slot holds section-specific extras (hero chevron, globe
 * accent corner) positioned outside the panel.
 */
type SectionShellProps = PropsWithChildren<{
  /** DOM id — must match a SECTION_SCENES entry ("top", "story", ...). */
  id: string;
  as?: "section" | "header";
  ariaLabel?: string;
  className?: string;
  /** Classes for the translucent copy panel. */
  panelClassName?: string;
  overlay?: ReactNode;
}>;

export default function SectionShell({
  id,
  as: Tag = "section",
  ariaLabel,
  className,
  panelClassName,
  overlay,
  children,
}: SectionShellProps) {
  const scene = SCENE_BY_ID[id];

  return (
    <Tag
      id={id}
      aria-label={ariaLabel}
      className={cn(
        "relative isolate flex min-h-screen flex-col justify-center overflow-hidden py-24",
        className
      )}
    >
      {scene && (
        <CanvasBoundary fallback={null}>
          <CityScene city={scene.city} timeOfDay={scene.timeOfDay} />
        </CanvasBoundary>
      )}

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <div
          className={cn(
            "mx-auto rounded-3xl border border-border/50 bg-background/90 px-6 py-12 shadow-2xl shadow-black/15 backdrop-blur-md sm:px-12 sm:py-16",
            panelClassName
          )}
        >
          {children}
        </div>
      </div>

      {overlay}
    </Tag>
  );
}
