import { resolveInviteVerse } from "@/lib/invite-verse-presets";
import { HimmelReveal } from "./himmel-reveal";

type Props = {
  inviteVerseTitle?: string | null;
  inviteVersePreset?: string | null;
  inviteVerseText?: string | null;
  accentColor: string;
  primaryColor: string;
};

export function HimmelInviteVerse({
  inviteVerseTitle,
  inviteVersePreset,
  inviteVerseText,
  accentColor,
  primaryColor,
}: Props) {
  const verse = resolveInviteVerse({
    inviteVerseTitle,
    inviteVersePreset,
    inviteVerseText,
  });

  return (
    <div
      className="himmel-verse px-4 py-12 sm:py-16"
      style={{ "--verse-accent": accentColor, "--verse-primary": primaryColor } as React.CSSProperties}
    >
      <HimmelReveal variant="up">
        <div className="himmel-verse__panel himmel-verse__panel--foil himmel-surface mx-auto max-w-3xl px-6 py-10 sm:px-10 sm:py-12">
          <p className="himmel-verse__eyebrow">{verse.title}</p>
          <p className="himmel-verse__text font-invitation">{verse.text}</p>
        </div>
      </HimmelReveal>
    </div>
  );
}
