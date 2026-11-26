import Hero from "@/src/components/sections/Hero";
import Marquee from "@/src/components/sections/Marquee";
import About from "@/src/components/sections/About";
import Portfolio from "@/src/components/sections/Portfolio";
import Services from "@/src/components/sections/Services";
import Process from "@/src/components/sections/Process";
import Manifesto from "@/src/components/sections/Manifesto";
import Contact from "@/src/components/sections/Contact";
import Footer from "@/src/components/layout/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Marquee />
        <About />
        <Portfolio />
        <Services />
        <Process />
        <Manifesto />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
