type Props = {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
  light?: boolean;
};

export function LandingSectionHeading({ eyebrow, title, align = "left", light = false }: Props) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <p
        className={`text-[0.65rem] font-semibold uppercase tracking-[0.45em] ${
          light ? "text-brand-chalk/70" : "text-brand-amaranth"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-invitation mt-4 text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.05] ${
          light ? "text-white" : "text-brand-ink"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}
