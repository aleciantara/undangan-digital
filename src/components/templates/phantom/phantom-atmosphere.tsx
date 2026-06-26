"use client";

import { useEffect, useState } from "react";

const PETALS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${8 + ((i * 7.3) % 84)}%`,
  delay: `${(i * 0.7) % 5}s`,
  duration: `${9 + (i % 4) * 2}s`,
  size: `${10 + (i % 3) * 4}px`,
  rot: `${(i * 37) % 360}deg`,
}));

export function PhantomAtmosphere({ accentColor }: { accentColor: string }) {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div
      className="phantom-atmosphere pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ "--atm-accent": accentColor } as React.CSSProperties}
      aria-hidden
    >
      <div className="phantom-atmosphere__vignette absolute inset-0" />
      <div className="phantom-atmosphere__curtain-left absolute inset-y-0 left-0 w-[18%] max-w-24" />
      <div className="phantom-atmosphere__curtain-right absolute inset-y-0 right-0 w-[18%] max-w-24" />

      {!reduced &&
        PETALS.map((p) => (
          <span
            key={p.id}
            className="phantom-petal"
            style={
              {
                left: p.left,
                "--petal-delay": p.delay,
                "--petal-duration": p.duration,
                "--petal-size": p.size,
                "--petal-rot": p.rot,
              } as React.CSSProperties
            }
          />
        ))}
    </div>
  );
}
