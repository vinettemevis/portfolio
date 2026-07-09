import {
  BarChart3,
  Bot,
  Coins,
  Compass,
  Database,
  FileText,
  FlaskConical,
  Map,
  Rocket,
  ShieldCheck,
  Users,
  Wand2,
} from "lucide-react";
import { Reveal, RevealItem, SectionHeading } from "@/components/motion";
import { t } from "@/lib/copy";

const TOOLS = [
  { icon: Compass, label: "Discovery" },
  { icon: Map, label: "Roadmapping" },
  { icon: FlaskConical, label: "Experimentation" },
  { icon: BarChart3, label: "Analytics · Mixpanel" },
  { icon: Rocket, label: "Go-to-market" },
  { icon: Coins, label: "Pricing & monetization" },
  { icon: Bot, label: "AI & agentic products" },
  { icon: Wand2, label: "Prompt engineering" },
  { icon: Users, label: "Stakeholder alignment" },
  { icon: FileText, label: "PRDs & specs" },
  { icon: Database, label: "SQL & instrumentation" },
  { icon: ShieldCheck, label: "Quality instinct" },
];

export default function Toolkit() {
  return (
    <section
      id="toolkit"
      aria-label="Skills and toolkit"
      className="mx-auto max-w-5xl px-6 py-28 sm:py-36"
    >
      <SectionHeading eyebrow={t("toolkit.eyebrow")} title={t("toolkit.title")} />

      <Reveal stagger className="mt-14 flex flex-wrap gap-3">
        {TOOLS.map(({ icon: Icon, label }) => (
          <RevealItem key={label}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-sm text-foreground backdrop-blur-sm transition-colors hover:border-[hsl(var(--ocean))]/60 hover:text-[hsl(var(--ocean))]">
              <Icon className="h-4 w-4 text-[hsl(var(--accent))]" aria-hidden />
              {label}
            </span>
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}
