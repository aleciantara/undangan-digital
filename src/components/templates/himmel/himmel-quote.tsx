"use client";

import { pickHimmelQuote } from "@/lib/himmel-quotes";
import { HimmelReveal } from "./himmel-reveal";

type Props = {
  groomName: string;
  brideName: string;
  slug: string;
  accentColor: string;
  loveStory?: string | null;
};

export function HimmelQuote({
  groomName,
  brideName,
  slug,
  accentColor,
  loveStory,
}: Props) {
  const fallback = pickHimmelQuote(`${slug}-${groomName}-${brideName}`);
  const text = loveStory?.trim() || fallback.text;
  const author = loveStory?.trim() ? `${groomName} & ${brideName}` : fallback.author;

  return (
    <div className="himmel-quote-section px-4 py-14 sm:py-20">
      <HimmelReveal variant="up">
        <div
          className="himmel-quote-panel himmel-surface relative mx-auto max-w-3xl px-8 py-12 sm:px-14 sm:py-14"
          style={{ "--quote-accent": accentColor } as React.CSSProperties}
        >
          <span className="himmel-quote-panel__ornament" aria-hidden>
            ✿
          </span>
          <p className="himmel-quote-panel__label">A Journey Together</p>

          <blockquote className="mt-8">
            <p className="himmel-quote-panel__text font-invitation">
              &ldquo;{text}&rdquo;
            </p>
            <footer className="himmel-quote-panel__author mt-8">— {author}</footer>
          </blockquote>
        </div>
      </HimmelReveal>
    </div>
  );
}
