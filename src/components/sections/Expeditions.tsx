import { Eyebrow, Reveal, TiltCard } from "@/components/motion";
import Skyline from "@/components/Skyline";

interface Expedition {
  tag: string;
  title: string;
  sub: string;
  problem: string;
  approach: string;
  result: string;
}

const EXPEDITIONS: Expedition[] = [
  {
    tag: "Automation engine",
    title: "Recurring Campaigns",
    sub: "The engine behind CallHub's SEIU Local 503 case study.",
    problem:
      "A 75,000-member union rebuilt 104 texting campaigns by hand every single year. The program nearly got cut.",
    approach:
      "Designed a recurring engine that carries schedules, audiences, and content forward on a yearly cadence with zero rebuilding.",
    result:
      "Cut yearly setup to 15 minutes, ending 7 years of cumulative manual rebuilds and saving a service for roughly 40,000 workers.",
  },
  {
    tag: "AI product",
    title: "Agent Quality & Coaching",
    sub: "An AI layer that turns call transcripts into coaching plans.",
    problem:
      "Managers ran hundreds of agents with no way to see who needed coaching, and no proof that coaching moved outcomes.",
    approach:
      "Shipped AI scoring of every transcript, 0 to 100, on script coverage, objection handling, rapport, and goals, with coaching auto-assigned. Built on a two-time hackathon-winning AI mock-call trainer.",
    result:
      "Priced per agent-day with ROI proven through before-and-after deltas. Organizers reported new skills after one AI rehearsal session.",
  },
  {
    tag: "Monetization",
    title: "Credit Expiry Policy",
    sub: "A pricing and policy play, not a feature.",
    problem:
      "$1.06M in unused prepaid credits sat on the books as deferred revenue, an unrealized liability growing every quarter.",
    approach:
      "Wrote the expiry policy end to end and drove it across finance, legal, and lifecycle marketing, with a re-engagement window built in.",
    result:
      "Converted $1.06M from liability to recognized revenue and gave inactive accounts a reason to come back.",
  },
];

function Block({
  label,
  children,
  accent,
}: {
  label: string;
  children: string;
  accent?: boolean;
}) {
  if (accent) {
    return (
      <div className="rounded-lg border-l-2 border-accent bg-accent/[0.06] py-3 pl-4 pr-3">
        <h4 className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-accent">
          {label}
        </h4>
        <p className="mt-1.5 text-sm leading-relaxed text-ink">{children}</p>
      </div>
    );
  }
  return (
    <div>
      <h4 className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-teal">
        {label}
      </h4>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{children}</p>
    </div>
  );
}

export default function Expeditions() {
  return (
    <section
      id="expeditions"
      className="relative overflow-hidden bg-paper pb-52 pt-28 sm:pb-72 sm:pt-36"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl pl-10 pr-6 sm:px-10 lg:px-16">
        <Reveal>
          <Eyebrow>Expeditions</Eyebrow>
          <h2 className="max-w-2xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">
            Work that moved the map.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {EXPEDITIONS.map((e, i) => (
            <Reveal key={e.title} delay={0.08 + i * 0.09} className="h-full">
              <TiltCard className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-line bg-paper-alt p-7 shadow-warm transition-shadow duration-500 ease-atlas hover:shadow-warm-lg">
                  <p className="self-start rounded-full border border-teal/40 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-teal">
                    {e.tag}
                  </p>
                  <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-ink">
                    {e.title}
                  </h3>
                  <p className="mt-1.5 font-display text-sm italic text-ink-soft">
                    {e.sub}
                  </p>
                  <div className="mt-6 flex grow flex-col gap-5 border-t border-dashed border-line pt-6">
                    <Block label="Problem">{e.problem}</Block>
                    <Block label="Approach">{e.approach}</Block>
                    <div className="mt-auto">
                      <Block label="Result" accent>
                        {e.result}
                      </Block>
                    </div>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>

      <Skyline city="newyork" />
    </section>
  );
}
