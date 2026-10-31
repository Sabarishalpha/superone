"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export default function SmoothMotion() {
  const pathname = usePathname();

  useEffect(() => {
<<<<<<< HEAD
=======
    if (pathname.startsWith("/admin")) return;

>>>>>>> origin/main
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const lenis = new Lenis({
      anchors: true,
      autoRaf: true,
      smoothWheel: true,
    });
<<<<<<< HEAD
    let setupFrame = 0;
=======
    let setupTimeout = 0;
>>>>>>> origin/main
    const observers: IntersectionObserver[] = [];

    let sectionAnimations: gsap.core.Tween[] = [];

<<<<<<< HEAD
    setupFrame = window.requestAnimationFrame(() => {
      const sections = gsap.utils.toArray<HTMLElement>(
        "main > section, main > footer, body > section, body > footer",
=======
    setupTimeout = window.setTimeout(() => {
      const sections = gsap.utils.toArray<HTMLElement>(
        "main:not([data-library-page]) > section, main:not([data-library-page]) > footer, body > section, body > footer",
>>>>>>> origin/main
      );
      sectionAnimations = sections.map((section) =>
        gsap.fromTo(
          section,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "transform,opacity,visibility",
            paused: true,
          },
        ),
      );

      sections.forEach((section, index) => {
        const animation = sectionAnimations[index];
<<<<<<< HEAD
        const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            animation.play();
            observer.disconnect();
          }
        }, { threshold: 0.12 });
        observers.push(observer);
        observer.observe(section);
      });
    });

    return () => {
      window.cancelAnimationFrame(setupFrame);
=======
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              animation.play();
              observer.disconnect();
            }
          },
          { threshold: 0.12 },
        );
        observers.push(observer);
        observer.observe(section);
      });
    }, 150);

    return () => {
      window.clearTimeout(setupTimeout);
>>>>>>> origin/main
      lenis.destroy();
      observers.forEach((observer) => observer.disconnect());
      sectionAnimations.forEach((animation) => animation.kill());
    };
  }, [pathname]);

  return null;
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/main
