import Header from "@/components/Header";
import Hero from "@/sections/Hero";
import Story from "@/sections/Story";
import Intro from "@/sections/Intro";
import Experience from "@/sections/Experience";
import Work from "@/sections/Work";
import Skills from "@/sections/Skills";
import Contact from "@/sections/Contact";

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-paper text-ink">
      <Header />
      <main id="main" className="relative z-10">
        <Hero />
        <Story />
        <Intro />
        <Experience />
        <Work />
        <Skills />
        <Contact />
      </main>
      <footer className="relative z-10 border-t border-ink/20 py-8 text-center font-mono text-xs uppercase tracking-[0.1em] text-ink-faint">
        <p>Vinette Sequeira · 2026</p>
        <p className="mt-1.5">
          Built in Bengaluru. Currently looking for my next PM role.
        </p>
      </footer>
    </div>
  );
}
