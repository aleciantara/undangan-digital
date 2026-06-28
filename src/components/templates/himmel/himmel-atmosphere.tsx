"use client";

import { useEffect, useMemo, useState } from "react";
import {
  HIMMEL_PETAL_DRIFT,
  buildHimmelFlowerField,
  buildHimmelPetalDriftItems,
  resolveHimmelFlowerDensity,
  splitFlowerLayers,
  type HimmelFlowerDensity,
} from "@/lib/himmel-flowers";
import { HimmelMeadowFlower } from "./himmel-meadow-flower";

/** Fixed full-screen flower field — always behind invitation content (z-index in CSS) */
export function HimmelAtmosphere() {
  const [reduced, setReduced] = useState(true);
  const [density, setDensity] = useState<HimmelFlowerDensity>("lite");
  const { backMid, front } = useMemo(() => splitFlowerLayers(buildHimmelFlowerField(density)), [density]);
  const petals = useMemo(() => buildHimmelPetalDriftItems(density), [density]);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setDensity(resolveHimmelFlowerDensity());

    const onResize = () => setDensity(resolveHimmelFlowerDensity());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="himmel-atmosphere-wrap pointer-events-none" aria-hidden>
      <div className="himmel-atmosphere">
        <div className="himmel-atmosphere__sky" />
        <div className="himmel-atmosphere__glow" />
        <div className="himmel-atmosphere__grain" />
        <div className="himmel-atmosphere__vignette" />

        <div className="himmel-meadow himmel-meadow--back">
          {backMid.map((f) => (
            <HimmelMeadowFlower key={f.id} f={f} reduced={reduced} />
          ))}
        </div>
      </div>

      <div className="himmel-meadow-front">
        {front.map((f) => (
          <HimmelMeadowFlower key={`front-${f.id}`} f={f} reduced={reduced} />
        ))}

        {!reduced && (
          <div className="himmel-petal-drift">
            {petals.map((p) => (
              <span
                key={p.id}
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
