"use client";

import { useEffect, useState } from "react";

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getRemaining(target: Date): CountdownParts | null {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/** Shared 1s countdown ticker used by every invitation template. */
export function useCountdown(targetDate: string) {
  const [remaining, setRemaining] = useState<CountdownParts | null>(null);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    const target = new Date(targetDate);
    const update = () => {
      setRemaining(getRemaining(target));
      setFlip((f) => !f);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return { remaining, flip };
}
