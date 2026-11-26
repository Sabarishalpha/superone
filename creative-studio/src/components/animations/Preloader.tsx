"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/src/lib/gsap";
import { siteConfig } from "@/src/config/site";
import "./Preloader.css";

const SESSION_KEY = "voltage-studio:preloader-seen";

type PreloaderProps = {
  onActiveChange: (paused: boolean) => void;
};

type PreloaderElements = {
  curtain: HTMLDivElement;
  logo: HTMLImageElement;
  progress: HTMLDivElement;
  fill: HTMLDivElement;
};

export default function Preloader({ onActiveChange }: PreloaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const curtainRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) return;
      window.sessionStorage.setItem(SESSION_KEY, "true");
    } catch (error) {
      console.error("Unable to read or write the preloader session state.", error);
    }

    queueMicrotask(() => setIsVisible(true));
  }, []);

  useLayoutEffect(() => {
    onActiveChange(isVisible);

    return () => {
      onActiveChange(false);
    };
  }, [isVisible, onActiveChange]);

  useGSAP(
    () => {
      if (!isVisible) return;

      const elements: PreloaderElements | null =
        curtainRef.current &&
        logoRef.current &&
        progressRef.current &&
        fillRef.current
          ? {
              curtain: curtainRef.current,
              logo: logoRef.current,
              progress: progressRef.current,
              fill: fillRef.current,
            }
          : null;

      if (!elements) {
        setIsVisible(false);
        onActiveChange(false);
        return;
      }

      let isComplete = false;
      let introComplete = false;
      let pageReady = document.readyState === "complete";
      let timeoutId = 0;
      let timeline: gsap.core.Timeline | null = null;

      const complete = () => {
        if (isComplete) return;
        isComplete = true;
        window.clearTimeout(timeoutId);
        setIsVisible(false);
        onActiveChange(false);

        try {
          ScrollTrigger.refresh();
        } catch (error) {
          console.error("Unable to refresh ScrollTrigger after the preloader.", error);
        }
      };

      const onPageReady = () => {
        pageReady = true;
        if (introComplete) timeline?.play();
      };

      const onReducedMotion = (event: MediaQueryListEvent) => {
        if (event.matches) complete();
      };

      const motionPreference = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );
      motionPreference.addEventListener("change", onReducedMotion);
      window.addEventListener("load", onPageReady, { once: true });

      timeoutId = window.setTimeout(complete, 4000);

      if (pageReady) onPageReady();

      try {
        timeline = gsap
          .timeline({
            paused: true,
            onComplete: complete,
          })
          .to(
            elements.logo,
            {
              autoAlpha: 1,
              scale: 1,
              duration: 0.42,
              ease: "power3.out",
            },
            0,
          )
          .to(
            elements.fill,
            {
              scaleX: 0.82,
              duration: 0.82,
              ease: "power2.inOut",
            },
            0,
          )
          .addPause(">", () => {
            introComplete = true;
            if (pageReady) timeline?.play();
          })
          .to(elements.fill, {
            scaleX: 1,
            duration: 0.2,
            ease: "power3.inOut",
          })
          .to(
            [elements.logo, elements.progress],
            {
              autoAlpha: 0,
              duration: 0.22,
              ease: "power2.out",
            },
            "-=0.02",
          )
          .to(
            elements.curtain,
            {
              yPercent: -100,
              duration: 0.56,
              ease: "power4.inOut",
            },
            "-=0.02",
          );

        timeline.play(0);
      } catch (error) {
        console.error("Unable to animate the preloader; revealing the page.", error);
        complete();
      }

      return () => {
        window.clearTimeout(timeoutId);
        window.removeEventListener("load", onPageReady);
        motionPreference.removeEventListener("change", onReducedMotion);
      };
    },
    {
      dependencies: [isVisible],
      scope: curtainRef,
      revertOnUpdate: true,
    },
  );

  const handleLogoError = () => {
    console.error("The preloader logo could not be loaded from /images/logo.png.");
    setIsVisible(false);
    onActiveChange(false);
  };

  if (!isVisible) return null;

  return (
    <div
      ref={curtainRef}
      className="preloader-curtain"
      role="status"
      aria-label="Loading"
    >
      <div className="preloader-group">
        <Image
          ref={logoRef}
          src="/images/logo.png"
          alt={`${siteConfig.brandName} logo`}
          width={120}
          height={120}
          priority
          className="preloader-logo"
          onError={handleLogoError}
        />
        <div
          ref={progressRef}
          className="preloader-progress"
          aria-hidden="true"
        >
          <div ref={fillRef} className="preloader-fill" />
        </div>
      </div>
    </div>
  );
}
