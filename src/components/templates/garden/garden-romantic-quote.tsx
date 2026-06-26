"use client";

import { pickGardenQuote } from "@/lib/garden-quotes";
import { GardenReveal } from "./garden-reveal";

type Props = {
  groomName: string;
  brideName: string;
  slug: string;
  accentColor: string;
  loveStory?: string | null;
};

export function GardenRomanticQuote({
  groomName,
  brideName,
  slug,
  accentColor,
  loveStory,
}: Props) {
  const fallback = pickGardenQuote(`${slug}-${groomName}-${brideName}`);
  const text = loveStory?.trim() || fallback.text;
  const author = loveStory?.trim() ? `${groomName} & ${brideName}` : fallback.author;

  return (
    <section className="relative z-10 px-4 py-12 sm:py-20">
      <GardenReveal variant="up">
        <div
          className="garden-quote-panel garden-card-paper relative mx-auto max-w-3xl px-8 py-12 sm:px-14 sm:py-14"
          style={{ "--quote-accent": accentColor } as React.CSSProperties}
        >
          <span className="garden-quote-panel__ornament font-invitation" aria-hidden>
            ✦
          </span>
          <p
            className="text-[0.65rem] font-bold uppercase tracking-[0.55em]"
            style={{ color: accentColor }}
          >
            {loveStory ? "Kisah Kami" : "Kata Hati"}
          </p>

          <blockquote className="mt-8">
            <p className="font-invitation text-[clamp(1.5rem,5vw,2.5rem)] font-medium italic leading-[1.4] text-inv-ink">
              &ldquo;{text}&rdquo;
            </p>
            <footer className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-inv-muted">
              — {author}
            </footer>
          </blockquote>
        </div>
      </GardenReveal>
    </section>
  );
}
