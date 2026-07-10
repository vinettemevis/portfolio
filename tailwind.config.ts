import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "hsl(var(--paper) / <alpha-value>)",
        "paper-alt": "hsl(var(--paper-alt) / <alpha-value>)",
        ink: "hsl(var(--ink) / <alpha-value>)",
        "ink-soft": "hsl(var(--ink-soft) / <alpha-value>)",
        accent: "hsl(var(--accent) / <alpha-value>)",
        teal: "hsl(var(--teal) / <alpha-value>)",
        gold: "hsl(var(--gold) / <alpha-value>)",
        line: "hsl(var(--line) / <alpha-value>)",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "Cambria", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        warm: "0 2px 6px -2px hsl(26 28% 15% / 0.06), 0 14px 36px -14px hsl(26 28% 15% / 0.14)",
        "warm-lg":
          "0 4px 10px -4px hsl(26 28% 15% / 0.08), 0 24px 56px -20px hsl(26 28% 15% / 0.2)",
      },
      transitionTimingFunction: {
        atlas: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
