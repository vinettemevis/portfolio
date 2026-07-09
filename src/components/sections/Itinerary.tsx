import { MapPin } from "lucide-react";
import { Reveal, RevealItem, SectionHeading } from "@/components/motion";
import { t } from "@/lib/copy";

const STOPS: Array<{
  role: string;
  company: string;
  dates: string;
  outcome: string;
  current?: boolean;
}> = [
  {
    role: "Product Manager",
    company: "CallHub",
    dates: "Jan 2025 to Present",
    outcome: t("itinerary.stop1.outcome"),
    current: true,
  },
  {
    role: "Senior QA Engineer",
    company: "SpotDraft",
    dates: "Jun 2022 to Dec 2024",
    outcome: t("itinerary.stop2.outcome"),
  },
  {
    role: "Software Quality Engineer",
    company: "Kaleyra",
    dates: "Nov 2019 to Jun 2022",
    outcome: t("itinerary.stop3.outcome"),
  },
  {
    role: "Software Engineer, QA",
    company: "Wieland IT Solutions",
    dates: "May 2019 to Oct 2019",
    outcome: t("itinerary.stop4.outcome"),
  },
  {
    role: "Associate Software Engineer",
    company: "Teknotrait Solutions",
    dates: "Jul 2017 to May 2019",
    outcome: t("itinerary.stop5.outcome"),
  },
];

export default function Itinerary() {
  return (
    <section
      id="itinerary"
      aria-label="Career itinerary"
      className="mx-auto max-w-5xl px-6 py-28 sm:py-36"
    >
      <SectionHeading eyebrow={t("itinerary.eyebrow")} title={t("itinerary.title")} />

      <Reveal stagger className="relative mt-16">
        {/* route line */}
        <div
          aria-hidden
          className="absolute bottom-4 left-[15px] top-2 w-px bg-gradient-to-b from-[hsl(var(--primary))] via-[hsl(var(--border))] to-transparent"
        />
        <ol className="space-y-12">
          {STOPS.map((stop) => (
            <RevealItem key={`${stop.company}-${stop.dates}`}>
              <li className="relative flex gap-6 pl-0">
                <span
                  className={`relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                    stop.current
                      ? "border-primary/60 bg-primary/15 text-[hsl(var(--primary))]"
                      : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  <MapPin className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-xl font-semibold sm:text-2xl">
                      {stop.role}{" "}
                      <span className="text-[hsl(var(--ocean))]">
                        · {stop.company}
                      </span>
                    </h3>
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {stop.dates}
                    </span>
                  </div>
                  <p className="mt-2 max-w-2xl text-muted-foreground">
                    {stop.outcome}
                  </p>
                </div>
              </li>
            </RevealItem>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
