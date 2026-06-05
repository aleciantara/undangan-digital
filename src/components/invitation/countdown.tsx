"use client";

import { useEffect, useState } from "react";

type Props = { targetDate: string; label?: string };

function getRemaining(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown({ targetDate, label = "Menuju hari bahagia" }: Props) {
  const [remaining, setRemaining] = useState<ReturnType<typeof getRemaining>>(null);

  useEffect(() => {
    const target = new Date(targetDate);
    const tick = () => setRemaining(getRemaining(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!remaining) {
    return (
      <p className="text-center font-invitation text-lg text-batik-brown/80">Hari bahagia telah tiba ✨</p>
    );
  }

  const units = [
    { value: remaining.days, label: "Hari" },
    { value: remaining.hours, label: "Jam" },
    { value: remaining.minutes, label: "Menit" },
    { value: remaining.seconds, label: "Detik" },
  ];

  return (
    <div className="text-center">
      <p className="mb-4 text-sm uppercase tracking-[0.2em] text-batik-brown/70">{label}</p>
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {units.map((u) => (
          <div
            key={u.label}
            className="rounded-xl border border-batik-brown/15 bg-white/80 px-2 py-3 shadow-sm backdrop-blur sm:px-4"
          >
            <p className="font-invitation text-2xl font-semibold text-batik-dark sm:text-3xl">
              {String(u.value).padStart(2, "0")}
            </p>
            <p className="mt-1 text-xs text-batik-brown/70">{u.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
