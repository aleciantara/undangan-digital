"use client";

import { useCountdown } from "@/hooks/use-countdown";

type Props = { targetDate: string; label?: string; accentColor: string; primaryColor: string };

export function PhantomCountdown({
  targetDate,
  label = "Menuju hari bahagia",
  accentColor,
  primaryColor,
}: Props) {
  const { remaining, flip } = useCountdown(targetDate);

  if (!remaining) {
    return (
      <p className="phantom-countdown-done text-center font-invitation text-[clamp(2rem,8vw,3.5rem)] font-semibold text-inv-accent">
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
      className="phantom-countdown-editorial"
      style={{ "--cd-accent": accentColor, "--cd-primary": primaryColor } as React.CSSProperties}
    >
      <p className="phantom-countdown-editorial__label">{label}</p>

      <div className="phantom-countdown-editorial__row">
        {units.map((u, i) => (
          <div key={u.label} className="phantom-countdown-editorial__unit">
            {i > 0 && (
              <span className="phantom-countdown-editorial__colon font-invitation" aria-hidden>
                :
              </span>
            )}
            <div className="phantom-countdown-editorial__num-wrap">
              <span
                className={`phantom-countdown-editorial__num font-invitation ${u.live && flip ? "phantom-countdown-editorial__num--flip" : ""}`}
              >
                {String(u.value).padStart(2, "0")}
              </span>
              <span className="phantom-countdown-editorial__unit-label">{u.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
