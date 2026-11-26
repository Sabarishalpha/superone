"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/src/lib/gsap";
import "./Process.css";

const processSteps = [
  {
    number: "01",
    name: "DISCOVER.",
    description: "Understand your brand, audience and ambitions.",
    graphic: "discover",
  },
  {
    number: "02",
    name: "DESIGN.",
    description: "Transform strategy into powerful visual experiences.",
    graphic: "design",
  },
  {
    number: "03",
    name: "DEVELOP.",
    description: "Build fast, scalable and interactive digital solutions.",
    graphic: "develop",
  },
  {
    number: "04",
    name: "LAUNCH & SCALE.",
    description: "Launch, optimize and accelerate your digital growth.",
    graphic: "launch",
  },
] as const;

type ProcessGraphicName = (typeof processSteps)[number]["graphic"];

function ProcessGraphic({ name }: { name: ProcessGraphicName }) {
  if (name === "discover") {
    return (
      <svg viewBox="0 0 320 240" fill="none" aria-hidden="true">
        <circle cx="160" cy="120" r="78" />
        <circle cx="160" cy="120" r="48" />
        <circle cx="160" cy="120" r="17" />
        <path d="M160 12v39m0 138v39M52 120h39m138 0h39" />
        <path className="process-art__accent" d="m160 120 54-54" />
        <circle className="process-art__point" cx="214" cy="66" r="5" />
      </svg>
    );
  }

  if (name === "design") {
    return (
      <svg viewBox="0 0 320 240" fill="none" aria-hidden="true">
        <path d="M72 48h176v144H72z" />
        <path d="M72 96h176M132 48v144M192 48v144" />
        <path className="process-art__accent" d="m132 96 60 48-60 48-60-48 60-48Z" />
        <circle className="process-art__point" cx="192" cy="96" r="6" />
      </svg>
    );
  }

  if (name === "develop") {
    return (
      <svg viewBox="0 0 320 240" fill="none" aria-hidden="true">
        <path d="m114 76-42 44 42 44M206 76l42 44-42 44" />
        <path className="process-art__accent" d="m177 60-34 120" />
        <path d="M48 198h224" />
        <circle className="process-art__point" cx="58" cy="42" r="5" />
        <circle cx="78" cy="42" r="5" />
        <circle cx="98" cy="42" r="5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 320 240" fill="none" aria-hidden="true">
      <path d="M54 190h220M54 190V42" />
      <path className="process-art__accent" d="m82 158 48-30 38 12 70-76" />
      <path className="process-art__accent" d="M204 64h34v34" />
      <circle className="process-art__point" cx="130" cy="128" r="5" />
      <circle cx="168" cy="140" r="5" />
    </svg>
  );
}

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLOListElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLOutputElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stack = stackRef.current;
      const progressFill = progressRef.current;
      const progressBar = progressBarRef.current;
      const counter = counterRef.current;

      if (!section || !stack || !progressFill || !progressBar || !counter) {
        return;
      }

      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-process-card]",
        stack,
      );
      if (!cards.length) return;

      const updateProgress = (progress: number) => {
        const normalized = gsap.utils.clamp(0, 1, progress);
        const activeStep = Math.min(
          processSteps.length,
          Math.max(1, Math.ceil(normalized * processSteps.length)),
        );

        gsap.set(progressFill, { scaleX: normalized });
        progressBar.setAttribute(
          "aria-valuenow",
          String(Math.round(normalized * 100)),
        );
        counter.value = `${String(activeStep).padStart(2, "0")} / ${String(
          processSteps.length,
        ).padStart(2, "0")}`;
      };

      ScrollTrigger.create({
        trigger: stack,
        start: "top 76%",
        end: "bottom 52%",
        onUpdate: (self) => updateProgress(self.progress),
        onRefresh: (self) => updateProgress(self.progress),
      });

      const motion = gsap.matchMedia();

      motion.add("(prefers-reduced-motion: no-preference)", () => {
        cards.forEach((card) => {
          const revealItems = card.querySelectorAll<HTMLElement>(
            "[data-process-reveal]",
          );
          const art = card.querySelector<SVGSVGElement>("[data-process-art]");

          gsap.fromTo(
            revealItems,
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              stagger: 0.12,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 82%",
                end: "top 46%",
                scrub: 0.5,
              },
            },
          );

          if (art) {
            gsap.fromTo(
              art,
              { autoAlpha: 0.45, scale: 0.88, rotate: -5 },
              {
                autoAlpha: 1,
                scale: 1,
                rotate: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top 80%",
                  end: "top 42%",
                  scrub: 0.6,
                },
              },
            );
          }
        });

        const stacking = gsap.matchMedia();
        stacking.add("(min-width: 768px)", () => {
          cards.slice(0, -1).forEach((card, index) => {
            const nextCard = cards[index + 1];
            if (!nextCard) return;

            gsap.to(card, {
              scale: 0.965,
              transformOrigin: "center top",
              ease: "none",
              scrollTrigger: {
                trigger: nextCard,
                start: "top 38%",
                end: "top 13%",
                scrub: 0.55,
              },
            });
          });
        });

        return () => stacking.revert();
      });

      return () => motion.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="process-section"
      id="process"
      aria-labelledby="process-heading"
    >
      <div className="process-section__inner">
        <p className="process-section__eyebrow">04 / HOW WE WORK</p>

        <header className="process-section__header">
          <h2 className="process-section__heading" id="process-heading">
            FROM IDEA.
            <br />
            <span>TO IMPACT.</span>
          </h2>
          <p className="process-section__description">
            A clear process. No unnecessary complexity.
          </p>
        </header>

        <div className="process-progress" aria-label="Process progress">
          <div
            className="process-progress__track"
            ref={progressBarRef}
            role="progressbar"
            aria-label="Our process progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
          >
            <span className="process-progress__fill" ref={progressRef} />
          </div>
          <output
            className="process-progress__counter"
            ref={counterRef}
            aria-label="Current process step"
          >
            01 / 04
          </output>
        </div>

        <ol className="process-stack" ref={stackRef}>
          {processSteps.map((step, index) => (
            <li
              className={`process-card${index === processSteps.length - 1 ? " process-card--final" : ""}`}
              data-process-card
              key={step.number}
              style={
                {
                  "--process-step-offset": `${index * 14}px`,
                } as CSSProperties
              }
            >
              <div className="process-card__topline" data-process-reveal>
                <span>STAGE {step.number} / 04</span>
                <span className="process-card__mark" aria-hidden="true">
                  VOLT / {step.number}
                </span>
              </div>

              <div className="process-card__body">
                <div className="process-card__copy">
                  <h3 className="process-card__heading" data-process-reveal>
                    <span className="process-card__number">{step.number}</span>
                    <span className="process-card__title">{step.name}</span>
                  </h3>
                  <p className="process-card__description" data-process-reveal>
                    {step.description}
                  </p>
                </div>

                <div className="process-card__visual" data-process-reveal>
                  <ProcessGraphic name={step.graphic} />
                  <span className="process-card__visual-caption" aria-hidden="true">
                    {step.number} — {step.name.replace(".", "")}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
