"use client";

import { pickRaoulQuote } from "@/lib/raoul-quotes";
import { RaoulReveal } from "./raoul-reveal";

type Props = {
  groomName: string;
  brideName: string;
  slug: string;
  accentColor: string;
  loveStory?: string | null;
};

export function RaoulQuote({
  groomName,
  brideName,
  slug,
  accentColor,
  loveStory,
}: Props) {
  const fallback = pickRaoulQuote(`${slug}-${groomName}-${brideName}`);
  const text = loveStory?.trim() || fallback.text;
  const author = loveStory?.trim() ? `${groomName} & ${brideName}` : fallback.author;

  return (
    <div className="raoul-quote-section px-4 py-14 sm:py-20">
      <RaoulReveal variant="up">
        <div
          className="raoul-quote-panel relative mx-auto max-w-3xl px-8 py-12 sm:px-14 sm:py-14"
          style={{ "--quote-accent": accentColor } as React.CSSProperties}
        >
          <span className="raoul-quote-panel__ornament" aria-hidden>
            ✿
          </span>
          <p className="raoul-quote-panel__label">All I Ask of You</p>

          <blockquote className="mt-8">
            <p className="raoul-quote-panel__text font-invitation">
              &ldquo;{text}&rdquo;
            </p>
            <footer className="raoul-quote-panel__author mt-8">— {author}</footer>
          </blockquote>
        </div>
      </RaoulReveal>
    </div>
  );
}
