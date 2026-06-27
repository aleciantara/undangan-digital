"use client";

import { RaoulReveal } from "./raoul-reveal";

type Props = {
  accentColor: string;
  primaryColor: string;
  index?: string;
  align?: "left" | "center";
  children: React.ReactNode;
};

export function RaoulSectionHeading({
  children,
  accentColor,
  primaryColor,
  index,
  align = "left",
}: Props) {
  return (
    <RaoulReveal variant="clip" className="mb-10 sm:mb-14">
      <div
        className={`raoul-heading ${align === "center" ? "raoul-heading--center" : ""}`}
        style={{ "--hd-accent": accentColor, "--hd-primary": primaryColor } as React.CSSProperties}
      >
        {index && <span className="raoul-heading__index font-mono">{index}</span>}
        <h2 className="raoul-heading__title font-invitation">{children}</h2>
        <div className="raoul-heading__bar" aria-hidden>
          <span className="raoul-heading__line" />
          <span className="raoul-heading__gem">◆</span>
          <span className="raoul-heading__line" />
        </div>
      </div>
    </RaoulReveal>
  );
}
