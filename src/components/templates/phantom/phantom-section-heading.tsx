"use client";

import { GardenReveal } from "@/components/templates/garden/garden-reveal";

type Props = {
  accentColor: string;
  primaryColor: string;
  index?: string;
  align?: "left" | "center";
  children: React.ReactNode;
};

export function PhantomSectionHeading({
  children,
  accentColor,
  primaryColor,
  index,
  align = "left",
}: Props) {
  return (
    <GardenReveal variant="clip" className="mb-10 sm:mb-14">
      <div
        className={`phantom-heading ${align === "center" ? "phantom-heading--center" : ""}`}
        style={{ "--hd-accent": accentColor, "--hd-primary": primaryColor } as React.CSSProperties}
      >
        {index && <span className="phantom-heading__index font-mono">{index}</span>}
        <h2 className="phantom-heading__title font-invitation">{children}</h2>
        <div className="phantom-heading__bar" aria-hidden>
          <span className="phantom-heading__rose">❧</span>
        </div>
      </div>
    </GardenReveal>
  );
}
