import SectionShell from "@/components/SectionShell";
import { Reveal, RevealItem } from "@/components/motion";
import { t } from "@/lib/copy";

const CHIPS = ["story.chip1", "story.chip2", "story.chip3", "story.chip4"].map(
  (key) => t(key)
);

export default function Story() {
  return (
    <SectionShell id="story" ariaLabel="The long way round" panelClassName="max-w-3xl">
      <Reveal stagger>
        <RevealItem>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-[hsl(var(--ocean))]">
            {t("story.eyebrow")}
          </p>
        </RevealItem>

        <RevealItem>
          <h2 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            {t("story.heading")}
          </h2>
        </RevealItem>

        <RevealItem>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
            {t("story.body1")}
          </p>
        </RevealItem>
        <RevealItem>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            {t("story.body2")}
          </p>
        </RevealItem>
        <RevealItem>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            {t("story.body3")}
          </p>
        </RevealItem>

        <RevealItem>
          <blockquote className="mt-10 border-l-2 border-primary/60 pl-5 font-display text-xl italic leading-snug text-foreground sm:text-2xl">
            "{t("story.quote")}"
          </blockquote>
        </RevealItem>

        <RevealItem>
          <div className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[hsl(var(--ocean))]">
              {t("story.chips.title")}
            </p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {CHIPS.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-border bg-card/70 px-4 py-2 text-sm text-foreground backdrop-blur-sm"
                >
                  {chip}
                </li>
              ))}
            </ul>
          </div>
        </RevealItem>
      </Reveal>
    </SectionShell>
  );
}
