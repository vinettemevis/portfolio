import { cn } from "@/lib/utils";

/** Soft orange glow, 520px. Pure CSS. Position it with `className`. */
export function GlowBlob({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("absolute h-[520px] w-[520px] rounded-full blur-[26px]", className)}
      style={{
        background:
          "radial-gradient(circle at 55% 45%, hsl(var(--accent-soft)) 0%, hsl(var(--accent)) 58%, hsl(var(--accent) / 0) 72%)",
      }}
    />
  );
}
