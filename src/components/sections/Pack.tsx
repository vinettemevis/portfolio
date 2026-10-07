import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Matter from "matter-js";
import { Reveal } from "@/components/motion";

const SKILLS = [
  "Discovery",
  "Roadmapping",
  "Experimentation",
  "Analytics",
  "Mixpanel",
  "Go-to-market",
  "Pricing & monetization",
  "AI & agentic products",
  "Prompt engineering",
  "Stakeholder alignment",
  "PRDs & specs",
  "SQL & instrumentation",
  "Quality instinct",
];

// Lava palette: [blob, text]
const LAVA = [
  ["#e2531f", "#fff8f0"],
  ["#f0a040", "#2a1c14"],
  ["#c2410c", "#fff8f0"],
  ["#f3c9a0", "#2a1c14"],
];

const POOL = 22; // height of the lava pool at the bottom, px

const pill =
  "select-none whitespace-nowrap rounded-full px-5 py-2.5 text-[15px] font-medium sm:px-6 sm:py-3 sm:text-base";

/**
 * Skills fall into a dark slab and pile up on a lava pool. Blobs live on a
 * goo-filtered layer so touching pills melt together like metaballs; the
 * text sits on a crisp layer above, synced to the same physics bodies.
 */
function LavaPit() {
  const pitRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLLIElement | null)[]>([]);
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [started, setStarted] = useState(false);

  // Drop the pills once the pit scrolls into view.
  useEffect(() => {
    const pit = pitRef.current;
    if (!pit) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setStarted(true), io.disconnect()),
      { threshold: 0.35 },
    );
    io.observe(pit);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const pit = pitRef.current;
    if (!started || !pit) return;
    const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint } = Matter;

    const engine = Engine.create({ gravity: { x: 0, y: 1 } });
    let W = pit.clientWidth;
    let H = pit.clientHeight;
    const T = 200; // wall thickness
    const wall = { isStatic: true, render: { visible: false } };
    const floor = Bodies.rectangle(W / 2, H - POOL / 2 + T / 2, W * 3, T, wall);
    const left = Bodies.rectangle(-T / 2, 0, T, H * 6, wall);
    const right = Bodies.rectangle(W + T / 2, 0, T, H * 6, wall);

    const els = textRefs.current.filter(Boolean) as HTMLLIElement[];
    const bodies = els.map((el, i) => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const x = w / 2 + Math.random() * Math.max(1, W - w);
      const y = -h - i * 55;
      return Bodies.rectangle(x, y, w, h, {
        chamfer: { radius: h / 2 },
        friction: 0.5,
        restitution: 0.2,
        angle: (Math.random() - 0.5) * 0.6,
      });
    });
    Composite.add(engine.world, [floor, left, right, ...bodies]);

    // Mouse drag. Matter's default touch handlers block page scroll across
    // the whole pit, so swap them for touch-drag that only starts on a pill.
    const mouse = Mouse.create(pit);
    const m = mouse as Matter.Mouse & {
      mousedown: (e: Event) => void;
      mousemove: (e: Event) => void;
      mouseup: (e: Event) => void;
      mousewheel: (e: Event) => void;
    };
    pit.removeEventListener("wheel", m.mousewheel);
    pit.removeEventListener("touchstart", m.mousedown);
    pit.removeEventListener("touchmove", m.mousemove);
    pit.removeEventListener("touchend", m.mouseup);
    let touching = false;
    const onTouchStart = (e: TouchEvent) => {
      touching = true;
      m.mousedown(e);
    };
    const onTouchMove = (e: TouchEvent) => touching && m.mousemove(e);
    const onRelease = (e: Event) => {
      touching = false;
      m.mouseup(e);
    };
    els.forEach((el) => el.addEventListener("touchstart", onTouchStart, { passive: false }));
    addEventListener("touchmove", onTouchMove, { passive: false });
    addEventListener("touchend", onRelease);
    addEventListener("mouseup", onRelease);
    Composite.add(
      engine.world,
      MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } }),
    );

    const onResize = () => {
      W = pit.clientWidth;
      H = pit.clientHeight;
      Body.setPosition(floor, { x: W / 2, y: H - POOL / 2 + T / 2 });
      Body.setPosition(right, { x: W + T / 2, y: 0 });
      bodies.forEach((b) => {
        if (b.position.x > W - 20) Body.setPosition(b, { x: W - 60, y: b.position.y });
      });
    };
    addEventListener("resize", onResize);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      Engine.update(engine, Math.min(32, now - last));
      last = now;
      bodies.forEach((b, i) => {
        // Tame hard flicks, and drop anything that escapes back in from the top.
        const v = b.velocity;
        const sp = Math.hypot(v.x, v.y);
        if (sp > 28) Body.setVelocity(b, { x: (v.x / sp) * 28, y: (v.y / sp) * 28 });
        if (b.position.y < -3 * H || b.position.x < -T || b.position.x > W + T) {
          Body.setPosition(b, { x: W / 2, y: -60 });
          Body.setVelocity(b, { x: 0, y: 0 });
        }
        const tf = `translate(${b.position.x - els[i].offsetWidth / 2}px, ${
          b.position.y - els[i].offsetHeight / 2
        }px) rotate(${b.angle}rad)`;
        els[i].style.transform = tf;
        const blob = blobRefs.current[i];
        if (blob) blob.style.transform = tf;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      els.forEach((el) => el.removeEventListener("touchstart", onTouchStart));
      removeEventListener("touchmove", onTouchMove);
      removeEventListener("touchend", onRelease);
      removeEventListener("mouseup", onRelease);
      removeEventListener("resize", onResize);
      Mouse.clearSourceEvents(mouse);
      Engine.clear(engine);
    };
  }, [started]);

  // Before the drop, park everything above the pit.
  const parked = { transform: "translate(0, -200px)" };

  return (
    <div
      ref={pitRef}
      className="relative h-[clamp(420px,62vh,560px)] overflow-hidden rounded-[36px] bg-[#241710]"
    >
      <svg aria-hidden className="absolute h-0 w-0">
        <filter id="lava-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" />
        </filter>
      </svg>

      {/* Goo layer: pill-shaped blobs + lava pool, fused by the filter. */}
      <div aria-hidden className="absolute inset-0 [filter:url(#lava-goo)]">
        <div
          className="absolute inset-x-0 bottom-0 bg-[#e2531f]"
          style={{ height: POOL }}
        />
        {SKILLS.map((s, i) => (
          <div
            key={s}
            ref={(el) => {
              blobRefs.current[i] = el;
            }}
            className={`${pill} absolute left-0 top-0 text-transparent`}
            style={{ background: LAVA[i % LAVA.length][0], ...(!started && parked) }}
          >
            {s}
          </div>
        ))}
      </div>

      {/* Crisp text layer, also the drag targets. */}
      <ul className="absolute inset-0">
        {SKILLS.map((s, i) => (
          <li
            key={s}
            ref={(el) => {
              textRefs.current[i] = el;
            }}
            className={`${pill} absolute left-0 top-0 cursor-grab touch-none active:cursor-grabbing`}
            style={{ color: LAVA[i % LAVA.length][1], ...(!started && parked) }}
          >
            {s}
          </li>
        ))}
      </ul>

      <p className="pointer-events-none absolute right-6 top-5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#d8c6b2]/70">
        Drag them around
      </p>
    </div>
  );
}

function StaticSkills() {
  return (
    <ul className="flex flex-wrap gap-2.5">
      {SKILLS.map((s, i) => (
        <li
          key={s}
          className={pill}
          style={{ background: LAVA[i % LAVA.length][0], color: LAVA[i % LAVA.length][1] }}
        >
          {s}
        </li>
      ))}
    </ul>
  );
}

export default function Pack() {
  const reduce = useReducedMotion();

  return (
    <section
      id="pack"
      className="bg-[#e8ddcf] px-[clamp(20px,5vw,64px)] py-[clamp(80px,12vw,160px)]"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-14">
        <Reveal className="flex flex-col gap-8">
          <div className="flex items-center gap-3 font-mono text-[13px] uppercase tracking-[0.08em] text-ink">
            <span className="text-[#c2410c]">06</span>
            <span className="h-px w-8 bg-ink" />
            Skills &amp; Tools
          </div>
          <h2 className="font-display text-[clamp(40px,5.5vw,76px)] font-normal leading-none tracking-[-0.015em] text-ink">
            The skills behind the work.
          </h2>
        </Reveal>

        {reduce ? <StaticSkills /> : <LavaPit />}
      </div>
    </section>
  );
}
