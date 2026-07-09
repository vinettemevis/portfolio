import { MotionConfig, motion, useScroll, useTransform } from "framer-motion";
import Globe from "@/components/Globe";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Itinerary from "@/components/sections/Itinerary";
import Expeditions from "@/components/sections/Expeditions";
import Toolkit from "@/components/sections/Toolkit";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/hooks";

export default function App() {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const { scrollY } = useScroll();

  // gentle dim past the hero; the journey choreography handles globe
  // placement/scale, so the globe never needs to fade far to stay legible
  const globeOpacity = useTransform(
    scrollY,
    [0, 700],
    [isMobile ? 0.8 : 1, isMobile ? 0.55 : 0.85]
  );

  return (
    <MotionConfig reducedMotion="user">
      {/* fixed 3D backdrop; content scrolls over it */}
      <div aria-hidden className="sunrise-glow fixed inset-0 z-0" />
      <motion.div
        className="fixed inset-0 z-0"
        style={
          reducedMotion
            ? { opacity: isMobile ? 0.65 : 0.9 }
            : { opacity: globeOpacity }
        }
      >
        <Globe />
      </motion.div>

      <div className="relative z-10">
        <Hero />
        <main>
          <About />
          <Itinerary />
          <Expeditions />
          <Toolkit />
          <Contact />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
