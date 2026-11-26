"use client";

import Image from "next/image";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { useRef, useSyncExternalStore, type MouseEvent } from "react";
import { footerNavigationItems, siteConfig } from "@/src/config/site";
import { services } from "@/src/data/services";
import { useSmoothScroll } from "@/src/components/providers/SmoothScrollProvider";
import { gsap, useGSAP } from "@/src/lib/gsap";
import "./Footer.css";

function getCurrentYear() {
  return new Date().getFullYear();
}

function getServerYear() {
  return 0;
}

function subscribeToYearChange(onChange: () => void) {
  const subscribedYear = getCurrentYear();
  let timeout: number;

  const scheduleUpdate = () => {
    const now = new Date();
    const nextYear = new Date(now.getFullYear() + 1, 0, 1).getTime();
    const delay = Math.min(
      Math.max(0, nextYear - now.getTime()),
      2_147_483_647,
    );

    timeout = window.setTimeout(() => {
      if (getCurrentYear() !== subscribedYear) {
        onChange();
      } else {
        scheduleUpdate();
      }
    }, delay);
  };

  scheduleUpdate();
  return () => window.clearTimeout(timeout);
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const { scrollTo } = useSmoothScroll();
  const year = useSyncExternalStore(
    subscribeToYearChange,
    getCurrentYear,
    getServerYear,
  );

  useGSAP(
    () => {
      const footer = footerRef.current;
      if (!footer) return;

      const motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        const words = gsap.utils.toArray<HTMLElement>(
          "[data-footer-word]",
          footer,
        );

        gsap.fromTo(
          words,
          { autoAlpha: 0.18, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: footer,
              start: "top 88%",
              end: "top 48%",
              scrub: 0.55,
            },
          },
        );
      });

      return () => motion.revert();
    },
    { scope: footerRef },
  );

  const handleAnchorClick = (
    event: MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    const target = document.getElementById(sectionId);
    if (!target) return;

    event.preventDefault();
    scrollTo(target, {
      offset: sectionId === "home" ? 0 : -88,
      duration: 0.85,
    });
  };

  const handleBackToTop = () => {
    const home = document.getElementById("home");
    scrollTo(home ?? 0, { offset: 0, duration: 1 });
  };

  return (
    <footer className="studio-footer" ref={footerRef} aria-label="Site footer">
      <div className="studio-footer__inner">
        <div className="studio-footer__topline">
          <a
            className="studio-footer__brand"
            href="#home"
            aria-label={`Return to ${siteConfig.brandName} home`}
            onClick={(event) => handleAnchorClick(event, "home")}
          >
            <Image
              src="/images/logo.png"
              alt=""
              aria-hidden="true"
              width={840}
              height={768}
              className="studio-footer__logo"
              sizes="48px"
            />
            <span>{siteConfig.brandName}</span>
          </a>
          <span className="studio-footer__tagline">
            {siteConfig.navigationTagline}
          </span>
        </div>

        <h2 className="studio-footer__heading" aria-label="LET'S MAKE NOISE.">
          <span data-footer-word>LET&apos;S</span>{" "}
          <span data-footer-word>MAKE</span>
          <br />
          <span className="studio-footer__heading-accent" data-footer-word>
            NOISE.
          </span>
        </h2>

        <div className="studio-footer__links">
          <nav aria-label="Footer navigation">
            <h3>EXPLORE</h3>
            <ul>
              {footerNavigationItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(event) => handleAnchorClick(event, item.id)}
                  >
                    {item.label}
                    <ArrowUpRight aria-hidden="true" size={13} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services">
            <h3>WHAT WE DO</h3>
            <ul>
              {services.map((service) => (
                <li key={service.id}>
                  <a
                    href="#services"
                    onClick={(event) => handleAnchorClick(event, "services")}
                  >
                    {service.title}
                    <ArrowUpRight aria-hidden="true" size={13} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="studio-footer__contact">
            <h3>GET IN TOUCH</h3>
            {siteConfig.contactEmail ? (
              <a href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
                <ArrowUpRight aria-hidden="true" size={14} />
              </a>
            ) : (
              <a
                href="#contact"
                onClick={(event) => handleAnchorClick(event, "contact")}
              >
                Start an enquiry
                <ArrowUpRight aria-hidden="true" size={14} />
              </a>
            )}
            {siteConfig.socialLinks.length > 0 ? (
              <ul className="studio-footer__socials">
                {siteConfig.socialLinks.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                      <ArrowUpRight aria-hidden="true" size={13} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="studio-footer__bottom">
          <p>
            © <span className="studio-footer__year">{year || ""}</span>{" "}
            {siteConfig.brandName}
          </p>
          <p>POWERING THE NEXT DIGITAL ERA.</p>
          <button type="button" onClick={handleBackToTop}>
            BACK TO TOP
            <ArrowUp aria-hidden="true" size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}
