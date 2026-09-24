import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * A felted sunflower character, rooted in a garden bush, whose eyes
 * track the cursor. True to a hand-drawn flipbook, the gaze only ever
 * holds two poses — left and right — and a blink is what carries it
 * between them, so the snap never shows. The blink itself is
 * rate-limited: a fast mouse pass can request a new pose at any
 * moment, but a blink already in flight always finishes at its own
 * pace before the next one starts.
 */

const MIN_BLINK_GAP_MS = 850;
const IDLE_BLINK_MIN_MS = 3600;
const IDLE_BLINK_MAX_MS = 6800;
const BLINK_CLOSE_S = 0.11;
const BLINK_OPEN_S = 0.16;

const PETAL_COUNT = 15;

function FeltDefs() {
  return (
    <defs>
      <filter id="felt-fuzz" x="-30%" y="-30%" width="160%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves={2} seed={7} result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale={7} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="felt-fuzz-soft" x="-30%" y="-30%" width="160%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves={2} seed={3} result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale={4.5} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="ground-shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#233d1a" floodOpacity="0.28" />
      </filter>
      <radialGradient id="petalGrad" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#ffdd88" />
        <stop offset="55%" stopColor="#f2b52e" />
        <stop offset="100%" stopColor="#d99418" />
      </radialGradient>
      <radialGradient id="seedGrad" cx="38%" cy="32%" r="75%">
        <stop offset="0%" stopColor="#7a5334" />
        <stop offset="70%" stopColor="#573a22" />
        <stop offset="100%" stopColor="#3c2717" />
      </radialGradient>
      <linearGradient id="faceGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fbf1d9" />
        <stop offset="100%" stopColor="#f0dcae" />
      </linearGradient>
      <linearGradient id="stemGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#7fa855" />
        <stop offset="100%" stopColor="#537a34" />
      </linearGradient>
      <radialGradient id="bushGradBack" cx="35%" cy="25%" r="80%">
        <stop offset="0%" stopColor="#6f9c4c" />
        <stop offset="100%" stopColor="#4c7530" />
      </radialGradient>
      <radialGradient id="bushGradFront" cx="35%" cy="25%" r="80%">
        <stop offset="0%" stopColor="#5c8a3c" />
        <stop offset="100%" stopColor="#3d6226" />
      </radialGradient>
    </defs>
  );
}

function Petals() {
  const petals = Array.from({ length: PETAL_COUNT });
  return (
    <g filter="url(#felt-fuzz)">
      {petals.map((_, i) => (
        <g key={i} transform={`rotate(${(360 / PETAL_COUNT) * i})`}>
          <ellipse
            cx={132}
            cy={0}
            rx={50}
            ry={27}
            fill="url(#petalGrad)"
            stroke="#c17f14"
            strokeOpacity={0.35}
            strokeWidth={1.5}
          />
        </g>
      ))}
    </g>
  );
}

function SeedDisc() {
  const rings = [26, 46, 66, 84];
  const dots: { x: number; y: number }[] = [];
  rings.forEach((r, ringIdx) => {
    const count = 10 + ringIdx * 6;
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + ringIdx * 0.3;
      dots.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
    }
  });
  return (
    <g filter="url(#felt-fuzz-soft)">
      <circle r={96} fill="url(#seedGrad)" />
      <g fill="#2c1c10" opacity={0.55}>
        {dots.map((d, i) => (
          <ellipse key={i} cx={d.x} cy={d.y} rx={3.2} ry={2.4} />
        ))}
      </g>
    </g>
  );
}

function Pupil({ x, y }: { x: MotionValue<number>; y: MotionValue<number> }) {
  return (
    <motion.g style={{ x, y }}>
      <circle r={7.3} fill="#4a2f1c" />
      <circle cx={-2.2} cy={-2.2} r={1.8} fill="#fff" opacity={0.9} />
    </motion.g>
  );
}

function Bush() {
  return (
    <g>
      <g filter="url(#felt-fuzz)" opacity={0.95}>
        <ellipse cx={-92} cy={0} rx={66} ry={46} fill="url(#bushGradBack)" />
        <ellipse cx={92} cy={6} rx={70} ry={48} fill="url(#bushGradBack)" />
        <ellipse cx={0} cy={18} rx={80} ry={40} fill="url(#bushGradBack)" />
      </g>
      <g filter="url(#felt-fuzz)">
        <ellipse cx={-60} cy={22} rx={54} ry={34} fill="url(#bushGradFront)" />
        <ellipse cx={64} cy={26} rx={58} ry={36} fill="url(#bushGradFront)" />
        <ellipse cx={4} cy={34} rx={62} ry={30} fill="url(#bushGradFront)" />
      </g>
    </g>
  );
}

function Bud({ x, s = 1 }: { x: number; s?: number }) {
  return (
    <g transform={`translate(${x},0) scale(${s})`}>
      <path d="M0,0 C-6,-14 -4,-30 0,-42" fill="none" stroke="url(#stemGrad)" strokeWidth={4} strokeLinecap="round" />
      <g filter="url(#felt-fuzz-soft)" transform="translate(0,-44)">
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <ellipse key={a} cx={0} cy={-7} rx={5} ry={9} fill="url(#petalGrad)" transform={`rotate(${a})`} />
        ))}
        <circle r={6} fill="url(#seedGrad)" />
      </g>
    </g>
  );
}

export default function Sunflower({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  const pupilX = useMotionValue(0);
  const pupilY = useMotionValue(0);
  const lidScale = useMotionValue(0);

  const poseRef = useRef<"left" | "right" | null>(null);
  const blinkingRef = useRef(false);
  const lastBlinkRef = useRef(0);

  useEffect(() => {
    if (reduce) return;

    const runBlink = (toPose: "left" | "right") => {
      blinkingRef.current = true;
      lastBlinkRef.current = performance.now();
      animate(lidScale, 1, { duration: BLINK_CLOSE_S, ease: "easeIn" }).then(
        () => {
          poseRef.current = toPose;
          pupilX.set(toPose === "left" ? -8 : 8);
          animate(lidScale, 0, { duration: BLINK_OPEN_S, ease: "easeOut" }).then(
            () => {
              blinkingRef.current = false;
            },
          );
        },
      );
    };

    const onMove = (e: PointerEvent) => {
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.36;

      const dy = e.clientY - cy;
      pupilY.set(Math.max(-5, Math.min(5, dy * 0.02)));

      const desired = e.clientX < cx ? "left" : "right";
      if (
        desired !== poseRef.current &&
        !blinkingRef.current &&
        performance.now() - lastBlinkRef.current > MIN_BLINK_GAP_MS
      ) {
        runBlink(desired);
      }
    };

    let idleTimer = 0;
    const scheduleIdleBlink = () => {
      const wait =
        IDLE_BLINK_MIN_MS + Math.random() * (IDLE_BLINK_MAX_MS - IDLE_BLINK_MIN_MS);
      idleTimer = window.setTimeout(() => {
        if (
          !blinkingRef.current &&
          performance.now() - lastBlinkRef.current > MIN_BLINK_GAP_MS
        ) {
          runBlink(poseRef.current ?? "right");
        }
        scheduleIdleBlink();
      }, wait);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    scheduleIdleBlink();
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.clearTimeout(idleTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <svg
        viewBox="0 0 400 570"
        className="h-full w-full overflow-visible"
        role="img"
        aria-label="A felted sunflower character growing from a garden bush, eyes following the cursor"
      >
        <FeltDefs />

        <g transform="translate(20,25)" filter="url(#ground-shadow)">
          {/* stem, rising from the bush into the flower head */}
          <path
            d="M180,300 C176,340 184,380 180,420"
            fill="none"
            stroke="url(#stemGrad)"
            strokeWidth={12}
            strokeLinecap="round"
          />
          {/* leaves */}
          <path
            d="M180,360 C150,352 128,368 118,392 C148,396 170,384 180,360 Z"
            fill="url(#stemGrad)"
            filter="url(#felt-fuzz-soft)"
          />
          <path
            d="M180,395 C212,388 236,402 246,426 C214,432 190,418 180,395 Z"
            fill="url(#stemGrad)"
            filter="url(#felt-fuzz-soft)"
          />

          <g transform="translate(180,430)">
            <Bush />
            <Bud x={-108} s={0.65} />
            <Bud x={118} s={0.55} />
          </g>

          {/* flower head */}
          <g transform="translate(180,168)">
            <Petals />
            <SeedDisc />

            <ellipse cx={0} cy={10} rx={62} ry={50} fill="url(#faceGrad)" />

            <path d="M-46,-18 Q-34,-26 -22,-18" fill="none" stroke="#8a6a3f" strokeWidth={2.4} strokeLinecap="round" opacity={0.7} />
            <path d="M46,-18 Q34,-26 22,-18" fill="none" stroke="#8a6a3f" strokeWidth={2.4} strokeLinecap="round" opacity={0.7} />

            <ellipse cx={-38} cy={26} rx={11} ry={7} fill="#e98a6b" opacity={0.5} />
            <ellipse cx={38} cy={26} rx={11} ry={7} fill="#e98a6b" opacity={0.5} />

            {[-24, 24].map((ex) => (
              <g key={ex} transform={`translate(${ex},4)`}>
                <circle r={16} fill="#fffaf0" stroke="#e2cd9c" strokeWidth={1.5} />
                <Pupil x={pupilX} y={pupilY} />
                <motion.rect
                  x={-17}
                  y={-16}
                  width={34}
                  height={34}
                  fill="url(#faceGrad)"
                  style={{ scaleY: lidScale, originY: 0, originX: 0.5 }}
                />
              </g>
            ))}

            <path
              d="M-12,42 Q0,50 12,42"
              fill="none"
              stroke="#8a6a3f"
              strokeWidth={2.4}
              strokeLinecap="round"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
