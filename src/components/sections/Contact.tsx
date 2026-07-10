import { FileDown, Linkedin, Mail } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Eyebrow, Magnetic, Reveal } from "@/components/motion";
import Skyline from "@/components/Skyline";
import { cn } from "@/lib/utils";

interface IconLink {
  label: string;
  href: string;
  icon: typeof Linkedin;
  external: boolean;
  download?: boolean;
}

const ICON_LINKS: IconLink[] = [
  {
    label: "LinkedIn profile",
    href: "https://www.linkedin.com/in/vinette-sequeira/",
    icon: Linkedin,
    external: true,
  },
  {
    label: "Email Vinette",
    href: "mailto:vinette.vs@gmail.com",
    icon: Mail,
    external: false,
  },
  {
    label: "Download resume",
    href: "/Vinette%20Sequeira%20PM.pdf",
    icon: FileDown,
    external: false,
    download: true,
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-paper pb-56 pt-28 sm:pb-80 sm:pt-40"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl pl-10 pr-6 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <div className="flex justify-center">
              <Eyebrow>Plan the Next Leg</Eyebrow>
            </div>
            <h2 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              The best products come from teams that{" "}
              <em className="font-display italic text-accent">
                travel well together
              </em>
              .
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 leading-relaxed text-ink-soft">
              Building AI products that pay for themselves. If that belongs on
              your roadmap, my inbox is open.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10 flex justify-center">
              <Magnetic>
                <a
                  href="mailto:vinette.vs@gmail.com"
                  className={cn(buttonVariants({ size: "lg" }))}
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
                    download={l.download}
                    {...(l.external
                      ? { target: "_blank", rel: "noreferrer noopener" }
                      : {})}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper-alt text-ink-soft transition-colors duration-300 ease-atlas hover:border-accent hover:text-accent"
                  >
                    <l.icon aria-hidden className="h-[18px] w-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      <Skyline city="singapore" variant="sunrise" />
    </section>
  );
}
