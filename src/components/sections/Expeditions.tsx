import { useEffect, useRef } from "react";
import { Reveal } from "@/components/motion";

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

const THEMES = [
  { bg: "#f6f0e7", ink: "#2a1c14", soft: "#6b5646", line: "#d9cab6", accent: "#c2410c" },
  { bg: "#241710", ink: "#efe7dc", soft: "#d8c6b2", line: "rgba(239,231,220,.22)", accent: "#f0a040" },
  { bg: "#f3c9a0", ink: "#2a1c14", soft: "#5a3a26", line: "rgba(42,28,20,.22)", accent: "#9a3412" },
];

const label =
  "m-0 font-mono text-xs font-medium uppercase tracking-[0.14em]";

/** Sticky stacked cards: each card pins, then shrinks and dims as the next one slides over it. */
function useCardStack(listRef: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = () =>
      [...(listRef.current?.querySelectorAll<HTMLElement>("[data-stack-card]") ?? [])];
    const narrow = () => innerWidth < 760 || innerHeight < 600;

    const fit = () =>
      cards().forEach((c, i) => {
        if (narrow()) {
          c.style.position = "relative";
          c.style.top = "0px";
          return;
        }
        c.style.position = "sticky";
        const base = 72 + i * 28;
        c.style.top =
          (c.offsetHeight + base > innerHeight ? innerHeight - c.offsetHeight - 24 : base) + "px";
      });

    const onScroll = () => {
      const cs = cards();
      cs.forEach((c, i) => {
        const next = cs[i + 1];
        if (reduce || narrow() || !next) {
          c.style.transform = "";
          c.style.filter = "";
          return;
        }
        const top = parseFloat(getComputedStyle(c).top) || 0;
        const p = Math.min(1, Math.max(0, 1 - (next.getBoundingClientRect().top - top) / c.offsetHeight));
        c.style.transform = `scale(${1 - p * 0.05})`;
        c.style.filter = `brightness(${1 - p * 0.12})`;
      });
    };
    const onResize = () => {
      fit();
      onScroll();
    };

    onResize();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
    };
  }, [listRef]);
}

export default function Expeditions() {
  const listRef = useRef<HTMLDivElement>(null);
  useCardStack(listRef);

  return (
    <section
      id="expeditions"
      className="px-[clamp(20px,5vw,64px)] py-[clamp(80px,12vw,160px)]"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-14">
        <Reveal className="flex flex-col gap-8">
          <div className="flex items-center gap-3 font-mono text-[13px] uppercase tracking-[0.08em] text-ink">
            <span className="text-[#c2410c]">05</span>
            <span className="h-px w-8 bg-ink" />
            Selected Work
          </div>
          <h2 className="font-display text-[clamp(40px,5.5vw,76px)] font-normal leading-none tracking-[-0.015em] text-ink">
            Work that moved the map.
          </h2>
        </Reveal>

        <div ref={listRef} className="flex flex-col gap-6 pb-[8vh]">
          {EXPEDITIONS.map((e, i) => {
            const th = THEMES[i % THEMES.length];
            return (
              <article
                key={e.title}
                data-stack-card
                className="sticky box-border grid min-h-[min(78vh,720px)] origin-top grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] content-start gap-[clamp(32px,5vw,72px)] rounded-[36px] border p-[clamp(28px,4vw,56px)] shadow-[0_-24px_60px_-40px_rgba(42,28,20,.45)] will-change-transform"
                style={{ top: 72 + i * 28, background: th.bg, color: th.ink, borderColor: th.line }}
              >
                <div className="flex flex-col gap-7">
                  <div
                    className="flex items-center gap-4 font-mono text-[13px] uppercase tracking-[0.1em]"
                    style={{ color: th.soft }}
                  >
                    <span>
                      {e.index} / {String(EXPEDITIONS.length).padStart(2, "0")}
                    </span>
                    <span className="h-px w-6" style={{ background: th.soft }} />
                    <span>{e.tag}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="font-display text-[clamp(44px,5vw,72px)] font-normal leading-[0.98] tracking-[-0.015em]">
                      {e.title}
                    </h3>
                    <p
                      className="font-display text-[clamp(20px,1.8vw,24px)] italic"
                      style={{ color: th.soft }}
                    >
                      {e.sub}
                    </p>
                  </div>
                  <div
                    className="mt-auto flex flex-col gap-2.5 border-t pt-6"
                    style={{ borderColor: th.line }}
                  >
                    <h4 className={label} style={{ color: th.accent }}>
                      Result
                    </h4>
                    <p className="font-display text-[clamp(26px,2.4vw,34px)] leading-[1.15] [text-wrap:pretty]">
                      {e.result}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-8 pt-2">
                  {(["Problem", "Approach"] as const).map((k) => (
                    <div key={k} className="flex flex-col gap-2.5">
                      <h4 className={label} style={{ color: th.soft }}>
                        {k}
                      </h4>
                      <p className="text-lg leading-relaxed [text-wrap:pretty]">
                        {k === "Problem" ? e.problem : e.approach}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
