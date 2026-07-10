import FlightRoute from "@/components/FlightRoute";
import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import Traveler from "@/components/sections/Traveler";
import RouteSoFar from "@/components/sections/RouteSoFar";
import Expeditions from "@/components/sections/Expeditions";
import Pack from "@/components/sections/Pack";
import Contact from "@/components/sections/Contact";

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-paper text-ink">
      <FlightRoute marker="plane" />
      <main className="relative z-10">
        <Hero />
        <Story />
        <Traveler />
        <RouteSoFar />
        <Expeditions />
        <Pack />
        <Contact />
      </main>
      <footer className="relative z-10 border-t border-line bg-paper py-6 text-center text-xs text-ink-soft">
        Vinette Sequeira · 2026 · Charted from Bengaluru. Next stop still being
        drawn.
      </footer>
    </div>
  );
}
