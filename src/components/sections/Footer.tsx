import { t } from "@/lib/copy";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 px-6 py-10 text-center">
      <p className="font-display text-lg">Vinette Sequeira</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {new Date().getFullYear()} · {t("footer.tagline")}
      </p>
    </footer>
  );
}
