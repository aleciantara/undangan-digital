"use client";

import { useInvitationPresentReveal } from "@/hooks/use-invitation-present-reveal";
import { presentationDelay } from "@/lib/invitation-reveal";
import { useEffect, useRef, useState } from "react";

export type InvitationRevealTheme = "himmel" | "raoul" | "phantom";
export type InvitationRevealVariant = "up" | "left" | "right" | "scale" | "clip";

type Props = {
  theme: InvitationRevealTheme;
  children: React.ReactNode;
  className?: string;
  variant?: InvitationRevealVariant;
  delay?: number;
};

/**
 * Shared scroll-into-view entrance used by all templates. Triggers a one-shot
 * animation via IntersectionObserver (no per-frame scroll listeners) and only
 * promotes the element to its own compositor layer (`will-change`) while the
 * entrance animation is actually running.
 */
export function InvitationReveal({
  theme,
  children,
  className = "",
  variant = "up",
  delay = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const presenting = useInvitationPresentReveal(ref);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!presenting) return;
    const el = ref.current;
    if (!el) return;
    setAnimating(true);
    const stop = () => setAnimating(false);
    el.addEventListener("animationend", stop);
    el.addEventListener("animationcancel", stop);
    return () => {
      el.removeEventListener("animationend", stop);
      el.removeEventListener("animationcancel", stop);
    };
  }, [presenting]);

  return (
    <div
      ref={ref}
      className={`${theme}-reveal ${theme}-reveal--${variant} ${presenting ? `${theme}-reveal--in` : ""} ${className}`}
      style={
        {
          "--inv-present-delay": `${presentationDelay(delay)}ms`,
          willChange: animating ? "transform, opacity" : undefined,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
