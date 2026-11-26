"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP } from "@/src/lib/gsap";
import "./MagneticButton.css";

type MagneticButtonProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  children: ReactNode;
  href: string;
};

export default function MagneticButton({
  children,
  className = "",
  href,
  ...anchorProps
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const button = buttonRef.current;
      const arrow = arrowRef.current;

      if (!button || !arrow) return;

      const media = gsap.matchMedia();
      media.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const moveX = gsap.quickTo(button, "x", {
            duration: 0.35,
            ease: "power3.out",
          });
          const moveY = gsap.quickTo(button, "y", {
            duration: 0.35,
            ease: "power3.out",
          });

          const onPointerMove = (event: PointerEvent) => {
            const bounds = button.getBoundingClientRect();
            const distanceX =
              (event.clientX - bounds.left - bounds.width / 2) * 0.12;
            const distanceY =
              (event.clientY - bounds.top - bounds.height / 2) * 0.12;

            moveX(gsap.utils.clamp(-6, 6, distanceX));
            moveY(gsap.utils.clamp(-6, 6, distanceY));
          };

          const onPointerEnter = () => {
            gsap.to(arrow, {
              x: 3,
              y: -3,
              duration: 0.2,
              ease: "power2.out",
              overwrite: "auto",
            });
          };

          const onPointerLeave = () => {
            moveX(0);
            moveY(0);
            gsap.to(arrow, {
              x: 0,
              y: 0,
              duration: 0.25,
              ease: "power3.out",
              overwrite: "auto",
            });
          };

          button.addEventListener("pointermove", onPointerMove);
          button.addEventListener("pointerenter", onPointerEnter);
          button.addEventListener("pointerleave", onPointerLeave);

          return () => {
            button.removeEventListener("pointermove", onPointerMove);
            button.removeEventListener("pointerenter", onPointerEnter);
            button.removeEventListener("pointerleave", onPointerLeave);
          };
        },
      );

      return () => media.revert();
    },
    { scope: buttonRef },
  );

  return (
    <a
      {...anchorProps}
      ref={buttonRef}
      href={href}
      className={`magnetic-button ${className}`.trim()}
    >
      <span>{children}</span>
      <ArrowUpRight
        ref={arrowRef}
        className="magnetic-button__arrow"
        aria-hidden="true"
      />
    </a>
  );
}
