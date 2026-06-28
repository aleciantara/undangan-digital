"use client";

import { HimmelReveal } from "./himmel-reveal";

type Props = {
  accentColor: string;
  primaryColor: string;
  index?: string;
  align?: "left" | "center";
  children: React.ReactNode;
};

export function HimmelSectionHeading({
  children,
  accentColor,
  primaryColor,
  index,
  align = "left",
}: Props) {
  return (
    <HimmelReveal variant="clip" className="mb-10 sm:mb-14">
      <div
        className={`himmel-heading ${align === "center" ? "himmel-heading--center" : ""}`}
        style={{ "--hd-accent": accentColor, "--hd-primary": primaryColor } as React.CSSProperties}
      >
        {index && <span className="himmel-heading__index font-mono">{index}</span>}
        <h2 className="himmel-heading__title font-invitation">{children}</h2>
        <div className="himmel-heading__bar" aria-hidden>
          <span className="himmel-heading__line" />
          <span className="himmel-heading__gem">◆</span>
          <span className="himmel-heading__line" />
        </div>
      </div>
    </HimmelReveal>
  );
}
