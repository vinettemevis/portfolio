import { motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  Bot,
  Coins,
  Compass,
  Database,
  FileText,
  FlaskConical,
  LineChart,
  Map,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Eyebrow, Reveal } from "@/components/motion";
import Skyline from "@/components/Skyline";
import { EASE } from "@/lib/utils";

const SKILLS: { label: string; icon: LucideIcon }[] = [
  { label: "Discovery", icon: Compass },
  { label: "Roadmapping", icon: Map },
  { label: "Experimentation", icon: FlaskConical },
  { label: "Analytics", icon: BarChart3 },
  { label: "Mixpanel", icon: LineChart },
  { label: "Go-to-market", icon: Rocket },
  { label: "Pricing & monetization", icon: Coins },
  { label: "AI & agentic products", icon: Bot },
  { label: "Prompt engineering", icon: Sparkles },
  { label: "Stakeholder alignment", icon: Users },
  { label: "PRDs & specs", icon: FileText },
  { label: "SQL & instrumentation", icon: Database },
  { label: "Quality instinct", icon: ShieldCheck },
];

export default function Pack() {
  const reduce = useReducedMotion();

  return (
    <section
      id="pack"
      className="relative overflow-hidden bg-paper-alt pb-52 pt-28 sm:pb-72 sm:pt-36"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl pl-10 pr-6 sm:px-10 lg:px-16">
        <Reveal>
          <Eyebrow>The Pack</Eyebrow>
          <h2 className="max-w-2xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">
            Carried on every expedition.
          </h2>
        </Reveal>

        <ul className="mt-12 flex max-w-4xl flex-wrap gap-3">
          {SKILLS.map((s, i) => (
            <motion.li
              key={s.label}
              className="inline-flex items-center gap-2.5 rounded-full border border-line bg-paper px-5 py-2.5 text-sm font-medium text-ink shadow-warm"
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: 0.05 + i * 0.045, ease: EASE }}
            >
              <s.icon aria-hidden className="h-4 w-4 text-teal" />
              {s.label}
            </motion.li>
          ))}
        </ul>
      </div>

      <Skyline city="london" />
    </section>
  );
}
