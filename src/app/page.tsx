import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import FeaturedProjects from "./components/FeaturedProjects";
import VideoShowcase from "./components/VideoShowcase";
import BrandPartners from "./components/BrandPartners";
<<<<<<< HEAD

export default function Home() {
=======
import { getProjects, getServices } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projectItems, services] = await Promise.all([
    getProjects(),
    getServices(),
  ]);
  const projects = projectItems.map((project) => ({
    ...project,
    category: project.category as
      | "Residential"
      | "Commercial"
      | "Hospitality"
      | "Institute"
      | "Luxury",
  }));
>>>>>>> origin/main
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <About />
<<<<<<< HEAD
        <Services />
        <FeaturedProjects />
        <BrandPartners />
        <VideoShowcase />
        <Projects />
        
=======
        <Services services={services} />
        <FeaturedProjects projects={projectItems} />
        <BrandPartners />
        <VideoShowcase />
        <Projects projectLimit={2} projects={projects} />
>>>>>>> origin/main
      </main>

      <Footer />
    </>
  );
}
