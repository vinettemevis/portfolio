import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Plane } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Magnetic, Reveal } from "@/components/motion";
import Skyline from "@/components/Skyline";
import { cn } from "@/lib/utils";

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-paper pb-52 pt-24 sm:pb-64"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl pl-10 pr-6 sm:px-10 lg:px-16">
        <Reveal>
          <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-paper-alt px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-teal shadow-warm">
            <Plane aria-hidden className="h-3.5 w-3.5 text-accent" />
            Associate Product Manager · CallHub · Bengaluru
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="mt-8 max-w-4xl font-display text-5xl font-semibold leading-[1.04] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            I turn <em className="not-italic text-accent">messy problems</em>{" "}
            into products people{" "}
            <em className="font-display italic text-accent">actually</em>{" "}
            use.
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Product manager for CallHub&rsquo;s P2P texting and AI suite, based
            in Bengaluru. Nine years in B2B SaaS, from the QA trenches to
            owning products that unlock revenue and save real programs.
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
          <p className="mt-8 text-[0.7rem] font-medium uppercase tracking-[0.3em] text-ink-soft/70">
            12.97° N · 77.59° E — Home port
          </p>
        </Reveal>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <motion.a
          href="#story"
          aria-label="Scroll to the next section"
          className="flex flex-col items-center gap-1 text-ink-soft/80 transition-colors hover:text-accent"
          animate={reduce ? undefined : { y: [0, 7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.3em]">
            Scroll
          </span>
          <ChevronDown aria-hidden className="h-4 w-4" />
        </motion.a>
      </div>

      <Skyline city="bangalore" variant="dawn" />
    </section>
  );
}
