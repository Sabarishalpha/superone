"use client";

import { ArrowUpRight } from "lucide-react";
import type { MouseEvent } from "react";
import { useRef } from "react";
import { useSmoothScroll } from "@/src/components/providers/SmoothScrollProvider";
import { gsap, ScrollTrigger, useGSAP } from "@/src/lib/gsap";
import { services, type Service, type ServiceGraphic } from "@/src/data/services";
import "./Services.css";

function ServiceGraphicArt({ type }: { type: ServiceGraphic }) {
  if (type === "website") {
    return (
      <div className="service-art service-art--website" aria-hidden="true">
        <div className="service-art__browser">
          <div className="service-art__browser-bar">
            <span />
            <span />
            <span />
            <i>STUDIO / DIGITAL</i>
          </div>
          <div className="service-art__browser-content">
            <div className="service-art__browser-copy">
              <span>INDEPENDENT BY DESIGN</span>
              <strong>
                MAKE
                <br />
                ROOM.
              </strong>
              <i />
              <i />
            </div>
            <div className="service-art__browser-shape">
              <span />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "meta-ads") {
    return (
      <svg
        className="service-art service-art--meta"
        viewBox="0 0 260 140"
        fill="none"
        aria-hidden="true"
      >
        <path
          className="service-art__meta-loop"
          d="M130 70C108 40 85 35 68 51 46 72 67 106 91 93c16-9 24-23 39-23s23 14 39 23c24 13 45-21 23-42-17-16-40-11-62 19Z"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="130" cy="70" r="4" fill="var(--accent-light)" />
      </svg>
    );
  }

  if (type === "google-ads") {
    return (
      <svg
        className="service-art service-art--chart"
        viewBox="0 0 260 150"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20 124H242M20 124V20"
          stroke="currentColor"
          strokeOpacity=".24"
        />
        <path
          d="M42 104 94 82l42 12 76-64"
          className="service-art__chart-line"
          stroke="var(--accent-light)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M190 30h22v22"
          stroke="var(--accent-light)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="94" cy="82" r="4" fill="currentColor" />
        <circle cx="136" cy="94" r="4" fill="currentColor" />
      </svg>
    );
  }

  if (type === "social") {
    return (
      <div className="service-art service-art--social" aria-hidden="true">
        <div className="service-art__post service-art__post--back">
          <span />
          <i />
          <i />
        </div>
        <div className="service-art__post service-art__post--front">
          <span />
          <strong>MAKE<br />A MOMENT.</strong>
          <i />
        </div>
        <div className="service-art__social-orbit" />
      </div>
    );
  }

  if (type === "branding") {
    return (
      <svg
        className="service-art service-art--branding"
        viewBox="0 0 240 160"
        fill="none"
        aria-hidden="true"
      >
        <rect
          className="service-art__brand-square"
          x="22"
          y="37"
          width="84"
          height="84"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle
          className="service-art__brand-circle"
          cx="150"
          cy="78"
          r="43"
          fill="var(--accent-primary)"
        />
        <path
          className="service-art__brand-diamond"
          d="m190 43 48 78h-96l48-78Z"
          fill="var(--accent-light)"
          fillOpacity=".76"
        />
      </svg>
    );
  }

  return (
    <svg
      className="service-art service-art--growth"
      viewBox="0 0 260 150"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 124H242M20 124V20"
        stroke="currentColor"
        strokeOpacity=".24"
      />
      <path
        d="m40 108 48-20 38 8 68-62"
        className="service-art__growth-line"
        stroke="var(--accent-light)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M176 34h20v20"
        stroke="var(--accent-light)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="88" cy="88" r="4" fill="currentColor" />
      <circle cx="126" cy="96" r="4" fill="currentColor" />
    </svg>
  );
}

function prepareServiceSelection(contact: HTMLElement, service: Service) {
  const select = contact.querySelector<HTMLSelectElement>(
    'select[name="service"]',
  );

  if (select) {
    const option = Array.from(select.options).find(
      (item) =>
        item.value === service.id ||
        item.value === service.title ||
        item.textContent?.trim() === service.title,
    );

    if (option) {
      select.value = option.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  const radio = Array.from(
    contact.querySelectorAll<HTMLInputElement>(
      'input[type="radio"][name="service"]',
    ),
  ).find(
    (input) => input.value === service.id || input.value === service.title,
  );

  if (radio) {
    radio.checked = true;
    radio.dispatchEvent(new Event("change", { bubbles: true }));
  }

  contact.dispatchEvent(
    new CustomEvent("studio:service-select", {
      bubbles: true,
      detail: { serviceId: service.id, serviceName: service.title },
    }),
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollTo } = useSmoothScroll();

  const handleServiceClick = (
    event: MouseEvent<HTMLAnchorElement>,
    service: Service,
  ) => {
    event.preventDefault();
    const contact = document.getElementById("contact");
    if (!contact) return;

    prepareServiceSelection(contact, service);
    scrollTo(contact, {
      offset: window.matchMedia("(max-width: 767px)").matches ? -80 : -92,
      duration: 0.9,
    });
  };

  useGSAP(
    () => {
      const section = sectionRef.current;
      const grid = gridRef.current;
      if (!section || !grid) return;

      const cards = gsap.utils.toArray<HTMLElement>(
        ".service-card",
        grid,
      );
      const visuals = gsap.utils.toArray<HTMLElement>(
        "[data-service-visual]",
        grid,
      );
      const motion = gsap.matchMedia();

      motion.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          cards,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: grid,
              start: "top 82%",
              once: true,
            },
          },
        );

        const visibilityTriggers = visuals.map((visual) => {
          const trigger = ScrollTrigger.create({
            trigger: visual,
            start: "top 96%",
            end: "bottom 4%",
            onToggle: (self) => {
              visual.dataset.visible = String(self.isActive);
            },
            onRefresh: (self) => {
              visual.dataset.visible = String(self.isActive);
            },
          });

          visual.dataset.visible = String(trigger.isActive);
          return trigger;
        });

        return () => visibilityTriggers.forEach((trigger) => trigger.kill());
      });

      motion.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const cardsWithListeners = cards.map((card) => {
            const onPointerMove = (event: PointerEvent) => {
              const bounds = card.getBoundingClientRect();
              card.style.setProperty(
                "--spotlight-x",
                `${event.clientX - bounds.left}px`,
              );
              card.style.setProperty(
                "--spotlight-y",
                `${event.clientY - bounds.top}px`,
              );
            };

            const onPointerLeave = () => {
              card.style.removeProperty("--spotlight-x");
              card.style.removeProperty("--spotlight-y");
            };

            card.addEventListener("pointermove", onPointerMove);
            card.addEventListener("pointerleave", onPointerLeave);
            return { card, onPointerMove, onPointerLeave };
          });

          return () => {
            cardsWithListeners.forEach(
              ({ card, onPointerMove, onPointerLeave }) => {
                card.removeEventListener("pointermove", onPointerMove);
                card.removeEventListener("pointerleave", onPointerLeave);
                card.style.removeProperty("--spotlight-x");
                card.style.removeProperty("--spotlight-y");
              },
            );
          };
        },
      );

      return () => motion.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="services-section"
      id="services"
      aria-labelledby="services-heading"
    >
      <div className="services-section__inner">
        <p className="services-section__eyebrow">03 / WHAT WE DO</p>

        <header className="services-section__header">
          <h2 className="services-section__heading" id="services-heading">
            GOOD DESIGN.
            <br />
            <span>REAL GROWTH.</span>
          </h2>
          <p className="services-section__description">
            Creative solutions built for ambitious brands.
          </p>
        </header>

        <div className="services-grid" ref={gridRef}>
          {services.map((service) => (
            <a
              className={`service-card service-card--${service.layout}`}
              href="#contact"
              key={service.id}
              onClick={(event) => handleServiceClick(event, service)}
              aria-label={`Discuss ${service.title}: ${service.description}`}
            >
              <span className="service-card__number">{service.number}</span>
              <ArrowUpRight
                className="service-card__arrow"
                aria-hidden="true"
                strokeWidth={1.5}
              />

              <div className="service-card__visual" data-service-visual>
                <ServiceGraphicArt type={service.graphic} />
              </div>

              <div className="service-card__copy">
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__description">
                  {service.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
