"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef } from "react";
import type { NavigationSection } from "@/src/config/site";
import { navigationItems, siteConfig } from "@/src/config/site";
import { gsap, useGSAP } from "@/src/lib/gsap";
import "./MobileMenu.css";

type MobileMenuProps = {
  activeSection: NavigationSection;
  isLocked: boolean;
  isOpen: boolean;
  onClose: () => void;
  onClosed: () => void;
  onNavigate: (section: NavigationSection) => void;
};

export default function MobileMenu({
  activeSection,
  isLocked,
  isOpen,
  onClose,
  onClosed,
  onNavigate,
}: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isOpenRef = useRef(isOpen);
  const hasCompletedCloseRef = useRef(true);
  const finishCloseRef = useRef<() => void>(() => {});
  const onCloseRef = useRef(onClose);
  const onClosedRef = useRef(onClosed);

  useLayoutEffect(() => {
    isOpenRef.current = isOpen;
    onCloseRef.current = onClose;
    onClosedRef.current = onClosed;
  }, [isOpen, onClose, onClosed]);

  useGSAP(
    () => {
      const menu = menuRef.current;
      if (!menu) return;

      const links = gsap.utils.toArray<HTMLElement>(
        ".mobile-menu__link",
        menu,
      );
      const dividers = gsap.utils.toArray<HTMLElement>(
        ".mobile-menu__divider",
        menu,
      );

      gsap.set(menu, { autoAlpha: 0, yPercent: -100 });
      gsap.set(links, { autoAlpha: 0, y: 40 });
      gsap.set(dividers, { scaleX: 0, transformOrigin: "left center" });

      const finishClose = () => {
        if (hasCompletedCloseRef.current) return;
        hasCompletedCloseRef.current = true;
        onClosedRef.current();
      };
      finishCloseRef.current = finishClose;

      const timeline = gsap.timeline({
        paused: true,
        onStart: () => {
          gsap.set(menu, { visibility: "visible" });
          closeButtonRef.current?.focus();
        },
        onReverseComplete: finishClose,
      });

      timeline
        .to(
          menu,
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.6,
            ease: "power4.inOut",
          },
          0,
        )
        .to(
          links,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.055,
            ease: "power3.out",
          },
          0.12,
        )
        .to(
          dividers,
          {
            scaleX: 1,
            duration: 0.3,
            stagger: 0.045,
            ease: "power3.out",
          },
          0.2,
        );

      timelineRef.current = timeline;

      return () => {
        timeline.kill();
        timelineRef.current = null;
      };
    },
    { scope: menuRef },
  );

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline || !isLocked) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      if (isOpen) {
        hasCompletedCloseRef.current = false;
        timeline.progress(1).pause();
        closeButtonRef.current?.focus();
      } else {
        timeline.progress(0).pause();
        finishCloseRef.current();
      }

      return;
    }

    if (isOpen) {
      hasCompletedCloseRef.current = false;
      timeline.play();
    } else {
      timeline.reverse();
    }
  }, [isLocked, isOpen]);

  useEffect(() => {
    if (!isLocked) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (isOpenRef.current) onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !menuRef.current) return;

      const focusable = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("hidden"));

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (!menuRef.current.contains(activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [isLocked]);

  useEffect(() => {
    if (!isLocked) return;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const onMotionPreferenceChange = () => {
      if (!motionPreference.matches) return;

      const timeline = timelineRef.current;
      if (!timeline) return;

      if (isOpenRef.current) {
        timeline.progress(1).pause();
      } else {
        timeline.progress(0).pause();
        finishCloseRef.current();
      }
    };

    motionPreference.addEventListener("change", onMotionPreferenceChange);
    return () =>
      motionPreference.removeEventListener(
        "change",
        onMotionPreferenceChange,
      );
  }, [isLocked]);

  return (
    <div
      ref={menuRef}
      id="mobile-menu-overlay"
      className="mobile-menu"
      data-active={isLocked}
      aria-hidden={!isLocked}
      inert={!isLocked}
    >
      <div className="mobile-menu__inner">
        <header className="mobile-menu__header">
          <a
            href="#home"
            className="mobile-menu__logo-link"
            aria-label="Go to home"
            onClick={(event) => {
              event.preventDefault();
              onNavigate("home");
            }}
          >
            <Image
              src="/images/logo.png"
              alt=""
              width={840}
              height={768}
              className="mobile-menu__logo"
            />
          </a>
          <button
            ref={closeButtonRef}
            className="mobile-menu__close"
            type="button"
            aria-label="Close navigation menu"
            onClick={onClose}
          >
            <X aria-hidden="true" size={19} strokeWidth={1.6} />
          </button>
        </header>

        <nav className="mobile-menu__navigation" aria-label="Mobile navigation">
          {navigationItems.map((item) => (
            <div className="mobile-menu__row" key={item.id}>
              <a
                className="mobile-menu__link"
                href={`#${item.id}`}
                aria-current={
                  activeSection === item.id ? "page" : undefined
                }
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(item.id);
                }}
              >
                <span className="mobile-menu__number" aria-hidden="true">
                  {item.number}
                </span>
                <span>{item.label}</span>
              </a>
              <span className="mobile-menu__divider" aria-hidden="true" />
            </div>
          ))}
        </nav>

        <footer className="mobile-menu__footer">
          <p>{siteConfig.navigationTagline}</p>
        </footer>
      </div>
    </div>
  );
}
