import { useRef } from "react";
import { Reveal } from "@/components/motion";
import { RouteBlobs } from "@/components/RouteBlobs";

const ROLES = [
  {
    role: "Associate Product Manager",
    org: "CallHub",
    loc: "Bengaluru",
    dates: "Jan 2025–Present",
    desc: "Shipped CallHub's first paid AI features on usage-based billing. Owns P2P texting, agent quality, and billing.",
  },
  {
    role: "Senior QA Engineer",
    org: "SpotDraft",
    loc: "Bengaluru",
    dates: "Jun 2022–Dec 2024",
    desc: "Led quality for the core CLM product.",
  },
  {
    role: "Software Quality Engineer",
    org: "Kaleyra",
    loc: "Bengaluru",
    dates: "Nov 2019–Jun 2022",
    desc: "Automated UI regression, cutting manual effort roughly 30%. Acting voice lead for a team of four, plus JMeter load and stress testing.",
  },
  {
    role: "Software Engineer",
    org: "Wieland IT Solutions",
    loc: "Bangalore",
    dates: "May 2019–Oct 2019",
    desc: "Tested iOS and Android for a healthcare app with Appium.",
  },
  {
    role: "Associate Software Engineer",
    org: "Teknotrait Solutions",
    loc: "Bangalore",
    dates: "Jul 2017–May 2019",
    desc: "First port. Compatibility and end-to-end testing across safety, local-guide (ML), and e-learning apps.",
  },
];

export default function RouteSoFar() {
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="route"
      className="bg-[#e8ddcf] px-[clamp(20px,5vw,64px)] py-[clamp(80px,12vw,160px)]"
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-[clamp(40px,6vw,96px)]">
        <Reveal className="flex flex-col gap-8">
          <div className="flex items-center gap-3 font-mono text-[13px] uppercase tracking-[0.08em] text-ink">
            <span className="text-[#c2410c]">04</span>
            <span className="h-px w-8 bg-ink" />
            Where I&rsquo;ve worked
          </div>
          <h2 className="font-display text-[clamp(40px,5.5vw,76px)] font-normal leading-none tracking-[-0.015em] text-ink [text-wrap:balance]">
            Nine years, five ports, one heading.
          </h2>
        </Reveal>

        <div ref={wrapRef} className="relative">
          <div
            aria-hidden
            className="absolute bottom-3 left-[43px] top-3 w-[2px] rounded-sm bg-[#cdbca6]"
          />
          <RouteBlobs wrapRef={wrapRef} />
          <ol className="relative flex flex-col">
            {ROLES.map((r) => (
              <li
                key={r.org}
                data-route-item
                className="grid grid-cols-[88px_minmax(0,1fr)] pb-[30px] pt-[22px] opacity-40 transition-opacity duration-[600ms] ease-atlas"
              >
                <span />
                <div className="flex flex-col gap-1.5">
                  <p className="font-mono text-xs uppercase tracking-[0.1em] text-[#6b5646]">
                    {r.dates} &middot; {r.loc}
                  </p>
                  <h3 className="font-display text-[clamp(30px,2.8vw,40px)] font-normal leading-[1.05] text-ink">
                    {r.org}
                  </h3>
                  <p className="text-base font-semibold text-ink">{r.role}</p>
                  <p className="mt-1.5 max-w-[56ch] text-base leading-relaxed text-[#4a3a2e] [text-wrap:pretty]">
                    {r.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
