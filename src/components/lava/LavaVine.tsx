import { useEffect, useRef, type RefObject } from "react";

const COLOR = "#E2531F";
const S = 2; // draw at 1/2 size
const CX = 44; // vine x in CSS px, on the timeline rail

/**
 * Lava that drips down the timeline as you scroll. Each `[data-route-item]`
 * in `wrapRef` starts as a dark dot, turns into an orange blob when the lava
 * reaches it, and fades its job entry to full opacity.
 */
export function LavaVine({ wrapRef }: { wrapRef: RefObject<HTMLElement> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const [cr, cg, cb] = [1, 3, 5].map((i) => parseInt(COLOR.slice(i, i + 2), 16));
    let W = 0;
    let H = 0;
    let img: ImageData | null = null;
    let head = 0; // lava tip y, in canvas px
    const acts: number[] = []; // per item: 0 = dark dot, 1 = orange blob
    const t0 = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > innerHeight + 200) return; // offscreen
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
      // Tip chases a point 55% down the viewport.
      const target = Math.min(H - 6, Math.max(0, (innerHeight * 0.55 - rect.top) / S));
      head = reduce ? target : head + (target - head) * 0.08;
      ys.forEach((y, i) => {
        const on = head >= y - 2;
        acts[i] = reduce ? +on : (acts[i] ?? 0) + (+on - (acts[i] ?? 0)) * 0.1;
        items[i].style.opacity = on ? "1" : "0.4";
      });

      const cx = CX / S;
      const drip = reduce ? 0 : Math.sin(t * 1.6) * 0.5 + 0.5;
      const d = img.data;
      for (let j = 0; j < H; j++) {
        for (let i = 0; i < W; i++) {
          const dx = i - cx;
          let fa = 0; // orange field: stream + tip + drip + reached items
          let fi = 0; // dark field: items not reached yet
          const sy = j > head ? j - head : 0;
          fa += 9 / (dx * dx + sy * sy + 1e-3); // stream above the tip
          const hy = j - head;
          fa += 70 / (dx * dx + hy * hy + 1e-3); // tip
          const dy2 = j - (head + 6 + drip * 7);
          fa += 22 / (dx * dx + dy2 * dy2 + 1e-3); // drip under the tip
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
  }, [wrapRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 block h-full w-[88px]"
    />
  );
}
