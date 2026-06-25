import { landingMarqueeWords } from "@/lib/landing-marquee";

type Props = {
  variant?: "dark" | "light" | "rose";
};

export function LandingMarquee({ variant = "dark" }: Props) {
  const words = [...landingMarqueeWords, ...landingMarqueeWords];
  const styles = {
    dark: "border-brand-ink/10 bg-brand-ink text-brand-chalk/80",
    light: "border-brand-brook/20 bg-brand-chalk text-brand-muted",
    rose: "border-brand-amaranth/20 bg-brand-amaranth text-brand-chalk/90",
  };

  return (
    <div className={`overflow-hidden border-y py-4 ${styles[variant]}`}>
      <div className="animate-landing-marquee flex w-max gap-10 whitespace-nowrap px-4">
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="flex items-center gap-10 font-invitation text-2xl italic sm:text-3xl">
            {word}
            <span className="text-brand-rose" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
