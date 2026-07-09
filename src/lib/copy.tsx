import { Fragment } from "react";
import { COPY } from "@/config/copy";

export const t = (key: string) => COPY[key] ?? key;

/** Render {{...}} segments of a copy string as accent-colored spans. */
export function accentify(text: string) {
  const parts = text.split(/\{\{(.*?)\}\}/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="not-italic text-[hsl(var(--accent))]">
        {part}
      </em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}
