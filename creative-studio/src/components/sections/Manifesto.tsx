"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/src/lib/gsap";
import "./Manifesto.css";

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const intro = section?.querySelector<HTMLElement>(
        ".manifesto-section__intro",
      );
      const mainHeading = section?.querySelector<HTMLElement>(
        ".manifesto-section__heading",
      );
      const outro = section?.querySelector<HTMLElement>(
        ".manifesto-section__outro",
      );
      const secondaryHeading = section?.querySelector<HTMLElement>(
        ".manifesto-section__secondary",
      );
      const support = section?.querySelector<HTMLElement>(
        ".manifesto-section__support",
      );
      const logo = section?.querySelector<HTMLElement>(
        ".manifesto-section__logo",
      );
      const tagline = section?.querySelector<HTMLElement>(
        ".manifesto-section__tagline",
      );

      if (
        !section ||
        !intro ||
        !mainHeading ||
        !outro ||
        !secondaryHeading ||
        !support ||
        !logo ||
        !tagline
      ) {
        return;
      }

      const mainWords = Array.from(
        mainHeading.querySelectorAll<HTMLElement>("[data-manifesto-word]"),
      );
      const secondaryWords = Array.from(
        secondaryHeading.querySelectorAll<HTMLElement>(
          "[data-manifesto-outro-word]",
        ),
      );
      if (!mainWords.length || !secondaryWords.length) return;

      const accentColor =
        getComputedStyle(section).getPropertyValue("--accent-light").trim() ||
        "#438eff";
      const motion = gsap.matchMedia();

      motion.add("(prefers-reduced-motion: no-preference)", () => {
        const mainReveal = gsap.timeline({
          scrollTrigger: {
            trigger: mainHeading,
            start: "top 88%",
            end: "bottom 38%",
            scrub: 0.65,
          },
        });

        mainWords.forEach((word, index) => {
          const isAccent = word.hasAttribute("data-manifesto-accent");
          mainReveal.fromTo(
            word,
            { color: isAccent ? "#123c86" : "#4a4a50" },
            {
              color: isAccent ? accentColor : "#ffffff",
              duration: 1,
              ease: "none",
            },
            index * 0.72,
          );
        });

        gsap.fromTo(
          [support, logo],
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.12,
            ease: "none",
            scrollTrigger: {
              trigger: support,
              start: "top 92%",
              end: "top 58%",
              scrub: 0.5,
            },
          },
        );

        gsap.fromTo(
          outro,
          { backgroundColor: "#050505" },
          {
            backgroundColor: "#ffffff",
            ease: "none",
            scrollTrigger: {
              trigger: outro,
              start: "top 88%",
              end: "top 20%",
              scrub: 0.7,
            },
          },
        );

        const outroReveal = gsap.timeline({
          scrollTrigger: {
            trigger: outro,
            start: "top 88%",
            end: "top 22%",
            scrub: 0.65,
          },
        });

        secondaryWords.forEach((word, index) => {
          outroReveal.fromTo(
            word,
            { autoAlpha: 0.16, y: 28, color: "#85858a" },
            {
              autoAlpha: 1,
              y: 0,
              color: "#050505",
              duration: 1,
              ease: "none",
            },
            index * 0.68,
          );
        });

        outroReveal.fromTo(
          tagline,
          { autoAlpha: 0.2, y: 18, color: "#85858a" },
          {
            autoAlpha: 1,
            y: 0,
            color: "#050505",
            duration: 1,
            ease: "none",
          },
          secondaryWords.length * 0.68,
        );
      });

      motion.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.fromTo(
            mainHeading,
            { scale: 0.975, y: 18 },
            {
              scale: 1.015,
              y: -10,
              ease: "none",
              scrollTrigger: {
                trigger: intro,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );
        },
      );

      return () => motion.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="manifesto-section"
      id="manifesto"
      aria-labelledby="manifesto-heading"
    >
      <div className="manifesto-section__intro">
        <p className="manifesto-section__eyebrow">05 / OUR PHILOSOPHY</p>

        <h2 className="manifesto-section__heading" id="manifesto-heading">
          <span className="manifesto-section__heading-line">
            <span data-manifesto-word>ATTENTION</span>
          </span>
          <span className="manifesto-section__heading-line">
            <span data-manifesto-word>IS</span>{" "}
            <span data-manifesto-word>THE</span>{" "}
            <span data-manifesto-word>NEW</span>
          </span>
          <span className="manifesto-section__heading-line">
            <span data-manifesto-word data-manifesto-accent>
              CURRENCY.
            </span>
          </span>
        </h2>

        <div className="manifesto-section__intro-footer">
          <p className="manifesto-section__support">
            In a world full of noise, we create reasons to pay attention.
          </p>
          <Image
            className="manifesto-section__logo"
            src="/images/logo.png"
            alt=""
            aria-hidden="true"
            width={840}
            height={768}
            sizes="56px"
          />
        </div>
      </div>

      <div className="manifesto-section__outro">
        <div className="manifesto-section__outro-inner">
          <h3 className="manifesto-section__secondary">
            <span className="manifesto-section__secondary-line">
              <span data-manifesto-outro-word>DON&apos;T</span>{" "}
              <span data-manifesto-outro-word>JUST</span>{" "}
              <span data-manifesto-outro-word>EXIST.</span>
            </span>
            <span className="manifesto-section__secondary-line">
              <span data-manifesto-outro-word>BE</span>{" "}
              <span data-manifesto-outro-word>IMPOSSIBLE</span>
            </span>
            <span className="manifesto-section__secondary-line">
              <span data-manifesto-outro-word>TO</span>{" "}
              <span data-manifesto-outro-word>IGNORE.</span>
            </span>
          </h3>
          <p className="manifesto-section__tagline">
            THINK DIFFERENT. CREATE DIFFERENT.
          </p>
        </div>
      </div>
    </section>
  );
}
