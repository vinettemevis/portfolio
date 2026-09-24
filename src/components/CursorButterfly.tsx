import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, useState, type RefObject } from "react";

const MONARCH_ORANGE = "#e2670f";

function Wing({ mirror = false }: { mirror?: boolean }) {
  return (
    <g transform={mirror ? "scale(-1,1)" : undefined}>
      <motion.g
        style={{ originX: 0 }}
        animate={{ scaleX: [1, 0.55, 1] }}
        transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M3,-5 C16,-24 30,-38 46,-42 C58,-46 66,-38 63,-26
             C61,-16 52,-6 38,3 C25,11 10,10 3,3 Z"
          fill={MONARCH_ORANGE}
          stroke="#141414"
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <path
          d="M3,5 C14,10 24,20 26,32 C27,40 20,44 12,40
             C5,36 1,26 1,15 Z"
          fill={MONARCH_ORANGE}
          stroke="#141414"
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <circle cx={44} cy={-32} r={2.6} fill="#fbf7ec" />
        <circle cx={20} cy={30} r={2} fill="#fbf7ec" />
      </motion.g>
    </g>
  );
}

/**
 * A monarch that stands in for the mouse cursor inside `containerRef`,
 * fluttering as it follows a spring toward the pointer. Hidden on
 * touch input (nothing to replace) and under reduced motion. Opacity
 * is driven as a MotionValue (not React state) so it animates through
 * framer-motion's own render pipeline rather than a plain re-render.
 */
export default function CursorButterfly({
  containerRef,
}: {
  containerRef: RefObject<HTMLElement>;
}) {
  const reduce = useReducedMotion();
  const [coarse, setCoarse] = useState(true);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 300, damping: 22, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 300, damping: 22, mass: 0.5 });
  const opacity = useMotionValue(0);

  useEffect(() => {
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || coarse || reduce) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
      animate(opacity, 1, { duration: 0.15 });
    };
    const onLeave = () => animate(opacity, 0, { duration: 0.2 });

    el.style.cursor = "none";
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.style.cursor = "";
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [containerRef, coarse, reduce, x, y, opacity]);

  if (coarse || reduce) return null;

  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 160 110"
      className="pointer-events-none absolute left-0 top-0 z-30 h-11 w-11 overflow-visible -translate-x-1/2 -translate-y-1/2"
      style={{ x: sx, y: sy, opacity }}
    >
      <g transform="translate(80,55)">
        <Wing />
        <Wing mirror />
        <ellipse cx={0} cy={0} rx={2.6} ry={12} fill="#141414" />
      </g>
    </motion.svg>
  );
}
