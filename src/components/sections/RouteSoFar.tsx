import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow, Reveal } from "@/components/motion";
import { EASE } from "@/lib/utils";

const ROLES = [
  {
    index: "01",
    role: "Associate Product Manager",
    org: "CallHub",
    loc: "Bengaluru",
    dates: "Jan 2025 - Jul 2026",
    desc: "Shipped CallHub's first paid AI features on usage-based billing. Owned P2P texting, agent quality, and billing.",
  },
  {
    index: "02",
    role: "Senior QA Engineer",
    org: "SpotDraft",
    loc: "Bengaluru",
    dates: "Jun 2022 - Dec 2024",
    desc: "Led quality for the core CLM product.",
  },
  {
    index: "03",
    role: "Software Quality Engineer",
    org: "Kaleyra",
    loc: "Bengaluru",
    dates: "Nov 2019 - Jun 2022",
    desc: "Automated UI regression, cutting manual effort roughly 30%. Acting voice lead for a team of four, plus JMeter load and stress testing.",
  },
  {
    index: "04",
    role: "Software Engineer",
    org: "Wieland IT Solutions",
    loc: "Bangalore",
    dates: "May 2019 - Oct 2019",
    desc: "Tested iOS and Android for a healthcare app with Appium.",
  },
  {
    index: "05",
    role: "Associate Software Engineer",
    org: "Teknotrait Solutions",
    loc: "Bangalore",
    dates: "Jul 2017 - May 2019",
    desc: "First port. Compatibility and end-to-end testing across safety, local-guide (ML), and e-learning apps.",
  },
];

export default function RouteSoFar() {
  const reduce = useReducedMotion();

  return (
    <section id="route" className="relative overflow-hidden py-28 sm:py-36">
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-16">
        <Reveal>
          <Eyebrow>The Route So Far</Eyebrow>
          <h2 className="max-w-2xl font-display text-4xl leading-[1.08] tracking-tight text-ink sm:text-5xl">
            Nine years, five ports, one heading.
          </h2>
        </Reveal>

        <ol className="mt-14 flex flex-col">
          {ROLES.map((r, i) => (
            <motion.li
              key={r.org}
              className="grid grid-cols-[64px_minmax(0,1fr)] gap-6 border-t border-ink/20 py-8 sm:grid-cols-[88px_minmax(0,1fr)] sm:gap-10"
              initial={{ opacity: 0, y: reduce ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.05, ease: EASE }}
            >
              <span
                aria-hidden
                className="font-display text-4xl italic leading-none text-accent/70 sm:text-5xl"
              >
                {r.index}
              </span>
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-xl tracking-tight text-ink sm:text-2xl">
                    {r.role}
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint">
                    {r.dates}
                  </p>
                </div>
                <p className="mt-1 text-sm text-ink-soft">
                  {r.org} &middot; {r.loc}
                </p>
                <p className="mt-2.5 max-w-xl text-[0.95rem] leading-relaxed text-ink-soft">
                  {r.desc}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
