import { FileDown, Linkedin, Mail } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import GlobeAccent from "@/components/GlobeAccent";
import SectionShell from "@/components/SectionShell";
import { Reveal, RevealItem } from "@/components/motion";
import { accentify, t } from "@/lib/copy";

const LINKS = [
  {
    icon: Linkedin,
    label: "LinkedIn profile",
    href: "https://www.linkedin.com/in/vinette-sequeira/",
  },
  {
    icon: Mail,
    label: "Email Vinette",
    href: "mailto:vinette.vs@gmail.com",
  },
  {
    icon: FileDown,
    label: "Download resume",
    href: "/Vinette_Sequeira_PM.pdf",
  },
];

export default function Contact() {
  return (
    <SectionShell
      id="contact"
      ariaLabel="Contact"
      panelClassName="max-w-4xl text-center"
      overlay={
        <div
          className="pointer-events-none absolute -bottom-4 left-1/2 z-0 h-20 w-20 -translate-x-1/2 sm:-bottom-6 sm:h-36 sm:w-36 md:h-44 md:w-44"
          aria-hidden
        >
          <GlobeAccent placement="contact-corner" />
        </div>
      }
    >
      <Reveal stagger className="flex flex-col items-center">
        <RevealItem>
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-[hsl(var(--ocean))]">
            {t("contact.eyebrow")}
          </p>
        </RevealItem>
        <RevealItem>
          <h2 className="text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">
            {accentify(t("contact.headline"))}
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            {t("contact.subtext")}
          </p>
        </RevealItem>
        <RevealItem>
          <a
            href="mailto:vinette.vs@gmail.com"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-10 rounded-full"
            )}
          >
            <Mail className="h-4 w-4" aria-hidden />
            vinette.vs@gmail.com
          </a>
        </RevealItem>
        <RevealItem>
          <div className="mt-10 flex items-center justify-center gap-4">
            {LINKS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/70 text-muted-foreground transition-colors hover:border-accent/60 hover:text-accent"
              >
                <Icon className="h-5 w-5" aria-hidden />
              </a>
            ))}
          </div>
        </RevealItem>
      </Reveal>
    </SectionShell>
  );
}
