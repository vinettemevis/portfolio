import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { cn, EASE } from "@/lib/utils";

/** Fades and rises into place the first time it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Section label: "03 Where I've worked". */
export function Eyebrow({
  n,
  children,
  className,
}: {
  n: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 font-mono text-[13px] uppercase tracking-[0.08em] text-ink",
        className,
      )}
    >
      <span className="text-accent-ink">{String(n).padStart(2, "0")}</span>
      {children}
    </p>
  );
}

/** h1 whose words slide up one after another. Wrap a word in `*` to italicise it. */
export function SplitHeading({
  children,
  className,
  delay = 0,
}: {
  children: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = children.split(" ");
  return (
    <h1 className={className} aria-label={children.replace(/\*/g, "")}>
      {words.map((word, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className={cn("inline-block", word.startsWith("*") && "italic")}
            initial={reduce ? false : { y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: delay + i * 0.06, ease: EASE }}
          >
            {word.replace(/\*/g, "")}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </h1>
  );
}

/** Pulls its child up to 10px toward the cursor. Mouse only. */
export function Magnetic({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const spring = { stiffness: 260, damping: 18, mass: 0.4 };
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const pull = (d: number) => Math.max(-10, Math.min(10, d * 0.28));

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(pull(e.clientX - (r.left + r.width / 2)));
    y.set(pull(e.clientY - (r.top + r.height / 2)));
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="inline-block"
      style={reduce ? undefined : { x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}

/** Counts from 0 to `value` over 1.6s once visible. */
export function CountUp({
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
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) return setDisplay(value);
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1600);
      setDisplay(value * (1 - Math.pow(1 - t, 4))); // ease-out
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
