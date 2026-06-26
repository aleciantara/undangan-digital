"use client";

type Props = {
  accentColor: string;
  primaryColor: string;
};

const PETALS = [
  { left: "8%", top: "12%", size: 28, rot: -18, delay: 0 },
  { left: "82%", top: "18%", size: 22, rot: 24, delay: 1.2 },
  { left: "72%", top: "62%", size: 34, rot: -8, delay: 2.4 },
  { left: "14%", top: "78%", size: 20, rot: 32, delay: 0.8 },
  { left: "48%", top: "8%", size: 16, rot: 12, delay: 3.1 },
  { left: "90%", top: "48%", size: 26, rot: -22, delay: 1.8 },
  { left: "4%", top: "44%", size: 18, rot: 8, delay: 2.9 },
];

export function GardenAtmosphere({ accentColor, primaryColor }: Props) {
  return (
    <div className="garden-atmosphere pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div
        className="garden-atmosphere__orb garden-atmosphere__orb--1"
        style={{ "--orb-color": accentColor } as React.CSSProperties}
      />
      <div
        className="garden-atmosphere__orb garden-atmosphere__orb--2"
        style={{ "--orb-color": primaryColor } as React.CSSProperties}
      />
      <div
        className="garden-atmosphere__orb garden-atmosphere__orb--3"
        style={{ "--orb-color": accentColor } as React.CSSProperties}
      />

      {PETALS.map((p, i) => (
        <span
          key={i}
          className="garden-petal"
          style={
            {
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              "--petal-rot": `${p.rot}deg`,
              "--petal-delay": `${p.delay}s`,
              "--petal-color": i % 2 === 0 ? accentColor : primaryColor,
            } as React.CSSProperties
          }
        />
      ))}

      <div className="garden-atmosphere__grain" />
    </div>
  );
}
