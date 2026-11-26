"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/src/lib/gsap";
import "./About.css";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const heading = section?.querySelector<HTMLElement>(
        ".about-section__heading",
      );
      const words = section?.querySelectorAll<HTMLElement>(
        "[data-about-word]",
      );
      const divider = section?.querySelector<HTMLElement>(
        ".about-section__divider",
      );
      const paragraphs = section?.querySelectorAll<HTMLElement>(
        "[data-about-copy]",
      );
      const tagline = section?.querySelector<HTMLElement>(
        ".about-section__tagline",
      );

      if (!section || !heading || !words?.length || !divider || !paragraphs) {
        return;
      }

      const motion = gsap.matchMedia();

      motion.add("(prefers-reduced-motion: no-preference)", () => {
        const wordsInOrder = Array.from(words);
        const accentColor =
          getComputedStyle(section).getPropertyValue("--accent-light").trim() ||
          "#438eff";
        const headingReveal = gsap.timeline({
          scrollTrigger: {
            trigger: heading,
            start: "top 82%",
            end: "center 48%",
            scrub: 0.6,
          },
        });

        wordsInOrder.forEach((word, index) => {
          const isAccent = word.hasAttribute("data-about-accent");
          headingReveal.fromTo(
            word,
            { color: isAccent ? "#173d82" : "#414141" },
            {
              color: isAccent ? accentColor : "#ffffff",
              duration: 1,
              ease: "none",
            },
            index,
          );
        });

        gsap.fromTo(
          divider,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: divider,
              start: "top 88%",
              end: "top 58%",
              scrub: 0.5,
            },
          },
        );

        gsap.fromTo(
          [...paragraphs, ...(tagline ? [tagline] : [])],
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            stagger: 0.14,
            ease: "power3.out",
            scrollTrigger: {
              trigger: paragraphs[0],
              start: "top 86%",
              once: true,
            },
          },
        );
      });

      return () => motion.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="about-section"
      id="about"
      aria-labelledby="about-heading"
    >
      <div className="about-section__inner">
        <p className="about-section__eyebrow">01 / WHO WE ARE</p>

        <h2 className="about-section__heading" id="about-heading">
          <span className="about-section__heading-line">
            <span data-about-word>WE</span>{" "}
            <span data-about-word>DON&apos;T</span>{" "}
            <span data-about-word>JUST</span>
          </span>
          <span className="about-section__heading-line">
            <span data-about-word>BUILD</span>{" "}
            <span data-about-word>WEBSITES.</span>
          </span>
          <span className="about-section__heading-line">
            <span data-about-word>WE</span>{" "}
            <span data-about-word>BUILD</span>
          </span>
          <span className="about-section__heading-line">
            <span data-about-word data-about-accent>
              DIGITAL
            </span>{" "}
            <span data-about-word data-about-accent>
              IMPACT.
            </span>
          </span>
        </h2>

        <div className="about-section__divider" aria-hidden="true" />

        <div className="about-section__bottom">
          <div className="about-section__copy">
            <p data-about-copy>
              An independent creative studio at the intersection of design,
              technology and digital growth.
            </p>
            <p data-about-copy>
              We create experiences that capture attention, connect with people
              and drive business forward.
            </p>
          </div>
          <p className="about-section__tagline">CREATIVITY WITHOUT LIMITS.</p>
        </div>
      </div>
    </section>
  );
}
