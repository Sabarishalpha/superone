"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { navigationItems, type NavigationSection } from "@/src/config/site";
import { gsap, useGSAP } from "@/src/lib/gsap";
import { useSmoothScroll } from "../providers/SmoothScrollProvider";
import MagneticButton from "../ui/MagneticButton";
import MobileMenu from "./MobileMenu";
import "./Navbar.css";

const desktopNavigationItems = navigationItems.filter(
  (item) => item.id !== "contact",
);

export default function Navbar() {
  const [navigationReady, setNavigationReady] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] =
    useState<NavigationSection>("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuLocked, setIsMenuLocked] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const logoLinkRef = useRef<HTMLAnchorElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef(false);
  const hasMenuLockRef = useRef(false);
  const pendingNavigationRef = useRef<NavigationSection | null>(null);
  const { scrollTo, setScrollLock } = useSmoothScroll();

  useLayoutEffect(() => {
    let sawPreloader = Boolean(
      document.querySelector(".preloader-curtain"),
    );
    let hasRevealedNavigation = false;

    const revealNavigation = () => {
      if (hasRevealedNavigation) return;

      hasRevealedNavigation = true;
      window.clearTimeout(skipCheck);
      window.clearTimeout(fallback);
      observer.disconnect();
      setNavigationReady(true);
    };

    const checkPreloader = () => {
      const preloaderIsPresent = Boolean(
        document.querySelector(".preloader-curtain"),
      );

      if (preloaderIsPresent) {
        sawPreloader = true;
      } else if (sawPreloader) {
        revealNavigation();
      }
    };

    const observer = new MutationObserver(checkPreloader);

    observer.observe(document.body, { childList: true, subtree: true });

    const skipCheck = window.setTimeout(() => {
      checkPreloader();

      if (!sawPreloader) revealNavigation();
    }, 100);
    const fallback = window.setTimeout(revealNavigation, 4500);

    return () => {
      window.clearTimeout(skipCheck);
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav || !navigationReady) return;

      const links = gsap.utils.toArray<HTMLElement>(
        ".primary-nav__link",
        nav,
      );
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        gsap.set(nav, { autoAlpha: 1, y: 0 });
        gsap.set(links, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(nav, { autoAlpha: 0, y: -25 });
      gsap.set(links, { autoAlpha: 0, y: 8 });

      const timeline = gsap.timeline();
      timeline
        .to(
          nav,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          0,
        )
        .to(
          links,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.34,
            stagger: 0.065,
            ease: "power3.out",
          },
          0.2,
        );

      return () => timeline.kill();
    },
    {
      dependencies: [navigationReady],
      scope: navRef,
      revertOnUpdate: true,
    },
  );

  useEffect(() => {
    const updateScrolledState = () => {
      const nextState = window.scrollY > 80;
      setIsScrolled((currentState) =>
        currentState === nextState ? currentState : nextState,
      );
    };

    const frame = window.requestAnimationFrame(updateScrolledState);
    window.addEventListener("scroll", updateScrolledState, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScrolledState);
    };
  }, []);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const sections = navigationItems
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null);
    if (sections.length === 0) return;

    const visibility = new Map<Element, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target, entry.isIntersecting);
        }

        const currentSection = Array.from(visibility)
          .filter(([, isVisible]) => isVisible)
          .map(([section]) => section)
          .sort(
            (first, second) =>
              first.getBoundingClientRect().top -
              second.getBoundingClientRect().top,
          )[0];

        if (currentSection instanceof HTMLElement) {
          const section = navigationItems.find(
            (item) => item.id === currentSection.id,
          );
          if (section) setActiveSection(section.id);
        }
      },
      {
        rootMargin: "-25% 0px -65% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    const wasInert = main.inert;
    main.inert = isMenuLocked;

    return () => {
      main.inert = wasInert;
    };
  }, [isMenuLocked]);

  useLayoutEffect(() => {
    if (isMenuLocked || !restoreFocusRef.current) return;

    restoreFocusRef.current = false;
    const menuButton = menuButtonRef.current;

    if (menuButton && getComputedStyle(menuButton).display !== "none") {
      menuButton.focus();
    } else {
      logoLinkRef.current?.focus();
    }
  }, [isMenuLocked]);

  useEffect(
    () => () => {
      if (hasMenuLockRef.current) {
        setScrollLock("mobile-menu", false);
        hasMenuLockRef.current = false;
      }
    },
    [setScrollLock],
  );

  const openMenu = useCallback(() => {
    if (!hasMenuLockRef.current) {
      hasMenuLockRef.current = true;
      setScrollLock("mobile-menu", true);
    }

    setIsMenuLocked(true);
    setIsMenuOpen(true);
  }, [setScrollLock]);

  const requestMenuClose = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const navigateFromMenu = useCallback((section: NavigationSection) => {
    pendingNavigationRef.current = section;
    setIsMenuOpen(false);
  }, []);

  const finishMenuClose = useCallback(() => {
    setIsMenuLocked(false);
    restoreFocusRef.current = true;

    if (hasMenuLockRef.current) {
      hasMenuLockRef.current = false;
      setScrollLock("mobile-menu", false);
    }

    const pendingSection = pendingNavigationRef.current;
    pendingNavigationRef.current = null;
    if (!pendingSection) return;

    const target = document.getElementById(pendingSection);
    if (!target) return;

    setActiveSection(pendingSection);
    scrollTo(target, {
      offset: window.matchMedia("(max-width: 767px)").matches ? -80 : -92,
      duration: 0.9,
    });
  }, [scrollTo, setScrollLock]);

  const handleDesktopAnchor = (
    event: MouseEvent<HTMLAnchorElement>,
    section: NavigationSection,
  ) => {
    event.preventDefault();
    if (!document.getElementById(section)) {
      return;
    }

    setActiveSection(section);
    const target = document.getElementById(section);
    if (!target) return;

    scrollTo(target, {
      offset: window.matchMedia("(max-width: 767px)").matches ? -80 : -92,
      duration: 0.9,
    });
  };

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const home = document.getElementById("home");
    setActiveSection("home");
    scrollTo(home ?? 0, {
      offset: home ? -92 : 0,
      duration: 0.9,
    });
  };

  return (
    <>
      <div
        ref={navRef}
        className={`nav-shell${navigationReady ? " nav-shell--ready" : ""}${isScrolled ? " nav-shell--scrolled" : ""}`}
        aria-hidden={!navigationReady}
        inert={!navigationReady || isMenuLocked}
      >
        <header className="floating-navbar">
          <a
            ref={logoLinkRef}
            href="#home"
            className="navbar-logo"
            aria-label="Go to home"
            onClick={handleLogoClick}
          >
            <Image
              src="/images/logo.png"
              alt=""
              width={840}
              height={768}
              className="navbar-logo__image"
              priority
            />
          </a>

          <nav className="primary-nav" aria-label="Primary navigation">
            {desktopNavigationItems.map((item) => (
              <a
                href={`#${item.id}`}
                className="primary-nav__link"
                aria-current={
                  activeSection === item.id ? "page" : undefined
                }
                key={item.id}
                onClick={(event) => handleDesktopAnchor(event, item.id)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="navbar-actions">
            <MagneticButton
              href="#contact"
              className="magnetic-button--navbar"
              onClick={(event) => {
                event.preventDefault();
                const contact = document.getElementById("contact");
                if (!contact) return;

                setActiveSection("contact");
                scrollTo(contact, { offset: -92, duration: 0.9 });
              }}
            >
              LET&apos;S TALK
            </MagneticButton>

            <button
              ref={menuButtonRef}
              type="button"
              className={`navbar-menu-toggle${isMenuOpen ? " navbar-menu-toggle--open" : ""}`}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu-overlay"
              onClick={isMenuOpen ? requestMenuClose : openMenu}
            >
              <span className="navbar-menu-toggle__line" aria-hidden="true" />
              <span className="navbar-menu-toggle__line" aria-hidden="true" />
            </button>
          </div>
        </header>
      </div>

      <MobileMenu
        activeSection={activeSection}
        isLocked={isMenuLocked}
        isOpen={isMenuOpen}
        onClose={requestMenuClose}
        onClosed={finishMenuClose}
        onNavigate={navigateFromMenu}
      />
    </>
  );
}
