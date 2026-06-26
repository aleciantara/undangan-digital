"use client";

import { GARDEN_FLORAL_ASSETS } from "@/lib/garden-floral-assets";
import { useCallback, useState } from "react";

type Props = {
  accentColor: string;
  primaryColor: string;
};

const DRIFT = [
  { left: "8%", delay: 0, duration: 16, size: 34, rot: -18, asset: 0 },
  { left: "22%", delay: 3.2, duration: 19, size: 28, rot: 24, asset: 1 },
  { left: "38%", delay: 6.5, duration: 17, size: 32, rot: -8, asset: 0 },
  { left: "55%", delay: 1.8, duration: 21, size: 26, rot: 16, asset: 1 },
  { left: "70%", delay: 4.5, duration: 18, size: 30, rot: -22, asset: 0 },
  { left: "86%", delay: 7.8, duration: 20, size: 24, rot: 10, asset: 1 },
] as const;

export function GardenFlowerDrift({ accentColor, primaryColor }: Props) {
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const onFail = useCallback((i: number) => {
    setFailed((prev) => ({ ...prev, [i]: true }));
  }, []);

  return (
    <div className="garden-flower-drift pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden>
      {DRIFT.map((d, i) => {
        const src = GARDEN_FLORAL_ASSETS.petals[d.asset % GARDEN_FLORAL_ASSETS.petals.length];
        const useFallback = failed[i];

        return (
          <span
            key={i}
            className={`garden-flower-drift__item ${useFallback ? "garden-flower-drift__item--fallback" : ""}`}
            style={
              {
                left: d.left,
                width: d.size,
                height: d.size,
                "--drift-delay": `${d.delay}s`,
                "--drift-duration": `${d.duration}s`,
                "--drift-rot": `${d.rot}deg`,
                "--petal-color": i % 2 === 0 ? accentColor : primaryColor,
              } as React.CSSProperties
            }
          >
            {!useFallback && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt=""
                className="garden-flower-drift__img"
                onError={() => onFail(i)}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}
