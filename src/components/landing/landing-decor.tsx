export function LandingClipDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        <clipPath id="landing-blob-hero" clipPathUnits="objectBoundingBox">
          <path d="M0.12,0.05 C0.35,-0.08 0.75,0.02 0.92,0.28 C1.08,0.52 0.95,0.82 0.68,0.95 C0.42,1.08 0.08,0.88 0.02,0.58 C-0.04,0.28 0.02,0.12 0.12,0.05 Z" />
        </clipPath>
        <clipPath id="landing-blob-accent" clipPathUnits="objectBoundingBox">
          <path d="M0.15,0.1 C0.45,0 0.85,0.15 0.95,0.45 C1.05,0.75 0.75,1 0.45,0.95 C0.15,0.9 0,0.55 0.05,0.25 C0.1,0.1 0.15,0.1 0.15,0.1 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function LandingOrb({
  className,
  color = "rose",
}: {
  className?: string;
  color?: "rose" | "brook" | "amaranth";
}) {
  const fills = {
    rose: "from-brand-rose/50 to-brand-rose/10",
    brook: "from-brand-brook/45 to-brand-brook/5",
    amaranth: "from-brand-amaranth/40 to-brand-amaranth/5",
  };
  return (
    <div
      className={`pointer-events-none absolute rounded-full bg-gradient-to-br blur-3xl ${fills[color]} ${className ?? ""}`}
      aria-hidden
    />
  );
}
