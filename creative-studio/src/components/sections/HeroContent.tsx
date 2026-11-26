"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/src/lib/gsap";
import { useSmoothScroll } from "../providers/SmoothScrollProvider";

type HeroContentProps = {
  children: ReactNode;
};

export default function HeroContent({ children }: HeroContentProps) {
  const [experienceReady, setExperienceReady] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollTo } = useSmoothScroll();

  useLayoutEffect(() => {
    let sawPreloader = Boolean(
      document.querySelector(".preloader-curtain"),
    );
    let hasRevealed = false;
    let skipCheck = 0;
    let fallback = 0;

    const reveal = () => {
      if (hasRevealed) return;

      hasRevealed = true;
      window.clearTimeout(skipCheck);
      window.clearTimeout(fallback);
      observer.disconnect();
      setExperienceReady(true);
    };

    const checkPreloader = () => {
      const preloaderIsPresent = Boolean(
        document.querySelector(".preloader-curtain"),
      );

      if (preloaderIsPresent) {
        sawPreloader = true;
      } else if (sawPreloader) {
        reveal();
      }
    };

    const observer = new MutationObserver(checkPreloader);
    observer.observe(document.body, { childList: true, subtree: true });

    skipCheck = window.setTimeout(() => {
      checkPreloader();
      if (!sawPreloader) reveal();
    }, 100);
    fallback = window.setTimeout(reveal, 4500);

    return () => {
      window.clearTimeout(skipCheck);
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  const handleHeroLink = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!(event.target instanceof Element)) return;

      const anchor = event.target.closest<HTMLAnchorElement>(
        "a[data-hero-scroll]",
      );
      if (!anchor) return;

      event.preventDefault();
      const target = document.getElementById(anchor.hash.slice(1));
      if (!target) return;

      scrollTo(target, {
        offset: window.matchMedia("(max-width: 767px)").matches ? -80 : -92,
        duration: 0.9,
      });
    },
    [scrollTo],
  );

  useGSAP(
    () => {
      const content = contentRef.current;
      const hero = content?.closest<HTMLElement>(".hero");
      if (!content || !hero || !experienceReady) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const kicker = content.querySelector<HTMLElement>("[data-hero-kicker]");
      const lines = gsap.utils.toArray<HTMLElement>(
        "[data-hero-title-line]",
        content,
      );
      const visual = content.querySelector<HTMLElement>(
        "[data-hero-visual]",
      );
      const description = content.querySelector<HTMLElement>(
        "[data-hero-description]",
      );
      const actions = gsap.utils.toArray<HTMLElement>(
        "[data-hero-action]",
        content,
      );
      const footer = content.querySelector<HTMLElement>("[data-hero-footer]");
      const copy = content.querySelector<HTMLElement>("[data-hero-copy]");
      const stage = content.querySelector<HTMLElement>("[data-hero-stage]");
      const pointerTarget = content.querySelector<HTMLElement>(
        "[data-hero-pointer]",
      );
      const logo = content.querySelector<HTMLElement>("[data-hero-logo]");
      const glow = content.querySelector<HTMLElement>("[data-hero-glow]");
      const scrollCue = content.querySelector<HTMLElement>(
        "[data-hero-scroll-cue]",
      );

      const entranceTargets = [
        kicker,
        ...lines,
        visual,
        description,
        ...actions,
        footer,
      ].filter(
        (target): target is HTMLElement =>
          target !== null && target !== undefined,
      );
      let entrance: gsap.core.Timeline | null = null;

      try {
        const timeline = gsap.timeline();
        entrance = timeline;

        if (kicker) {
          timeline.fromTo(
            kicker,
            { autoAlpha: 0, y: 12 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.38,
              ease: "power4.out",
            },
            0,
          );
        }

        if (lines.length > 0) {
          timeline.fromTo(
            lines,
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 0.72,
              stagger: 0.085,
              ease: "power4.out",
              clearProps: "transform",
            },
            0.08,
          );
        }

        if (visual) {
          timeline.fromTo(
            visual,
            { autoAlpha: 0, scale: 0.85, rotationY: -9 },
            {
              autoAlpha: 1,
              scale: 1,
              rotationY: 0,
              duration: 0.82,
              ease: "power3.out",
              clearProps: "transform",
            },
            0.14,
          );
        }

        if (description) {
          timeline.fromTo(
            description,
            { autoAlpha: 0, y: 16 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.45,
              ease: "power3.out",
            },
            0.62,
          );
        }

        if (actions.length > 0) {
          timeline.fromTo(
            actions,
            { autoAlpha: 0, y: 14 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.08,
              ease: "power3.out",
            },
            0.76,
          );
        }

        if (footer) {
          timeline.fromTo(
            footer,
            { autoAlpha: 0, y: 12 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.42,
              ease: "power3.out",
            },
            0.94,
          );
        }
      } catch (error) {
        console.error(
          "Unable to initialize the hero entrance; showing static content.",
          error,
        );
        entrance?.kill();
        gsap.set(entranceTargets, { clearProps: "all" });
        return;
      }

      if (!entrance) return;

      const motionMedia = gsap.matchMedia();

      motionMedia.add("(prefers-reduced-motion: no-preference)", () => {
        const scrollTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        if (copy) {
          scrollTimeline.to(
            copy,
            { y: -26, ease: "none" },
            0,
          );
        }

        if (stage) {
          scrollTimeline.to(
            stage,
            {
              y: -42,
              scale: 1.07,
              rotationY: 3,
              ease: "none",
            },
            0,
          );
        }

        if (glow) {
          scrollTimeline.to(glow, { autoAlpha: 0.42, ease: "none" }, 0);
        }

        const visibilityTrigger = ScrollTrigger.create({
          trigger: hero,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            if (scrollCue) {
              scrollCue.dataset.inView = String(self.isActive);
            }
          },
        });

        return () => {
          visibilityTrigger.kill();
          scrollTimeline.scrollTrigger?.kill();
          scrollTimeline.kill();
        };
      });

      motionMedia.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          if (!pointerTarget || !logo) return;

          gsap.set(logo, { transformPerspective: 1000 });

          const rotateX = gsap.quickTo(logo, "rotationX", {
            duration: 0.55,
            ease: "power3.out",
          });
          const rotateY = gsap.quickTo(logo, "rotationY", {
            duration: 0.55,
            ease: "power3.out",
          });
          const moveX = gsap.quickTo(logo, "x", {
            duration: 0.55,
            ease: "power3.out",
          });
          const moveY = gsap.quickTo(logo, "y", {
            duration: 0.55,
            ease: "power3.out",
          });

          const onPointerMove = (event: PointerEvent) => {
            const bounds = pointerTarget.getBoundingClientRect();
            if (bounds.width === 0 || bounds.height === 0) return;

            const normalizedX = gsap.utils.clamp(
              -1,
              1,
              (event.clientX - bounds.left - bounds.width / 2) /
                (bounds.width / 2),
            );
            const normalizedY = gsap.utils.clamp(
              -1,
              1,
              (event.clientY - bounds.top - bounds.height / 2) /
                (bounds.height / 2),
            );

            rotateX(gsap.utils.clamp(-8, 8, normalizedY * -7));
            rotateY(gsap.utils.clamp(-10, 10, normalizedX * 9));
            moveX(gsap.utils.clamp(-8, 8, normalizedX * 5));
            moveY(gsap.utils.clamp(-8, 8, normalizedY * 5));
          };

          const onPointerLeave = () => {
            rotateX(0);
            rotateY(0);
            moveX(0);
            moveY(0);
          };

          pointerTarget.addEventListener("pointermove", onPointerMove);
          pointerTarget.addEventListener("pointerleave", onPointerLeave);

          return () => {
            pointerTarget.removeEventListener("pointermove", onPointerMove);
            pointerTarget.removeEventListener("pointerleave", onPointerLeave);
          };
        },
      );

      return () => {
        entrance?.kill();
        motionMedia.revert();
      };
    },
    {
      dependencies: [experienceReady],
      scope: contentRef,
      revertOnUpdate: true,
    },
  );

  return (
    <div
      ref={contentRef}
      className="hero__experience"
      data-hero-ready={experienceReady}
      onClick={handleHeroLink}
    >
      {children}
    </div>
  );
}
