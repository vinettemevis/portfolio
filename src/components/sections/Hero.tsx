import { buttonVariants } from "@/components/ui/button";
import { Magnetic, Reveal } from "@/components/motion";
import { LavaBlobs } from "@/components/LavaBlobs";
import Header from "@/components/sections/Header";
import { cn } from "@/lib/utils";

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

      <Header />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-16">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-4 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink-faint shadow-warm">
            Associate Product Manager · CallHub · Bengaluru
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
            Product manager for CallHub&rsquo;s P2P texting and AI suite,
            based in Bengaluru. Nine years in B2B SaaS, from the QA trenches
            to owning products that unlock revenue and save real programs.
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
      </div>
    </section>
  );
}
