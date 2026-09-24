import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Plane } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Magnetic, Reveal } from "@/components/motion";
import Sunflower from "@/components/Sunflower";
import CursorButterfly from "@/components/CursorButterfly";
import { cn } from "@/lib/utils";

const STATS = [
  { label: "Features shipped", value: "6+" },
  { label: "Years in B2B SaaS", value: "9" },
  { label: "Verticals led", value: "3" },
];

export default function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-paper/85 pb-24 pt-24 backdrop-blur-sm sm:pb-28"
    >
      <CursorButterfly containerRef={sectionRef} />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 pl-10 pr-6 sm:grid-cols-[4fr_5fr] sm:gap-6 sm:px-10 lg:gap-10 lg:px-16">
        <Reveal>
          <Sunflower className="mx-auto aspect-[40/57] w-full max-w-[9rem] sm:max-w-[10rem] md:max-w-xs lg:max-w-sm" />
        </Reveal>

        <div>
          <Reveal>
            <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-paper-alt px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-teal shadow-warm">
              <Plane aria-hidden className="h-3.5 w-3.5 text-accent" />
              Associate Product Manager · CallHub · Bengaluru
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-6 max-w-xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:mt-8 sm:text-3xl md:text-5xl lg:text-6xl">
              I turn <em className="not-italic text-cta">messy problems</em>{" "}
              into products people{" "}
              <em className="font-display italic text-accent">actually</em>{" "}
              use.
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-ink-soft sm:mt-4 sm:text-[0.8rem] md:mt-7 md:text-base lg:text-lg">
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
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl font-semibold text-ink">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[0.72rem] leading-snug text-ink-soft">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
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
    </section>
  );
}
