import { FileDown, Linkedin, Mail } from "lucide-react";
import { button } from "@/components/button";
import { Eyebrow, Magnetic, Reveal } from "@/components/motion";
import { GlowBlob } from "@/components/lava/GlowBlob";

const ICON_LINKS = [
  {
    label: "LinkedIn profile",
    href: "https://www.linkedin.com/in/vinette-sequeira/",
    icon: Linkedin,
  },
  {
    label: "Email Vinette",
    href: "mailto:vinette.vs@gmail.com",
    icon: Mail,
  },
  {
    label: "Download resume",
    href: "/Vinette%20Sequeira%20PM.pdf",
    icon: FileDown,
    download: true,
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-28 sm:py-40"
    >
      <GlowBlob className="left-1/2 top-10 -translate-x-1/2 opacity-50" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <div className="flex justify-center">
              <Eyebrow n={6} className="mb-6">Plan the Next Leg</Eyebrow>
            </div>
            <h2 className="font-display text-4xl leading-[1.1] tracking-tight text-ink sm:text-5xl">
              The best products come from teams that{" "}
              <em className="inline-block pb-1 italic text-accent">
                travel well together
              </em>
              .
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-[1.05rem] leading-relaxed text-ink-soft">
              Building AI products that pay for themselves. If that belongs
              on your roadmap, my inbox is open.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10 flex justify-center">
              <Magnetic>
                <a
                  href="mailto:vinette.vs@gmail.com"
                  className={button.solid}
                >
                  vinette.vs@gmail.com
                </a>
              </Magnetic>
            </div>
            <ul className="mt-8 flex justify-center gap-3">
              {ICON_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    aria-label={l.label}
                    download={"download" in l}
                    {...(l.href.startsWith("http") && {
                      target: "_blank",
                      rel: "noreferrer noopener",
                    })}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-paper-alt text-ink-soft transition-colors duration-300 ease-atlas hover:border-accent hover:text-accent"
                  >
                    <l.icon aria-hidden className="h-[18px] w-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
