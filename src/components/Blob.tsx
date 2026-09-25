import { cn } from "@/lib/utils";

/**
 * A single blurred radial-gradient "metaball": the recurring accent motif
 * from the reference design. Pure CSS, no canvas or physics, so it stays
 * cheap on scroll and composes with `overflow-hidden` ancestors.
 */
export function Blob({
  className,
  size = 420,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div
      aria-hidden
      className={cn("absolute rounded-full blur-[26px]", className)}
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle at 55% 45%, hsl(var(--accent-soft)) 0%, hsl(var(--accent)) 58%, hsl(var(--accent) / 0) 72%)",
      }}
    />
  );
}
