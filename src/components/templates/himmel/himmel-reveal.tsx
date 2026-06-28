"use client";

import { useEffect, useRef, useState } from "react";
import { useInvitationScroll } from "@/components/invitation/invitation-scroll-context";

type Props = {
  children: React.ReactNode;
  className?: string;
  variant?: "up" | "left" | "right" | "scale" | "clip";
  delay?: number;
};

function scrollRootFor(el: HTMLElement, scrollRef: HTMLElement | null): Element | null {
  if (scrollRef) {
    const style = getComputedStyle(scrollRef);
    const scrollable =
      (style.overflowY === "auto" || style.overflowY === "scroll") &&
      scrollRef.scrollHeight > scrollRef.clientHeight;
    if (scrollable) return scrollRef;
  }

  let parent = el.parentElement;
  while (parent) {
    const style = getComputedStyle(parent);
    if (
      (style.overflowY === "auto" || style.overflowY === "scroll") &&
      parent.scrollHeight > parent.clientHeight
    ) {
      return parent;
    }
    parent = parent.parentElement;
  }

  return null;
}

export function HimmelReveal({
  children,
  className = "",
  variant = "up",
  delay = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const scrollCtx = useInvitationScroll();
  const revealsActive = scrollCtx?.revealsActive ?? true;

  useEffect(() => {
    if (!revealsActive) {
      setVisible(false);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(true);
      return;
    }

    const root = scrollRootFor(el, scrollCtx?.scrollRef.current ?? null);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        root,
        threshold: 0.14,
        rootMargin: "0px 0px -5% 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [revealsActive, scrollCtx?.scrollRef]);

  return (
    <div
      ref={ref}
      className={`himmel-reveal himmel-reveal--${variant} ${visible ? "himmel-reveal--in" : ""} ${className}`}
      style={{ "--himmel-reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
