import { MotionConfig } from "framer-motion";
import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import About from "@/components/sections/About";
import Itinerary from "@/components/sections/Itinerary";
import Expeditions from "@/components/sections/Expeditions";
import Toolkit from "@/components/sections/Toolkit";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

/**
 * Every section owns its own city background (SectionShell) and, at most,
 * its own globe accent — there is no fixed full-viewport 3D layer anymore.
 * A failure in any one section's canvas can never affect another.
 */
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Hero />
      <main>
        <Story />
        <About />
        <Itinerary />
        <Expeditions />
        <Toolkit />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
