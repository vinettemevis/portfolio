import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow, Reveal } from "@/components/motion";
import { EASE } from "@/lib/utils";

const SKILLS = [
  "Discovery",
  "Roadmapping",
  "Experimentation",
  "Analytics",
  "Mixpanel",
  "Go-to-market",
  "Pricing & monetization",
  "AI & agentic products",
  "Prompt engineering",
  "Stakeholder alignment",
  "PRDs & specs",
  "SQL & instrumentation",
  "Quality instinct",
];

export default function Pack() {
  const reduce = useReducedMotion();

  return (
    <section id="pack" className="relative overflow-hidden py-28 sm:py-36">
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-16">
        <Reveal>
          <Eyebrow>The Pack</Eyebrow>
          <h2 className="max-w-2xl font-display text-4xl leading-[1.08] tracking-tight text-ink sm:text-5xl">
            Carried on every expedition.
          </h2>
        </Reveal>

        <ul className="mt-12 flex max-w-4xl flex-wrap gap-3">
          {SKILLS.map((s, i) => (
            <motion.li
              key={s}
              className="rounded-full border border-ink/15 bg-paper px-5 py-2.5 font-mono text-[0.78rem] uppercase tracking-[0.08em] text-ink shadow-warm"
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: 0.05 + i * 0.045, ease: EASE }}
            >
              {s}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
