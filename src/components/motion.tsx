import { motion, type Variants } from "framer-motion";
import type { PropsWithChildren } from "react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

type RevealProps = PropsWithChildren<{
  className?: string;
  /** Stagger direct children that are motion elements with the fadeUp variant. */
  stagger?: boolean;
  as?: "div" | "section" | "header" | "footer";
}>;

export function Reveal({ children, className, stagger = false }: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={stagger ? staggerParent : fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  className,
}: {
  eyebrow: string;
  title: string;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-[hsl(var(--ocean))]">
        {eyebrow}
      </p>
      <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
        {title}
      </h2>
    </Reveal>
  );
}
