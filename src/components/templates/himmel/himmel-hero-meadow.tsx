"use client";

import { useEffect, useMemo, useState } from "react";
import {
  HIMMEL_PETAL_DRIFT,
  buildHimmelHeroFlowerField,
  buildHimmelPetalDriftItems,
  resolveHimmelFlowerDensity,
  splitFlowerLayers,
  type HimmelFlowerDensity,
} from "@/lib/himmel-flowers";
import { HimmelMeadowFlower } from "./himmel-meadow-flower";

/** Full-viewport blooming meadow for the flower-animation hero */
export function HimmelHeroMeadow() {
  const [reduced, setReduced] = useState(true);
  const [density, setDensity] = useState<HimmelFlowerDensity>("lite");
  const { backMid, front } = useMemo(
    () => splitFlowerLayers(buildHimmelHeroFlowerField(density)),
    [density]
  );
  const petals = useMemo(() => buildHimmelPetalDriftItems(density).slice(0, density === "lite" ? 8 : 12), [density]);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setDensity(resolveHimmelFlowerDensity());
  }, []);

  return (
    <div className="himmel-hero__meadow pointer-events-none" aria-hidden>
      <div className="himmel-hero__meadow-sky" />
      <div className="himmel-hero__meadow-glow" />

      <div className="himmel-meadow himmel-meadow--back himmel-hero__meadow-layer">
        {backMid.map((f) => (
          <HimmelMeadowFlower key={f.id} f={f} reduced={reduced} />
        ))}
      </div>

      <div className="himmel-meadow-front himmel-hero__meadow-layer">
        {front.map((f) => (
          <HimmelMeadowFlower key={`hero-front-${f.id}`} f={f} reduced={reduced} />
        ))}

        {!reduced && (
          <div className="himmel-petal-drift">
            {petals.map((p) => (
              <span
                key={`hero-drift-${p.id}`}
                className="himmel-petal-drift__item"
                style={
                  {
                    left: p.left,
                    "--drift-delay": p.delay,
                    "--drift-duration": p.duration,
                    "--drift-size": p.size,
                    "--drift-rot": p.rot,
                  } as React.CSSProperties
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={HIMMEL_PETAL_DRIFT} alt="" className="himmel-petal-drift__img" draggable={false} />
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
