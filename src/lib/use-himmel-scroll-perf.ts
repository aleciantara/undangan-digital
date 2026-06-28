"use client";

import { useInvitationScroll } from "@/components/invitation/invitation-scroll-context";
import { useEffect, type RefObject } from "react";

/** Pause meadow animations while scrolling and after the hero leaves the viewport. */
export function useHimmelScrollPerf(rootRef: RefObject<HTMLElement | null>) {
  const scrollCtx = useInvitationScroll();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const scrollEl = scrollCtx?.scrollRef.current ?? null;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    let ticking = false;

    const setScrolling = (active: boolean) => {
      root.classList.toggle("himmel-invite--scrolling", active);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setScrolling(true);
          ticking = false;
        });
      }

      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setScrolling(false), 120);
    };

    scrollEl?.addEventListener("scroll", onScroll, { passive: true });

    const hero = root.querySelector(".himmel-hero");
    const io =
      hero &&
      new IntersectionObserver(
        ([entry]) => {
          root.classList.toggle("himmel-invite--past-hero", !entry.isIntersecting);
        },
        { root: scrollEl, threshold: 0.06 }
      );

    if (hero && io) io.observe(hero);

    return () => {
      scrollEl?.removeEventListener("scroll", onScroll);
      if (idleTimer) clearTimeout(idleTimer);
      io?.disconnect();
      root.classList.remove("himmel-invite--scrolling", "himmel-invite--past-hero");
    };
  }, [rootRef, scrollCtx?.scrollRef]);
}
