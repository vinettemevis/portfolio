import { useEffect, useRef } from "react";

interface Blob {
  x: number;
  r: number;
  ph: number;
  per: number;
  wob: number;
  amp: number;
}

/**
 * Canvas metaball field (the "lava lamp" from the reference embed), ported
 * into React with proper effect cleanup. Renders at 1/5 resolution and
 * upscales via the canvas, matching the source snippet's perf budget.
 * Freezes on a single frame under prefers-reduced-motion.
 */
export function LavaBlobs({
  className,
  color = "#E2531F",
  count = 9,
  speed = 1.6,
}: {
  className?: string;
  color?: string;
  count?: number;
  speed?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0;
    let H = 0;
    let img: ImageData;
    let seed = 7;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };

    const blobs: Blob[] = [];
    for (let i = 0; i < count; i++) {
      blobs.push({
        x: 0.15 + rnd() * 0.7,
        r: 0.07 + rnd() * 0.09,
        ph: rnd() * 6.283,
        per: 26 + rnd() * 30,
        wob: rnd() * 6.283,
        amp: 0.03 + rnd() * 0.05,
      });
    }

    const size = () => {
      W = Math.max(1, Math.ceil(canvas.clientWidth / 5));
      H = Math.max(1, Math.ceil(canvas.clientHeight / 5));
      canvas.width = W;
      canvas.height = H;
      img = ctx.createImageData(W, H);
    };
    size();
    const observer = new ResizeObserver(size);
    observer.observe(canvas);

    const cr = parseInt(color.slice(1, 3), 16);
    const cg = parseInt(color.slice(3, 5), 16);
    const cb = parseInt(color.slice(5, 7), 16);
    const t0 = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const t = reduce ? 0 : ((now - t0) / 1000) * speed;
      const asp = W / H;
      const P = blobs.map((b) => {
        const a = (t * 6.283) / b.per + b.ph;
        return [
          (b.x + Math.sin(t * 0.23 + b.wob) * b.amp) * asp,
          0.5 - 0.558 * Math.cos(a),
          b.r * b.r,
          1 + 0.25 * Math.abs(Math.sin(a)),
        ] as const;
      });
      const d = img.data;
      for (let j = 0; j < H; j++) {
        const py = j / H;
        for (let i = 0; i < W; i++) {
          const px = i / H;
          let f = 0;
          for (const p of P) {
            const dx = px - p[0];
            const dy = (py - p[1]) / p[3];
            f += p[2] / (dx * dx + dy * dy + 1e-5);
          }
          const o = (j * W + i) * 4;
          const al = Math.min(1, Math.max(0, (f - 0.9) * 6));
          const core = Math.min(1, Math.max(0, (f - 1.2) / 3));
          const glow = Math.min(1, f * 0.35) * 0.22;
          d[o] = cr + (255 - cr) * core * 0.55;
          d[o + 1] = cg + (190 - cg) * core * 0.7;
          d[o + 2] = cb + (60 - cb) * core * 0.4;
          d[o + 3] = 255 * Math.max(al * 0.92, glow);
        }
      }
      ctx.putImageData(img, 0, 0);
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [color, count, speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
    />
  );
}
