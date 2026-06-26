"use client";

import { pickPhantomQuote } from "@/lib/phantom-quotes";
import { GardenReveal } from "@/components/templates/garden/garden-reveal";

type Props = {
  groomName: string;
  brideName: string;
  slug: string;
  accentColor: string;
  loveStory?: string | null;
};

export function PhantomQuote({
  groomName,
  brideName,
  slug,
  accentColor,
  loveStory,
}: Props) {
  const fallback = pickPhantomQuote(`${slug}-${groomName}-${brideName}`);
  const text = loveStory?.trim() || fallback.text;
  const author = loveStory?.trim() ? `${groomName} & ${brideName}` : fallback.author;

  return (
    <div className="phantom-quote-section px-4 py-14 sm:py-20">
      <GardenReveal variant="up">
        <div
          className="phantom-quote-panel relative mx-auto max-w-3xl px-8 py-12 sm:px-14 sm:py-14"
          style={{ "--quote-accent": accentColor } as React.CSSProperties}
        >
          <span className="phantom-quote-panel__mask" aria-hidden>🎭</span>
          <p className="phantom-quote-panel__label">A Song of Love</p>

          <blockquote className="mt-8">
            <p className="phantom-quote-panel__text font-invitation">
              &ldquo;{text}&rdquo;
            </p>
            <footer className="phantom-quote-panel__author mt-8">— {author}</footer>
          </blockquote>
        </div>
      </GardenReveal>
    </div>
  );
}
