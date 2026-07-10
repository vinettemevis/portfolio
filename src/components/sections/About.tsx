import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";
import SectionShell from "@/components/SectionShell";
import { Reveal, RevealItem, SectionHeading } from "@/components/motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { t } from "@/lib/copy";

function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const format = (v: number) => `${prefix}${v.toFixed(decimals)}${suffix}`;
    if (!inView) {
      el.textContent = format(0);
      return;
    }
    if (reducedMotion) {
      el.textContent = format(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => {
        el.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [inView, value, decimals, prefix, suffix, reducedMotion]);

  return <span ref={ref} className="tabular-nums" />;
}

const STATS: Array<{
  value: number;
  label: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}> = [
  { value: 6, suffix: "+", label: t("about.stat1.label") },
  { value: 1.06, decimals: 2, prefix: "$", suffix: "M", label: t("about.stat2.label") },
  { value: 9, label: t("about.stat3.label") },
];

export default function About() {
  return (
    <SectionShell id="about" ariaLabel="About">
      <SectionHeading eyebrow={t("about.eyebrow")} title={t("about.title")} />

      <Reveal className="mt-8 max-w-3xl">
        <p className="text-lg leading-relaxed text-muted-foreground">
          {t("about.body")}
        </p>
      </Reveal>

      <Reveal stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {STATS.map((stat) => (
          <RevealItem
            key={stat.label}
            className="rounded-2xl border border-border bg-card/70 p-6 backdrop-blur-sm"
          >
            <div className="font-display text-4xl font-semibold text-[hsl(var(--accent))] sm:text-5xl">
              <CountUp
                value={stat.value}
                decimals={stat.decimals}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
          </RevealItem>
        ))}
      </Reveal>
    </SectionShell>
  );
}
