"use client";

import { useInvitationScroll } from "@/components/invitation/invitation-scroll-context";
import {
  INVITATION_PRESENT,
  scrollRootFor,
} from "@/lib/invitation-reveal";
import { useEffect, useState, type RefObject } from "react";

/** Triggers a one-shot entrance when the element scrolls into view (PowerPoint-style). */
export function useInvitationPresentReveal(ref: RefObject<HTMLElement | null>) {
  const [presenting, setPresenting] = useState(false);
  const scrollCtx = useInvitationScroll();
  const revealsActive = scrollCtx?.revealsActive ?? true;

  useEffect(() => {
    if (!revealsActive) {
      setPresenting(false);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPresenting(true);
      return;
    }

    const root = scrollRootFor(el, scrollCtx?.scrollRef.current ?? null);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPresenting(true);
          observer.disconnect();
        }
      },
      {
        root,
        threshold: INVITATION_PRESENT.threshold,
        rootMargin: INVITATION_PRESENT.rootMargin,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [revealsActive, scrollCtx?.scrollRef, ref]);

  return presenting;
}
