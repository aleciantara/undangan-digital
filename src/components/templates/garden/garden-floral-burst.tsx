"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  accentColor: string;
  primaryColor: string;
  className?: string;
};

const PETAL_COUNT = 14;

export function GardenFloralBurst({ accentColor, primaryColor, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setBurst(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBurst(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`garden-floral-burst pointer-events-none absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2 ${className}`}
      aria-hidden
    >
      {Array.from({ length: PETAL_COUNT }, (_, i) => (
        <span
          key={i}
          className={`garden-floral-burst__petal ${burst ? "garden-floral-burst__petal--out" : ""}`}
          style={
            {
              "--petal-i": i,
              "--petal-angle": `${(360 / PETAL_COUNT) * i}deg`,
              "--petal-color": i % 2 === 0 ? accentColor : primaryColor,
              "--petal-delay": `${i * 45}ms`,
            } as React.CSSProperties
          }
        />
      ))}
      <span
        className={`garden-floral-burst__core ${burst ? "garden-floral-burst__core--out" : ""}`}
        style={{ "--petal-color": accentColor } as React.CSSProperties}
      />
    </div>
  );
}
