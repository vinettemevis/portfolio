import { useRef, type PropsWithChildren } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, type ButtonProps } from "@/components/ui/button";
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
    <header
      id="top"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      {/* radial scrim so hero copy stays readable over the brighter dawn globe */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 58% at 50% 48%, hsl(var(--background) / 0.8), hsl(var(--background) / 0.35) 55%, transparent 75%)",
        }}
      />

      <Reveal stagger className="relative flex max-w-5xl flex-col items-center">
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

      <motion.button
        type="button"
        aria-label="Scroll to about section"
        onClick={() => scrollTo("about")}
        className="absolute bottom-8 text-muted-foreground transition-colors hover:text-accent"
        animate={reducedMotion ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-6 w-6" />
      </motion.button>
    </header>
  );
}
