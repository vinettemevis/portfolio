import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { EASE } from "@/lib/utils";

// Same order as the page.
const LINKS = [
  { label: "Story", href: "#story" },
  { label: "Route", href: "#experience" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

/** Id of the section currently in the upper third of the screen. */
function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-30% 0px -65% 0px" },
    );
    document.querySelectorAll("main > section[id]").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  return active;
}

export default function Header() {
  const active = useActiveSection();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  // While the mobile menu is open: freeze page scroll, close on Escape.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 font-mono text-[0.8rem] uppercase tracking-[0.06em] text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>

      <div className="relative z-10 box-content flex h-14 items-center justify-between border-b border-ink/10 bg-paper/85 px-5 backdrop-blur-md pt-[env(safe-area-inset-top)] sm:px-10 md:h-16 lg:px-16">
        <a href="#hero" onClick={() => setOpen(false)} className="flex items-center gap-2.5 py-2 font-medium">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-accent" />
          Vinette Sequeira
        </a>

        {/* Desktop: inline links, dark pill on the current section. */}
        <nav aria-label="Sections" className="-mr-3 hidden md:flex">
          {LINKS.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={isActive ? "location" : undefined}
                className={`relative rounded-full px-3.5 py-2.5 transition-colors duration-300 ${
                  isActive ? "text-paper" : "text-ink-soft hover:text-ink"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-full bg-ink"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {l.label}
              </a>
            );
          })}
        </nav>

        {/* Mobile: menu toggle. */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
          className="-mr-2 flex h-11 items-center gap-2.5 rounded-full px-3 uppercase md:hidden"
        >
          {open ? "Close" : "Menu"}
          <span aria-hidden className="relative h-2.5 w-4">
            <span
              className={`absolute left-0 h-px w-4 bg-ink transition-transform duration-300 ease-atlas ${
                open ? "top-1/2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 h-px w-4 bg-ink transition-transform duration-300 ease-atlas ${
                open ? "top-1/2 -rotate-45" : "bottom-0"
              }`}
            />
          </span>
        </button>

        <motion.div
          aria-hidden
          className="absolute inset-x-0 -bottom-px h-[2px] origin-left bg-accent"
          style={{ scaleX: progress }}
        />
      </div>

      {/* Mobile: full-screen menu, big serif links. */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Sections"
            className="fixed inset-0 flex flex-col justify-between bg-paper px-5 pb-10 pt-[calc(env(safe-area-inset-top)+5.5rem)] md:hidden"
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <ol className="flex flex-col">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  className="border-b border-ink/15"
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.05, ease: EASE }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={active === l.href.slice(1) ? "location" : undefined}
                    className="flex items-baseline gap-4 py-4 font-display text-[2.6rem] normal-case leading-none tracking-tight aria-[current]:italic aria-[current]:text-accent-ink"
                  >
                    <span className="font-mono text-xs text-accent-ink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ol>
            <a href="mailto:vinette.vs@gmail.com" className="py-2 text-ink-soft">
              vinette.vs@gmail.com
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
