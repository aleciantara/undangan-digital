"use client";

import type { HimmelFlowerInstance } from "@/lib/himmel-flowers";

type Props = {
  f: HimmelFlowerInstance;
  reduced: boolean;
  className?: string;
};

export function HimmelMeadowFlower({ f, reduced, className = "" }: Props) {
  const anchorTop = f.anchor === "top";

  const positionStyle = anchorTop ? { top: f.top } : { bottom: f.bottom };

  return (
    <span
      className={`himmel-meadow__flower himmel-meadow__flower--${f.layer} himmel-meadow__flower--sway-${f.sway} ${anchorTop ? "himmel-meadow__flower--anchor-top" : ""} ${reduced ? "himmel-meadow__flower--still" : ""} ${className}`.trim()}
      style={
        {
          left: f.left,
          ...positionStyle,
          zIndex: f.z,
          "--flower-scale": f.scale,
          "--flower-delay": f.delay,
          "--flower-duration": f.duration,
          "--flower-bloom-delay": f.bloomDelay,
          "--flower-opacity": f.opacity,
        } as unknown as React.CSSProperties
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={f.src} alt="" className="himmel-meadow__img" draggable={false} />
    </span>
  );
}
