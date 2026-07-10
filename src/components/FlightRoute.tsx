import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A single continuous airline-route line running down the whole page.
 * A plane (or bird) marker travels along it driven by scroll progress;
 * a dashed accent trail fills in behind it. Waypoint "passport
 * stamps" mark each section.
 */

type Marker = "plane" | "bird";

interface Stop {
  id: string;
  code: string;
  name: string;
  /** horizontal wander as a fraction of viewport width (desktop) */
  xf: number;
  /** vertical anchor as a fraction of the section's height */
  yf: number;
}

const STOPS: Stop[] = [
  { id: "hero", code: "BLR", name: "Bengaluru", xf: 0.06, yf: 0.38 },
  { id: "story", code: "ENR", name: "En route", xf: 0.11, yf: 0.5 },
  { id: "traveler", code: "TYO", name: "Tokyo", xf: 0.06, yf: 0.42 },
  { id: "route", code: "BLR", name: "Bengaluru", xf: 0.21, yf: 0.3 },
  { id: "expeditions", code: "NYC", name: "New York", xf: 0.055, yf: 0.35 },
  { id: "pack", code: "LON", name: "London", xf: 0.11, yf: 0.45 },
  { id: "contact", code: "SIN", name: "Singapore", xf: 0.08, yf: 0.42 },
];

interface Point extends Stop {
  x: number;
  y: number;
}

interface Geometry {
  w: number;
  h: number;
  d: string;
  pts: Point[];
}

function buildPath(pts: Point[]): string {
  if (pts.length === 0) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const dy = (b.y - a.y) / 2;
    d += ` C ${a.x} ${a.y + dy}, ${b.x} ${b.y - dy}, ${b.x} ${b.y}`;
  }
  return d;
}

export default function FlightRoute({ marker = "plane" }: { marker?: Marker }) {
  const reduce = useReducedMotion();
  const [geom, setGeom] = useState<Geometry | null>(null);
  const [active, setActive] = useState(0);

  const pathRef = useRef<SVGPathElement>(null);
  const maskRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const measureRaf = useRef(0);

  /* ── Geometry: waypoints from live section positions ─────────── */

  const measure = useCallback(() => {
    cancelAnimationFrame(measureRaf.current);
    measureRaf.current = requestAnimationFrame(() => {
      const w = window.innerWidth;
      const mobile = w < 768;
      const pts: Point[] = [];
      for (const stop of STOPS) {
        const el = document.getElementById(stop.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const x = mobile
          ? 16 + (stop.xf > 0.12 ? 10 : 0)
          : Math.min(330, Math.max(48, w * stop.xf));
        pts.push({ ...stop, x, y: r.top + window.scrollY + r.height * stop.yf });
      }
      if (pts.length < 2) return;
      const h = document.documentElement.scrollHeight;
      setGeom((prev) => {
        const d = buildPath(pts);
        if (prev && prev.d === d && prev.w === w && prev.h === h) return prev;
        return { w, h, d, pts };
      });
    });
  }, []);

  useEffect(() => {
    measure();
    // Re-measure once fonts settle, and on any layout change.
    const t = window.setTimeout(measure, 500);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    return () => {
      window.clearTimeout(t);
      ro.disconnect();
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(measureRaf.current);
    };
  }, [measure]);

  /* ── Active waypoint from scroll position ────────────────────── */

  useEffect(() => {
    if (!geom) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.scrollY + window.innerHeight * 0.5;
      let idx = 0;
      for (let i = 0; i < geom.pts.length; i++) {
        if (geom.pts[i].y <= mid) idx = i;
      }
      setActive((prev) => (prev === idx ? prev : idx));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [geom]);

  /* ── Reduced motion: full static route, plane parked at the
        section in view ───────────────────────────────────────────── */

  useEffect(() => {
    const path = pathRef.current;
    const mask = maskRef.current;
    const plane = planeRef.current;
    if (!reduce || !geom || !path || !mask || !plane) return;

    const L = path.getTotalLength();
    if (!L) return;
    mask.setAttribute("stroke-dasharray", String(L));
    mask.setAttribute("stroke-dashoffset", "0");

    const first = geom.pts[0].y;
    const last = geom.pts[geom.pts.length - 1].y;
    const target = geom.pts[Math.min(active, geom.pts.length - 1)];
    const p = last > first ? (target.y - first) / (last - first) : 0;
    const pt = path.getPointAtLength(Math.max(0.1, Math.min(L - 0.1, p * L)));
    plane.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(90)`);
  }, [geom, reduce, active]);

  /* ── Marker + trail driven by scroll progress ────────────────── */

  useEffect(() => {
    const path = pathRef.current;
    const mask = maskRef.current;
    const plane = planeRef.current;
    if (reduce || !geom || !path || !mask || !plane) return;

    const L = path.getTotalLength();
    if (!L) return;
    mask.setAttribute("stroke-dasharray", String(L));

    const setAt = (p: number) => {
      const len = Math.max(0.1, Math.min(L - 0.1, p * L));
      const ahead = path.getPointAtLength(Math.min(L, len + 12));
      const behind = path.getPointAtLength(Math.max(0, len - 12));
      const pt = path.getPointAtLength(len);
      const angle =
        (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
      plane.setAttribute(
        "transform",
        `translate(${pt.x} ${pt.y}) rotate(${angle})`,
      );
      mask.setAttribute("stroke-dashoffset", String(L * (1 - p)));
    };

    const targetProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    let smooth = targetProgress();
    let raf = 0;
    const tick = () => {
      const t = targetProgress();
      smooth += (t - smooth) * 0.11;
      if (Math.abs(t - smooth) < 0.0004) {
        smooth = t;
        setAt(smooth);
        raf = 0;
        return;
      }
      setAt(smooth);
      raf = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    setAt(smooth);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [geom, reduce]);

  if (!geom) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
    >
      <svg
        className="absolute left-0 top-0"
        width={geom.w}
        height={geom.h}
        viewBox={`0 0 ${geom.w} ${geom.h}`}
        fill="none"
      >
        <defs>
          <mask id="route-trail-mask" maskUnits="userSpaceOnUse">
            <path
              ref={maskRef}
              d={geom.d}
              stroke="#fff"
              strokeWidth={8}
              strokeLinecap="round"
              fill="none"
            />
          </mask>
        </defs>

        {/* Full route, faint — the legs still to fly */}
        <path
          ref={pathRef}
          d={geom.d}
          stroke="hsl(var(--accent))"
          strokeOpacity={0.22}
          strokeWidth={1.6}
          strokeDasharray="2 9"
          strokeLinecap="round"
        />

        {/* Flown trail, revealed behind the marker */}
        <g mask="url(#route-trail-mask)">
          <path
            d={geom.d}
            stroke="hsl(var(--accent))"
            strokeOpacity={0.62}
            strokeWidth={2}
            strokeDasharray="3 9"
            strokeLinecap="round"
          />
        </g>

        {/* Waypoint passport stamps */}
        {geom.pts.map((pt, i) => {
          const isActive = i === active;
          return (
            <g key={`${pt.id}-${i}`} transform={`translate(${pt.x} ${pt.y})`}>
              <circle
                r={4.5}
                fill="hsl(var(--paper))"
                stroke={isActive ? "hsl(var(--accent))" : "hsl(var(--teal))"}
                strokeWidth={isActive ? 2.4 : 1.6}
                style={{ transition: "stroke 0.4s" }}
              />
              <circle
                r={isActive ? 13 : 10}
                fill="none"
                stroke={isActive ? "hsl(var(--accent))" : "hsl(var(--line))"}
                strokeWidth={1.2}
                strokeDasharray="2.5 3.5"
                opacity={isActive ? 0.95 : 0.7}
                style={{ transition: "r 0.4s, stroke 0.4s" }}
              />
              <g transform="rotate(-7)" opacity={isActive ? 1 : 0.66}>
                <text className="route-code" x={20} y={-1}>
                  {pt.code}
                </text>
                <text className="route-name" x={20} y={13}>
                  {pt.name}
                </text>
              </g>
            </g>
          );
        })}

        {/* Travelling marker */}
        <g ref={planeRef}>
          <circle r={14} fill="hsl(var(--accent))" opacity={0.1} />
          {marker === "plane" ? (
            <g>
              <path
                d="M15 0 L-9 -8 L-4.5 0 L-9 8 Z"
                fill="hsl(var(--accent))"
              />
              <path
                d="M15 0 L-4.5 0"
                stroke="hsl(var(--paper))"
                strokeWidth={1.1}
              />
            </g>
          ) : (
            <g>
              <path
                d="M10 0 Q0 -3 -8 -1 Q-12 0 -8 1 Q0 3 10 0 Z"
                fill="hsl(var(--accent))"
              />
              <path
                className="bird-wing"
                d="M0 0 Q-2 -9 -9 -12 Q-1 -12 3 -4 Z"
                fill="hsl(var(--accent))"
              />
              <path
                className="bird-wing"
                d="M0 0 Q-2 9 -9 12 Q-1 12 3 4 Z"
                fill="hsl(var(--accent))"
                opacity={0.55}
              />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
