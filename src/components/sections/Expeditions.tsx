import { useRef, type PropsWithChildren } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SectionShell from "@/components/SectionShell";
import { Reveal, RevealItem, SectionHeading } from "@/components/motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { t } from "@/lib/copy";

const EXPEDITIONS = (["exp1", "exp2", "exp3"] as const).map((slug) => ({
  tag: t(`${slug}.tag`),
  name: t(`${slug}.name`),
  context: t(`${slug}.context`),
  problem: t(`${slug}.problem`),
  approach: t(`${slug}.approach`),
  result: t(`${slug}.result`),
}));

function TiltCard({ children }: PropsWithChildren) {
  const reducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [8, -8]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-8, 8]), {
    stiffness: 200,
    damping: 20,
  });

  const onMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const onMouseLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={
        reducedMotion
          ? undefined
          : { rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }
      }
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

function Leg({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(var(--ocean))]">
        {label}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

export default function Expeditions() {
  return (
    <SectionShell id="expeditions" ariaLabel="Featured work" panelClassName="max-w-4xl">
      <SectionHeading eyebrow={t("expeditions.eyebrow")} title={t("expeditions.title")} />

      <Reveal stagger className="mt-16 flex flex-col gap-6">
        {EXPEDITIONS.map((exp) => (
          <RevealItem key={exp.name} className="h-full">
            <TiltCard>
              <Card className="flex h-full flex-col transition-colors hover:border-primary/40 lg:flex-row">
                <CardHeader className="lg:w-[38%] lg:shrink-0">
                  <Badge variant="outline" className="mb-3 self-start">
                    {exp.tag}
                  </Badge>
                  <CardTitle>{exp.name}</CardTitle>
                  <CardDescription>{exp.context}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-5 lg:pt-6">
                  <Leg label="Problem" text={exp.problem} />
                  <Leg label="Approach" text={exp.approach} />
                  <div className="mt-auto rounded-xl border border-primary/25 bg-primary/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(var(--primary))]">
                      Result
                    </p>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-foreground">
                      {exp.result}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TiltCard>
          </RevealItem>
        ))}
      </Reveal>
    </SectionShell>
  );
}
