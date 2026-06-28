"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildHimmelSectionFlowerField,
  resolveHimmelFlowerDensity,
  splitFlowerLayers,
  type HimmelFlowerDensity,
} from "@/lib/himmel-flowers";
import { HimmelMeadowFlower } from "./himmel-meadow-flower";

type Props = {
  seed: number;
};

/** Flowers layered above a solid section background, below cards */
export function HimmelSectionMeadow({ seed }: Props) {
  const [reduced, setReduced] = useState(true);
  const [density, setDensity] = useState<HimmelFlowerDensity>("lite");
  const { backMid, front } = useMemo(
    () => splitFlowerLayers(buildHimmelSectionFlowerField(seed, density)),
    [seed, density]
  );

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setDensity(resolveHimmelFlowerDensity());
  }, []);

  return (
    <div className="himmel-section__meadow pointer-events-none" aria-hidden>
      <div className="himmel-meadow himmel-meadow--back">
        {backMid.map((f) => (
          <HimmelMeadowFlower key={f.id} f={f} reduced={reduced} />
        ))}
      </div>
      <div className="himmel-meadow-front himmel-section__meadow-front">
        {front.map((f) => (
          <HimmelMeadowFlower key={`section-front-${f.id}`} f={f} reduced={reduced} />
        ))}
      </div>
    </div>
  );
}
