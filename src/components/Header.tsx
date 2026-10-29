import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

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
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-paper/80 font-mono text-[0.8rem] uppercase tracking-[0.04em] text-ink backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-0 px-6 py-1.5 sm:px-10 lg:px-16">
        <a href="#hero" className="py-2 font-medium">
          Vinette Sequeira
        </a>
        <nav aria-label="Sections" className="-mx-3 flex flex-wrap">
          {LINKS.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={isActive ? "location" : undefined}
                className={`relative rounded-full px-3 py-3 transition-colors duration-300 ${
                  isActive ? "text-paper" : "text-ink-soft hover:text-ink"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-full bg-ink"
                    transition={
                      reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }
                    }
                  />
                )}
                {l.label}
              </a>
            );
          })}
        </nav>
      </div>
      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-[-1px] h-[2px] origin-left bg-accent"
        style={{ scaleX: progress }}
      />
    </header>
  );
}
