import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow, Reveal } from "@/components/motion";
import Skyline from "@/components/Skyline";
import { EASE } from "@/lib/utils";

const LEGS = [
  {
    stamp: "CH",
    role: "Associate Product Manager",
    org: "CallHub",
    loc: "Bengaluru",
    dates: "Jan 2025–Present",
    desc: "Shipped CallHub's first paid AI features on usage-based billing. Owns P2P texting, agent quality, and billing.",
  },
  {
    stamp: "SD",
    role: "Senior QA Engineer",
    org: "SpotDraft",
    loc: "Bengaluru",
    dates: "Jun 2022–Dec 2024",
    desc: "Led quality for the core CLM product.",
  },
  {
    stamp: "KA",
    role: "Software Quality Engineer",
    org: "Kaleyra",
    loc: "Bengaluru",
    dates: "Nov 2019–Jun 2022",
    desc: "Automated UI regression, cutting manual effort roughly 30%. Acting voice lead for a team of four, plus JMeter load and stress testing.",
  },
  {
    stamp: "WI",
    role: "Software Engineer",
    org: "Wieland IT Solutions",
    loc: "Bangalore",
    dates: "May 2019–Oct 2019",
    desc: "Tested iOS and Android for a healthcare app with Appium.",
  },
  {
    stamp: "TK",
    role: "Associate Software Engineer",
    org: "Teknotrait Solutions",
    loc: "Bangalore",
    dates: "Jul 2017–May 2019",
    desc: "First port. Compatibility and end-to-end testing across safety, local-guide (ML), and e-learning apps.",
  },
];

export default function RouteSoFar() {
  const reduce = useReducedMotion();

  return (
    <section
      id="route"
      className="relative overflow-hidden bg-paper-alt pb-48 pt-28 sm:pb-60 sm:pt-36"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl pl-10 pr-6 sm:px-10 lg:px-16">
        {/* Content sits right of the gutter so the route line can swing wide here */}
        <div className="lg:ml-[26%]">
          <Reveal>
            <Eyebrow>The Route So Far</Eyebrow>
            <h2 className="max-w-2xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">
              Nine years, five ports, one heading.
            </h2>
          </Reveal>

          <ol className="mt-14 space-y-12">
            {LEGS.map((leg, i) => (
              <motion.li
                key={leg.org}
                className="flex items-start gap-5 sm:gap-7"
                initial={{ opacity: 0, x: reduce ? 0 : 36 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, delay: i * 0.05, ease: EASE }}
              >
                <span
                  aria-hidden
                  className="mt-1 flex h-14 w-14 shrink-0 -rotate-6 items-center justify-center rounded-full border-[1.5px] border-dashed border-teal/60 font-display text-sm font-semibold text-teal"
                >
                  {leg.stamp}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                    {leg.role}
                  </h3>
                  <p className="mt-1 text-sm text-ink-soft">
                    {leg.org} · {leg.loc} ·{" "}
                    <span className="font-medium uppercase tracking-[0.12em] text-teal">
                      {leg.dates}
                    </span>
                  </p>
                  <p className="mt-2.5 max-w-xl text-[0.95rem] leading-relaxed text-ink-soft">
                    {leg.desc}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>

      <Skyline city="bangalore" light />
    </section>
  );
}
