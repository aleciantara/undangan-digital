"use client";

import { useCountdown } from "@/hooks/use-countdown";

type Props = { targetDate: string; label?: string; accentColor: string; primaryColor: string };

export function HimmelCountdown({
  targetDate,
  label = "Menuju hari bahagia",
  accentColor,
  primaryColor,
}: Props) {
  const { remaining, flip } = useCountdown(targetDate);

  if (!remaining) {
    return (
      <p className="himmel-countdown-done text-center font-invitation text-[clamp(2rem,8vw,3.5rem)] font-semibold text-inv-accent">
        Hari bahagia telah tiba
      </p>
    );
  }

  const units = [
    { value: remaining.days, label: "Hari" },
    { value: remaining.hours, label: "Jam" },
    { value: remaining.minutes, label: "Menit" },
    { value: remaining.seconds, label: "Detik", live: true },
  ];

  return (
    <div
      className="himmel-countdown"
      style={{ "--cd-accent": accentColor, "--cd-primary": primaryColor } as React.CSSProperties}
    >
      <p className="himmel-countdown__label">{label}</p>

      <div className="himmel-countdown__row">
        {units.map((u, i) => (
          <div key={u.label} className="himmel-countdown__unit">
            {i > 0 && (
              <span className="himmel-countdown__colon font-invitation" aria-hidden>
                :
              </span>
            )}
            <div className="himmel-countdown__num-wrap">
              <span
                className={`himmel-countdown__num font-invitation ${u.live && flip ? "himmel-countdown__num--flip" : ""}`}
              >
                {String(u.value).padStart(2, "0")}
              </span>
              <span className="himmel-countdown__unit-label">{u.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
