"use client";

import { useInvitationPresentReveal } from "@/hooks/use-invitation-present-reveal";
import { presentationDelay } from "@/lib/invitation-reveal";
import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  variant?: "up" | "left" | "right" | "scale" | "clip";
  delay?: number;
};

export function HimmelReveal({
  children,
  className = "",
  variant = "up",
  delay = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const presenting = useInvitationPresentReveal(ref);

  return (
    <div
      ref={ref}
      className={`himmel-reveal himmel-reveal--${variant} ${presenting ? "himmel-reveal--in" : ""} ${className}`}
      style={
        { "--inv-present-delay": `${presentationDelay(delay)}ms` } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
