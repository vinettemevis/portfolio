import GardenScene from "@/components/GardenScene";
import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import Traveler from "@/components/sections/Traveler";
import RouteSoFar from "@/components/sections/RouteSoFar";
import Expeditions from "@/components/sections/Expeditions";
import Pack from "@/components/sections/Pack";
import Contact from "@/components/sections/Contact";

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-clip text-ink">
      <div aria-hidden className="fixed inset-0 z-0">
        <GardenScene />
      </div>
      <main className="relative z-10">
        <Hero />
        <Story />
        <Traveler />
        <RouteSoFar />
        <Expeditions />
        <Pack />
        <Contact />
      </main>
      <footer className="relative z-10 border-t border-line bg-paper/85 py-6 text-center text-xs text-ink-soft backdrop-blur-sm">
        Vinette Sequeira · 2026 · Built in Bengaluru.
      </footer>
    </div>
  );
}
