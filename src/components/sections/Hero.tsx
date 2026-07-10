import { useRef, type PropsWithChildren } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, type ButtonProps } from "@/components/ui/button";
import GlobeAccent from "@/components/GlobeAccent";
import SectionShell from "@/components/SectionShell";
import { Reveal, RevealItem } from "@/components/motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { accentify, t } from "@/lib/copy";

function MagneticButton({
  children,
  onClick,
  ...props
}: PropsWithChildren<ButtonProps>) {
  const reducedMotion = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18 });
  const sy = useSpring(y, { stiffness: 260, damping: 18 });

  const onMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.25);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.25);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={wrapRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x: sx, y: sy }}
      whileHover={reducedMotion ? undefined : { scale: 1.03 }}
      className="inline-block"
    >
      <Button onClick={onClick} {...props}>
        {children}
      </Button>
    </motion.div>
  );
}

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function Hero() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <SectionShell
      as="header"
      id="top"
      panelClassName="text-center"
      overlay={
        <>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
            <motion.button
              type="button"
              aria-label="Scroll to the story section"
              onClick={() => scrollTo("story")}
              className="text-muted-foreground transition-colors hover:text-accent"
              animate={reducedMotion ? undefined : { y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="h-6 w-6" />
            </motion.button>
          </div>

          {/* small bright globe accent, parked bottom-right and partially
              off-canvas — a decoration, never the backdrop. SectionShell
              clips overflow, so this stays clear of any horizontal scroll
              even where it hangs off the edge on larger screens. */}
          <div
            className="pointer-events-none absolute -bottom-5 -right-5 z-0 h-24 w-24 sm:-bottom-8 sm:-right-8 sm:h-40 sm:w-40 md:h-52 md:w-52 lg:h-64 lg:w-64"
            aria-hidden
          >
            <GlobeAccent placement="hero-corner" />
          </div>
        </>
      }
    >
      <Reveal stagger className="relative mx-auto flex max-w-5xl flex-col items-center">
        <RevealItem>
          <Badge className="mb-8">
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary"
              aria-hidden
            />
            {t("hero.eyebrow")}
          </Badge>
        </RevealItem>

        <RevealItem>
          <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            {accentify(t("hero.headline"))}
          </h1>
        </RevealItem>

        <RevealItem>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground">
            {t("hero.subtext")}
          </p>
        </RevealItem>

        <RevealItem>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              size="lg"
              className="rounded-full"
              onClick={() => scrollTo("expeditions")}
            >
              {t("hero.cta.primary")}
            </MagneticButton>
            <MagneticButton
              size="lg"
              variant="ghost"
              className="rounded-full"
              onClick={() => scrollTo("contact")}
            >
              {t("hero.cta.secondary")}
            </MagneticButton>
          </div>
        </RevealItem>
      </Reveal>
    </SectionShell>
  );
}
