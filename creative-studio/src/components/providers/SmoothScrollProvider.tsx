"use client";

import {
  useCallback,
  createContext,
  useEffect,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import Lenis, { type ScrollToOptions } from "lenis";
import { gsap, ScrollTrigger } from "@/src/lib/gsap";
import Preloader from "../animations/Preloader";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

type ScrollLockReason = "preloader" | "mobile-menu";

type SmoothScrollContextValue = {
  setScrollLock: (reason: ScrollLockReason, locked: boolean) => void;
  scrollTo: (target: Element | number, options?: ScrollToOptions) => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

export function useSmoothScroll() {
  const context = useContext(SmoothScrollContext);

  if (!context) {
    throw new Error("useSmoothScroll must be used within SmoothScrollProvider.");
  }

  return context;
}

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const scrollLocksRef = useRef(new Set<ScrollLockReason>());

  const setScrollLock = useCallback(
    (reason: ScrollLockReason, locked: boolean) => {
      if (locked) {
        scrollLocksRef.current.add(reason);
      } else {
        scrollLocksRef.current.delete(reason);
      }

      if (scrollLocksRef.current.size > 0) {
        lenisRef.current?.stop();
      } else {
        lenisRef.current?.start();
      }
    },
    [],
  );

  const setPreloaderScrollLock = useCallback(
    (locked: boolean) => setScrollLock("preloader", locked),
    [setScrollLock],
  );

  const scrollTo = useCallback(
    (target: Element | number, options?: ScrollToOptions) => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, options);
        return;
      }

      const offset = options?.offset ?? 0;
      const top =
        typeof target === "number"
          ? target + offset
          : target.getBoundingClientRect().top + window.scrollY + offset;

      window.scrollTo({
        top,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    },
    [],
  );

  const contextValue = useMemo(
    () => ({ setScrollLock, scrollTo }),
    [scrollTo, setScrollLock],
  );

  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let lenis: Lenis | null = null;

    const updateScroll = (time: number) => {
      lenis?.raf(time * 1000);
    };

    const stop = () => {
      if (!lenis) return;

      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(updateScroll);
      lenis.destroy();
      lenisRef.current = null;
      lenis = null;
      gsap.ticker.lagSmoothing(500, 33);
    };

    const start = () => {
      if (motionPreference.matches || lenis) return;

      lenis = new Lenis({ autoRaf: false });
      lenisRef.current = lenis;
      if (scrollLocksRef.current.size > 0) lenis.stop();
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(updateScroll);
      gsap.ticker.lagSmoothing(0);
    };

    const syncMotionPreference = () => {
      if (motionPreference.matches) {
        stop();
      } else {
        start();
      }
    };

    syncMotionPreference();
    motionPreference.addEventListener("change", syncMotionPreference);

    return () => {
      motionPreference.removeEventListener("change", syncMotionPreference);
      stop();
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={contextValue}>
      <Preloader onActiveChange={setPreloaderScrollLock} />
      {children}
    </SmoothScrollContext.Provider>
  );
}
