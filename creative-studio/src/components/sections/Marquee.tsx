"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/src/lib/gsap";
import "./Marquee.css";

const words = ["DESIGN", "DEVELOP", "ADVERTISE", "SCALE"] as const;

export default function Marquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      const segment = track?.querySelector<HTMLElement>(
        ".agency-marquee__segment",
      );

      if (!section || !track || !segment) return;

      const motion = gsap.matchMedia();

      motion.add("(prefers-reduced-motion: no-preference)", () => {
        let segmentWidth = 0;
        let position = 0;
        let direction = -1;
        let isActive = false;
        const speed = { value: 1 };
        let speedTween: gsap.core.Tween | null = null;
        let resetCall: gsap.core.Tween | null = null;
        const setX = gsap.quickSetter(track, "x", "px");

        const measure = () => {
          const nextWidth = segment.getBoundingClientRect().width;
          if (nextWidth <= 0) return;

          const progress =
            segmentWidth > 0 ? (position + segmentWidth) / segmentWidth : 0;

          segmentWidth = nextWidth;
          position = -segmentWidth + progress * segmentWidth;
          setX(position);
        };

        const tick = (_time: number, deltaTime: number) => {
          if (!isActive || segmentWidth <= 0) return;

          const elapsed = Math.min(deltaTime, 50) / 1000;
          position = gsap.utils.wrap(
            -segmentWidth,
            0,
            position + direction * 112 * speed.value * elapsed,
          );
          setX(position);
        };

        const setActive = (active: boolean) => {
          if (isActive === active) return;
          isActive = active;

          if (active) {
            gsap.ticker.add(tick);
            return;
          }

          gsap.ticker.remove(tick);
          resetCall?.kill();
          speedTween?.kill();
          speed.value = 1;
        };

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => setActive(self.isActive),
          onRefresh: (self) => setActive(self.isActive),
          onUpdate: (self) => {
            direction = self.direction === 1 ? -1 : 1;

            const targetSpeed = gsap.utils.clamp(
              1,
              1.9,
              1 + Math.abs(self.getVelocity()) / 2400,
            );

            speedTween?.kill();
            speedTween = gsap.to(speed, {
              value: targetSpeed,
              duration: 0.2,
              ease: "power2.out",
              overwrite: true,
            });

            resetCall?.kill();
            resetCall = gsap.delayedCall(0.18, () => {
              speedTween = gsap.to(speed, {
                value: 1,
                duration: 0.55,
                ease: "power2.out",
                overwrite: true,
              });
            });
          },
        });

        const resizeObserver = new ResizeObserver(measure);
        resizeObserver.observe(segment);
        measure();
        setActive(trigger.isActive);

        return () => {
          resizeObserver.disconnect();
          trigger.kill();
          gsap.ticker.remove(tick);
          resetCall?.kill();
          speedTween?.kill();
          gsap.set(track, { clearProps: "transform" });
        };
      });

      return () => motion.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="agency-marquee"
      aria-label="Studio capabilities"
    >
      <p className="agency-marquee__accessible">
        Design, develop, advertise, scale.
      </p>
      <div className="agency-marquee__viewport" aria-hidden="true">
        <div ref={trackRef} className="agency-marquee__track">
          {[0, 1].map((copy) => (
            <div className="agency-marquee__segment" key={copy}>
              {words.map((word) => (
                <span className="agency-marquee__item" key={word}>
                  <span>{word}</span>
                  <Image
                    className="agency-marquee__logo"
                    src="/images/logo.png"
                    alt=""
                    width={840}
                    height={768}
                    sizes="(max-width: 767px) 28px, 48px"
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
