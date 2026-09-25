import { buttonVariants } from "@/components/ui/button";
import { Magnetic, Reveal } from "@/components/motion";
import { LavaBlobs } from "@/components/LavaBlobs";
import { cn } from "@/lib/utils";

const STATS = [
  { label: "Features shipped", value: "6+" },
  { label: "Years in B2B SaaS", value: "9" },
  { label: "Verticals led", value: "3" },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden pb-20 pt-24"
    >
      <LavaBlobs />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(60,40,25,.10) 1px, transparent 1.2px)",
          backgroundSize: "7px 7px",
          mixBlendMode: "multiply",
          opacity: 0.5,
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-16">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-4 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink-faint shadow-warm">
            Product Manager · Open to opportunities · Bengaluru
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="mt-8 max-w-2xl font-display text-4xl leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            I turn <em className="italic text-ink">messy problems</em>{" "}
            into products people{" "}
            <em className="italic text-ink">actually</em> use.
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            Product manager who most recently built CallHub&rsquo;s P2P
            texting and AI suite, based in Bengaluru. Nine years in B2B SaaS,
            from the QA trenches to owning products that unlock revenue and
            save real programs. Now looking for the next team to help scale.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a href="#expeditions" className={cn(buttonVariants({ size: "lg" }))}>
                View the work
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                Get in touch
              </a>
            </Magnetic>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-ink/20 pt-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl text-ink">{s.value}</p>
                <p className="mt-1 text-[0.72rem] leading-snug text-ink-soft">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
