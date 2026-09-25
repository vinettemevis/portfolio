import { Eyebrow, Reveal } from "@/components/motion";
import { Blob } from "@/components/Blob";

interface Expedition {
  index: string;
  tag: string;
  title: string;
  sub: string;
  problem: string;
  approach: string;
  result: string;
}

const EXPEDITIONS: Expedition[] = [
  {
    index: "01",
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
    index: "02",
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
    index: "03",
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

function Field({ label, children }: { label: string; children: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h4 className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink-faint">
        {label}
      </h4>
      <p className="text-[0.95rem] leading-relaxed text-ink-soft">
        {children}
      </p>
    </div>
  );
}

export default function Expeditions() {
  return (
    <section id="expeditions" className="relative overflow-hidden py-28 sm:py-36">
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-16">
        <Reveal>
          <Eyebrow>Expeditions</Eyebrow>
          <h2 className="max-w-2xl font-display text-4xl leading-[1.08] tracking-tight text-ink sm:text-5xl">
            Work that moved the map.
          </h2>
        </Reveal>

        <div className="mt-16 flex flex-col">
          {EXPEDITIONS.map((e, i) => (
            <Reveal key={e.title} delay={0.08 + i * 0.06}>
              <article className="grid grid-cols-1 gap-10 border-t border-ink/20 py-14 md:grid-cols-[140px_minmax(0,1fr)] lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-14">
                <div className="relative h-[120px]">
                  <Blob className="-left-6 -top-4 opacity-70" size={180} />
                  <span className="relative font-display text-7xl italic leading-none text-ink lg:text-8xl">
                    {e.index}
                  </span>
                </div>

                <div className="flex flex-col gap-7 md:col-span-2 lg:col-span-1">
                  <div>
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink-faint">
                      {e.tag}
                    </p>
                    <h3 className="mt-3 font-display text-3xl leading-[1.05] tracking-tight text-ink sm:text-4xl">
                      {e.title}
                    </h3>
                    <p className="mt-1.5 font-display text-lg italic text-ink-soft">
                      {e.sub}
                    </p>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-3">
                    <Field label="Problem">{e.problem}</Field>
                    <Field label="Approach">{e.approach}</Field>
                    <Field label="Result">{e.result}</Field>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
