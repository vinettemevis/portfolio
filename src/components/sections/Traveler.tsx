import { CountUp, Eyebrow, Reveal } from "@/components/motion";
import Skyline from "@/components/Skyline";

const STATS: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
}[] = [
  { value: 6, suffix: "+", label: "products shipped at CallHub" },
  {
    value: 1.06,
    decimals: 2,
    prefix: "$",
    suffix: "M",
    label: "deferred revenue unlocked",
  },
  { value: 9, label: "years building B2B SaaS" },
];

export default function Traveler() {
  return (
    <section
      id="traveler"
      className="relative overflow-hidden bg-paper pb-52 pt-28 sm:pb-72 sm:pt-36"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl pl-10 pr-6 sm:px-10 lg:px-16">
        <Reveal>
          <Eyebrow>The Traveler</Eyebrow>
          <h2 className="max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">
            Quality taught me how products break. Product lets me build ones
            that don&rsquo;t.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl leading-relaxed text-ink-soft">
            I spent years in quality engineering reading products the way a
            navigator reads weather: finding where they fail before customers
            do. Now I run product at CallHub, owning P2P texting and the AI
            layer around it. I ship features that pay for themselves, from AI
            call scoring priced per agent-day to a credit policy that turned a
            seven-figure liability into recognized revenue.
          </p>
        </Reveal>

        <div className="mt-16 grid max-w-3xl gap-10 sm:grid-cols-3 sm:gap-8">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={0.12 + i * 0.08}>
              <div className="border-t border-line pt-6">
                <p className="font-display text-5xl font-semibold tracking-tight text-ink">
                  <CountUp
                    value={s.value}
                    decimals={s.decimals}
                    prefix={s.prefix}
                    suffix={s.suffix}
                  />
                </p>
                <p className="mt-2 text-sm leading-snug text-ink-soft">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <Skyline city="tokyo" />
    </section>
  );
}
