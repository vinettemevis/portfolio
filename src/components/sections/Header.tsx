const LINKS = [
  { label: "Story", href: "#story" },
  { label: "Work", href: "#expeditions" },
  { label: "Route", href: "#route" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  return (
    <header className="relative z-10 flex flex-wrap items-center justify-between gap-6 px-6 py-7 font-mono text-[0.8rem] uppercase tracking-[0.04em] text-ink sm:px-10 lg:px-16">
      <a href="#hero" className="font-medium">
        Vinette Sequeira
      </a>
      <nav className="flex flex-wrap gap-7">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="text-ink-soft transition-colors duration-300 hover:text-ink">
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
