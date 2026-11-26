"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/src/lib/gsap";
import { projects } from "@/src/data/projects";
import "./Portfolio.css";

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLOutputElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      const progressFill = progressRef.current;
      const progressBar = progressBarRef.current;
      const counter = counterRef.current;
      const cards = track?.querySelectorAll<HTMLElement>(
        ".portfolio-project",
      );
      const images = track?.querySelectorAll<HTMLElement>(
        "[data-project-parallax]",
      );

      if (
        !section ||
        !stage ||
        !viewport ||
        !track ||
        !progressFill ||
        !progressBar ||
        !counter ||
        !cards?.length ||
        !images?.length
      ) {
        return;
      }

      const totalProjects = cards.length;
      const updateProgress = (progress: number) => {
        const normalized = gsap.utils.clamp(0, 1, progress);
        const currentProject = Math.min(
          totalProjects,
          Math.floor(normalized * (totalProjects - 1)) + 1,
        );

        gsap.set(progressFill, { scaleX: normalized });
        progressBar.setAttribute(
          "aria-valuenow",
          String(Math.round(normalized * 100)),
        );
        counter.value = `${String(currentProject).padStart(2, "0")} / ${String(
          totalProjects,
        ).padStart(2, "0")}`;
      };

      const motion = gsap.matchMedia();

      motion.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const getDistance = () =>
            Math.max(0, track.scrollWidth - viewport.clientWidth);

          const horizontalTween = gsap.to(track, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: stage,
              start: "top top",
              end: () => `+=${getDistance()}`,
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => updateProgress(self.progress),
              onRefresh: (self) => updateProgress(self.progress),
            },
          });

          images.forEach((image, index) => {
            const card = cards[index];
            if (!card) return;

            gsap.fromTo(
              image,
              { xPercent: -3 },
              {
                xPercent: 3,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: horizontalTween,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              },
            );
          });

          ScrollTrigger.refresh();
        },
      );

      motion.add(
        "(max-width: 767px), (prefers-reduced-motion: reduce)",
        () => {
          const onScroll = () => {
            const maxScroll = viewport.scrollWidth - viewport.clientWidth;
            updateProgress(
              maxScroll > 0 ? viewport.scrollLeft / maxScroll : 0,
            );
          };

          viewport.addEventListener("scroll", onScroll, { passive: true });
          onScroll();

          return () => viewport.removeEventListener("scroll", onScroll);
        },
      );

      return () => motion.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="portfolio-section"
      id="work"
      aria-labelledby="portfolio-heading"
    >
      <header className="portfolio-section__header">
        <p className="portfolio-section__eyebrow">02 / SELECTED WORK</p>
        <div className="portfolio-section__intro">
          <h2 className="portfolio-section__heading" id="portfolio-heading">
            <span>WORK THAT HITS</span>
            <span>DIFFERENT.</span>
          </h2>
          <p className="portfolio-section__description">
            Ideas brought to life through design, technology and creativity.
          </p>
        </div>
      </header>

      <div className="portfolio-stage" ref={stageRef}>
        <div
          className="portfolio-viewport"
          ref={viewportRef}
          role="region"
          aria-label="Selected project concepts"
          tabIndex={0}
        >
          <div className="portfolio-track" ref={trackRef}>
            {projects.map((project) => (
              <article
                className="portfolio-project"
                key={project.number}
                aria-labelledby={`project-title-${project.number}`}
              >
                <figure className="portfolio-project__figure">
                  <div
                    className="portfolio-project__parallax"
                    data-project-parallax
                  >
                    <Image
                      className="portfolio-project__image"
                      src={project.image}
                      alt={project.imageAlt}
                      fill
                      sizes="(max-width: 767px) 86vw, (max-width: 1200px) 78vw, 1100px"
                    />
                  </div>
                  <span className="portfolio-project__concept">
                    INDEPENDENT CONCEPT
                  </span>
                </figure>

                <div className="portfolio-project__meta">
                  <div className="portfolio-project__title-group">
                    <p className="portfolio-project__category">
                      {project.category}
                    </p>
                    <h3
                      className="portfolio-project__title"
                      id={`project-title-${project.number}`}
                    >
                      {project.name}
                    </h3>
                  </div>
                  <div className="portfolio-project__index">
                    <span>
                      {project.number} /{" "}
                      {String(projects.length).padStart(2, "0")}
                    </span>
                    <svg
                      className="portfolio-project__arrow"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 18 18 6M7 6h11v11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="portfolio-controls" aria-label="Project progress">
          <div
            className="portfolio-controls__progress"
            ref={progressBarRef}
            role="progressbar"
            aria-label="Project browsing progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
          >
            <span
              className="portfolio-controls__progress-fill"
              ref={progressRef}
            />
          </div>
          <output
            className="portfolio-controls__counter"
            ref={counterRef}
            aria-label="Current project"
          >
            01 / {String(projects.length).padStart(2, "0")}
          </output>
        </div>
      </div>
    </section>
  );
}
