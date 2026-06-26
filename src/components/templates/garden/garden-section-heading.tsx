"use client";

import { GardenReveal } from "./garden-reveal";

type Props = {
  accentColor: string;
  primaryColor: string;
  index?: string;
  align?: "left" | "center";
  children: React.ReactNode;
};

export function GardenSectionHeading({
  children,
  accentColor,
  primaryColor,
  index,
  align = "left",
}: Props) {
  return (
    <GardenReveal variant="clip" className="mb-12 sm:mb-16">
      <div
        className={`garden-heading-editorial ${align === "center" ? "garden-heading-editorial--center" : ""}`}
        style={{ "--hd-accent": accentColor, "--hd-primary": primaryColor } as React.CSSProperties}
      >
        {index && <span className="garden-heading-editorial__index font-mono">{index}</span>}
        <h2 className="garden-heading-editorial__title font-invitation">{children}</h2>
        <div className="garden-heading-editorial__bar" aria-hidden />
      </div>
    </GardenReveal>
  );
}
