import { useEffect, useRef, type RefObject } from "react";

const S = 2; // canvas downscale
const CX = 44; // vine x-position in CSS px, matches the rail line

/**
 * Metaball lava-vine for the "Where I've worked" rail. The head follows a
 * point 55% down the viewport; each `[data-route-item]` inside `wrapRef`
 * gets a dark marker that swells into an orange blob (and the item fades
 * to full opacity) once the head reaches it.
 */
export function RouteBlobs({
  wrapRef,
  color = "#E2531F",
}: {
  wrapRef: RefObject<HTMLElement>;
  color?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const [cr, cg, cb] = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16));
    let W = 0;
    let H = 0;
    let img: ImageData | null = null;
    let head = 0;
    const acts: number[] = [];
    const t0 = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > innerHeight + 200) return;
      const cw = Math.ceil(c.clientWidth / S);
      const ch = Math.ceil(c.clientHeight / S);
      if (cw < 2 || ch < 2) return;
      if (cw !== W || ch !== H || !img) {
        W = c.width = cw;
        H = c.height = ch;
        img = ctx.createImageData(W, H);
      }

      const t = (now - t0) / 1000;
      const items = [...wrap.querySelectorAll<HTMLElement>("[data-route-item]")];
      const ys = items.map((li) => (li.offsetTop + 34) / S);
      const target = Math.min(H - 6, Math.max(0, (innerHeight * 0.55 - rect.top) / S));
      head = reduce ? target : head + (target - head) * 0.08;
      ys.forEach((y, i) => {
        const on = head >= y - 2;
        acts[i] = acts[i] ?? 0;
        acts[i] = reduce ? +on : acts[i] + (+on - acts[i]) * 0.1;
        items[i].style.opacity = on ? "1" : "0.4";
      });

      const cx = CX / S;
      const drip = reduce ? 0 : Math.sin(t * 1.6) * 0.5 + 0.5;
      const d = img.data;
      for (let j = 0; j < H; j++) {
        for (let i = 0; i < W; i++) {
          const dx = i - cx;
          let fa = 0;
          let fi = 0;
          const sy = j > head ? j - head : 0;
          fa += 9 / (dx * dx + sy * sy + 1e-3);
          const hy = j - head;
          fa += 70 / (dx * dx + hy * hy + 1e-3);
          const dy2 = j - (head + 6 + drip * 7);
          fa += 22 / (dx * dx + dy2 * dy2 + 1e-3);
          for (let k = 0; k < ys.length; k++) {
            const ny = j - ys[k];
            const dd = dx * dx + ny * ny + 1e-3;
            const a = acts[k];
            const r = 5 + 8 * a;
            fa += (r * r * a) / dd;
            fi += (16 * (1 - a)) / dd;
          }
          const o = (j * W + i) * 4;
          const al = Math.min(1, Math.max(0, (fa - 1) * 4));
          const core = Math.min(1, Math.max(0, (fa - 1.6) / 4));
          if (al > 0.02) {
            d[o] = cr + (255 - cr) * core * 0.55;
            d[o + 1] = cg + (190 - cg) * core * 0.7;
            d[o + 2] = cb + (60 - cb) * core * 0.4;
            d[o + 3] = 255 * al;
          } else {
            d[o] = 42;
            d[o + 1] = 28;
            d[o + 2] = 20;
            d[o + 3] = 255 * Math.min(1, Math.max(0, (fi - 1) * 4));
          }
        }
      }
      ctx.putImageData(img, 0, 0);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [wrapRef, color]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 block h-full w-[88px]"
    />
  );
}
