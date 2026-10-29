const base =
  "inline-flex h-[4.75rem] items-center justify-center whitespace-nowrap rounded-full px-11 font-mono text-[1.05rem] uppercase tracking-[0.14em] transition-colors duration-300 ease-atlas";

/** Class names for the big pill links (CTAs). */
export const button = {
  solid: `${base} bg-ink text-paper shadow-warm hover:bg-ink/90`,
  outline: `${base} border-[1.5px] border-ink/70 text-ink hover:border-accent hover:text-accent`,
};
